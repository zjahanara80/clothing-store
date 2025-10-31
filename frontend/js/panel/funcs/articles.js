import { getToken } from "../../funcs/apiFuncs.js"
import { modalBoxHideHandeling, modalBoxShowHandeling } from "./shared.js";

const categorySelectParent = document.querySelector('#category-list')
const coverUploaderElem = document.getElementById('cover')
let articleBodyEditor = null;
let categoryID = -1
let articleCover = null
let publishedArticles = null
let draftedArticles = null

const clearInputs = () => {
    document.getElementById('title').value = ''
    document.getElementById('chekideh').value = ''
    document.getElementById('link').value = ''
    coverUploaderElem.value = ''
    categorySelectParent.selectedIndex = 0;
    // articleBodyEditor.setData('');
}

const getAndShowAllArticles = async () => {
    const endArticlesElem = document.querySelector('#endArticles tbody')
    const preArticlesElem = document.querySelector('#preArticles tbody')

    endArticlesElem.innerHTML = ''
    preArticlesElem.innerHTML = ''

    const res = await fetch(`https://lovin-clothing.onrender.com/api/articles/admin`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "content-type": "application/json"
        }
    })
    const articlesResult = await res.json()

    publishedArticles = [...articlesResult.filter(article => article.isDraft == false)]
    draftedArticles = [...articlesResult.filter(article => article.isDraft == true)]

    articlesResult.forEach((article, index) => {
        if (article.isDraft == false) {
            endArticlesElem.insertAdjacentHTML('beforeend',
                `
                <tr>
                  <td>${index + 1}</td>
                  <td>${article.title}</td>
                  <td>${article.createdAt.slice(0, 10)}</td>
                  
                  <td>${article.category == 'متفرقه' ? 'متفرقه' : article.category.name}</td>
                  <td>
                      <button type="button" class="btn btn-primary edit-btn" onclick="publishedArticleEdit('${article._id}' , event)" data-article='${JSON.stringify(article)}'>ویرایش</button>
                  </td>
                   <td>
                      <button type="button" class="btn btn-danger delete-btn" onclick="deleteArticle('${article._id}')">حذف</button>
                  </td>
                </tr>
                `
            )
        }
        if (article.isDraft == true) {
            preArticlesElem.insertAdjacentHTML('beforeend',
                `
                <tr>
                  <td>${index + 1}</td>
                  <td>${article.title}</td>
                  <td>${article.createdAt.slice(0, 10)}</td>
                  <td>${article.category == 'متفرقه' ? 'متفرقه' : article.category.name}</td>
                  <td>
                      <button type="button" class="btn btn-primary edit-btn" onclick="publishedArticleEdit('${article._id}' , event)" data-article='${JSON.stringify(article)}'>تکمیل</button>
                  </td>
                  <td>
                      <button type="button" class="btn btn-primary publish-btn" onclick="publishDraftedArticle('${article._id}')">انتشار</button>
                  </td>
                   <td>
                      <button type="button" class="btn btn-danger delete-btn" onclick="deleteArticle('${article._id}')">حذف</button>
                  </td>
                </tr>
                `
            )
        }
    })
}

const getAndShowCetgoriesItems = async (parentElem) => {
    const CatRes = await fetch('https://lovin-clothing.onrender.com/api/categories')
    const Categories = await CatRes.json()
    console.log(Categories);
    Categories.forEach(category => {
        if (category.parent == null) {
            parentElem.insertAdjacentHTML('beforeend', `
                 <option value=${category._id}>${category.name}</option>
                `)
        }
    })
}

