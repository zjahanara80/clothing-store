const User = require("../models/User");
const Campaign = require("../models/Campaign");
const mongoose = require("mongoose");
const Product = require("../models/Product");

exports.toggleProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId))
      return res.status(400).json({ message: "شناسه محصول نامعتبر است." });

    const user = await User.findById(req.user.id).populate("cartProducts.product");
    if (!user) return res.status(404).json({ message: "کاربر یافت نشد." });

    const productIndex = user.cartProducts.findIndex(
      item => item.product && item.product._id.toString() === productId
    );

    let inCart;
    if (productIndex === -1) {
      user.cartProducts.push({ product: productId, quantity: 1 });
      inCart = true;
    } else {
      user.cartProducts.splice(productIndex, 1);
      inCart = false;
    }

    await user.save();
    res.json({ success: true, inCart, cart: user.cartProducts });
  } catch (err) {
    console.error("Error in toggle cart:", err);
    res.status(500).json({ message: "خطای سرور در تغییر سبد خرید.", error: err.message });
  }
};


exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) return res.status(400).json({ message: "productId الزامی است" });

    const user = await User.findById(req.user.id).populate("cartProducts.product");
    if (!user) return res.status(404).json({ message: "کاربر پیدا نشد" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "محصول پیدا نشد" });

    const existingItem = user.cartProducts.find(
      item => item.product && item.product._id.toString() === productId
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > 3) {
        return res.status(400).json({ message: "حداکثر تعداد یک محصول 3 عدد است." });
      }
      if (newQuantity > product.countInStock) {
        return res.status(400).json({ message: "تعداد محصول در انبار کافی نیست." });
      }

      existingItem.quantity = newQuantity;
    } else {
      if (quantity > 3) {
        return res.status(400).json({ message: "حداکثر تعداد یک محصول 3 عدد است." });
      }
      if (quantity > product.countInStock) {
        return res.status(400).json({ message: "تعداد محصول در انبار کافی نیست." });
      }

      user.cartProducts.push({ product: productId, quantity });
    }

    await user.save();
    res.json({ message: "محصول به سبد خرید اضافه شد", cart: user.cartProducts });
  } catch (error) {
    console.error("خطا در افزودن به سبد خرید:", error);
    res.status(500).json({ message: "خطای سرور در افزودن به سبد خرید" });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity == null)
      return res.status(400).json({ message: "productId و quantity الزامی هستند" });

    const user = await User.findById(req.user.id).populate("cartProducts.product");
    if (!user) return res.status(404).json({ message: "کاربر پیدا نشد" });

    const item = user.cartProducts.find(item => item.product && item.product._id.toString() === productId);
    if (!item) return res.status(404).json({ message: "محصول در سبد خرید پیدا نشد" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "محصول پیدا نشد" });

    if (quantity <= 0) {
      user.cartProducts = user.cartProducts.filter(
        i => i.product && i.product._id.toString() !== productId
      );
    } else if (quantity > 3) {
      return res.status(400).json({ message: "حداکثر تعداد یک محصول 3 عدد است." });
    } else if (quantity > product.countInStock) {
      return res.status(400).json({ message: "تعداد محصول در انبار کافی نیست." });
    } else {
      item.quantity = quantity;
    }

    await user.save();
    res.json({ message: "تعداد محصول بروزرسانی شد", cart: user.cartProducts });
  } catch (error) {
    console.error("خطا در آپدیت تعداد:", error);
    res.status(500).json({ message: "خطای سرور در آپدیت تعداد" });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) return res.status(400).json({ message: "productId الزامی است" });

    const user = await User.findById(req.user.id).populate("cartProducts.product");
    if (!user) return res.status(404).json({ message: "کاربر پیدا نشد" });

    user.cartProducts = user.cartProducts.filter(
      item => item.product && item.product._id.toString() !== productId
    );

    await user.save();
    res.json({ message: "محصول از سبد خرید حذف شد", cart: user.cartProducts });
  } catch (error) {
    console.error("خطا در حذف محصول:", error);
    res.status(500).json({ message: "خطای سرور در حذف محصول" });
  }
};

exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cartProducts.product");
    if (!user) return res.status(404).json({ message: "کاربر پیدا نشد" });

    const now = new Date();
    const globalCampaign = await Campaign.findOne({
      isGlobal: true,
      isActive: true,
      $or: [
        { startDate: { $lte: now }, endDate: { $gte: now } },
        { startDate: null, endDate: null },
      ],
    });

    const cartWithDetails = user.cartProducts
      .map(item => {
        if (!item.product) return null;

        const p = item.product.toObject();
        p.quantity = item.quantity;
        p.inCart = true;

        if (p.discount > 0) {
          p.finalPrice = Math.floor(p.price - (p.price * p.discount) / 100);
          p.globalDiscount = 0;
        } else if (globalCampaign) {
          p.finalPrice = Math.floor(p.price - (p.price * globalCampaign.discountPercent) / 100);
          p.globalDiscount = globalCampaign.discountPercent;
        } else {
          p.finalPrice = p.price;
          p.globalDiscount = 0;
        }

        return p;
      })
      .filter(p => p !== null);

    res.json({ cart: cartWithDetails });
  } catch (error) {
    console.error("خطا در دریافت سبد خرید:", error);
    res.status(500).json({ message: "خطای سرور در دریافت سبد خرید" });
  }
};
