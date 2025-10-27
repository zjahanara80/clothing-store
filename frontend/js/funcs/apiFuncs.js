
window.AllProducts = [];

const getToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.token : null;
};

const getFromLs = (key) => {
    const lsData = JSON.parse(localStorage.getItem(key));
    return lsData ?? null;
};

const isLogin = () => !!getFromLs('user');

const saveIntoLS = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

const getDataFromApi = async (url) => {
    const response = await fetch(url, {
        headers: {
            ...(getToken() && { Authorization: `Bearer ${getToken()}` })
        }
    });
    return await response.json();
};


const setProductsToDom = async (products, parent, isFavoritesPage = false, isCartPage = false) => {
    parent.innerHTML = '';
    window.AllProducts = products;
    console.log(products);

    products.forEach(product => {
        const isInCart = product.inCart;
        const favActionBtnHTML = !isFavoritesPage ?
            `<i class="fa fa-heart product-item-overlay__icon favorite-btn  ${product.isFavorite ? 'red-color-btn' : ''}" 
                   data-id="${product._id}" 
                   title=${product.isFavorite ? 'حذف از علاقه مندی' : 'اضافه به علاقه مندی'}>
                </i>`

            : `<i class="fa fa-trash product-item-overlay__icon favorite-btn remove-fav-btn ${product.isFavorite ? 'red-color-btn' : ''}" 
                       data-id="${product._id}" 
                       title="حذف از علاقه مندی">
                </i>`;

        if (!isCartPage) {
            parent.insertAdjacentHTML('beforeend', `
             <div class="product-item" data-id="${product._id}">
                 ${product.globalDiscount > 0 || product.discount > 0 ?
                    `<span class="discount-percent">${product.globalDiscount > 0 ? product.globalDiscount : product.discount}%</span>`
                    : ''}
 
                 <span class="product-item-title">${product.name} کد ${product.code}</span>
                 <img src="http://localhost:5000${product.img[0]}" alt="" class="product-item-img" />
                 <div class="product-item-priceWrapper">
                     ${product.globalDiscount > 0 || product.discount > 0 ? `
                         <span class="product-item-price oldPrice">${product.price.toLocaleString()} تومان</span><br/>
                         <span class="product-item-price newPrice">
                             ${product.globalDiscount > 0
                        ? (product.price - (product.price * product.globalDiscount / 100)).toLocaleString()
                        : (product.price - (product.price * product.discount / 100)).toLocaleString()} تومان
                         </span>`
                    :
                    `<span class="product-item-price">${product.price} تومان</span>`
                }
                 </div>
                 <div class="product-item-overlay">
                    <div class="basket-icon-wrapper ${isInCart ? 'line-through' : ''}">    
                      <i class="fa fa-basket-shopping product-item-overlay__icon add-to-cart-btn cart-btn"
                         title="${isInCart ? 'حذف از سبد خرید' : 'اضافه به سبد خرید'}" data-id="${product._id}"></i>
                    </div>
                     ${favActionBtnHTML}
                     <i class="fa fa-eye product-item-overlay__icon show-product-btn" 
                        title="مشاهده محصول" 
                        data-show-id="${product._id}"></i>
                 </div>
             </div>
         `);
        }
        else {
            parent.insertAdjacentHTML('beforeend', `
             <div class="cart-box__products-item" data-id="${product._id}" data-stock="${product.countInStock}">
                <img src="http://localhost:5000${product.img[0]}" alt="" class="cart-box__products-item__img" />
                  <div class="cart-box__products-details">  
                    <span class="product-item-title">${product.name} </span>
                    <span class="product-item-code">کد : ${product.code}</span>

                    <span class="product-item-discount">${product.globalDiscount > 0 ? ' تخفیف : ' + product.globalDiscount + '%' :
                    product.discount > 0 ? ' تخفیف : ' + product.discount + '%' : 'بدون تخفیف'}
                     </span>

                    <div class="product-item-priceWrapper">
                     ${product.globalDiscount > 0 || product.discount > 0 ? `
                        <span class="product-item-price oldPrice">
                          <label>قیمت قبل : </label><span>${product.price.toLocaleString()} تومان</span>
                        </span>
                        <span class="product-item-price newPrice">
                          <label>قیمت با تخفیف : </label>
                          <span>${product.globalDiscount > 0
                        ? (product.price - (product.price * product.globalDiscount / 100)).toLocaleString()
                        : (product.price - (product.price * product.discount / 100)).toLocaleString()} تومان
                          </span>
                        </span>
                         `
                    :
                    `<span class="product-item-price"><label>قیمت : </label>
                      <span>${product.price} تومان</span>
                     </span>`
                }
                   </div>
                </div>

              <div class="cart-box__left">
                <div class="count-wrapper">
                 <label>تعداد محصول در سبد خرید</label>
                 <div class="basket-buy__count-wrapper">
                     <input type="button" name="" id="" value="+" class="plus">
                     <input type="number" name="" class="count" id="" value="${product.quantity}" min="1" max="3" inputmode="numeric" autocomplete="off">
                     <input type="button" name="" id="" value="-" class="mines">
                 </div>
                </div>
                 <div class="cart-box__products-item__btns">
                   <div class="add-to-cart-btn cart-box__products-item__icon delete-pro-from-cart delete-color"
                    data-id="${product._id}">  
                      حذف از سبد خرید  
                    </div>
               
                   <div class=" show-product-btn cart-box__products-item__icon"
                   data-id="${product._id}">
                     مشاهده محصول
                   </div>  
                 </div>
               </div> 
             </div>
         `);
        }
    });
};


