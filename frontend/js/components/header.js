import { getDataFromApi, globalSearch } from "../funcs/apiFuncs.js";

let $ = document
let hamburger = $.querySelector('.hamburger-menu');
let globalSearchElem = $.querySelector('.header-middle__search-input')
let serachSubmitBtn = $.querySelector('.header-middle__search-btn')
let showSearchResultBoxElem = $.getElementById('search-result__parent')
let currentIndexForSearchItems = -1


//set searched products to url
const hrefSearchValueTo = () => {
    if (globalSearchElem.value !== '') {
        const searchValue = encodeURIComponent(globalSearchElem.value.trim())
        location.href = `search.html?q=${searchValue}`
    }
    else {
        globalSearchElem.focus()
    }
}

//get style when user arrow down or up :)
const insertSelectClassOnsearchItems = (index) => {
    const items = $.querySelectorAll('.search-result__parent-item')
    console.log(index);
    console.log(items[index]);

    items.forEach(item => item.classList.remove('userArrowItem'))
    items[index].classList.add('userArrowItem')
    items[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

//global searchBox behavior
globalSearchElem.onkeyup = (event) => {
  globalSearch(globalSearchElem.value).then(products => {

    if (event.key === 'ArrowDown') {
      if (products.slice(0, 4).length) {
        if (currentIndexForSearchItems < products.slice(0, 4).length - 1) {
          currentIndexForSearchItems++;
          insertSelectClassOnsearchItems(currentIndexForSearchItems);
        }
      }
    }

    else if (event.key === 'ArrowUp') {
      if (products.slice(0, 4).length) {
        if (currentIndexForSearchItems > 0) {
          currentIndexForSearchItems--;
          insertSelectClassOnsearchItems(currentIndexForSearchItems);
        }
      }
    }

    else if (event.code === 'Enter') {
      // اگر روی آیتم خاصی هست
      const selectedItem = document.querySelector('.search-result__parent-item.userArrowItem');
      if (selectedItem) {
        const productId = selectedItem.dataset.id;
        location.href = `productDetails.html?q=${productId}`;
        globalSearchElem.value = '';
      } else {
        // اگه فقط اینتر زده و چیزی انتخاب نکرده
        const firstItem = document.querySelector('.search-result__parent-item');
        if (firstItem) {
          const productId = firstItem.dataset.id;
          location.href = `productDetails.html?q=${productId}`;
          globalSearchElem.value = '';
        } else {
          hrefSearchValueTo();
        }
      }
    }

    else {
      if (products.length) {
        showSearchResultBoxElem.innerHTML = '';
        showSearchResultBoxElem.style.display = 'block';
        products.slice(0, 4).forEach(product => {
          showSearchResultBoxElem.insertAdjacentHTML('beforeend', `
            <li class="search-result__parent-item" data-id="${product._id}">
              ${product.name} با کد ${product.code}
            </li>
          `);
        });

        // اضافه کردن کلیک مستقیم روی آیتم‌ها
        document.querySelectorAll('.search-result__parent-item').forEach(item => {
          item.onclick = () => {
            const productId = item.dataset.id;
            location.href = `productDetails.html?q=${productId}`;
            globalSearchElem.value = '';
          };
        });
      } else {
        showSearchResultBoxElem.style.display = 'none';
      }
    }

  });
};

serachSubmitBtn.onclick = hrefSearchValueTo


// header bottom responsive
hamburger.style.position = 'fixed';
$.querySelector('.header-bottom__response-icon').onclick = headerBottomToggle;
hamburger.onclick = headerBottomToggle;

function headerBottomToggle() {
    $.querySelector('.header-bottom').classList.toggle('h-b__rightSide')
    $.querySelector('.header-bottom__menu').classList.toggle('h-b__rightSide-menu');
    $.querySelectorAll('.header-bottom__item').forEach(item => {
        item.classList.toggle('h-b__rightSide-item');
    })
    $.querySelector('.header-bottom__link').classList.toggle('h-b__rightSide-link');
    $.querySelector('.header-bottom__icon').classList.toggle('h-b__rightSide-icon');
    $.querySelectorAll('.header-bottom__sub').forEach(item => {
        item.classList.toggle('h-b__rightSide-sub');
    })
    $.querySelector('.header-bottom__mode').classList.toggle('h-b__rightSide-mode');
    $.querySelector('.header-bottom__mode-btn').classList.toggle('h-b__rightSide-mode-btn')
    // $.querySelector('.header-bottom__sub-link').classList.toggle('h-b__rightSide-sub')

    hamburger.classList.remove('hamburger-menu__change');
    $.querySelector('.first-line').classList.remove('first-line__change')
    $.querySelector('.middle-line').classList.remove('middle-line__change')
    $.querySelector('.third-line').classList.remove('third-line__change')

    $.querySelector('.overlay').classList.toggle('display-block')
}

if ($.querySelector('.overlay')) {

    $.querySelector('.overlay').onclick = () => {
        headerBottomToggle()
    }
}

$.querySelector('.header-bottom__response-item').onclick = () => {
    headerBottomToggle();
}

// check window size for hidden right-side menu
let checkResize = (event) => {
    if (window.innerWidth > 599) {
        $.querySelector('.header-bottom').classList.remove('h-b__rightSide')
        $.querySelector('.header-bottom__menu').classList.remove('h-b__rightSide-menu');
        $.querySelectorAll('.header-bottom__item').forEach(item => {
            item.classList.remove('h-b__rightSide-item');
        })
        $.querySelector('.header-bottom__link').classList.remove('h-b__rightSide-link');
        $.querySelector('.header-bottom__icon').classList.remove('h-b__rightSide-icon');
        $.querySelectorAll('.header-bottom__sub').forEach(item => {
            item.classList.remove('h-b__rightSide-sub');
        })
        $.querySelector('.header-bottom__mode').classList.remove('h-b__rightSide-mode');
        $.querySelector('.header-bottom__mode-btn').classList.remove('h-b__rightSide-mode-btn')
        // $.querySelector('.header-bottom__sub-link').classList.toggle('h-b__rightSide-sub')

        hamburger.classList.remove('hamburger-menu__change');
        $.querySelector('.first-line').classList.remove('first-line__change')
        $.querySelector('.middle-line').classList.remove('middle-line__change')
        $.querySelector('.third-line').classList.remove('third-line__change')

        $.querySelector('.overlay').classList.remove('display-block')
    }
}


export { checkResize }