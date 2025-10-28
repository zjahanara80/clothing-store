import {
  setProductsToDom,
  getParamFromUrl,
  getToken,
  isLogin,
} from "./funcs/apiFuncs.js";
import { paginationStructure } from './funcs/utils.js';
import { getMe } from './funcs/authentication.js';

const cartCount = document.querySelector('.header-middle__buy span')
let CartCountVar = 0
if (!isLogin() || !getToken()) {
  location.href = 'login.html'
}

const loadUserCart = async () => {

  const paginateList = document.querySelector('.paginate-list');
  const productsParent = document.querySelector('.main-center__products');
  const boxCountShow = document.getElementById('carts-count-elem')
  const boxTotalShow = document.getElementById('carts-total-elem')
  const boxDiscountsShow = document.getElementById('carts-discounts-elem')
  let phoneElem = document.getElementById('carts-tel-elem')
  let postElem = document.getElementById('carts-post-elem')
  let addressElem = document.getElementById('carts-address-elem')
  let nameElem = document.getElementById('carts-name-elem')
  let totalVar = 0
  let discountVar = 0
  let mainTotal = 0

  const pageNumber = parseInt(getParamFromUrl('page')) || 1;
  let allProducts = [];

  try {
    const res = await fetch('http://localhost:5000/api/user/cart', {
      headers: { Authorization: `Bearer ${getToken()}` }
    });

    let data = await res.json();
    allProducts = data.cart || [];
    console.log(data);

    boxCountShow.innerHTML = data.cart.length
    data.cart.forEach(item => {
      mainTotal = item.price * item.quantity

      if (item.discount == 0 && item.globalDiscount == 0) {
        totalVar += mainTotal
      }

      else if (item.globalDiscount > 0) {
        let discountTotal = (((item.price * item.quantity) * item.globalDiscount) / 100)
        totalVar += (mainTotal - discountTotal)
        discountVar = discountTotal

      }

      else if (item.discount > 0) {
        let discountTotal = (((item.price * item.quantity) * item.discount) / 100)
        console.log(discountTotal);

        totalVar += (mainTotal - discountTotal)

        discountVar = discountTotal
      }
    })

    boxTotalShow.innerHTML = totalVar.toLocaleString()
    boxDiscountsShow.innerHTML = discountVar.toLocaleString()


    const renderProducts = (productsArray) => {
      // const pageProducts = paginationStructure(productsArray, 6, paginateList, pageNumber);
      productsParent.innerHTML = '';

      if (productsArray.length) {
        setProductsToDom(productsArray, productsParent, false, true);
      } else {
        productsParent.innerHTML = `
          <div class="alert alert-danger" 
               style="border:2px solid red; color:red; padding:2rem; width:90%; margin:2rem auto;">
            هیچ محصولی درسبد خرید شما نیست 
          </div>`;
      }
    };

    document.addEventListener("click", async (event) => {
      const deleteProBTN = event.target.closest(".delete-pro-from-cart");
      const plusBtn = event.target.closest(".plus");
      const minusBtn = event.target.closest(".mines");

      // حذف محصول از سبد
      // if (deleteProBTN) {
      //   const productId = deleteProBTN.dataset.id;
      //   try {
      //     const res = await fetch(`http://localhost:5000/api/user/cart/toggle/${productId}`, {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //         Authorization: `Bearer ${getToken()}`
      //       }
      //     });

      //     const data = await res.json();
      //     if (!res.ok) {
      //       alert(data.message || "خطا در تغییر سبد خرید");
      //       return;
      //     }

      //     // حذف محصول از allProducts و رندر مجدد
      //     allProducts = allProducts.filter(p => p._id !== productId);
      //     renderProducts(allProducts);

      //     // به‌روزرسانی شمارنده هدر
      //     CartCountVar = allProducts.length;
      //     cartCount ? cartCount.textContent = CartCountVar : '';

      //   } catch (err) {
      //     console.error("خطا در toggle محصول:", err);
      //     alert("خطا در تغییر سبد خرید");
      //   }
      // }

      // // افزایش یا کاهش تعداد
      // if (plusBtn || minusBtn) {
      //   const productElem = event.target.closest(".cart-box__products-item");
      //   const productId = productElem.dataset.id;
      //   const countInput = productElem.querySelector(".count");
      //   let newQuantity = parseInt(countInput.value);
      //   const maxStock = parseInt(productElem.dataset.stock);

      //   if (plusBtn && newQuantity < 3 && newQuantity < maxStock) newQuantity++;
      //   if (plusBtn && newQuantity >= maxStock) {
      //     alert("تعداد محصول داخل انبار کافی نیست");
      //     return;
      //   }
      //   if (minusBtn && newQuantity > 1) newQuantity--;

      //   countInput.value = newQuantity;

      //   try {
      //     const res = await fetch("http://localhost:5000/api/user/cart/update-quantity", {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //         Authorization: `Bearer ${getToken()}`
      //       },
      //       body: JSON.stringify({ productId, quantity: newQuantity })
      //     });

      //     const data = await res.json();
      //     if (!res.ok) {
      //       alert(data.message);
      //       return;
      //     }

      //     // آپدیت مقدار در allProducts
      //     const index = allProducts.findIndex(p => p._id === productId);
      //     if (index !== -1) allProducts[index].quantity = newQuantity;

      //     // شمارنده هدر
      //     CartCountVar = allProducts.length;
      //     cartCount ? cartCount.textContent = CartCountVar : '';

      //   } catch (err) {
      //     console.error("خطا در آپدیت تعداد:", err);
      //   }
      // }
      // حذف محصول
      if (deleteProBTN) {
        const productId = deleteProBTN.dataset.id;
        try {
          const res = await fetch(`http://localhost:5000/api/user/cart/toggle/${productId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }
          });

          const data = await res.json();
          if (!res.ok) {
            alert(data.message || "خطا در تغییر سبد خرید");
            return;
          }

          allProducts = allProducts.filter(p => p._id !== productId);
          renderProducts(allProducts);
          updateCartTotals(allProducts);  // ⚡ بروزرسانی قیمت و تخفیف
        } catch (err) {
          console.error("خطا در toggle محصول:", err);
          alert("خطا در تغییر سبد خرید");
        }
      }

      // افزایش یا کاهش تعداد
      if (plusBtn || minusBtn) {
        const productElem = event.target.closest(".cart-box__products-item");
        const productId = productElem.dataset.id;
        const countInput = productElem.querySelector(".count");
        let newQuantity = parseInt(countInput.value);
        const maxStock = parseInt(productElem.dataset.stock);

        if (plusBtn && newQuantity < 3 && newQuantity < maxStock) newQuantity++;
        if (plusBtn && newQuantity >= maxStock) { alert("تعداد محصول داخل انبار کافی نیست"); return; }
        if (minusBtn && newQuantity > 1) newQuantity--;

        countInput.value = newQuantity;

        try {
          const res = await fetch("http://localhost:5000/api/user/cart/update-quantity", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
            body: JSON.stringify({ productId, quantity: newQuantity })
          });

          const data = await res.json();
          if (!res.ok) { alert(data.message); return; }

          const index = allProducts.findIndex(p => p._id === productId);
          if (index !== -1) allProducts[index].quantity = newQuantity;

          updateCartTotals(allProducts);  // ⚡ بروزرسانی قیمت و تخفیف
        } catch (err) {
          console.error("خطا در آپدیت تعداد:", err);
        }
      }

    });
    renderProducts(allProducts);


    getMe().then(info => {
      console.log(info);
      info[0].phone ? phoneElem.innerHTML = info[0].phone +
        `<button class="edit-info edit-phone" data-value="phone">ویرایش</button>` :
        phoneElem.innerHTML = `ست نشده <button class="edit-info" data-value="phone">افزودن</button>`

      info[0].postalCode ? postElem.innerHTML = info[0].postalCode +
        `<button class="edit-info edit-post" data-value="post">ویرایش</button>` :
        postElem.innerHTML = `ست نشده <button class="edit-info" data-value="post">افزودن</button>`

      info[0].address ? addressElem.innerHTML = info[0].address +
        `<button class="edit-inf edit-address" data-value="address">ویرایش</button>` :
        addressElem.innerHTML = `ست نشده <button class="edit-info" data-value="address">افزودن</button>`

      info[0].name ? nameElem.innerHTML = info[0].name +
        `<button class="edit-info edit-name" data-value="name">ویرایش</button>` :
        nameElem.innerHTML = `ست نشده <button class="edit-info" data-value="name">افزودن</button>`

    })

  } catch (err) {
    console.error("خطا در بارگذاری سبد خرید:", err);
  }
};

//count of favorits handler
const getBuyCount = async () => {
  if (!getToken()) return 0;

  try {
    const res = await fetch("http://localhost:5000/api/user/cart", {
      headers: { Authorization: `Bearer ${getToken()}` }
    });

    const data = await res.json();

    console.log(data);

    return data.cart ? data.cart.length : 0;
  } catch (err) {
    console.error("خطا در دریافت تعداد:", err);
    return 0;
  }
}

const updateCartTotals = (productsArray) => {
  let totalVar = 0;
  let discountVar = 0;

  productsArray.forEach(item => {
    const mainTotal = item.price * item.quantity;

    if (item.globalDiscount > 0) {
      const discountTotal = (mainTotal * item.globalDiscount) / 100;
      totalVar += mainTotal - discountTotal;
      discountVar += discountTotal;
    } else if (item.discount > 0) {
      const discountTotal = (mainTotal * item.discount) / 100;
      totalVar += mainTotal - discountTotal;
      discountVar += discountTotal;
    } else {
      totalVar += mainTotal;
    }
  });

  document.getElementById('carts-total-elem').innerHTML = totalVar.toLocaleString();
  document.getElementById('carts-discounts-elem').innerHTML = discountVar.toLocaleString();
  document.getElementById('carts-count-elem').innerHTML = productsArray.length;
  cartCount ? cartCount.textContent = productsArray.length : '';
};



document.addEventListener("click", async (event) => {
  const editBtn = event.target.closest(".edit-info");
  const submitBtn = event.target.closest(".submit-info");
  const cancelBtn = event.target.closest(".cancel-icon");

  let nameElem = document.getElementById('carts-name-elem')
  let phoneElem = document.getElementById('carts-tel-elem')
  let addressElem = document.getElementById('carts-address-elem')
  let postElem = document.getElementById('carts-post-elem')


  if (editBtn) {
    const value = editBtn.dataset.value;
    console.log(value);

    switch (value) {
      case "name":
        nameElem.classList.add('info-mode')
        nameElem.innerHTML = `<input type="text" class="info-input" 
             data-value="name" id="name-input-sub">
             <i class="fas fa-check icon-mode tick-icon submit-info" data-value="phone">ثبت</i>
             <i class="fas fa-add icon-mode cancel-icon" data-value="name"></i>
             `
        break;
      case "phone":
        phoneElem.classList.add('info-mode')
        phoneElem.innerHTML = `<input type="text" class="info-input" 
             data-value="phone" id="phone-input-sub">
             <i class="fas fa-check tick-icon icon-mode submit-info" data-value="phone">ثبت</i>
             <i class="fas fa-add cancel-icon icon-mode" data-value="phone"></i>
             `
        break;
      case "address":
        addressElem.classList.add('info-mode')
        addressElem.innerHTML = `<textarea type="text" class="info-input" 
             data-value="address" id="address-input-sub"></textarea>
             <i class="fas fa-check tick-icon icon-mode submit-info" data-value="phone">ثبت</i>
             <i class="fas fa-add cancel-icon icon-mode" data-value="address"></i>`
        break;
      case "post":
        postElem.classList.add('info-mode')
        postElem.innerHTML = `<input type="text" class="info-input" 
             data-value="post" id="post-input-sub">
             <i class="fas fa-check tick-icon icon-mode submit-info" data-value="phone">ثبت</i>
             <i class="fas fa-add cancel-icon icon-mode" data-value="post"></i>`
        break;

      default:
        break;
    }
  }

  if (submitBtn) {
    const value = submitBtn.dataset.value;
    let newValue = ''
    let reqBody = null

    switch (value) {
      case "name":
        const nameElem = document.getElementById("name-input-sub");

        if (nameElem.value && nameElem.value.trim().length > 3) {
          reqBody = { name: nameElem.value.trim() }
          newValue = nameElem.value.trim()
          console.log(reqBody);
        }
        else {
          alert('لطفا نام خود را درست وارد کنید')
        }

        break;
      case "phone":
        const phoneElem = document.getElementById("phone-input-sub");

        if (phoneElem.value && phoneElem.value.trim().length == 11) {
          reqBody = { phone: phoneElem.value.trim() }
          newValue = phoneElem.value.trim()
          console.log(reqBody);
        }
        else {
          alert('لطفا شماره همراه را همراه صفر و کامل وارد کنید')
        }

        break;
      case "address":
        const addressElem = document.getElementById("address-input-sub");

        if (addressElem.value && addressElem.value.trim().length > 20) {
          reqBody = { address: addressElem.value.trim() }
          newValue = addressElem.value.trim()
        }
        else {
          alert('لطفا آدرس را دقیق وارد کنید')
        }

        break;
      case "post":
        const postElem = document.getElementById("post-input-sub");

        if (postElem.value && postElem.value.trim().length == 10) {
          reqBody = { postalCode: postElem.value.trim() }
          newValue = postElem.value.trim()
        }
        else {
          alert('کد پستی باید 10 رقم باشد')
        }

        break;

      default:
        break;
    }

    const response = await fetch(`http://localhost:5000/api/users/me`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqBody)
    })
    const result = await response.json()
    console.log(result);

    if (response.ok) {
      switch (value) {
        case "name":
          nameElem.innerHTML = `${newValue} <button class="edit-info" data-value="name">ویرایش</button>`;
          break;
        case "phone":
          phoneElem.innerHTML = `${newValue} <button class="edit-info" data-value="phone">ویرایش</button>`;
          break;
        case "address":
          addressElem.innerHTML = `${newValue} <button class="edit-info" data-value="address">ویرایش</button>`;
          break;
        case "post":
          postElem.innerHTML = `${newValue} <button class="edit-info" data-value="post">ویرایش</button>`;
          break;
      }
    } else {
      alert("خطا در ذخیره‌سازی!");
    }

  }

  if (cancelBtn) {
    const cancelValue = cancelBtn.dataset.value;
    console.log(cancelValue);

    getMe().then(info => {
      switch (cancelValue) {
        case "name":
          info[0].name ? nameElem.innerHTML = info[0].name +
            `<button class="edit-info edit-name" data-value="name">ویرایش</button>` :
            nameElem.innerHTML = `ست نشده <button class="edit-info" data-value="name">افزودن</button>`
          break;

        case "phone":
          info[0].phone ? phoneElem.innerHTML = info[0].phone +
            `<button class="edit-info edit-phone" data-value="phone">ویرایش</button>` :
            phoneElem.innerHTML = `ست نشده <button class="edit-info" data-value="phone">افزودن</button>`
          break;

        case "address":
          info[0].postalCode ? postElem.innerHTML = info[0].postalCode +
            `<button class="edit-info edit-post" data-value="post">ویرایش</button>` :
            postElem.innerHTML = `ست نشده <button class="edit-info" data-value="post">افزودن</button>`

          break;
        case "post":
          info[0].address ? addressElem.innerHTML = info[0].address +
            `<button class="edit-inf edit-address" data-value="address">ویرایش</button>` :
            addressElem.innerHTML = `ست نشده <button class="edit-info" data-value="address">افزودن</button>`
          break;

        default:
          break;
      }



    })
  }
});

if (document.querySelector('.main-center__products')) {
  loadUserCart()
}


export { getBuyCount }