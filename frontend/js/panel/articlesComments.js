
import {
    getAndShowAllcomments, showCommentFunc, acceptComment
    , rejectComment, removeComment
} from './funcs/articles-comments.js'
window.showCommentFunc = showCommentFunc
window.acceptComment = acceptComment
window.rejectComment = rejectComment
window.removeComment = removeComment
window.onload = () => {
    getAndShowAllcomments()
}