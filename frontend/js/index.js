import {
    getAndShowAllArticlesInDom, visitArticle, shareArticle
    , visitArticleComments
} from './funcs/index.js'
import { getDataFromApi } from "./funcs/apiFuncs.js";


let $ = document;
let mainTopSubTest = $.querySelector('.main-top__text-first')
let galleryBtns = $.querySelectorAll('.main-category__item');
let showAllOffsProductsBtn = $.querySelector('.main-offer__btn')
window.shareArticle = shareArticle
window.visitArticleComments = visitArticleComments
//main top brand transition
function typeWriter(text, index) {
    if (index < text.length) {
        mainTopSubTest.innerHTML += text[index]
        index++
    }

    setTimeout(() => {
        typeWriter(text, index)
    }, 70)
}

const getData = async () => {
    const response = await fetch('js/db.json')
    const data = await response.json()
    // await galleryGeneration(data, title)
    return data
}


// main category gallery
galleryBtns.forEach(btn => {
    btn.onclick = (event) => {

        let btnTitle = event.target.innerHTML

        galleryBtns.forEach(btnsub => {
            if (btnsub.innerHTML == btnTitle) {
                btnsub.classList.add('current-category__item')
            }
            else {
                btnsub.classList.remove('current-category__item')
            }
        })

        galleryGeneration(btnTitle)

    }
})


let galleryGeneration = async (title) => {
    getData().then(data => {
        for (const [key, value] of Object.entries(data.mainCategory)) {
            if (value.info == title) {
                // grid template area
                $.querySelector('.main-category__box').classList = "main-category__box mx-auto mt-3 " + value.gridTemplateClass

                // items details
                $.querySelector('.main-item').src = value.srcOne.src
                $.querySelector('.main-title').innerHTML = value.srcOne.title
                $.querySelector('.item-one').src = value.srcTwo.src
                $.querySelector('.item-one-title').innerHTML = value.srcTwo.title
                $.querySelector('.item-two').src = value.srcThree.src
                $.querySelector('.item-two-title').innerHTML = value.srcThree.title

                if (value.srcFour) {
                    $.querySelector('.item-three').src = value.srcFour.src
                    $.querySelector('.item-three-title').innerHTML = value.srcFour.title
                }
                if (value.srcFive) {
                    $.querySelector('.item-four').src = value.srcFive.src
                    $.querySelector('.item-four-title').innerHTML = value.srcFive.title
                }

                // تنظیم grid بر اساس دسته‌بندی
                if (title == 'کودکانه') {
                    $.querySelector('.main-category__box').style.gridTemplateRows = 'repeat(2, 270px)';
                    $.querySelector('.main-category__box').style.gridTemplateColumns = 'repeat(2, 1fr)';
                    $.querySelector('.main-category__box-item__gallery3').style.display = 'none'
                    $.querySelector('.main-category__box-item__gallery5').style.display = 'none'
                }
                else if (title == 'مردانه') {
                    $.querySelector('.main-category__box').style.gridTemplateRows = 'repeat(2, 270px)';
                    $.querySelector('.main-category__box').style.gridTemplateColumns = 'repeat(3, 1fr)';
                    $.querySelector('.main-category__box-item__gallery3').style.display = 'none'
                    $.querySelector('.main-category__box-item__gallery5').style.display = 'block'
                }
                else if (title == "زنانه") {
                    $.querySelector('.main-category__box').style.gridTemplateRows = 'repeat(3, 270px)';
                    $.querySelector('.main-category__box').style.gridTemplateColumns = 'repeat(3, 1fr)';
                    $.querySelector('.main-category__box-item__gallery3').style.display = 'block'
                    $.querySelector('.main-category__box-item__gallery5').style.display = 'block'
                }
                $.querySelector('.main-item').onclick = () => {
                    window.location.href = `products.html?category=${value.srcOne.id}`;
                }
                $.querySelector('.item-one').onclick = () => {
                    window.location.href = `products.html?category=${value.srcTwo.id}`;
                }
                $.querySelector('.item-two').onclick = () => {
                    window.location.href = `products.html?category=${value.srcThree.id}`;
                }
                if (value.srcFour) {
                    $.querySelector('.item-three').onclick = () => {
                        window.location.href = `products.html?category=${value.srcFour.id}`;
                    }
                }
                if (value.srcFive) {
                    $.querySelector('.item-four').onclick = () => {
                        window.location.href = `products.html?category=${value.srcFive.id}`;
                    }
                }
            }
        }
    })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}


// let categoryResponse = (event) => {
//     if (window.innerWidth < 560) {
//         galleryBtns.forEach(item => {
//             if (item.classList.contains('current-category__item')) {
//                 $.querySelector('.main-category__box').style.gridTemplateColumns = 'repeat(4, 1fr)';
//                 $.querySelector('.main-category__box').style.width = '90%';
//                 $.querySelector('.main-category__box').style.gridTemplateAreas =
//                     `
//                  "gallery_1 gallery_1 gallery_1 gallery_1"
//                  "gallery_3 gallery_3 gallery_2 gallery_2"
//                  "gallery_4 gallery_4 gallery_5 gallery_5"
//                  `
//             }
//         })
//     }
//     else {
//         $.querySelector('.main-category__box').style.gridTemplateColumns = 'repeat(2, 1fr)';
//         $.querySelector('.main-category__box').style.width = '85%';
//         $.querySelector('.main-category__box').style.gridTemplateAreas =
//             `
//             "gallery_1 gallery_1 gallery_1"
//             "gallery_3 gallery_3 gallery_2"
//             "gallery_4 gallery_5 gallery_2"
//          `
//     }
// }

