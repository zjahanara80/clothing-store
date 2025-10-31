import {
  setProductsToDom,
  getParamFromUrl,
  getCategoriesItems,
  getProductsFromCategories,
  sortUserSelection,
  userSearchProduct,
  getToken , 
  isLogin
} from "./funcs/apiFuncs.js";
import { paginationStructure } from './funcs/utils.js';
const FavoriteCount = document.querySelector('.header-middle__popular span')
let favoriteCountVar = 0
const mainBottomParent = document.querySelector('.main-bottom')
const boxesParent = document.querySelector('.cart-box')
const currentPage = location.pathname;
if (!isLogin() || !getToken()) {
  mainBottomParent.style.flexDirection = "column"
  mainBottomParent.style.alignItems = "flex-start"
  mainBottomParent.innerHTML = `
  <p class="alert alert-danger" style="width:100%">
  ابتدا باید وارد سایت شوید
  </p>
   <button class="btn btn-primary m-2">
      <a style="color:white"
       href="login.html?redirect=${encodeURIComponent(currentPage)}">ورود به سایت</button>
  `} else {
  const loadUserFavorites = async () => {
    if (!getToken()) return;

    const paginateList = document.querySelector('.paginate-list');
    const productsParent = document.querySelector('.main-center__products');
    const pageNumber = parseInt(getParamFromUrl('page')) || 1;
    const selection = document.querySelector('.main-center__top-selection');

    let allProducts = [];

    try {
      const res = await fetch('http://localhost:5000/api/user-favorites/favorites', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });

      let data = await res.json();
      allProducts = data.favorites || [];
      console.log(data);


      const renderProducts = (productsArray) => {
        const pageProducts = paginationStructure(productsArray, 6, paginateList, pageNumber);
        productsParent ? productsParent.innerHTML = '' : '';

        if (pageProducts.length) {
          document.querySelector('.main-center__top-title').textContent =
            `در حال نمایش ${productsArray.length} نتیجه`;

          setProductsToDom(pageProducts, productsParent, true);

        } else {
          document.querySelector('.main-center__top-title').textContent = 'نتیجه‌ای یافت نشد';
          productsParent ? productsParent.innerHTML = `
              <div class="alert alert-danger" 
                   style="border:2px solid red; color:red; padding:2rem; width:90%; margin:2rem auto;">
                هیچ محصولی در مورد علاقه شما نیست
              </div>` : '';
        }
      };


      document.addEventListener("click", async (event) => {
        const favBtn = event.target.closest(".favorite-btn");
        if (favBtn) {
          const productId = favBtn.dataset.id;

          try {
            const toggleRes = await fetch(`http://localhost:5000/api/user-favorites/favorites/toggle/${productId}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`
              }
            });

            const toggleData = await toggleRes.json();
            if (!toggleData.isFavorite) {
              allProducts = allProducts.filter(p => p._id !== productId);
              renderProducts(allProducts);
              const pageSize = 6;
              const totalPages = Math.ceil(allProducts.length / pageSize);
              const currentPage = Math.min(pageNumber, totalPages) || 1;

              //url updatinf whithout refresh
              const newUrl = `favorite.html?page=${currentPage}#products-wrapper`;
              window.history.replaceState(null, '', newUrl);

              // رندر محصولات با صفحه جدید
              const pagedProducts = paginationStructure(allProducts, pageSize, paginateList, currentPage);
              setProductsToDom(pagedProducts, productsParent, true);

              if (allProducts.length === 0) {
                document.querySelector('.main-center__top-title').textContent = 'نتیجه‌ای یافت نشد';
                productsParent ? productsParent.innerHTML = `
                <div class="alert alert-danger" 
                     style="border:2px solid red; color:red; padding:2rem; width:90%; margin:2rem auto;">
                  هیچ محصولی در مورد علاقه شما نیست
                </div>` : '';
              }

              //show count of favorites (top of page)
              favoriteCountVar = allProducts.length
              FavoriteCount ? FavoriteCount.innerHTML = allProducts.length : ''
            }

          } catch (err) {
            console.error("خطا در toggle علاقه‌مندی:", err);
            productsParent ? productsParent.innerHTML = `
              <div class="alert alert-danger" 
                   style="border:2px solid red; color:red; padding:2rem; width:90%; margin:2rem auto;">
                خطا در دریافت محصولات علاقه مندی
              </div>` : '';
          }
        }
      });

      renderProducts(allProducts);

      // sorting
      selection.onchange = event => {
        const key = event.target.selectedOptions[0].dataset.key;
        const sorted = sortUserSelection(allProducts, key);
        renderProducts(sorted);
      };

    } catch (err) {
      console.error("خطا در بارگذاری علاقه‌مندی‌ها:", err);
    }
  };
  window.onload = async () => {
    await loadUserFavorites()
  };
}




