const getAndShowAllArticlesInDom = async() => {
    const articleParent = document.querySelector('.sug-articles__wrapper')

    const res = await fetch('http://localhost:5000/api/articles')
    const articles = await res.json()
    articles.forEach(article => {
        if(article.isDraft == false){
         articleParent.insertAdjacentHTML('beforeend' , 
            `
             <div class="swiper-slide article-sug__item swiper-slide-active" onclick="visitArticle('${article._id}')"
             role="group" aria-label="1 / 5" style="margin-left: 30px;">
                <img src="http://localhost:5000${article.cover}" alt="" class="article-sug__img">
                <div class="article-sug__img-balls">
                  <span class="article-sug__img-balls-item item1"></span>
                  <span class="article-sug__img-balls-item item2"></span>
                  <span class="article-sug__img-balls-item item3"></span>
                </div>
                
                <h1 class="article-sug__item-title">${article.title}</h1>
                <p class="article-sug__text">
                ${article.chekide}
                </p>
              <div class="article-sug__iconWrapper">
                <svg class="svg-inline--fa fa-share article-sug__icon article-sug__share" aria-labelledby="svg-inline--fa-title-uV6YTlAIpVKP" data-prefix="fas" data-icon="share" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><title id="svg-inline--fa-title-uV6YTlAIpVKP">share</title><path fill="currentColor" d="M307 34.8c-11.5 5.1-19 16.6-19 29.2l0 64-112 0C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96l96 0 0 64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z"></path></svg><!-- <i class="fa fa-share article-sug__icon article-sug__share" title="share"></i> Font Awesome fontawesome.com -->
                <svg class="svg-inline--fa fa-comment article-sug__comment article-sug__icon" aria-labelledby="svg-inline--fa-title-QPZbxvi2ySxA" data-prefix="fas" data-icon="comment" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><title id="svg-inline--fa-title-QPZbxvi2ySxA">comments</title><path fill="currentColor" d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c0 0 0 0 0 0s0 0 0 0s0 0 0 0c0 0 0 0 0 0l.3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"></path></svg><!-- <i class="fa fa-comment article-sug__icon article-sug__comment" title="comments"></i> Font Awesome fontawesome.com -->
              </div>
              <a class="article-sug__link" href="#">ادامه مطلب</a>
          </div>
            `
         )
        }
    })
}

const visitArticle = (articleID) => {
  window.location = `articlesDetails.html?q=${articleID}`
}

export{getAndShowAllArticlesInDom , visitArticle}