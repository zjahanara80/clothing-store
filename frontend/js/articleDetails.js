import { getParamFromUrl, getToken, isLogin } from "./funcs/apiFuncs.js";
import { getMe } from './funcs/authentication.js';

const articleID = getParamFromUrl('q');
const emailInput = document.querySelector('.user-comment-email')
const nameInput = document.querySelector('.user-comment-name')
const titleInput = document.querySelector('.user-comment-title')
const messageInput = document.querySelector('.user-comment-text')
const commentsParent = document.querySelector('.comments-wrapper')
const rateInputs = document.querySelectorAll('.rate-input')
const productRateShow = document.querySelector('.comment-right__stars-icons')
const sortBtns = document.querySelectorAll('.sort-btn')
const productRateStatusShow = document.querySelector('.comment-right__stars-result')


const getAndShowArticleDetails = async () => {
    const res = await fetch(`http://localhost:5000/api/articles/${articleID}`)
    const article = await res.json()
    console.log(article);

    document.querySelector('.articles-info').innerHTML = article.body
    document.querySelector('.details-Wrapper__left-info-subject .info').innerHTML = article.title ? article.title : 'ست نشده'
     if(article.category == 'متفرقه'){
        document.querySelector('.details-Wrapper__left-info-category .info').innerHTML = article.category
     }
     else if(!article.category){
        document.querySelector('.details-Wrapper__left-info-category .info').innerHTML = 'ست نشده'
     }
     else{
        document.querySelector('.details-Wrapper__left-info-category .info').innerHTML = `<a href="products.html?category=${article.category._id}">${article.category.name}</a>`
     }

    document.querySelector('.details-Wrapper__left-info-author .info').innerHTML = article.price ? article.price.toLocaleString() : 'ست نشده'
    document.querySelector('.details-Wrapper__left-info-date .info').innerHTML = article.createdAt.slice(0,10) ? article.createdAt.slice(0,10) : 'ست نشده'
    document.querySelector('.details-Wrapper__left-info-update .info').innerHTML = article.updatedAt.slice(0,10) ? article.updatedAt.slice(0,10) : 'ست نشده'
    document.querySelector('.details-Wrapper__left-desc').innerHTML = article.chekide ? article.chekide : 'ست نشده'

}

const getAndShowSuggestedAllArticles = async () => {
    const res = await fetch(`http://localhost:5000/api/articles`)
    const articles = await res.json()
    console.log(articles);

    articles.forEach(article => {
        if(article._id !== articleID && !article.isDraft){
            document.querySelector('.suggestedArticlesLinks').insertAdjacentHTML('beforeend' , 
                `<a href="articlesDetails.html?q=${article._id}">${article.title}</a>`
            )
        }
    })
}

const getAndShowAllcomments = async (sortBy = 'oldest') => {

    const res = await fetch(`http://localhost:5000/api/comment-articles/${articleID}`)
    const comments = await res.json()
    console.log(comments);

    let commentsRateSum = 0
    commentsParent.innerHTML = ''
   
    if (comments.length > 0) {
        switch (sortBy) {
            case 'newest':
                comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'oldest':
                comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'highest':
                comments.sort((a, b) => b.rating - a.rating);
                break;
            case 'lowest':
                comments.sort((a, b) => a.rating - b.rating);
                break;
        }


        comments.forEach(comment => {
            console.log(comment);
            if (comment.rating !== '' && !isNaN(comment.rating)) commentsRateSum += comment.rating


                commentsParent.insertAdjacentHTML('beforeend', `
                      <div class="comment">
                        <p class="comment-name">
                        <span class="name">${comment.name ? comment.name : 'بدون نام'}</span>
                        <span>${comment.createdAt.slice(0, 10)}</span></p>
                        <p class="comment-title">${comment.title}</p>
                        <div class="comment-right__stars">
                          <div class="comment-right__stars-icons">
                          ${Array(comment.rating).fill(0).map(score => '<i class="fa fa-star comment-right__stars-icon"></i>'
                ).join(' ')}
                             ${Array(5 - Math.max(0, Math.min(5, Number(comment.rating) || 0)))
                        .fill(0)
                        .map(() => '<i class="fa-regular fa-star comment-right__stars-icon"></i>')
                        .join(' ')
                    }
                          </div>
                        </div>
                        
                        <div class="comment-message">${comment.message}</div>
                      </div>
                    `)
            
        })
    }
    else {
        commentsParent.insertAdjacentHTML('beforeend', `
              <div class="alert alert-success">اولین نفری باشید که نظر ثبت میکند</div>
            `)
        document.querySelector('.comment-right__title').innerHTML = 'نظری برای این مقاله ثبت نشده است'
    }

    //show average stars
    const averageRate = commentsRateSum / comments.length;
    renderStars(averageRate);
    console.log(averageRate);
    console.log(Number(commentsRateSum));
}

