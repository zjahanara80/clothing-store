import { getToken } from "../../funcs/apiFuncs.js"

const getAndShowAllcomments = async() => {
    const tableElem = document.querySelector('table tbody')

    tableElem.innerHTML = ''
    const res = await fetch(`http://localhost:5000/api/comment-articles`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "content-type": "application/json"
        }
    })
    
    const comments = await res.json()
    console.log(comments);

    comments.forEach((comment, index) => {
        console.log(comment);
        
        if (comment.parent == null) {
            console.log(comment.userExists);
            
            tableElem.insertAdjacentHTML('beforeend', `
           <tr>
            <td>${index + 1}</td>
            <td>${comment.name ? comment.name : 'بدون نام'}</td>
            <td>${comment.email}</td>
            <td>${comment.isVerifiedUser == true ? 'لاگین' : 'عدم لاگین'}</td>
            <td>${comment.createdAt.slice(0, 10)}</td>
            <td>${comment.article ? comment.article.title : 'ست نشده'}</td>
            <td>
                <button type='button' class='btn btn-primary show-btn' onclick='showCommentFunc(${JSON.stringify(comment.title)} ,${JSON.stringify(comment.message)})'>مشاهده</button>
            </td>

            <td>
               ${comment.approved ? 
                `<button type='button' class='btn btn-danger delete-btn' onclick="rejectComment('${comment._id}')">رد</button>`
              :  
               `
                <button type='button' class='btn btn-success delete-btn' onclick="acceptComment('${comment._id}')">تایید</button>
               `} 
            </td>
            <td>
                <button type='button' class='btn btn-danger delete-btn' onclick="removeComment('${comment._id}')">حذف</button>
            </td>
        </tr>
                `)
        }
    })
}

const showCommentFunc = (commentTitle,commentText) => {
    Swal.fire({
        title: commentTitle,
        text : commentText,
        confirmButtonText: "دیدم",
    })
}

const acceptComment = async (commentID) => {

    const res = await fetch(`http://localhost:5000/api/comment-articles/approve/${commentID}`, {
        method : "PATCH",
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "content-type": "application/json"
        }
    })

    const result = await res.json()
    console.log(result);
    if(res.ok){
        getAndShowAllcomments()
    }
}

const rejectComment = async (commentID) => {
    const res = await fetch(`http://localhost:5000/api/comment-articles/reject/${commentID}`, {
        method : "PATCH",
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "content-type": "application/json"
        }
    })

    const result = await res.json()
    console.log(result);
    if(res.ok){
        getAndShowAllcomments()
    }
}

const removeComment = async (commentID) => {
    Swal.fire({
        title: "آیا از حذف کامنت اطمینان دارید؟",
        showDenyButton: true,
        confirmButtonText: "بله",
        denyButtonText: `خیر`
    }).then(async (result) => {
        if (result.isConfirmed) {
            const res = await fetch(`http://localhost:5000/api/comment-articles/${commentID}`, {
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
                }).then(res => getAndShowAllcomments())
            }

        }
    });
}
export {
    getAndShowAllcomments , showCommentFunc , acceptComment
    ,rejectComment , removeComment
}