import { getToken } from './../../funcs/apiFuncs.js'

const getAdminInfo = async () => {
    const res = await fetch('https://lovin-clothing.onrender.com/api/auth/getme', {
        headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
        }
    }
    )
    const adminInfo = await res.json()
    console.log(adminInfo);
    return adminInfo

}
console.log(getAdminInfo());



if (window.innerWidth > 700) {
    console.log('h');

}
let menuShowFlag = true

const menuSideShowAndHide = (event) => {
    console.log(event);
    
    if (menuShowFlag) {
        if (window.innerWidth > 700) {
            document.querySelector('#sidebar').style.right = "-30%"
        }
        else {
            document.querySelector('#sidebar').style.right = "-32%"
        }
        menuShowFlag = false
        document.querySelector('#home').style.minWidth = "100%"
    }
    else {
        if (window.innerWidth > 700) {
            document.querySelector('#home').style.width = "80%"
            document.querySelector('#home').style.minWidth = "80%"
        }
        else {
            document.querySelector('#home').style.width = "70%"
            document.querySelector('#home').style.minWidth = "70%"
        }
        document.querySelector('#sidebar').style.right = "0"
        menuShowFlag = true
    }


}



export { getAdminInfo, menuSideShowAndHide }

