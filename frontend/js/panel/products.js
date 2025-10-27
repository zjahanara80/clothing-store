import {
    showProductsToPanel, showCategoriesToSelectBox,
    providDataForCreateNewProduct, createNewProduct,
    editProduct , removeImgFromDb , removeProduct
} from './funcs/products.js'
import { modalBoxHideHandeling } from './funcs/shared.js'

let submitBtn = document.getElementById('createProduct')
let categoriesSelectParentElem = document.querySelector('.category-list')

window.editProduct = editProduct
window.removeImgFromDb = removeImgFromDb
window.removeProduct = removeProduct


window.addEventListener('load', () => {
    showProductsToPanel()
    showCategoriesToSelectBox(categoriesSelectParentElem)
    providDataForCreateNewProduct();

    document.querySelector('.edit-box-icon').onclick = () => {
        modalBoxHideHandeling()
    }
});

submitBtn.onclick = (event) => {
    event.preventDefault()
    createNewProduct()
}