// import { Swal } from './utils.js'
import { getDataFromApi, saveIntoLS, getToken } from './apiFuncs.js'

let $ = document;

let register = () => {
    let newUser = {
        name: $.querySelector('#name').value,
        email: $.querySelector('#email').value,
        phone: $.querySelector('#phone').value,
        password: $.querySelector('#pass').value,
        passConfirm: $.querySelector('#passConfirm').value
    }

    fetch('http://localhost:5000/api/auth/register',
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
        }).then(res => {
            console.log(res)
            if (res.status == 201) {
                Swal.fire({title : "با موفقیت ثبت نام شدید",
                     icon : "success", 
                     confirmBtn : 'ورود'
                    }).then(result => { location.href = 'index.html'})
            }
            else if (res.status == 409 || res.status == 400) {
                Swal.fire('این کاربر قبلا در سایت ثبت نام شده است', 'error', 'اصلاح اطلاعات', () => { })
            }
            else if (res.status == 403) {
                Swal.fire('این شماره از سایت بن شده است', 'error', 'اصلاح اطلاعات', () => { })
            }
            
            return res.json();
        }).then(result => {
            console.log(result);

            saveIntoLS('user', { token: result.token })
        })
}

let params = new URLSearchParams(location.search);
let redirect = params.get("redirect") || "index.html";

let login = () => {
    let identifierInput = $.getElementById('identifier')
    let passwordInput = $.getElementById('password')

    const userInfos = {
        email: identifierInput.value.trim(),
        password: passwordInput.value.trim()
    };

    fetch(`http://localhost:5000/api/auth/login`,
        {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(userInfos)
        })
        .then(res => {
            if (res.status == 200 || res.status == 201) {
                Swal.fire({title : "با موفقیت وارد شدید",
                     icon : "success", 
                     confirmBtn : 'ورود'
                    }).then(result => { location.href = redirect;})
            }
            else if (res.status == 404 || res.status == 400) {
                Swal.fire({title : 'کاربر بااین اطلاعات یافت نشد', 
                    icon : "error",
                     }).then(res => {
                    identifierInput.focus()
                    identifierInput.style.borderBottomColor = 'red'
                })
            }
            else if (res.status == 403) {
                Swal.fire({title : 'این ایمیل در سایت بن شده است', 
                    icon : "error",
                     }).then(res => {
                    identifierInput.focus()
                    identifierInput.style.borderBottomColor = 'red'
                })
            }
            return res.json()
        })
        .then(result => {
            saveIntoLS('user', { token: result.token })
        })
}

const getMe = async () => {
  const token = getToken();

  if (!token) {
    console.log("کاربر لاگین نکرده است");
    return [null, 0]; //  عدد خاص برای 'مهمان'
  }

  try {
    const response = await fetch(`http://localhost:5000/api/auth/getme`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log(response.status, data);

    return [data, response.status];
  } catch (error) {
    console.error("خطا در getMe:", error);
    return [null, 500];
  }
};

const logout = () => {
  localStorage.removeItem('user');
}

export { register, login , getMe , logout}