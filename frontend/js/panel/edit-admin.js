import { editAdminInfoHandler, getAdminInfos } from './funcs/edit-admin.js';

window.onload = () => {
    getAdminInfos()
    document.getElementById('editAdminBtn').onclick = (event) => {
        event.preventDefault()
        editAdminInfoHandler()
    }
}