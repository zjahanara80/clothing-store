import {addNewCampFunc , getAndShowAllCampaigns
    ,removeCampaign
} from './funcs/campaign.js'

window.removeCampaign = removeCampaign

const addNewCampBtn = document.getElementById('addNewCamp')

window.onload = () => {
    addNewCampBtn.onclick = (event) => {
        event.preventDefault()
        addNewCampFunc()
    }
    
    getAndShowAllCampaigns()
}