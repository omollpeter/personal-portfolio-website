import footerTemplate from '../../../components/footer.html';

export function loadFooter() {
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        footerContainer.innerHTML = footerTemplate;
        initFooter();
    }
}

function initFooter() {
    

}

document.addEventListener('DOMContentLoaded', loadFooter);

export default {
    loadFooter,
};