
//box modal show or hide 
const modalBoxShowHandeling = () => {
    const editOverlayElem = document.querySelector('.body-overlay')
    const editBoxElem = document.querySelector('.edit-box')

    editOverlayElem.classList.add('show')
    editBoxElem.style.transform = 'translate(-15%, 2%)';
}

const modalBoxHideHandeling = () => {
    const editOverlayElem = document.querySelector('.body-overlay')
    const editBoxElem = document.querySelector('.edit-box')

    editOverlayElem.classList.remove('show')
    editBoxElem.style.transform = 'translate(-150%, 0)';
}


export{modalBoxShowHandeling , modalBoxHideHandeling}