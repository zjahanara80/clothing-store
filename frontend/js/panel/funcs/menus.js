import { getToken } from '../../funcs/apiFuncs.js'
import { modalBoxHideHandeling, modalBoxShowHandeling } from "./shared.js";

const nameElem = document.getElementById('name')
const linkElem = document.getElementById('link')
const iconElem = document.getElementById('icon')
const backgroundElem = document.getElementById('background')
const descriptionElem = document.getElementById('description')
const selectCategoryParentElem = document.getElementById('selectCategory')
let bg = null
let parentID = undefined;

const getAndShowMenues = async () => {
    const menuesParentElem = document.querySelector('.table tbody')

    const res = await fetch('https://lovin-clothing.onrender.com/api/categories')
    const result = await res.json()

    menuesParentElem.innerHTML = ''
    result.forEach((menu, index) => {
        menuesParentElem.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${index + 1}</td>
      <td>${menu.name}</td>
      <td>${menu.link ? menu.link : ''}</td>
      <td>${menu.parent ? menu.parent.name : '___'}</td>
      <td>
          <button type='button' class='btn btn-primary edit-btn' onclick="editMenuesInfos('${menu._id}')">ویرایش</button>
      </td>
       <td>
          <button type='button' class='btn btn-danger delete-btn' onclick="deleteCategory('${menu._id}')">حذف</button>
      </td>
    </tr>
        `)
    })
    return result
}

const providInfoForMakeMenu = () => {

    backgroundElem.onchange = () => {
        bg = backgroundElem.files[0]
    }

    selectCategoryParentElem.onchange = (event) => {
        parentID = event.target.value
        console.log(parentID);

    }

}

const clearInputs = () => {
    nameElem.value = ''
    linkElem.value = ''
    iconElem.value = ''
    backgroundElem.value = ''
    descriptionElem.value = ''
    selectCategoryParentElem.selectedIndex = 0;
}

const createNewMenu = async () => {
    let formData = new FormData()

    formData.append('name', nameElem.value.trim())
    formData.append('icon', iconElem.value)
    formData.append('link', linkElem.value.trim())
    formData.append('parent', parentID)
    formData.append('description', descriptionElem.value.trim())
    formData.append('background', bg)

    const res = await fetch('https://lovin-clothing.onrender.com/api/categories', {
        method: "POST",
        headers: {
            Authorization: `Bearer ${getToken()}`
        },
        body: formData
    })

    const result = res.json()

    if (res.ok) {
        Swal.fire(
            'منو با موفقیت ثبت شد',
            'success',
            'ok')
            .then(result => {
                getAndShowMenues()
                clearInputs()
            })
    }
    else {
        Swal.fire(
            'منو ایجاد نشد',
            'error',
            'ok',
            () => { })
    }

}

const showMenuCategories = async (parent) => {
    const res = await fetch('https://lovin-clothing.onrender.com/api/categories/parents')
    const parentsOfMenus = await res.json()

    parent.innerHTML = ''
    parent.insertAdjacentHTML('beforeend', `
            <option value="${-1}">دسته بندی را انتخاب کنید</option>`)

    parentsOfMenus.forEach(menu => {
        parent.insertAdjacentHTML('beforeend', `
            <option value="${menu._id}">${menu.name}</option>
        `)
    })
}

const deleteCategory = async (catID) => {
    Swal.fire({
        title: "آیا از حذف منو اطمینان دارید؟",
        showDenyButton: true,
        confirmButtonText: "بله",
        denyButtonText: `خیر`
    }).then(async (result) => {
        if (result.isConfirmed) {

            const res = await fetch(`https://lovin-clothing.onrender.com/api/categories/${catID}`, {
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
                });
            }
            getAndShowMenues()

        }
    });
}

const editMenuesInfos = async (menuID) => {
    modalBoxShowHandeling()
    const titleEditInputElem = document.getElementById('edit-title')
    const linkEditInputElem = document.getElementById('edit-link')
    const descEditInputElem = document.getElementById('edit-description')
    const iconEditInputElem = document.getElementById('edit-icon')
    const bgEditInputElem = document.getElementById('edit-background')
    const catEditElemSelect = document.getElementById('edit-selectCategory')
    const categoriesEditSelect = document.getElementById('edit-selectCategory')
    const editMenuBtn = document.getElementById('edit-menu-infos-btn')

    const menuDetalisRes = await fetch(`https://lovin-clothing.onrender.com/api/categories/${menuID}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "content-type": "application/json"
        }
    })

    const menuDetalis = await menuDetalisRes.json()
    console.log(menuDetalis);

    titleEditInputElem.value = menuDetalis.name
    linkEditInputElem.value = menuDetalis.link ? menuDetalis.link : ''
    descEditInputElem.value = menuDetalis.description
    iconEditInputElem.value = menuDetalis.icon ? menuDetalis.icon : menuDetalis.parent.icon || '';

    //دریافت دسته بندی در ادیت باکس
    await showMenuCategories(categoriesEditSelect)

    //سلکت پرنت دسته بندی 
    if (menuDetalis.parent !== null) {
        catEditElemSelect.value = String(menuDetalis.parent._id)
    }

    let editSelectValue = catEditElemSelect.value

    //اگه کاربر دسته بندی رو تغییر داد
    catEditElemSelect.onchange = (event) => {
        editSelectValue = event.target.value
    }

    editMenuBtn.onclick = async (event) => {
        event.preventDefault()
        const formData = new FormData()
        formData.append("name", titleEditInputElem.value)
        formData.append("link", linkEditInputElem.value)
        formData.append("description", descEditInputElem.value)
        formData.append("icon", iconEditInputElem.value)
        formData.append("parent", editSelectValue)

        if (bgEditInputElem) {
            formData.append("background", bgEditInputElem.files[0]) 
        }

        const res = await fetch(`https://lovin-clothing.onrender.com/api/categories/${menuID}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${getToken()}`            },
            body: formData
        })
        const result = await res.json()
        console.log(result);

        if (res.ok) {
            swal.fire({
                title: "با موفقیت ویرایش شد",
                icon: "success"
            }).then(res => {
                modalBoxHideHandeling()
                getAndShowMenues()
                bgEditInputElem.value = ''
            })
        }
        else {
            swal.fire({
                title: "ویرایش با خطا مواجه شد",
                icon: "error"
            })
        }
    }

}

window.deleteCategory = deleteCategory

export {
    getAndShowMenues, showMenuCategories, providInfoForMakeMenu
    , createNewMenu, editMenuesInfos, selectCategoryParentElem
}