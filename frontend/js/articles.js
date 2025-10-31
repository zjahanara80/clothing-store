
import { paginationStructure } from './funcs/utils.js';
import {
  getParamFromUrl,
  sortUserSelection,
  userSearchProduct
} from "./funcs/apiFuncs.js";
import { shareArticle } from './funcs/index.js';

const articlesParent = document.querySelector('.article-sug__itemWrapper');
const paginateList = document.querySelector('.paginate-list');
const pageNumber = parseInt(getParamFromUrl('page')) || 1;
const selection = document.querySelector('.main-center__top-selection');
const searchInput = document.querySelector('.main-center__top-input');
window.shareArticle = shareArticle;

const getAndShowSuggestedAllArticles = async () => {
  const res = await fetch(`https://lovin-clothing.onrender.com/api/articles`);
  const articles = await res.json();
  console.log(articles);

  let pageArticles = paginationStructure(articles, 6, paginateList, pageNumber);

  articlesParent.innerHTML = '';
  if (pageArticles.length > 0) {
    addContentToElem(pageArticles);
    document.querySelector('.main-center__top-title').innerHTML = `در حال نمایش ${articles.length} نتیجه`;
  } else {
    document.querySelector('.main-center__top-title').innerHTML = 'نتیجه‌ای یافت نشد';
    articlesParent.innerHTML = `
      <div class="alert alert-warning" 
        style="border:2px solid orange; color:orange; padding:2rem; width:90%; margin:2rem auto; text-align:center;">
        مقاله‌ای یافت نشد
      </div>`;
  }

  // sort
  selection.onchange = event => {
    const key = event.target.selectedOptions[0].dataset.key;
    const sorted = sortUserSelection(articles, key);
    let sortedArticles = paginationStructure(sorted, 6, paginateList, 1);
    articlesParent.innerHTML = '';
    if (sortedArticles.length > 0) {
      addContentToElem(sortedArticles);
    } else {
      articlesParent.innerHTML = `
        <div class="alert alert-warning" 
          style="border:2px solid orange; color:orange; padding:2rem; width:90%; margin:2rem auto; text-align:center;">
          مقاله‌ای یافت نشد
        </div>`;
    }
  };

  // search
  searchInput.oninput = event => {
    const filtered = userSearchProduct(articles, 'title', event.target.value);
    const searchedArticles = paginationStructure(filtered, 6, paginateList, 1);
    articlesParent.innerHTML = '';

    if (searchedArticles.length > 0) {
      addContentToElem(searchedArticles);
      document.querySelector('.main-center__top-title').innerHTML = `در حال نمایش ${searchedArticles.length} نتیجه`;
    } else {
      document.querySelector('.main-center__top-title').innerHTML = 'نتیجه‌ای یافت نشد';
      articlesParent.innerHTML = `
        <div class="alert alert-warning" 
          style="border:2px solid orange; color:orange; padding:2rem; width:90%; margin:2rem auto; text-align:center;">
          مقاله‌ای یافت نشد
        </div>`;
    }
  };
};

const addContentToElem = (pageArticles) => {
  pageArticles.forEach(article => {
    articlesParent.insertAdjacentHTML('afterbegin', `
      <div class="article-sug__item swiper-slide-active" style="margin-left: 30px;">
        <img src="https://lovin-clothing.onrender.com${article.cover}" alt="" class="article-sug__img">
        <h1 class="article-sug__item-title">${article.title}</h1>
        <p class="article-sug__text">${article.chekide}</p>
        <div class="article-sug__iconWrapper">
          <i class="fa fa-share article-sug__icon article-sug__share" title="share" onclick="shareArticle('${article.title}', '${article._id}')"></i>
          <i class="fa fa-comment article-sug__icon article-sug__comment" title="comments" onclick="goToArticleComments('${article._id}')"></i> 
        </div>
        <a class="article-sug__link" href="articlesDetails.html?q=${article._id}">ادامه مطلب</a>
      </div>
    `);
  });
};

const goToArticleComments = (articleID) => {
  window.location = `articlesDetails.html?q=${articleID}&scrollTo=comments`;
};

window.goToArticleComments = goToArticleComments;
window.onload = () => {
  getAndShowSuggestedAllArticles();
};