const insertTextEditor = async (element) => {
    // const {
    //     ClassicEditor,
    //     Essentials,
    //     Bold,
    //     Italic,
    //     Font,
    //     Paragraph,
    //     Heading,
    //     Table,
    //     TableToolbar,
    //     Image,
    //     ImageUpload,
    //     ImageInsert,
    //     SimpleUploadAdapter
    // } = CKEDITOR;

    // ClassicEditor.create(editorElem, {
    //     licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NTIxOTE5OTksImp0aSI6IjYzNWJhZWEzLTY3MmMtNDliNC04NWIwLThlYzVjYjg4M2Y3NSIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6ImEwM2VmMzM2In0.Wy2m5n7t_V8qE6GD7-HdfZeHR2cFm6al2FA3rOk1LqD2T9aKnR85pp0T2GFQmyElYr5Sxt_ZUNPMEZAh7lIbJg', // کلید تستی ۱۴ روزه شما

    //     plugins: [Essentials, Heading, Bold, Italic, Font, Paragraph, Table, TableToolbar, Image, ImageUpload, ImageInsert, SimpleUploadAdapter],

    //     toolbar: [
    //         'heading', '|',
    //         'undo', 'redo', '|',
    //         'bold', 'italic', '|',
    //         'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|',
    //         'insertTable',
    //         'insertImage'
    //     ],

    //     heading: {
    //         options: [
    //             { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
    //             { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
    //             { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' }
    //         ]
    //     },
    //     table: {
    //         contentToolbar: [
    //             'tableColumn', 'tableRow', 'mergeTableCells'
    //         ]
    //     },
    //     simpleUpload: {
    //         uploadUrl: 'https://lovin-clothing.onrender.com/uploads/articles'
    //     },
    //     // تنظیمات زبان فارسی و راست‌به‌چپ
    //     language: {
    //         uiLanguage: 'fa',
    //         contentLanguage: 'fa'
    //     },
    //     // تنظیم جهت متون
    //     initialData: '<p dir="rtl"></p>',
    //     wordCount: false
    // })
    //     .then(editor => {
    //         // تنظیم جهت راست‌به‌چپ
    //         editor.editing.view.change(writer => {
    //             writer.setAttribute('dir', 'rtl', editor.editing.view.document.getRoot());
    //         });

    //         // مقداردهی اولیه
    //         articleBodyEditor = editor.getData();

    //         // گوش دادن به تغییرات محتوا
    //         editor.model.document.on('change:data', () => {
    //             articleBodyEditor = editor.getData();
    //         });

    //         console.log('Editor آماده با فارسی، هدر و جدول');
    //     })
    //     .catch(err => console.error(err));
    if (articleBodyEditor) return articleBodyEditor;
    const { ClassicEditor, Essentials, Bold, Italic, Font, Paragraph, Heading, Table, TableToolbar, Image, ImageUpload, ImageInsert, SimpleUploadAdapter } = CKEDITOR;
    articleBodyEditor = await ClassicEditor
        .create(element, {
            licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NTIxOTE5OTksImp0aSI6IjYzNWJhZWEzLTY3MmMtNDliNC04NWIwLThlYzVjYjg4M2Y3NSIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6ImEwM2VmMzM2In0.Wy2m5n7t_V8qE6GD7-HdfZeHR2cFm6al2FA3rOk1LqD2T9aKnR85pp0T2GFQmyElYr5Sxt_ZUNPMEZAh7lIbJg',
            plugins: [Essentials, Heading, Bold, Italic, Font, Paragraph, Table, TableToolbar, Image, ImageUpload, ImageInsert, SimpleUploadAdapter],
            toolbar: ['heading', '|', 'undo', 'redo', '|', 'bold', 'italic', '|', 'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|', 'insertTable', 'insertImage'],
            simpleUpload: { uploadUrl: 'https://lovin-clothing.onrender.com/uploads/articles' },
            language: { uiLanguage: 'fa', contentLanguage: 'fa' },
            initialData: '<p dir="rtl"></p>',
            wordCount: false
        });
    articleBodyEditor.editing.view.change(writer =>
        writer.setAttribute('dir', 'rtl', articleBodyEditor.editing.view.document.getRoot())
    );
    return articleBodyEditor;
}

const prepareCreateArticle = async () => {
    //handle article body CkEditor
    await insertTextEditor(document.querySelector('#editor'))

    //handle getting And Showing Categories
    await getAndShowCetgoriesItems(categorySelectParent)

    //handle category change
    categorySelectParent.onchange = (event) => {
        categoryID = event.target.value
    }

    //handle cover uploade
    coverUploaderElem.onchange = (event) => {
        articleCover = event.target.files[0]
    }
}

const createNewArticle = async () => {
    const formData = new FormData()

    formData.append('title', document.getElementById('title').value.trim())
    formData.append('body', articleBodyEditor.getData())
    formData.append('chekide', document.getElementById('chekideh').value.trim())
    formData.append('link', document.getElementById('link').value.trim())
    formData.append('category', categoryID)
    formData.append('cover', articleCover)
    formData.append('isDraft', false)


    const res = await fetch('https://lovin-clothing.onrender.com/api/articles', {
        method: "POST",
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
        , body: formData
    })
    if (res.ok) {
        Swal.fire({
            title: "با موفقیت منتشر شد",
            icon: "success",
        }).then(result => {
            getAndShowAllArticles()
            clearInputs()
        })
    }
    else {

        Swal.fire({
            title: "مقاله اضافه نشد",
            icon: "error",
        }).then(res => { })
    }

}

