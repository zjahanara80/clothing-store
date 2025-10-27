import{getAndShowAllcomments , showCommentFunc 
    ,rejectComment , acceptComment , removeComment
} from './funcs/comments.js'

window.showCommentFunc = showCommentFunc
window.rejectComment = rejectComment
window.acceptComment = acceptComment
window.removeComment = removeComment

window.onload = () => {
    getAndShowAllcomments()
}