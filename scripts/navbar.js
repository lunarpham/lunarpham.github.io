import { config } from '../config.js';

export function websiteMapNav() {
    const navigator = document.getElementById('navbar');
    const navItems = Object.entries(config.navigation)
        .map(([key, value]) => `<li><a href="${value}">${key.charAt(0).toUpperCase() + key.slice(1)}</a></li>`)
        .join('');

    navigator.innerHTML = `<ul>${navItems}</ul>`;
}
