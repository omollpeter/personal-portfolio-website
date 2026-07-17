import navbarTemplate from '../../../components/navbar.html';
import { cartManager } from './cart.js';

import LOGO_FULL from '../../images/LogoFullColour.svg';
import LOGO_SHORT from '../../images/LogomarkFullcolor.svg';

export function loadNavbar() {
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
        navbarContainer.innerHTML = navbarTemplate;
        initNavbar();
    }

    if (window.cartManager) {
        window.cartManager.updateCartCount();
    }
}

function initNavbar() {
    
}

document.addEventListener('DOMContentLoaded', loadNavbar);

export default {
    loadNavbar,
};