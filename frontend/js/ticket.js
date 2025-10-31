import { getToken } from './funcs/apiFuncs.js'
import { getMe } from './funcs/authentication.js';
import { isLogin } from "./funcs/apiFuncs.js";

const $ = document


let userName = $.querySelector("#user-name")
let userEmail = $.querySelector("#user-email")
let ticketTitle = $.querySelector("#ticket-title")
let ticketMessage = $.querySelector("#ticket-message")
let submitTicketBtn = $.getElementById('submit-ticket-btn')
let showUserTicketBox = $.querySelector('.tickets-box-parent')
let showUserTicketItemWrapper = $.querySelector('.ticket-box-wrapper-item')
let isLoginStatus;

const ticketShowStatusForCreateTicket = async () => {
    if (isLogin()) {
        await getMe().then(user => {
            userEmail.value = user[0].email
            userName.value = user[0].name
            isLoginStatus = true
        })
    }
    else {
        isLoginStatus = false
    }
}

const showTicketsOnDom = async () => {
    showUserTicketBox.innerHTML = ''
    if (isLogin() == true) {
        const res = await fetch('https://lovin-clothing.onrender.com/api/tickets/user', {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        const myTickets = await res.json();
        console.log(myTickets);

        myTickets.forEach(ticket => {
            showUserTicketBox.insertAdjacentHTML('beforeend', `
                 <div class="showUserTicketItemWrapper">
                  <div class="ticket-show-box">
                      <div class="top">
                          <span class="title">${ticket.title}</span>
                          <button onclick="showDetailsOfTicket(event , '${ticket._id}')">نمایش بیشتر 
                              <i class="fa fa-angle-down"></i>
                          </button>
                      </div>
  
                      <div class="bottom">
                          <div>
                              <span class="show-ticket-title">وضعیت : </span>
                              <span class="ticket-status">${ticket.answers.length !== 0 ? 'پاسخ داده شده' : 'درانتظار پاسخ'}</span>
                          </div>
                          <div>
                              <span class="show-ticket-title">تعداد پاسخ : </span>
                              <span class="ticket-status">${ticket.answers.length !== 0 ? ticket.answers.length : 0}</span>
                          </div>
  
                          <div>
                              <span class="show-ticket-title">تاریخ ثبت : </span>
                              <span class="ticket-status">${ticket.createdAt.slice(0, 10)}</span>
                          </div>
                      </div>
                   </div>
                  </div>
                `)
        })
    }
    else {
        showUserTicketBox.insertAdjacentHTML('beforeend', `
             <div class="alert alert-danger">ابتدا به سایت وارد شوید</div>
             <button class="btn btn-primary" onclick="goToLoginPage()">ورود به سایت</button>
            `)
    }
}

const showDetailsOfTicket = async (event, ticketID) => {
    const iconElem = event.target.children[0]

    iconElem.classList.toggle("fa-angle-down");
    iconElem.classList.toggle("fa-angle-up");

    const wrapper = event.target.closest(".showUserTicketItemWrapper");

    const existingDetails = wrapper.querySelector(".details-box");
    if (existingDetails) {
        existingDetails.remove();
        return;
    }

    const res = await fetch(`https://lovin-clothing.onrender.com/api/tickets/user`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "content-type": "application/json"
        }
    });

    const tickets = await res.json();
    const ticket = tickets.find(t => t._id === ticketID);

    if (!ticket) return;

    const detailsHTML = `
        <div class="ticket-show-box details-box">
            <div class="top">نمایش جزییات تیکت</div>
            <div class="ticket-details__body">
                <div class="right-side">
                    <div class="user-ticket">${ticket.message}</div>
                </div>
                <div class="left-side">
                    ${
                      ticket.answers.length !== 0
                        ? ticket.answers.map(answer => `
                          <div class="admin-answer">${answer.message}</div>
                        `).join('')
                        : ''
                    }
                </div>
            </div>
        </div>
    `;

    wrapper.insertAdjacentHTML('beforeend', detailsHTML);
};


const createNewTicket = async () => {

    let ticketObj = {
        email: userEmail.value.trim(),
        name: userName.value.trim(),
        title: ticketTitle.value.trim(),
        message: ticketMessage.value.trim()
    }

    let res = await fetch('https://lovin-clothing.onrender.com/api/tickets', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(ticketObj)
    })

    let ticketResponse = await res.json()
    console.log(ticketResponse);

    if (res.status == 201) {
        Swal.fire({ title: 'تیکت ثبت شد', icon: 'success', confirmBtn: 'خروج از صفحه' })
            .then(res => {
                showTicketsOnDom()
                ticketMessage.value = ''
                ticketTitle.value = ''

            })
    }

    else if (ticketMessage.value == '') {
        ticketMessage.classList.add('ticket-border-red')
        ticketMessage.onkeyup = () => {
            if (ticketMessage.value !== '') {
                ticketMessage.classList.remove('ticket-border-red')
            }
        }
    }
    else {
        Swal.fire('تیکت ثبت نشد', 'error', 'تلاش دوباره', () => { })

    }
    return ticketResponse
}

const goToLoginPage = () => {
    const currentPage = location.pathname; 
    location.href = `login.html?redirect=${encodeURIComponent(currentPage)}`;
}

window.showDetailsOfTicket = showDetailsOfTicket
window.goToLoginPage = goToLoginPage

window.onload = () => {
    ticketShowStatusForCreateTicket()
    showTicketsOnDom()
    $.getElementById('submit-ticket-btn').onclick = () => {
        createNewTicket()
    }
}