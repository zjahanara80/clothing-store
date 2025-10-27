// const Discount = require('../models/Discount');

// exports.createDiscount = async (req, res) => {
//   const { code, percentage, expiresAt } = req.body;
//   try {
//     const discount = await Discount.create({ code, percentage, expiresAt });
//     res.status(201).json(discount);
//   } catch (err) {
//     res.status(500).json({ message: 'خطا در ایجاد تخفیف', error: err.message });
//   }
// };

// exports.getAllDiscounts = async (req, res) => {
//   try {
//     const discounts = await Discount.find();
//     res.json(discounts);
//   } catch (err) {
//     res.status(500).json({ message: 'خطا در دریافت تخفیف‌ها', error: err.message });
//   }
// };

const Discount = require('../models/Discount');

exports.createDiscount = async (req, res) => {
  try {
    const discount = await Discount.create(req.body);
    res.status(201).json(discount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find();
    res.json(discounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
