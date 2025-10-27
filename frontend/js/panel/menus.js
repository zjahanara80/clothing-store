import {
    getAndShowMenues, showMenuCategories
    , providInfoForMakeMenu, createNewMenu,
    editMenuesInfos , selectCategoryParentElem
} from './funcs/menus.js'
import { modalBoxHideHandeling } from './funcs/shared.js'

window.editMenuesInfos = editMenuesInfos

const createMenuBtn = document.getElementById('createMenuBtn')

window.onload = (event) => {
    showMenuCategories(selectCategoryParentElem)

    providInfoForMakeMenu()

    getAndShowMenues().then(menus => {
        console.log(menus);

    })
    
    createMenuBtn.onclick = (event) => {
        event.preventDefault()
        createNewMenu()
    }

    document.querySelector('.edit-box-icon').onclick = () => {
        modalBoxHideHandeling()
    }
}