//sort comments by user selection
sortBtns.forEach(sortBtn => {
    sortBtn.onclick = (event) => {
        console.log(event.target.dataset.name);
        getAndShowAllcomments(event.target.dataset.name)
    }
})

const renderStars = (avg) => {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (avg >= i) {
            stars += '<i class="fa fa-star comment-right__stars-icon"></i>';
        }
        else if (avg >= i - 0.5) {
            stars += `<i class="fa-solid fa-star-half-stroke fa-flip-horizontal comment-right__stars-icon"></i>`;
        }
        else {
            stars += '<i class="fa-regular fa-star comment-right__stars-icon"></i>';
        }
    }

    if (avg == 5) {
        productRateStatusShow.innerHTML = 'عالی'
    }
    if (avg < 5 && avg >= 4) {
        productRateStatusShow.innerHTML = 'خوب'
    }
    if (avg >= 3 && avg < 4) {
        productRateStatusShow.innerHTML = 'متوسط'
    }
    if (avg >= 2 && avg < 3) {
        productRateStatusShow.innerHTML = 'ضعیف'
    }
    if (avg >= 1 && avg < 2) {
        productRateStatusShow.innerHTML = 'خیلی بد'
    }
    productRateShow.innerHTML = stars
    return stars;
}

const showUserInfoInCommentBoxStatus = () => {
    if (isLogin()) {
        if (getMe()) {
            getMe().then(userInfo => {
                
                if(userInfo[1] == 201 || userInfo[1] == 200){
                    console.log(userInfo);
                    emailInput.value = userInfo[0].email
                    nameInput.value = userInfo[0].name
                }
            });
        }
    }
}

let userRateCount = 0
const prepareSendComment = () => {
    rateInputs.forEach(rateInput => {
        rateInput.onclick = (event) => {
            if (!event.target.nextElementSibling.innerHTML.includes('<svg class="svg-inline--fa fa-star comment-right__stars-icon" aria-hidden="true" focusable="false" data-prefix="far" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"></path></svg>')) {
                userRateCount--
                console.log(userRateCount);

                event.target.nextElementSibling.innerHTML = `<i class="fa-regular fa-star comment-right__stars-icon"></i>`
            } else {
                userRateCount++
                console.log(userRateCount);
                event.target.nextElementSibling.innerHTML = `<i class="fa fa-star comment-right__stars-icon"></i>`
            }
        }
    })

}

const sendComment = async () => {
    const commentInfo = {
        articleId: articleID,
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        title: titleInput.value.trim(),
        message: messageInput.value.trim(),
        rating: userRateCount ? userRateCount : 0
    }
    console.log(commentInfo);


    const res = await fetch(`http://localhost:5000/api/comment-articles`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            ...(getToken() && { Authorization: `Bearer ${getToken()}` })
        },
        body: JSON.stringify(commentInfo)
    })
    const result = await res.json()
    console.log(result);
    if (res.ok) {
        Swal.fire({
            title: "کامنت با موفقیت ثبت شد پس از تایید نمایش داده میشود",
            icon: "success"
        }).then(result => {
            getAndShowAllcomments()
            clearInputs()
        })
    }
    else {
        Swal.fire({
            title: "کامنت ثبت نشد",
            icon: "error"
        })
    }
}

const clearInputs = () => {
    nameInput.value = ''
    emailInput.value = ''
    titleInput.value = ''
    messageInput.value = ''
    document.querySelectorAll('.comment-left__stars-icons label').forEach(item => {
        item.innerHTML = `<i class="fa-regular fa-star comment-right__stars-icon"></i>`
    })
    userRateCount = 0
}

document.querySelector('.user-comment-submit').onclick = (event) => {
    event.preventDefault()
    sendComment()
}

window.onload = () => {
    getAndShowArticleDetails()
    getAndShowSuggestedAllArticles()
    getAndShowAllcomments()
    showUserInfoInCommentBoxStatus()
    prepareSendComment()


    const scrollTo = getParamFromUrl('scrollTo');

    if (scrollTo === 'comments') {
        setTimeout(() => {
            const commentSection = document.getElementById('comments');
            if (commentSection) {
                commentSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 500); 
    }
}