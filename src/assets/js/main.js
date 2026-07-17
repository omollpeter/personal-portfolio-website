// Import CSS
import '../css/global.css';

import '../css/landing/hero.css'
import { initHeroAbout } from './landing/hero.js';

import '../css/landing/projects.css';
import { initProjects } from './landing/projects.js';

import '../css/landing/contact.css';
import { initContact } from './landing/contact.js';

import { hideLoader } from './components/common.js';

document.addEventListener('DOMContentLoaded', () => {
    hideLoader();
    
    initHeroAbout();
    initProjects();
    initContact();
});

window.addEventListener("load", () => {
    hideLoader();
});
