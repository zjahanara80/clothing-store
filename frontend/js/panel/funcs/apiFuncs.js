 import{getToken} from '../../funcs/apiFuncs.js'

 const getAllUsers = async () => {
  const res = await fetch('https://lovin-clothing.onrender.com/api/users' , {
    headers : {
      Authorization : `Bearer ${getToken()}`
    }
  })
  const users = await res.json()
  console.log(users);
  return users;
}


const getAllProducts = async () => {
  const res = await fetch('https://lovin-clothing.onrender.com/api/products')
  const products = await res.json()
  return products
}

const getAllCategories = async () => {
  const res = await fetch('https://lovin-clothing.onrender.com/api/categories')
  const categories = await res.json()
  return categories
}
export{getAllUsers , getAllProducts , getAllCategories}