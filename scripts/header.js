import { config } from '../config.js';

export function renderHeader() {
    const header = document.getElementById('header');
    header.innerHTML = `
        <h1>${config.title}</h1>
        <div class="profile">
            <img src="${config.author.avatar}" alt="${config.author.name}" class="profile-image">
            <div>
                <h2>${config.author.name}</h2>
                <p>${config.author.bio}</p>
            </div>
        </div>
    `;
}
