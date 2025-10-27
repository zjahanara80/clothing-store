import { isLogin } from '../funcs/apiFuncs.js';
import { getMe } from '../funcs/authentication.js';
import { getToken } from '../funcs/apiFuncs.js';
import { getAndShowParentMenus } from './menus.js';
import {
  ticketShowStatus, sendTicket,
  ticketBtnAndBoxShow, ticketBtnAndBoxClose
} from './ticketBox.js';
import { checkResize } from './header.js'
import { mode_handler, change_mode } from './page-mode.js'
import { getFromLs } from './../funcs/apiFuncs.js'
import { getBuyCount } from './../cart.js';

const $ = document
let ticketBtn = $.querySelector('.ticket-elem')
let closeTicketBoxBtn = $.querySelector('.ticket-icon')
let mode_btn = $.querySelector('.header-bottom__mode')
let addToFavoritBtn = $.querySelectorAll('.add-to-favorit-btn')
const FavoritePageBtn = $.querySelector('.header-middle__popular')
const buyPageBtn = $.querySelector('.header-middle__buy')
const FavoriteCount = $.querySelector('.header-middle__popular span')
const buyCountSpan = $.querySelector('.header-middle__buy span')
const menuBtns = $.querySelectorAll('.header-top__right-link')
const contactBtn = $.querySelector('.header-top__left-text')


if (ticketBtn) {
  ticketBtn.onclick = () => {
    ticketBtnAndBoxShow()
  }
}

if (closeTicketBoxBtn) {
  closeTicketBoxBtn.onclick = () => {
    console.log(closeTicketBoxBtn);
    ticketBtnAndBoxClose()
  }
}

if (document.querySelector('.ticket-box__body-ticket__submit')) {

  document.querySelector('.ticket-box__body-ticket__submit').onclick = () => {
    sendTicket().then(result => {
      console.log(result);

    })
  }
}
const showUsernameInNav = () => {
  let navProfileBox = document.querySelector('.header-middle__login')
  navProfileBox.innerHTML = ''
  let isUserLogin = isLogin()
  if (isUserLogin) {
    try {
      let userDetails = getMe().then(data => {
        if (data[0].message === 'Invalid token') {
          console.log('yes');
          navProfileBox.innerHTML = `
            <i class="fas fa-user header-middle__login-icon"></i>
            <a href="login.html" class="header-middle__login-link index-login-btn">ورود</a>
            <span class="header-middle__login-text">/</span>
            <a href="register.html" class="header-middle__login-link index-register-btn">ثبت نام</a>
         `
        }
        else {
          navProfileBox.style.cursor = 'pointer'
          navProfileBox.innerHTML = `
               <span class="header-middle__login-text">${data[0].name}</span>
            `
        }
      })
    }
    catch (error) {
      console.log(error);
    }
  }
  else {
    navProfileBox.innerHTML = `
            <i class="fas fa-user header-middle__login-icon"></i>
            <a href="login.html" class="header-middle__login-link index-login-btn">ورود</a>
            <span class="header-middle__login-text">/</span>
            <a href="register.html" class="header-middle__login-link index-register-btn">ثبت نام</a>
         `
  }


}

mode_btn.onclick = mode_handler

//go to contact for support 
if (document.querySelector('.createContactToSupport')) {

  document.querySelector('.createContactToSupport').onclick = () => {
    location.href = 'ticket.html'
  }
}


//go on favorite page
FavoritePageBtn ? FavoritePageBtn.onclick = () => {
  location.href = 'favorite.html'
} : ''

//count of favorits handler
const getFavoriteCount = async () => {
  if (!getToken()) return 0;

  try {
    const res = await fetch("http://localhost:5000/api/user-favorites/favorites", {
      headers: { Authorization: `Bearer ${getToken()}` }
    });

    const data = await res.json();
    FavoriteCount.innerHTML = data.favorites ? data.favorites.length : 0;
  } catch (err) {
    console.error("خطا در دریافت علاقه‌مندی‌ها:", err);
    FavoriteCount.innerHTML = 0;
  }
}

//go on cart page
buyPageBtn ? buyPageBtn.onclick = () => {
  console.log('buy');

  location.href = 'cart.html'
} : ''

menuBtns && menuBtns.forEach(btn => {
  if(btn.innerHTML == "تماس با ما") {
    btn.innerHTML = 'خانه'
    btn.onclick = () => location.href = 'index.html'
  }
})

contactBtn ? contactBtn.onclick = () =>  location.href = 'ticket.html' : ''
 


menuBtns && menuBtns.forEach(btn => {
  btn.onclick = () => {
    switch (btn.innerHTML) {
      case "مقالات":
        location.href = 'articles.html'
        break;
      case "خانه":
        location.href = 'index.html'
        break;
      case "درباره ی ما":
        location.href = 'about-us.html'
        break;
    }
  }
})


window.addEventListener('load', () => {
  ticketShowStatus()
  getAndShowParentMenus()
  change_mode(getFromLs('mode'))
  showUsernameInNav()

  // show favorite products count
  getFavoriteCount()

  // show cart products count
  getBuyCount().then(lenght =>
    buyCountSpan.innerHTML = lenght)
})

window.onresize = (event) => {
  checkResize(event)
}

