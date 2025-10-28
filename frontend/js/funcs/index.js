
const getAndShowAllArticlesInDom = async () => {
  const articleParent = document.querySelector('.sug-articles__wrapper');

  const res = await fetch('http://localhost:5000/api/articles');
  const articles = await res.json();

  articles.forEach(article => {
    if (!article.isDraft) {
      articleParent.insertAdjacentHTML(
        'beforeend',
        `
        <div class="swiper-slide article-sug__item">
          <img 
            src="http://localhost:5000${article.cover}" 
            alt="${article.title}" 
            class="article-sug__img"
            onclick="visitArticle('${article._id}')"
          />

          <h1 class="article-sug__item-title">${article.title}</h1>
          <p class="article-sug__text">${article.chekide}</p>

          <div class="article-sug__iconWrapper">
            <i class="fa fa-share article-sug__icon article-sug__share" 
               title="اشتراک گذاری" 
               onclick="shareArticle('${article.title}', '${article._id}')">
            </i>
            <i class="fa fa-comment article-sug__icon article-sug__comment" 
               title="دیدن نظرات" 
               onclick="visitArticleComments('${article._id}')">
            </i>
          </div>

          <a class="article-sug__link" href="articlesDetails.html?q=${article._id}">
            ادامه مطلب
          </a>
        </div>
        `
      );
    }
  });
};

// رفتن به صفحه‌ی مقاله
const visitArticle = (articleID) => {
  window.location = `articlesDetails.html?q=${articleID}`;
};

// رفتن مستقیم به بخش کامنت‌ها
const visitArticleComments = (articleID) => {
  window.location = `articlesDetails.html?q=${articleID}#comments`;
};

// اشتراک‌گذاری با Share API
const shareArticle = async (title, articleID) => {
  const url = `${window.location.origin}/articlesDetails.html?q=${articleID}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        text: `مقاله "${title}" را بخوانید 👇`,
        url: url,
      });
    } catch (err) {
      console.error('Error sharing:', err);
    }
  } else {
    // اگر share در مرورگر پشتیبانی نشود
    alert('مرورگر شما از اشتراک‌گذاری پشتیبانی نمی‌کند. لینک کپی شد.');
    navigator.clipboard.writeText(url);
  }
};

export { getAndShowAllArticlesInDom, visitArticle ,shareArticle , 
visitArticleComments};
