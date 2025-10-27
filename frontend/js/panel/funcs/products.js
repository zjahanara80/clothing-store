import { getToken } from '../../funcs/apiFuncs.js';
import { getAllProducts, getAllCategories } from './apiFuncs.js'
import { modalBoxHideHandeling, modalBoxShowHandeling } from "./shared.js";

let categoryID = -1;
let files = null;
let categoriesSelectParentElem = document.querySelector('.category-list')

const showProductsToPanel = async () => {
   let productsParentElem = document.getElementById('products-parent')

   productsParentElem.innerHTML = ''
   getAllProducts().then(products => {
      products.forEach(product => {

         productsParentElem.insertAdjacentHTML('beforeend', `
         <tr>
         <td>${product.code ? product.code : "ست نشده"}</td>
         <td>${product.name}</td>
         <td>${product.price}</td>
         <td>${product.countInStock ? product.countInStock : "ست نشده"}</td>
         <td>${product.category?.name || 'ندارد'}</td>
         <td>${product.discount && product.discount > 0
               ? product.discount + ' درصد'
               : product.globalDiscount && product.globalDiscount > 0
                  ? product.globalDiscount + ' درصد (کمپین)'
                  : 'تخفیف ندارد'}</td>
         <td><button class="product-btn product-edit" onclick="editProduct('${product._id}')">ویرایش</button></td>
         <td><button class="product-btn product-remove" onclick="removeProduct('${product._id}')">حذف</button></td>
         </tr>
        `)
      })

   });
}

const showCategoriesToSelectBox = (parentElem) => {
   parentElem.innerHTML = ''

   getAllCategories().then(categories => {
      parentElem.insertAdjacentHTML('afterbegin', `
              <option value="${-1}">
                        دسته بندی محصول را انتخاب کنید
               </option>
            `
      )
      categories.forEach((category, index) => {
         if (category.parent) {
            parentElem.insertAdjacentHTML('beforeend', `
              <option value="${category._id}">
                         ${category.name}
               </option>
            `
            )
         }
      })
   })
}

const clearCreateProductInputs = () => {
   document.getElementById('product-name').value = ''
   document.getElementById('product-description').value = ''
   document.getElementById('product-price').value = ''
   document.getElementById('product-count').value = ''
   document.querySelectorAll('input[name="size"]:checked').forEach(cb => cb.checked = false);
   document.getElementById('product-images').value = ''
   categoriesSelectParentElem.selectedIndex = 0;
   document.getElementById('product-code').value = ''
   document.getElementById('product-discount').value = ''
}

const providDataForCreateNewProduct = () => {

   //add multi photos 
   const imagesInput = document.getElementById('product-images');
   imagesInput.onchange = () => {
      files = imagesInput.files;
   }

   //get categoryID
   categoriesSelectParentElem.onchange = (event) => {
      categoryID = event.target.value
   }
}

const createNewProduct = async () => {
   if (!files || files.length === 0) {
      alert("لطفاً حداقل یک عکس انتخاب کنید");
      return;
   }

   let formData = new FormData()

   formData.append('name', document.getElementById('product-name').value.trim())
   formData.append('description', document.getElementById('product-description').value.trim())
   formData.append('price', document.getElementById('product-price').value.trim())
   formData.append('countInStock', document.getElementById('product-count').value.trim())
   formData.append('category', categoryID)
   formData.append('discount', document.getElementById('product-discount').value);

   const checked = document.querySelectorAll('input[name="size"]:checked');
   const sizes = Array.from(checked).map(cb => cb.value);
   console.log(sizes);

   formData.append('size', sizes)
   formData.append('code', document.getElementById('product-code').value.trim())

   for (let i = 0; i < files.length; i++) {
      formData.append('img', files[i])
   }


   const res = await fetch('http://localhost:5000/api/products',
      {
         method: "POST",
         headers: {
            Authorization: `Bearer ${getToken()}`
         },
         body: formData
      }
   )

   const addProductResult = await res.json()
   console.log(addProductResult);

   if (!res.ok) {
      //اگه ادمین کد محصول رو تکراری زد
      if (addProductResult.field === "code") {
         document.getElementById('product-code').style.borderColor = 'red' //bootstrap
         // codeErrorText.innerText = data.message;
         alert('کد محصول نمیتواند تکراری باشد')
      } else {
         // پیام عمومی برای بقیه خطاها
         swal.fire({ title: "خطا", text: addProductResult.message, icon: "error" });
      }
      return;
   }

   else if (res.ok) {
      await Swal.fire({
         title: "با موفقیت افزوده شد",
         icon: "success"
      })
         .then(res => {
            clearCreateProductInputs()
            showProductsToPanel()
         })
   }
}

