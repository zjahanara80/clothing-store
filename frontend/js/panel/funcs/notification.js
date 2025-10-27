import { getToken } from "../../funcs/apiFuncs.js";

let notificationIcon = document.getElementById('notifications-icon')
let notifListElem = document.querySelector('.home-notification-modal')

const notifShow = () => {
    notificationIcon.onmouseenter = () => {
        notifListElem.style.display = 'block'
    }
    notifListElem.onmouseleave = () => {
        notifListElem.style.display = 'none'
    }
}


const showNotificationsToModalBox = (filteredNotifs , parentElem) => {
    parentElem.innerHTML = '';

    if(filteredNotifs.length){
        filteredNotifs.slice(0,3).forEach(notif => {
            const listItem = document.createElement('li');
            listItem.className = 'home-notification-modal-item';
        
            const span = document.createElement('span');
            span.className = 'home-notification-modal-text';
            span.textContent = notif.message;
        
            const link = document.createElement('a');
            link.href = '#';
            link.addEventListener('click', () => {
              seenNotification(filteredNotifs, notif._id);
            });
        
            const icon = document.createElement('i');
            icon.className = 'fa fa-eye';
        
            link.appendChild(icon);
            listItem.appendChild(span);
            listItem.appendChild(link);
            parentElem.appendChild(listItem);
          });
    }
    else{
        parentElem.insertAdjacentHTML('beforeend' , `
             <div class="alert alert-danger">هیچ نوتیفی وجود ندارد</div>
            `)
    }
}

const getNotifications = async () => {
    const res = await fetch('http://localhost:5000/api/tickets', {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "content-type": "application/json"
      }
    });
    const notifications = await res.json();
  console.log(notifications);
  
   let unSeenNotifs =  notifications.filter(notif => {
        return notif.seen !== true && notif.parent == null
    })

    console.log(unSeenNotifs);
    

    showNotificationsToModalBox(unSeenNotifs , notifListElem)
  
    // return notifications;
  };
  

const seenNotification = async (notifications , notifId) => {
    const res = await fetch(`http://localhost:5000/api/tickets/${notifId}` , {
        method : "PATCH",
        headers : {
        Authorization: `Bearer ${getToken()}`,
        "content-type": "application/json"
        },
        body : JSON.stringify({
            seen: true
        })
    })
    getNotifications()
    const notifResponse = await res.json()
    console.log(notifResponse);   
}

window.seenNotification = seenNotification


export { notifShow , getNotifications}