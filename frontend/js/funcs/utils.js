const Swal = (title, icon, confirmButtonText, cb) => {
    Swal.fire({
        title,
        icon,
        confirmButtonText
    }).then(result => cb(result))
}


let scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

const setToUrlParam = (name, value) => {
    const url = new URL(window.location);
    const params = new URLSearchParams(url.search);

    params.set(name, value);
    url.search = params.toString();

    location.href = url
}

let paginationStructure = (array, itemPerPaginate, parentElement, currentPage) => {

    if (!currentPage) {
        currentPage = 1
    }

    let endIndex = itemPerPaginate * currentPage
    let startIndex = endIndex - itemPerPaginate

    let paginateArray = array.slice(startIndex, endIndex)
    let paginateCount = Math.ceil(array.length / itemPerPaginate)

    parentElement.innerHTML = ''

    for (let i = 1; i < paginateCount + 1; i++) {
        parentElement.insertAdjacentHTML('beforeend', `
            ${i == currentPage ? `<li class="main-bottom__paginate-list__item paginate-list__item--active" onclick = "setPageToUrlParam('page' , ${i})">${i}</li>` :
                `<li class="main-bottom__paginate-list__item" onclick = "setToUrlParam('page' , ${i})">${i}</li>`
            }`)
    }
    return paginateArray
}

window.setToUrlParam = setToUrlParam

export { Swal, scrollToTop, paginationStructure }