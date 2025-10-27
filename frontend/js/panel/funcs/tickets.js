import { getToken } from "../../funcs/apiFuncs.js"

const getAndShowAllTickets = async () => {
    const tableElem = document.querySelector('table tbody')

    tableElem.innerHTML = ''
    const res = await fetch(`http://localhost:5000/api/tickets`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "content-type": "application/json"
        }
    })
    
    const tickets = await res.json()
    console.log(tickets);

    tickets.forEach((ticket, index) => {
        console.log(ticket);
        
        if (ticket.parent == null) {
            console.log(ticket.userExists);
            
            tableElem.insertAdjacentHTML('beforeend', `
           <tr>
            <td>${index + 1}</td>
            <td>${ticket.name ? ticket.name : 'بدون نام'}</td>
            <td>${ticket.email}</td>
            <td>${ticket.userExists == true ? 'لاگین' : 'عدم لاگین'}</td>
            <td>${ticket.createdAt.slice(0, 10)}</td>
            <td>
                <button type='button' class='btn btn-primary show-btn' onclick='showTicketFunc(${JSON.stringify(ticket.title)} ,${JSON.stringify(ticket.message)})'>مشاهده</button>
            </td>
            <td>
                <button type='button' class='btn btn-danger answer-btn' onclick="answerTicketFunc('${ticket._id}')">پاسخ</button>
            </td>
            <td>
                <button type='button' class='btn btn-danger delete-btn' onclick="removeTicket('${ticket._id}')">حذف</button>
            </td>
            <td>
                <i class='fa fa-angle-down show-more-icon' onclick="showTicketMore(event , '${ticket._id}')"></i>
            </td>
        </tr>
                `)
        }
    })
}

const showTicketFunc = (ticketTitle,ticketBody) => {
    Swal.fire({
        title: ticketTitle,
        text : ticketBody,
        confirmButtonText: "دیدم",
    })
}

const answerTicketFunc = async (ticketId) => {
    console.log(ticketId);

    Swal.fire({
        title: "پاسخ را تایپ کنید",
        input: "text",
        button: "ثبت "
    })
        .then(async (result) => {
            if (result) {
                console.log(result);

                let answerObj = {
                    ticketID: ticketId,
                    message: result.value
                }

                const res = await fetch(`http://localhost:5000/api/tickets/answer`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${getToken()}`
                    },
                    body: JSON.stringify(answerObj)
                })

                const answerResult = await res.json()
                console.log(answerResult);

                if (res.ok) {
                    Swal.fire({
                        title: "پاسخ با موفقیت ارسال شد",
                        icon: "success"
                    });
                }
                else {
                    Swal.fire({
                        title: "مشکل در ارسال پاسخ",
                        icon: "error"
                    });
                }
            }
            else {
                alert('خطا')
            }
        })

}

const removeTicket = async (ticketID) => {
    console.log(ticketID);

    Swal.fire({
        title: "آیا از حذف تیکت اطمینان دارید؟",
        showDenyButton: true,
        confirmButtonText: "بله",
        denyButtonText: `خیر`
    }).then(async (result) => {
        if (result.isConfirmed) {

            const res = await fetch(`http://localhost:5000/api/tickets/${ticketID}`, {
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
                }).then(res => getAndShowAllTickets())
            }

        }
    });
}

const showTicketMore = async (event, ticketID) => {
    const iconElem = event.target;
    const parentRow = iconElem.closest("tr");

    // اگر آیکون باز شدن بود
    if (iconElem.classList.contains("fa-angle-down")) {
        iconElem.classList.replace("fa-angle-down", "fa-angle-up");

        const res = await fetch(`http://localhost:5000/api/tickets`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "content-type": "application/json"
            }
        });

        const tickets = await res.json();
        tickets.forEach((ticket) => {
            if (ticket.parent === ticketID) {
                const childRow = document.createElement("tr");
                childRow.classList.add("child-ticket");
                childRow.dataset.parent = ticketID;

                childRow.innerHTML = `
                    <td>*</td>
                    <td>${ticket.name ? ticket.name : 'بدون نام'}</td>
                    <td>${ticket.email ? ticket.email : "ایمیل پشتیبانی"}</td>
                    <td>${ticket.userExists === false ? 'لاگین' : 'عدم لاگین'}</td>
                    <td>${ticket.createdAt.slice(0, 10)}</td>
                    <td>
                        <button type='button' class='btn btn-primary show-btn' onclick='showTicketFunc(${JSON.stringify(ticket.message)})'>مشاهده</button>
                    </td>
                    <td>
                        ${ticket.email ? `<button type='button' class='btn btn-danger answer-btn' onclick="answerTicketFunc('${ticket._id}')">پاسخ</button>` : `__`}
                    </td>
                    <td>
                        <button type='button' class='btn btn-danger delete-btn' onclick="removeTicket('${ticket._id}')">حذف</button>
                    </td>
                    <td></td>
                `;
                parentRow.insertAdjacentElement('afterend', childRow);
            }
        });

    } else if (iconElem.classList.contains("fa-angle-up")) {
        iconElem.classList.replace("fa-angle-up", "fa-angle-down");

        // حذف ردیف‌های فرزند با data-parent
        const allChildRows = document.querySelectorAll(`tr.child-ticket[data-parent="${ticketID}"]`);
        allChildRows.forEach(row => row.remove());
    }
}

export {
    getAndShowAllTickets, showTicketFunc, answerTicketFunc
    , removeTicket, showTicketMore
}