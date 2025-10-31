import { getToken } from "../../funcs/apiFuncs.js"
const campPercentInputElem = document.getElementById('camp-percent-input')
const startDateInputElem = document.getElementById('start-date')
const endDateInputElem = document.getElementById('end-date')

const getAndShowAllCampaigns = async () => {
    const parentElem = document.querySelector('table tbody')

    const res = await fetch('https://lovin-clothing.onrender.com/api/campaign')
    const campaign = await res.json()

    parentElem.innerHTML = ''
    if (campaign.length) {

        campaign.forEach(item => {
            console.log(item);

            parentElem.insertAdjacentHTML('beforeend', `
                <tr>
                 <td>${item.discountPercent}</td>
                 <td>${item.startDate.slice(0, 10)}</td>
                 <td>${item.endDate.slice(0, 10)}</td>
                 <td><button class="btn btn-danger" onclick="removeCampaign('${item._id}')">حذف</button></td>
                </tr>
                `)

        })
    }
    else {
        parentElem.insertAdjacentHTML('beforeend', `
             <div class="alert alert-danger w-100">کمپین فعالی وجود ندارد</div>
            `)
    }
}

const addNewCampFunc = async () => {
    const newCampInfos = {
        discountPercent: Number(campPercentInputElem.value.trim()),
        startDate: startDateInputElem.value.trim(),
        endDate: endDateInputElem.value.trim(),
    }

    const res = await fetch('https://lovin-clothing.onrender.com/api/campaign', {
        method: "POST",
        headers: {
            Authorization: `Bearer ${ getToken() }`,
            "content-type": "application/json"
        }
        ,
        body: JSON.stringify(newCampInfos)
    })
    const result = await res.json()
    console.log(result);

    if (res.ok) {
        Swal.fire({
            title: "کمپین سراسری اعمال شد",
            icon: "success"
        }).then(result => {
            getAndShowAllCampaigns()
            campPercentInputElem.value = ''
            startDateInputElem.value = ''
            endDateInputElem.value = ''
        })
    }
    else {
        Swal.fire({
            title: "کمپین سراسری اعمال نشد",
            icon: "error"
        })
    }

}

const removeCampaign = async (campID) => {
    Swal.fire({
        title: "آیا از حذف کمپین اطمینان دارید؟",
        showDenyButton: true,
        confirmButtonText: "بله",
        denyButtonText: `خیر`
    }).then(async (result) => {
        if (result.isConfirmed) {

            const res = await fetch(`https://lovin-clothing.onrender.com/api/campaign/${campID}`, {
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
    }).then(res => { getAndShowAllCampaigns() })
}
        }
    });
}

export { addNewCampFunc, getAndShowAllCampaigns, removeCampaign }