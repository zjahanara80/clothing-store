import {login} from './funcs/authentication.js';

let loginBtn = document.getElementById('loginBtn')

window.onkeyup = (event) => {
    event.key == "Enter" && login()
    
}
loginBtn.onclick = login