// offer section swiper
var swiperOffer = new Swiper(".main-offer-swiper", {

    slidesPerView: 'auto',
    spaceBetween: 30,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
});



// main-offer section
let mainOfferGeneration = () => {
    getDataFromApi('http://localhost:5000/api/products').then(data => {
        console.log(data);

        const swiperWrapper = document.querySelector('.offer-swiper-parent');

        for (const [key, value] of Object.entries(data)) {
            if (value.discount > 0) {
                console.log(value);

                const slide = `
                    <div class="swiper-slide main-offer__left-item">
    
                        <span class="main-offer__left-title">${value.name}</span>
                        <img
                            src="http://localhost:5000${value.img[0]}"
                            alt=""
                            class="main-offer__left-img"/>
                        <div class="main-offer__left-priceWrapper">
                            <span class="main-offer__left-oldPrice">${value.price}</span>
                            <span class="main-offer__left-newPrice">${value.price - ((value.price * value.discount) / 100)} تومان</span>
                        </div>
                        <div class="show-pro-box">
                         <div class="btn-box" title="مشاهده محصول" onclick="openProductDetails('${value._id}')">
                          <i class="fa fa-eye main-offer__left-item__overlay-icon btn-icon"></i>
                          <span>نمایش </span> 
                         </div> 
                        </div>
                    </div>
                `;
                swiperWrapper.insertAdjacentHTML('beforeend', slide);
                swiperOffer.update();
            }
        }
    })
        .catch(error => {
            console.error(error);
        });
}

// article swiper
var swiperArticles = new Swiper(".article-sug__itemWrapper", {
    slidesPerView: 'auto',
    spaceBetween: 30,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    }
});

const openProductDetails = async (proID) => {
    window.location = `productDetails.html?q=${proID}`
}

// article suggestion generation
let articleSugGeneration = () => {
    getData().then(data => {
        const articlesWrapper = $.querySelector('.sug-articles__wrapper');
        if (data.articles) {
            for (const [key, value] of Object.entries(data.articles)) {
                const slide = `
                <div class="swiper-slide article-sug__item">
                <img src="${value.sugPlace.img}" alt="" class="article-sug__img">
                <div class="article-sug__img-balls">
                  <span class="article-sug__img-balls-item item1"></span>
                  <span class="article-sug__img-balls-item item2"></span>
                  <span class="article-sug__img-balls-item item3"></span>
                </div>
                </img>
                <h1 class="article-sug__item-title">${value.sugPlace.mainTitle}</h1>
                <p class="article-sug__text">${value.sugPlace.shortText}</p>
              <div class="article-sug__iconWrapper">
                <i class="fa fa-share article-sug__icon article-sug__share" title="share"></i>
                <i class="fa fa-comment article-sug__icon article-sug__comment" title="comments"></i>
              </div>
              <div class="article-sug__link">ادامه مطلب</div>
          </div>`;
                articlesWrapper.insertAdjacentHTML('beforeend', slide)
                swiperArticles.update()
            }
        }

        //article img animation
        let articleImages = $.querySelectorAll('.article-sug__img');
        articleImages.forEach(img => {
            img.addEventListener("mouseenter", () => {
                articleImgTransition(img)
            })
            img.onmouseleave = () => {
                img.classList.remove('article-sug__img-transition')
                $.querySelectorAll('.article-sug__img-balls-item').forEach(item => {
                    if (item.classList.contains('item1')) {
                        if (item.parentElement.previousElementSibling == img) {
                            item.classList.add('item1-out')
                            item.classList.remove('item1-in')
                        }
                    }
                    if (item.classList.contains('item2')) {
                        if (item.parentElement.previousElementSibling == img) {
                            item.classList.add('item2-out')
                            item.classList.remove('item2-in')
                        }
                    }
                    if (item.classList.contains('item3')) {
                        if (item.parentElement.previousElementSibling == img) {
                            item.classList.add('item3-out')
                            item.classList.remove('item3-in')
                        }
                    }
                })
            }
        });
    })
}

showAllOffsProductsBtn.onclick = () => {
    location.href = `products.html?category=67fb7e93055a1468df373b7c`
}

let articleImgTransition = (img) => {
    img.classList.add('article-sug__img-transition')
    $.querySelectorAll('.article-sug__img-balls-item').forEach(item => {
        if (item.classList.contains('item1')) {
            if (item.parentElement.previousElementSibling == img) {
                item.classList.add('item1-in')
                item.classList.remove('item1-out')
            }
        }
        if (item.classList.contains('item2')) {
            if (item.parentElement.previousElementSibling == img) {
                item.classList.add('item2-in')
                item.classList.remove('item2-out')

            }
        }
        if (item.classList.contains('item3')) {
            if (item.parentElement.previousElementSibling == img) {
                item.classList.add('item3-in')
                item.classList.remove('item3-out')

            }
        }
    })

}

window.visitArticle = visitArticle
window.openProductDetails = openProductDetails

window.onload = () => {
    let mainText = "برازنده ی تن تو..."
    let typeIndex = 0;
    typeWriter(mainText, typeIndex);
    getData();
    // categoryResponse(event)
    galleryGeneration('زنانه')
    mainOfferGeneration();
    getAndShowAllArticlesInDom()
    articleSugGeneration();
}

window.onresize = () => {
    // checkResize(event);
    categoryResponse(event)
}
