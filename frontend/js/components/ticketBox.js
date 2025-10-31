import { isLogin } from "../funcs/apiFuncs.js";
import { getMe } from "../funcs/authentication.js";
// import { Swal } from "../funcs/utils.js"

const $ = document;
let ticketBoxElem = $.querySelector('.ticket-box')
const emailInput = $.querySelector('.email-input')
const emailShow = $.querySelector('.ticket-box__body-showEmail')
const ticketContent = $.querySelector('.ticket-box__body-ticket')
const ticketBtn = $.querySelector('.ticket-elem')

let emailContent;
let loginFlag;

const ticketBtnAndBoxShow = () => {
    ticketBtn.classList.remove('display-block')
    ticketBtn.classList.add('display-none')
    ticketBoxElem.style.display = 'flex'
}

const ticketBtnAndBoxClose = () => {
    ticketBtn.classList.remove('display-none')
    ticketBtn.classList.add('display-block')
    ticketBoxElem.style.display = 'none'
}

let ticketShowStatus = async () => {

    if (isLogin()) {
        await getMe().then(user => {
            if(emailInput){

                emailInput.classList.add('display-none')
                emailShow.classList.add('display-block')
                emailShow.innerHTML = user[0].email
                loginFlag = true
            }
        });
    }
    else {
        emailInput.classList.add('display-block')
        emailShow.classList.add('display-none')

        loginFlag = false
    }
}

const sendTicket = async () => {
    if (loginFlag) emailContent = emailShow.innerHTML.trim()
    else emailContent = emailInput.value.trim()

    let ticketObj = {
        email: emailContent,
        name : document.querySelector('.name-input').value.trim(),
        title : document.querySelector('.title-input').value.trim(),
        message: ticketContent.value.trim()
    }

    let res = await fetch('http://localhost:5000/api/tickets', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(ticketObj)
    })

    let ticketResponse = await res.json()
    console.log(ticketResponse);

    if (res.status == 201) {
        Swal.fire({title : 'تیکت ثبت شد', icon : 'success', confirmBtn : 'خروج از صفحه'})
        .then(res => {
            ticketContent.value = ''
            ticketBtnAndBoxClose()
        })
    }
    
    else if(ticketContent.value == ''){
        ticketContent.style.border = '1px solid red';
        setTimeout(() => {
            ticketContent.style.border = 'none';

        }, 3000);
    }
    else {
        Swal.fire('تیکت ثبت نشد', 'error', 'تلاش دوباره', () => { })

    }
    return ticketResponse

}
export { ticketShowStatus, sendTicket, ticketBtnAndBoxShow, ticketBtnAndBoxClose }