import { getAdminInfo , menuSideShowAndHide} from "./funcs/utils.js";
import { notifShow , getNotifications} from "./funcs/notification.js";
import { isLogin } from "../funcs/apiFuncs.js";

const $ = document;
let hamburgerBtn = document.querySelector('.sidebar-menu-btn')
const logOutBtn = document.querySelector('.logout-btn')

window.addEventListener("load" , () => {
    getAdminInfo().then((admin) => {
        console.log(admin);
       if(admin.isAdmin){
        if($.getElementById('admin-welcome-name')){
            $.getElementById('admin-welcome-name').innerHTML = admin.name
          }
           $.getElementById('admin-name').innerHTML = admin.name
        } 
        else{
            const currentPage = location.pathname; 
            location.href = `../../login.html?redirect=${encodeURIComponent(currentPage)}`;
       }
    })

    notifShow()
    getNotifications()
    hamburgerBtn.onclick = menuSideShowAndHide

    if(logOutBtn){

      logOutBtn.onclick = (event) => {
        localStorage.removeItem('user')
        location.href = './../../index.html'
      }
    }
})