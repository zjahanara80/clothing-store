import { isLogin } from '../funcs/apiFuncs.js';
import { getMe, logout } from '../funcs/authentication.js';
import { getToken } from '../funcs/apiFuncs.js';
import { getAndShowParentMenus } from './menus.js';
import {
  ticketShowStatus, sendTicket,
  ticketBtnAndBoxShow, ticketBtnAndBoxClose
} from './ticketBox.js';
import { checkResize } from './header.js'
import { mode_handler, change_mode } from './page-mode.js'
import { getFromLs } from './../funcs/apiFuncs.js'

// import { getBuyCount } from './../cart.js';

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
const logoutBtn = document.getElementById('logout-btn');

const logoutHandler = () => {
  Swal.fire({
    title: "آیا می‌خواهید از حساب خارج شوید؟",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "بله، خروج",
    cancelButtonText: "خیر"
  }).then(result => {
    if (result.isConfirmed) {
      logout();
      showUsernameInNav();
      Swal.fire({
        title: "خارج شدید",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      })
    }
  })

}

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
               <div>
               <i class="fas fa-sign-out-alt" style="color:orange;margin-left:0.4rem" id="logout-btn" onclick="logoutHandler()"></i>
                <span class="header-middle__login-text">${data[0].name}</span>
               </div>
               
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
    const res = await fetch("https://lovin-clothing.onrender.com/api/user-favorites/favorites", {
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

//count of cart items
const getBuyCount = async () => {
  const token = getToken();
  if (!token) return 0;
  try {
    const res = await fetch("https://lovin-clothing.onrender.com/api/user/cart", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    return data.cart ? data.cart.length : 0;
  } catch (err) {
    console.error("خطا در دریافت تعداد:", err);
    return 0;
  }
};


window.logoutHandler = logoutHandler

window.addEventListener('load', () => {
  //loader
  const loader = document.getElementById("loader");
  const mainContent = document.getElementById("main-content");
  loader.style.opacity = "0";
  setTimeout(() => {
    loader.style.display = "none";
    mainContent.style.display = "block";
  }, 500);


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

