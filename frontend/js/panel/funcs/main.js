
import { getAllUsers } from "./apiFuncs.js";
import { getToken } from "../../funcs/apiFuncs.js";

const addLastUsersToDom = () => {
    let userParentElem = document.getElementById('user-insert-parent')
    getAllUsers().then(users => {
        users.forEach(user => {
            userParentElem.insertAdjacentHTML('beforeend', `
                <tr>
                <td>${user.name}</td>
                <td>${user.phone}</td>
                <td>${user.email}</td>
                <td>${(user.isAdmin) ? 'ادمین' : "کاربر عادی"}</td>
                <td>${user.createdAt.slice(0, 10)}</td>
                </tr>
                `)
        })
    })
}

const getAndShowMainDetails = async () => {
    const usersImproveElem = document.querySelector('.count-users #percent-improve')
    const articlesImproveElem = document.querySelector('.count-articles #percent-improve')
    const productsImproveElem = document.querySelector('.count-products #percent-improve')

    const usersImproveCountElem = document.querySelector('.count-users #count-improve')
    const articlesImproveCountElem = document.querySelector('.count-articles #count-improve')
    const productsImproveCountElem = document.querySelector('.count-products #count-improve')

    //get all main details
    const res = await fetch('http://localhost:5000/api/stats/overview', {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    })
    const result = await res.json()
    console.log(result);

    document.querySelector('.count-products .home-box-value span').innerHTML = result.products.totalCount + ' محصول'
    document.querySelector('.count-articles .home-box-value span').innerHTML = result.articles.totalCount + ' مقاله'
    document.querySelector('.count-users .home-box-value span').innerHTML = result.users.totalCount + ' کاربر'

//  رشد درصد کاربران
result.users.growthRate > 0 
  ? usersImproveElem.classList.add('improve-color') 
  : result.users.growthRate == 0  
    ? usersImproveElem.classList.add('equals-color') 
    : usersImproveElem.classList.add('failed-color');

usersImproveElem.innerHTML = result.users.growthRate + '% ';

//  رشد تعداد کاربران
result.users.countLastWeek > 0 
  ? usersImproveCountElem.classList.add('improve-color') 
  : result.users.countLastWeek == 0  
    ? usersImproveCountElem.classList.add('equals-color') 
    : usersImproveCountElem.classList.add('failed-color');

usersImproveCountElem.innerHTML = result.users.countLastWeek + ' کاربر';

//  رشد مقالات درصد
result.articles.growthRate > 0 
  ? articlesImproveElem.classList.add('improve-color') 
  : result.articles.growthRate == 0  
    ? articlesImproveElem.classList.add('equals-color') 
    : articlesImproveElem.classList.add('failed-color');

articlesImproveElem.innerHTML = result.articles.growthRate + '% ';

//  رشد تعداد مقالات
result.articles.countLastWeek > 0 
  ? articlesImproveCountElem.classList.add('improve-color') 
  : result.articles.countLastWeek == 0  
    ? articlesImproveCountElem.classList.add('equals-color') 
    : articlesImproveCountElem.classList.add('failed-color');

articlesImproveCountElem.innerHTML = result.articles.countLastWeek + ' مقاله ';

// درصد رشد محصولات
result.products.growthRate > 0 
  ? productsImproveElem.classList.add('improve-color') 
  : result.products.growthRate == 0  
    ? productsImproveElem.classList.add('equals-color')  
    : productsImproveElem.classList.add('failed-color');

productsImproveElem.innerHTML = result.products.growthRate + '% ';

//  رشد تعداد محصولات
result.products.countLastWeek > 0 
  ? productsImproveCountElem.classList.add('improve-color') 
  : result.products.countLastWeek == 0  
    ? productsImproveCountElem.classList.add('equals-color') 
    : productsImproveCountElem.classList.add('failed-color');

productsImproveCountElem.innerHTML = result.products.countLastWeek + ' محصول ';

}


export { addLastUsersToDom, getAndShowMainDetails }