const removeProduct = async (productID) => {
   Swal.fire({
      title: "آیا از حذف محصول اطمینان دارید؟",
      showDenyButton: true,
      confirmButtonText: "بله",
      denyButtonText: `خیر`
   }).then(async (result) => {
      if (result.isConfirmed) {
         const res = await fetch(`http://localhost:5000/api/products/${productID}`,
            {
               method: 'DELETE',
               headers: {
                  Authorization: `Bearer ${getToken()}`,
                  "content-type": "application/json"
               }
            })
         const result = res.json()
         if (res.ok) {
            Swal.fire({
               title: "حذف شد",
               icon: "success"
            });
         }
         else {
            Swal.fire({
               title: "حذف نشد",
               icon: "error"
            });
         }
         showProductsToPanel()
      }

   })
}

const editProduct = async (proID) => {
   modalBoxShowHandeling()

   const editNameElem = document.getElementById('edit-name')
   const editCodeElem = document.getElementById('edit-code')
   const editPriceElem = document.getElementById('edit-price')
   const editDescElem = document.getElementById('edit-description')
   const editCountElem = document.getElementById('edit-count')
   const editImgElem = document.getElementById('product-images-edit')
   const editCatSelect = document.querySelector('.category-list-edit')
   const editProductBtn = document.getElementById('edit-product-infos-btn')
   const editDisCountElem = document.getElementById('product-discount-edit')
   const imagesParentElem = document.querySelector('.images-parent-editBox')
   await showCategoriesToSelectBox(editCatSelect)

   const res = await fetch(`http://localhost:5000/api/products/${proID}`, {
      Authorization: `Bearer ${getToken()}`,
      "content-type": "application/json"
   })
   const product = await res.json()
   console.log(product);

   editNameElem.value = product.name
   editCodeElem.value = product.code
   editPriceElem.value = product.price
   editDescElem.value = product.description
   editCountElem.value = product.countInStock
   editDisCountElem.value = product.discount

   //سایز های از قبل ست شده برای محصول را در دام نشون بده
   const allCheckSizes = document.querySelectorAll('input[name="edit-size"]');
   if (allCheckSizes) {
      allCheckSizes.forEach(checkBox => {
         product.size.forEach(size => {
            if (checkBox.value == size) {
               checkBox.checked = true
            }
         })
      })

   }

   editCatSelect.value = product.category._id

   //تصاویر محصول رو داخل ادیت باکس نشون بده
   imagesParentElem.innerHTML = ''
   product.img.forEach(image => {
      imagesParentElem.insertAdjacentHTML('beforeend', `
     <div class="img-Box-editBox position-relative">
        <img class="short-img-editBox" src="http://localhost:5000${image}"/>
        <span onclick="removeImgFromDb('${product._id}', '${image}')" 
              class="badge bg-danger position-absolute rounded-0 align-bottom d-flex align-items-center" 
              style="right: 0px;top: 0px; padding: 0.1rem 0.6rem;cursor: pointer;">-
         </span>
     </div>
   `)
   })

   //وقتی دکمه ویرایش کلیک شد
   editProductBtn.onclick = async (event) => {
      event.preventDefault()
      const formData = new FormData()
      formData.append("name", editNameElem.value)
      formData.append("price", editPriceElem.value)
      formData.append("code", editCodeElem.value)
      formData.append("description", editDescElem.value)
      formData.append("countInStock", editCountElem.value)
      formData.append("discount", editDisCountElem.value)

      formData.append("category", editCatSelect.value)

      //اگه ادمین تصویری رو اضافه کرد اد کن داخل فرم دیتا
      if (editImgElem && editImgElem.files.length > 0) {
         for (let i = 0; i < editImgElem.files.length; i++) {
            formData.append("img", editImgElem.files[i])
         }
      }

      //سایز های تغییر داده شده رو اد کن
      const checkedSizes = document.querySelectorAll('input[name="edit-size"]:checked');
      const editSizes = Array.from(checkedSizes).map(cb => cb.value);
      formData.append("size", editSizes)

      const res = await fetch(`http://localhost:5000/api/products/${proID}`, {
         method: "PATCH",
         headers: {
            Authorization: `Bearer ${getToken()}`
         },
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
            showProductsToPanel()
            editImgElem.value = ''
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

function removeImgFromDb(productId, imagePath) {
   fetch(`http://localhost:5000/api/products/${productId}/images`, {
      method: "DELETE",
      headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ image: imagePath })
   })
      .then(res => res.json())
      .then(data => {
         console.log("عکس حذف شد:", data)
         // ری‌لود عکس‌ها بعد از حذف
         editProduct(productId)
      })
      .catch(err => console.error(err))
}

export {
   showProductsToPanel, showCategoriesToSelectBox,
   providDataForCreateNewProduct, createNewProduct
   , editProduct, removeImgFromDb, removeProduct
}