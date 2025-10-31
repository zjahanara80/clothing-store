import { getAdminInfo, menuSideShowAndHide } from "./funcs/utils.js";
import { notifShow, getNotifications } from "./funcs/notification.js";
import { isLogin } from "../funcs/apiFuncs.js";
import {  getFromLs } from "./../funcs/apiFuncs.js";
import {  change_mode } from "./../components/page-mode.js";

const $ = document;
let hamburgerBtn = document.querySelector('.sidebar-menu-btn')
const logOutBtn = document.querySelector('.logout-btn')
const notifBtnHeader = document.querySelector('.home-notification')
const homeNotifBtn = document.querySelector('.home-profile')

hamburgerBtn ? 
hamburgerBtn.onclick = menuSideShowAndHide : ""

window.addEventListener("load", () => {
  getAdminInfo().then((admin) => {
    console.log(admin);
    if (admin.isAdmin) {
      if ($.getElementById('admin-welcome-name')) {
        $.getElementById('admin-welcome-name').innerHTML = admin.name
      }
      $.getElementById('admin-name').innerHTML = admin.name
    }
    else {
      const currentPage = location.pathname;
      location.href = `../../login.html?redirect=${encodeURIComponent(currentPage)}`;
    }
  })

  notifShow()
  getNotifications()

  if (logOutBtn) {
    logOutBtn.onclick = (event) => {
      localStorage.removeItem('user')
      location.href = './../../index.html'
    }
  }
})

notifBtnHeader ? notifBtnHeader.onclick = () => {
  location.href = './../tickets/index.html'
} : ""

homeNotifBtn ? homeNotifBtn.onclick = () => {
  location.href = './../edit-admin-profile/index.html'
} : ""

window.addEventListener('load', () => {
  //loader
  const loader = document.getElementById("loader");
  const mainContent = document.getElementById("main-content");
  loader.style.opacity = "0";
  setTimeout(() => {
    loader.style.display = "none";
    mainContent ? mainContent.style.display = "block" : ""
  }, 500);
  change_mode(getFromLs('mode'))
})