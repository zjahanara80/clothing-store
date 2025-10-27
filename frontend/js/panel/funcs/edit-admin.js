import { getToken } from "../../funcs/apiFuncs.js"

const nameInputElem = document.getElementById('name')
const usernameInputElem = document.getElementById('username')
const emailInputElem = document.getElementById('email')
const phoneInputElem = document.getElementById('phone')
const passwordInputElem = document.getElementById('password')

const getAdminInfos = async () => {
    const res = await fetch('http://localhost:5000/api/users/me', {
        method: "GET",
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    })
    const result = await res.json()
    console.log(result);
    nameInputElem.value = result.name
    usernameInputElem.value = result.email
    emailInputElem.value = result.email
    phoneInputElem.value = result.phone
}

const editAdminInfoHandler = async () => {
    let body = {
        name: document.getElementById('name').value,
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        password: document.getElementById('password').value
    }

    const res = await fetch('http://localhost:5000/api/users/me', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(body)
    });

    if (res.ok) {
        Swal.fire({
            title: "اطلاعات شما با موفقیت ویرایش شد",
            icon: "success"
        }).then(res => location.refresh())
    }
    else {
        Swal.fire({
            title: "ویرایش اطلاعات با خطا مواجه شد",
            icon: "error"
        })

    }

    const data = await res.json();
}

export { editAdminInfoHandler, getAdminInfos }