import { register } from "./funcs/authentication.js"

let registerBtn = document.getElementById('registerBtn')

registerBtn.onclick = register

if(document.body.style.backgroundColor === 'rgb(37, 34, 34)'){
    document.body.style.backgroundBlendMode = 'lighen'
}
