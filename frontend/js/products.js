import {
  setProductsToDom,
  getParamFromUrl,
  getCategoriesItems,
  getProductsFromCategories,
  sortUserSelection,
  userSearchProduct,
  getToken,
  showLoader, hideLoader
} from "./funcs/apiFuncs.js";
import { paginationStructure } from './funcs/utils.js';

const getAndShowCategoryProducts = async () => {
  try {
    showLoader()
  const categoryId = getParamFromUrl('category');
  let allProducts = null

  if (!categoryId) return;

  const selection = document.querySelector('.main-center__top-selection');
  const searchInput = document.querySelector('.main-center__top-input');
  const backgroundCat = document.querySelector('.category-bg');
  const productsParent = document.querySelector('.main-center__products');
  const paginateList = document.querySelector('.paginate-list');

  const pageNumber = parseInt(getParamFromUrl('page')) || 1;

  // گرفتن تمام دسته‌ها
  const categories = await getCategoriesItems();
  const current = categories.find(c => c._id === categoryId);
  if (current) {
    console.log(current.background)
    console.log(backgroundCat);

    backgroundCat.style.background = `url("https://lovin-clothing.onrender.com${current.background}")`;
  }

  // اگه وارد صفحه تخفیفات شدیم محصولات تخفیف دار رو نمایش بده
  if (categoryId == "67fb7e93055a1468df373b7c") {
    const res = await fetch('https://lovin-clothing.onrender.com/api/products', {
      "content-type": "application/json",
      Authorization: `Bearer ${getToken()}`
    })

    const products = await res.json()

    let FilteredProducts = products.filter(pro => {
      return (pro.discount > 0 || pro.globalDiscount > 0)
    })

    if (getToken()) {
      try {
        const favRes = await fetch("https://lovin-clothing.onrender.com/api/user-favorites/favorites", {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        const favorites = await favRes.json();
        console.log(favorites);
        

        // merge علاقه مندی روی لیست محصولات
        FilteredProducts = FilteredProducts.map(p => ({
          ...p,
          isFavorite: favorites.favorites.some(f => f._id === p._id)
        }));
      } catch (err) {
        console.error("خطا در گرفتن علاقه‌مندی‌ها:", err);
      }
    }

    allProducts = FilteredProducts
  }

  // در غیر اینصورت برو محصولات رو از دیتا بیس مربوط به دسته بندی دریافت کن
  else {
    const children = categories.filter(cat => {
      return cat.parent && cat.parent._id === categoryId;
    });

    console.log(children);


    const isMain = children.length > 0;

    const targetCategoryIds = isMain
      ? [categoryId, ...children.map(c => c._id)]
      : [categoryId];
    // گرفتن محصولات مرتبط
    allProducts = await getProductsFromCategories(targetCategoryIds.join(','));
    console.log(allProducts);
    console.log(targetCategoryIds);
  }

  // صفحه‌بندی اولیه و نمایش
  const pageProducts = paginationStructure(allProducts, 3, paginateList, pageNumber);

  productsParent.innerHTML = '';
  if (pageProducts.length) {
    document.querySelector('.main-center__top-title').textContent =
      `در حال نمایش ${allProducts.length} نتیجه`;
    setProductsToDom(pageProducts, productsParent);
  } else {
    document.querySelector('.main-center__top-title').textContent = 'نتیجه‌ای یافت نشد';
    productsParent.innerHTML = `
        <div class="alert alert-danger" style="border:2px solid red; color:red; padding:2rem; width:90%; margin:2rem auto;">
          هیچ محصولی در این دسته‌بندی موجود نیست
        </div>`;
  }

  // sort
  selection.onchange = event => {
    const key = event.target.selectedOptions[0].dataset.key;
    const sorted = sortUserSelection(allProducts, key);
    const paged = paginationStructure(sorted, 3, paginateList, 1);
    productsParent.innerHTML = '';
    setProductsToDom(paged, productsParent);
  };

  // search
  // searchInput.oninput = event => {
  //   const filtered = userSearchProduct(allProducts, 'name', event.target.value);
  //   const paged = paginationStructure(filtered, 3, paginateList, 1);
  //   productsParent.innerHTML = '';
  //   setProductsToDom(paged, productsParent);
  // };
  searchInput.oninput = event => {
  const filtered = userSearchProduct(allProducts, 'name', event.target.value);
  const paged = paginationStructure(filtered, 3, paginateList, 1);
  productsParent.innerHTML = '';

  if (paged.length > 0) {
    setProductsToDom(paged, productsParent);
  } else {
    productsParent.innerHTML = `
      <div class="alert alert-warning" 
        style="border:2px solid orange; color:orange; padding:2rem; width:90%; margin:2rem auto; text-align:center;">
        محصولی یافت نشد
      </div>`;
  }
};
}
catch (error) {
  console.log('خطا در گرفتن محصولات'); 
}
finally {
  hideLoader ()
}
};

window.onload = () => {
  getAndShowCategoryProducts();
}
