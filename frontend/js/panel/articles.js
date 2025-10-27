
import{getAndShowAllArticles , prepareCreateArticle , createNewArticle
    ,deleteArticle  , createNewDraft , publishDraftedArticle , publishedArticleEdit
} from './funcs/articles.js'
import { modalBoxHideHandeling } from './funcs/shared.js'

window.deleteArticle = deleteArticle
window.publishDraftedArticle = publishDraftedArticle
window.publishedArticleEdit = publishedArticleEdit

window.onload = () => {
    prepareCreateArticle()
    getAndShowAllArticles()

    document.getElementById('addArticleBtn').onclick = (event) => {
        event.preventDefault()
        createNewArticle()
    }
    document.getElementById('preWrite').onclick = (event) => {
        event.preventDefault()
        createNewDraft()
    }
    document.querySelector('.edit-box-icon').onclick = () => {
        modalBoxHideHandeling()
    }
}