const createNewDraft = async () => {
    const formData = new FormData()

    formData.append('title', document.getElementById('title').value.trim())
    formData.append('body', articleBodyEditor)
    formData.append('chekide', document.getElementById('chekideh').value.trim())
    formData.append('link', document.getElementById('link').value.trim())
    formData.append('category', categoryID)
    formData.append('cover', articleCover)
    formData.append('isDraft', true)

    console.log(document.getElementById('title').value.trim())
    console.log(articleBodyEditor)
    console.log(document.getElementById('chekideh').value.trim())
    console.log(document.getElementById('link').value.trim())
    console.log(categoryID)
    console.log(articleCover)


    const res = await fetch('https://lovin-clothing.onrender.com/api/articles', {
        method: "POST",
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
        , body: formData
    })
    if (res.ok) {
        Swal.fire({
            title: "با موفقیت پیش نویس شد",
            icon: "success",
        }).then(result => {
            getAndShowAllArticles()
            clearInputs()
        })

    }
    else {
        Swal.fire({
            title: "مقاله پیش نویس نشد",
            icon: "error",
        })
    }

}

const deleteArticle = async (articleID) => {
    Swal.fire({
        title: "آیا از حذف مقاله اطمینان دارید؟",
        showDenyButton: true,
        confirmButtonText: "بله",
        denyButtonText: `خیر`
    }).then(async (result) => {
        if (result.isConfirmed) {

            const res = await fetch(`https://lovin-clothing.onrender.com/api/articles/${articleID}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            }
            )

            if (res.ok) {
                Swal.fire({
                    title: "حذف شد",
                    icon: "success"
                }).then(result => getAndShowAllArticles())
            }
        }
    });
}


const publishedArticleEdit = async (articleID, event) => {

    let article = JSON.parse(event.target.dataset.article)
    modalBoxShowHandeling();

    const updateArticleCover = document.getElementById('edit-cover')
    const editCategoryParent = document.getElementById('edit-category-list')
    const articleImgPreview = document.getElementById('article-img')

    let imgCover = article.cover;

    document.getElementById('edit-title').value = article.title
    document.getElementById('edit-link').value = article.slug
    document.getElementById('edit-chekideh').value = article.chekide

    //get category list
    // getAndShowCetgoriesItems(editCategoryParent).then(result => {
    //     //show selected category option
    //     editCategoryParent.value = article.category._id || -1
    //     editCategoryID = editCategoryParent.value
    // })

    document.getElementById('edit-content').value = article.body

    articleImgPreview.src = `https://lovin-clothing.onrender.com${article.cover}`

    updateArticleCover.onchange = event => {
        const imgCover = event.target.files[0];

        //change preview of photo
        if (imgCover) {
            const objectUrl = URL.createObjectURL(imgCover);
            articleImgPreview.src = objectUrl;

            articleImgPreview.onload = () => URL.revokeObjectURL(objectUrl);
        }
    };


    document.getElementById('edit-btn').onclick = async (event) => {
        event.preventDefault()

        const editedFormData = new FormData()
        editedFormData.append('title', document.getElementById('edit-title').value.trim())
        editedFormData.append('body', document.getElementById('edit-content').value)
        editedFormData.append('chekide', document.getElementById('edit-chekideh').value.trim())
        editedFormData.append('slug', document.getElementById('edit-link').value.trim())
        editedFormData.append('category', editCategoryParent.value)   
           
        editedFormData.append('isDraft', document.querySelector('input[name="edit-isDraft"]:checked')?.value)
    
        const file = updateArticleCover.files[0];
        if (file) {
            editedFormData.append('cover', file);
        }

        
        console.log(document.getElementById('edit-title').value.trim())
        console.log(document.getElementById('edit-content').value)
        console.log(document.getElementById('edit-chekideh').value.trim())
        console.log(document.getElementById('edit-link').value.trim())
        console.log(editCategoryParent.value)
        console.log(imgCover)

        const res = await fetch(`https://lovin-clothing.onrender.com/api/articles/${articleID}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${getToken()}`
            },
            body: editedFormData
        })

        const editResult = await res.json()
        console.log(editResult);

        if (res.ok) {
            Swal.fire({
                title: "تغییرات با موفقیت اعمال شد",
                icon: "success"
            }).then(result => {
                modalBoxHideHandeling()
                getAndShowAllArticles()
            })
        }
    }
}

const publishDraftedArticle = async (articleID) => {
    Swal.fire({
        title: "آیا از انتشار مقاله اطمینان دارید؟",
        showDenyButton: true,
        confirmButtonText: "بله",
        denyButtonText: `خیر`
    }).then(async (result) => {
        if (result.isConfirmed) {

            const res = await fetch(`https://lovin-clothing.onrender.com/api/articles/${articleID}/publish`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            }
            )

            if (res.ok) {
                Swal.fire({
                    title: "منتشر شد",
                    icon: "success"
                }).then(result => getAndShowAllArticles())
            }
            else {
                Swal.fire({
                    title: "منتشر نشد",
                    icon: "error"
                })
            }
        }
    });
}

export {
    getAndShowAllArticles, prepareCreateArticle, createNewArticle,
    deleteArticle, createNewDraft, publishDraftedArticle,
    publishedArticleEdit 
}
