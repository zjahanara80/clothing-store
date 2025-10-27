import {answerTicketFunc,  getAndShowAllTickets , showTicketFunc
    ,removeTicket , showTicketMore
} from "./funcs/tickets.js";

window.showTicketFunc = showTicketFunc
window.answerTicketFunc = answerTicketFunc
window.removeTicket = removeTicket
window.showTicketMore = showTicketMore

window.onload = () => {
    getAndShowAllTickets()
}