//حذف و اضافه در علاقه مندی ها و سبد خرید ها در این توابع فقط برای محصولات ساده هستند و نه محصولات داخل سبد و علاقه مندی
const AddOrRemoveFavorite = async (event, productId) => {
    event.stopPropagation();

    const productIndex = window.AllProducts.findIndex(p => p._id === productId);
    if (productIndex === -1) {
        console.error('Product not found in AllProducts');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/user-favorites/favorites/toggle/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`
            }
        });

        if (response.status === 403) {
            Swal.fire({
                title: "ابتدا وارد حساب کاربری خود شوید",
                icon: "error",
                confirmButtonText: "ورود به حساب"
            }).then(result => {
                if (result.isConfirmed) {
                    const currentPage = location.pathname + location.search + '#products-wrapper';
                    location.href = `login.html?redirect=${encodeURIComponent(currentPage)}`;
                }
            });
            return;
        }

        if (!response.ok) {
            throw new Error('خطا در تغییر علاقه‌مندی‌ها');
        }

        const data = await response.json();
        window.AllProducts[productIndex].isFavorite = data.isFavorite;
        console.log(data);

        // icon updating
        const heartBtn = event.target.closest(".favorite-btn");
        heartBtn.classList.toggle("red-color-btn", data.isFavorite);

        //count of favorites dinamic updating
        const FavoriteCount = document.querySelector('.header-middle__popular span')
        if (FavoriteCount) {
            let currentCount = parseInt(FavoriteCount.textContent) || 0;

            if (data.isFavorite) {
                currentCount += 1;
            } else {
                currentCount -= 1;
            }

            FavoriteCount.textContent = currentCount;
        }
    } catch (error) {
        alert('خطا در تغییر علاقه‌مندی‌ها');
        console.error(error);
    }
};

const AddOrRemoveCart = async (event, productId) => {
    event.stopPropagation();

    const productIndex = window.AllProducts.findIndex(p => p._id === productId);
    if (productIndex === -1) {
        console.error('Product not found in AllProducts');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/user/cart/toggle/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`
            }
        });

        if (response.status === 403) {
            Swal.fire({
                title: "ابتدا وارد حساب کاربری خود شوید",
                icon: "error",
                confirmButtonText: "ورود به حساب"
            }).then(result => {
                if (result.isConfirmed) {
                    const currentPage = location.pathname + location.search + '#products-wrapper';
                    location.href = `login.html?redirect=${encodeURIComponent(currentPage)}`;
                }
            });
            return;
        }

        if (!response.ok) {
            throw new Error('خطا در تغییر سبد خرید');
        }

        const data = await response.json();
        console.log("Toggle Cart Response:", data);

        // آپدیت وضعیت محصول
        window.AllProducts[productIndex].inCart = data.inCart;

        // تغییر آیکون
        const cartBtn = event.target.closest(".basket-icon-wrapper");
        cartBtn ? cartBtn.classList.toggle("line-through", data.inCart) : ''
        

        // شمارنده سبد خرید (هدر)
        const cartCount = document.querySelector('.header-middle__buy span');
        if (cartCount) {
            let currentCount = parseInt(cartCount.textContent) || 0;
            if (data.inCart) {
                currentCount += 1;
            } else {
                currentCount -= 1;
            }
            cartCount.textContent = currentCount;
        }
    } catch (error) {
        alert('خطا در تغییر سبد خرید');
        console.error(error);
    }
};



const sortUserSelection = (products, userSelect) => {
    switch (userSelect) {
        case 'cheap': return [...products].sort((a, b) => a.price - b.price);
        case 'expensive': return [...products].sort((a, b) => b.price - a.price);
        case 'reverse': return [...products].reverse();
        case 'default':
        default: return products;
    }
};

const userSearchProduct = (products, searchProperty, searchValue) => {
    return products.filter(product => product[searchProperty]?.includes(searchValue));
};

const getCategoriesItems = async (shortName) => {
    const res = await fetch(`http://localhost:5000/api/categories?category=${shortName}`);
    return await res.json();
};

const getProductsFromCategories = async (shortName) => {
    console.log(getToken());

    const res = await fetch(`http://localhost:5000/api/products?category=${shortName}`, {
        method: 'GET',
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${getToken()}`
        }
    });
    return await res.json();
};

const getParamFromUrl = (param) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
};

const globalSearch = async (searchValue) => {
    const res = await fetch(`http://localhost:5000/api/products/search?query=${searchValue}`);
    return await res.json();
};

const openProductDetails = (productID) => {
    location.href = `productDetails.html?q=${productID}`;
};


window.openProductDetails = openProductDetails;
window.AddOrRemoveFavorite = AddOrRemoveFavorite;
window.AddOrRemoveCart = AddOrRemoveCart;


document.addEventListener("click", (event) => {
    const favBtn = event.target.closest(".favorite-btn");
    if (favBtn) {
        const productId = favBtn.dataset.id;
        AddOrRemoveFavorite(event, productId);
    }

    const showBtn = event.target.closest(".show-product-btn");
    if (showBtn) {
        openProductDetails(showBtn.dataset.id);
    }

    const cartBtn = event.target.closest(".cart-btn");
    if (cartBtn) {
        const productId = cartBtn.dataset.id;
        AddOrRemoveCart(event, productId);
    }
});

export {
    getDataFromApi,
    saveIntoLS,
    getToken,
    isLogin,
    sortUserSelection,
    setProductsToDom,
    userSearchProduct,
    globalSearch,
    getFromLs,
    getParamFromUrl,
    getCategoriesItems,
    getProductsFromCategories,
};
