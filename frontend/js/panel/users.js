import {
    getAndShowAllUsers, removeUser, blockUser,
    prepareCreateUser, createNewUser, editUserInfos , 
} from "./funcs/users.js";
import { modalBoxHideHandeling } from './funcs/shared.js'

window.removeUser = removeUser
window.blockUser = blockUser
window.editUserInfos = editUserInfos

window.onload = () => {
    document.getElementById('addUserBtn').onclick = (event) => {
        event.preventDefault()
        createNewUser()
    }

    document.querySelector('.edit-box-icon').onclick = () => {
        modalBoxHideHandeling()
    }
    getAndShowAllUsers()
    prepareCreateUser()
}
