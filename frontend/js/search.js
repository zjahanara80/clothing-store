import { getParamFromUrl, setProductsToDom, globalSearch } from './funcs/apiFuncs.js'
import { paginationStructure } from './funcs/utils.js'

let parentElement = document.querySelector('.all-products-parent')
let showResultCountElem = document.querySelector('.main-center__top-title')

let insertSearchResultToDom = () => {
    let userSearchTitle = getParamFromUrl('q')
    let paginateList = document.querySelector('.paginate-list')

    console.log(userSearchTitle);

    globalSearch(userSearchTitle).then(products => {

        let pageNumber = getParamFromUrl('page')

        let resultArray = paginationStructure(products, 3, paginateList, pageNumber)

        console.log(resultArray);
        
        setProductsToDom(resultArray, parentElement)
        
        if (products.length) {
            showResultCountElem.innerHTML = `برای جست و جوی شما ${products.length} نتیجه پیدا شد`
        }
        else {
            showResultCountElem.style.color = 'red'
            showResultCountElem.style.borderColor = 'red'

            showResultCountElem.innerHTML = ` برای جست و جوی شما نتیجه ای یافت نشد <a href="index.html">بازگشت به خانه</a>`
        }
    })
}

insertSearchResultToDom()