import {getToken} from './../../funcs/apiFuncs.js'

const getAdminInfo = async () => {
    const res = await fetch('http://localhost:5000/api/auth/getme' , {
        headers : {
            Authorization : `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
        }}
    )
    const adminInfo = await res.json()
    console.log(adminInfo);
    return adminInfo
    
}
console.log(getAdminInfo());




let menuShowFlag = true

const menuSideShowAndHide = (event) => {
if(menuShowFlag){
    document.querySelector('#sidebar').style.right = "-17%"
    document.querySelector('#home').style.width = "100%"
    menuShowFlag = false
}
else{
    document.querySelector('#sidebar').style.right = "0"
    document.querySelector('#home').style.width = "83.33333333%"
    menuShowFlag = true
}
    
    
}
export {getAdminInfo , menuSideShowAndHide}

