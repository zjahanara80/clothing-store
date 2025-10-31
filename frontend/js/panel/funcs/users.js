import { getToken } from "../../funcs/apiFuncs.js"
import { modalBoxHideHandeling, modalBoxShowHandeling } from "./shared.js";

let isUserAdmin = false

const getAndShowAllUsers = async () => {
    const tableElem = document.querySelector('table tbody')

    tableElem.innerHTML = ''
    const res = await fetch(`https://lovin-clothing.onrender.com/api/users`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "content-type": "application/json"
        }
    })
    const result = await res.json()
    console.log(result);
    result.forEach((user, index) => {
        tableElem.insertAdjacentHTML('beforeend', `
       <tr>
        <td>${index + 1}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>${user.isAdmin ? "مدیر" : "کاربر عادی"}</td>
        <td>
            <button type='button' class='btn btn-primary edit-btn' onclick="editUserInfos('${user._id}')">ویرایش</button>
        </td>
        <td>
            <button type='button' class='btn btn-danger delete-btn' onclick="removeUser('${user._id}')">حذف</button>
        </td>
        <td>
            <button type='button' class='btn btn-danger delete-btn' onclick="blockUser('${user._id}' , ${user.isBanned})">${user.isBanned ? 'unblock' : 'block'}</button>
        </td>
    </tr>
            `)
    })
}

const removeUser = async (userID) => {
    Swal.fire({
        title: "آیا از حذف کاربر اطمینان دارید؟",
        showDenyButton: true,
        confirmButtonText: "بله",
        denyButtonText: `خیر`
    }).then(async (result) => {
        if (result.isConfirmed) {

            const res = await fetch(`https://lovin-clothing.onrender.com/api/users/${userID}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "content-type": "application/json"
                }
            })

            if (res.ok) {
                Swal.fire({
                    title: "حذف شد",
                    icon: "success"
                }).then(res => getAndShowAllUsers())
            }

        }
    });
}

const blockUser = async (userID, isBanned) => {
    Swal.fire({
        title: "آیا از بن کاربر اطمینان دارید؟",
        showDenyButton: true,
        confirmButtonText: "بله",
        denyButtonText: `خیر`
    }).then(async (result) => {
        if (result.isConfirmed) {

            const res = await fetch(`https://lovin-clothing.onrender.com/api/users/ban/${userID}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "content-type": "application/json"
                }
            })

            if (res.ok) {
                console.log(res);
                if (!isBanned) {
                    Swal.fire({
                        title: "بن شد",
                        icon: "success"
                    });
                }
                else {
                    Swal.fire({
                        title: "از بن خارج شد",
                        icon: "success"
                    });
                }

            }
            getAndShowAllUsers()
        }
    });
}

const cleareInputs = () => {
    document.getElementById('name').value = ''
    document.getElementById('username').value = ''
    document.getElementById('email').value = ''
    document.getElementById('phone').value = ''
    document.getElementById('password').value = ''
    document.querySelectorAll('.isAdminElem').forEach(item => {
        item.value = ''
    })
}

const prepareCreateUser = () => {
    document.querySelectorAll('.isAdminElem').forEach(item => {
        item.onchange = () => {
            if (item.value == "true") {
                isUserAdmin = true
            }
            else {
                isUserAdmin = false
            }
        }
    })
}

const createNewUser = async () => {
    let UserInfoObj = {
        name: document.getElementById('name').value,
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        password: document.getElementById('password').value,
        isAdmin: isUserAdmin
    }
    console.log(UserInfoObj);


    const res = await fetch('https://lovin-clothing.onrender.com/api/users', {
        method: "POST",
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "content-type": "application/json"
        },
        body: JSON.stringify(UserInfoObj)
    })
    const result = res.json()

    if (res.ok) {
        Swal.fire({
            title: "اد شد",
            icon: "success"
        }).then(result => {
            getAndShowAllUsers()
            cleareInputs()
        })
    }
    else {
        Swal.fire({
            title: "اد نشد",
            icon: "error"
        });
    }
}


const editUserInfos = async (userID) => {
    const nameInputElem = document.getElementById('edit-name')
    const usernameInputElem = document.getElementById('edit-username')
    const emailInputElem = document.getElementById('edit-email')
    const phoneInputElem = document.getElementById('edit-phone')
    const editRols = document.querySelectorAll('.edit-role')
    const editBtn = document.getElementById('edit-user-infos-btn')

    await modalBoxShowHandeling()

    const userDetailsRes = await fetch(`https://lovin-clothing.onrender.com/api/users/${userID}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "content-type": "application/json"
        }
    })

    const userDetails = await userDetailsRes.json()

    let editUserRoleIsAdmin = userDetails.isAdmin

    // show user details on edit box
    nameInputElem.value = userDetails.name
    usernameInputElem.value = userDetails.username ? userDetails.username : userDetails.email
    emailInputElem.value = userDetails.email
    phoneInputElem.value = userDetails.phone

    editRols.forEach(roleRadio => {
        if (userDetails.isAdmin == true && roleRadio.value == "true") {
            roleRadio.checked = true
        }
        else if (!userDetails.isAdmin && roleRadio.value == "false") {
            roleRadio.checked = true
        }
    })

    //if admin change the user role
    editRols.forEach(editRole => {
        editRole.onchange = (event) => {
            if (event.target.value == "true") editUserRoleIsAdmin = true
            else editUserRoleIsAdmin = false
        }
    })

    editBtn.onclick = async (event) => {
        event.preventDefault()
        let userNewInfoObj = {
            name: nameInputElem.value,
            username: usernameInputElem.value,
            email: emailInputElem.value,
            phone: phoneInputElem.value,
            isAdmin: editUserRoleIsAdmin
        }

        const res = await fetch(`https://lovin-clothing.onrender.com/api/users/admin/${userID}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "content-type": "application/json"
            },
            body: JSON.stringify(userNewInfoObj)
        })

        const result = await res.json()
        console.log(result);

        if (res.ok) {
            swal.fire({
                title: "با موفقیت ویرایش شد",
                icon: "success"
            }).then(res => {
                modalBoxHideHandeling()
                getAndShowAllUsers()
            })
        }
        else {
            swal.fire({
                title: "ویرایش با خطا مواجه شد",
                icon: "error"
            })
        }
    }

}


export {
    getAndShowAllUsers, removeUser, blockUser
    , prepareCreateUser, createNewUser, editUserInfos,

}