import { paginationStructure } from './funcs/utils.js';
import {
  getParamFromUrl,
  sortUserSelection,
  userSearchProduct

} from "./funcs/apiFuncs.js";

const articlesParent = document.querySelector('.article-sug__itemWrapper')
const paginateList = document.querySelector('.paginate-list');
const pageNumber = parseInt(getParamFromUrl('page')) || 1;
const selection = document.querySelector('.main-center__top-selection');
const searchInput = document.querySelector('.main-center__top-input');

const getAndShowSuggestedAllArticles = async () => {
  const res = await fetch(`http://localhost:5000/api/articles`)
  const articles = await res.json()
  console.log(articles);

  let pageArticles = paginationStructure(articles, 6, paginateList, pageNumber);

  addContentToElem(pageArticles)

  document.querySelector('.main-center__top-title').innerHTML = articles.length ? `در حال نمایش ${articles.length} نتیجه` : 'بدون نتیجه'

  // sort
  selection.onchange = event => {
    const key = event.target.selectedOptions[0].dataset.key;
    const sorted = sortUserSelection(articles, key);
    let sortedArticles = paginationStructure(sorted, 6, paginateList, 1);
    articlesParent.innerHTML = '';
    addContentToElem(sortedArticles)
  };

  // search
  searchInput.oninput = event => {
    const filtered = userSearchProduct(articles, 'title', event.target.value);
    const searchedArticles = paginationStructure(filtered, 6, paginateList, 1);
    articlesParent.innerHTML = '';
    addContentToElem(searchedArticles)
    document.querySelector('.main-center__top-title').innerHTML = searchedArticles.length ? `در حال نمایش ${searchedArticles.length} نتیجه` : 'بدون نتیجه'
  };
}

const addContentToElem = (pageArticles) => {
  pageArticles.forEach(article => {
    articlesParent.insertAdjacentHTML('afterbegin', `
         <div class="article-sug__item swiper-slide-active" onclick="visitArticle('685e777a5399124c770d9aa3')"  style="margin-left: 30px;">
                <img src="http://localhost:5000${article.cover}" alt="" class="article-sug__img">

                
                <h1 class="article-sug__item-title">${article.title}</h1>
                <p class="article-sug__text">
                 ${article.chekide}
                </p>
              <div class="article-sug__iconWrapper">
                <i class="fa fa-share article-sug__icon article-sug__share" title="share"></i>
                <i class="fa fa-comment article-sug__icon article-sug__comment" title="comments" onclick="goToArticleComments('${article._id}')"></i> 
              </div>
              <a class="article-sug__link" href="articlesDetails.html?q=${article._id}">ادامه مطلب</a>
          </div>
        `)
  })
}

const goToArticleComments = (articleID) => {
  window.location = `articlesDetails.html?q=${articleID}&scrollTo=comments`
}

window.goToArticleComments = goToArticleComments
window.onload = () => {
  getAndShowSuggestedAllArticles()
}