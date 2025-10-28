import { saveIntoLS } from "../funcs/apiFuncs.js";
let $ = document

let darkMode_flag = true;


const mode_handler = () => {
    darkMode_flag = !darkMode_flag
    saveIntoLS('mode', darkMode_flag)
    change_mode(darkMode_flag)
}


function change_mode(flagMode) {
    if (!flagMode) {
        if ($.querySelector('.header-bottom__mode-btn')) {
            $.querySelector('.header-bottom__mode-btn').innerHTML = 'حالت روشن';
        }
        $.querySelector('.header-bottom__mode-icon').classList.replace('fa-moon', 'fa-sun')
        // global vars
        document.documentElement.style.setProperty('--g-color-secondry', 'rgba(245, 245, 245, 0.966)');
        document.documentElement.style.setProperty('--g-color-orange1', 'rgb(231, 103, 12)');
        document.documentElement.style.setProperty('--g-color-orange2', 'rgb(196, 88, 11)');
        document.documentElement.style.setProperty('--g-bg-light', 'rgb(37, 34, 34)');
        document.documentElement.style.setProperty('--overlay-bg', 'rgba(0, 0, 0, 0.326)');
        document.documentElement.style.setProperty('--users-boxshadow', 'rgba(188, 109, 35, 0.852)');
        //header vars
        document.documentElement.style.setProperty('--header-search-icon', 'rgb(92, 89, 89)');
        document.documentElement.style.setProperty('--header-search-placeholder', 'rgba(57, 54, 54, 0.79)');
        document.documentElement.style.setProperty('--header-login-bg', 'rgb(255, 255, 255)');
        document.documentElement.style.setProperty('--header-login-color', 'black');
        document.documentElement.style.setProperty('--header-buybox-hover', 'rgba(247, 247, 247, 0.913)');
        document.documentElement.style.setProperty('--header-current-color', 'rgba(241, 231, 231, 0.857)');
        document.documentElement.style.setProperty('--header-top-bg', 'rgb(44, 44, 44)');
        //main top vars
        document.documentElement.style.setProperty('--mainTop-shadow', 'orangered');
        //main mailto
        document.documentElement.style.setProperty('--mailto-title-bg', '#383434');
        document.documentElement.style.setProperty('--mailto-title-color', 'white');
        document.documentElement.style.setProperty('--mailto-bg', '#292929');
        document.documentElement.style.setProperty('--mailto-box-bg', 'white');

        //footer
        document.documentElement.style.setProperty('--footer-two-item-color', 'white');
        document.documentElement.style.setProperty('--footer-main-bg', '#2a2a2a');

        //register/login bg
        document.body.style.backgroundBlendMode = 'lighten';
        document.documentElement.style.setProperty('--register-bg', 'rgb(44 44 44 / 75%)')
        document.documentElement.style.setProperty('--gradient-mode', 'rgb(22 22 22 / 91%)')


    }
    else {
        if ($.querySelector('.header-bottom__mode-btn')) {
            $.querySelector('.header-bottom__mode-btn').innerHTML = 'حالت تاریک';
        }
        $.querySelector('.header-bottom__mode-icon').classList.replace('fa-sun', 'fa-moon')
        // global vars
        document.documentElement.style.setProperty('--g-color-secondry', 'rgba(16, 16, 16, 0.7)');
        document.documentElement.style.setProperty('--g-color-orange1', 'rgb(246, 143, 69)');
        document.documentElement.style.setProperty('--g-color-orange2', 'rgb(198, 100, 30)');
        document.documentElement.style.setProperty('--g-bg-light', 'rgb(243, 243, 243)');
        document.documentElement.style.setProperty('--overlay-bg', 'rgba(0, 0, 0, 0.2)');
        document.documentElement.style.setProperty('--users-boxshadow', 'rgba(0, 0, 0, 0.284)');
        //header vars
        document.documentElement.style.setProperty('--header-search-icon', 'rgb(135, 135, 135)');
        document.documentElement.style.setProperty('--header-search-placeholder', 'rgba(147, 147, 147, 0.732)');
        document.documentElement.style.setProperty('--header-login-bg', 'rgba(139, 126, 126, 0.218)');
        document.documentElement.style.setProperty('--header-login-color', 'rgb(23, 23, 23)');
        document.documentElement.style.setProperty('--header-buybox-hover', 'rgba(202, 202, 202, 0.836)');
        document.documentElement.style.setProperty('--header-current-color', 'rgba(99, 92, 92, 0.727)');
        document.documentElement.style.setProperty('--header-top-bg', 'rgb(230, 228, 228)');

        document.documentElement.style.setProperty('--mainTop-shadow', '#000');
        //main mailto
        document.documentElement.style.setProperty('--mailto-title-bg', 'transparent');
        document.documentElement.style.setProperty('--mailto-title-color', 'black');
        document.documentElement.style.setProperty('--mailto-bg', '#a592922b');
        document.documentElement.style.setProperty('--mailto-box-bg', 'transparent');
        //footer
        document.documentElement.style.setProperty('--footer-two-item-color', '#585656');
        document.documentElement.style.setProperty('--footer-main-bg', 'transparent');
        document.documentElement.style.setProperty('--gradient-mode', 'rgb(243 243 243 / 91%)')

        //register/login bg
        document.body.style.backgroundBlendMode = 'darken';

    }
}

export { mode_handler, change_mode }