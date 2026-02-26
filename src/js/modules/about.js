import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';
import { renderError } from '../app/error.js';
import { config } from "../app/config.js";
import { t, getLang } from './locales.js';

async function fetchBioContent(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load bio: ${response.statusText}`);
    marked.use({ breaks: true, gfm: true });
    return marked.parse(await response.text());
}

export async function renderAboutPage() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('page') !== 'about') return;

    const contentElement = document.getElementById('content');
    const { author } = config;

    try {
        const lang = getLang();
        const bioPath = author.bio.replace('.md', `.${lang}.md`);
        const bioContent = await fetchBioContent(bioPath);
        contentElement.innerHTML = `
            <div class="about-container">
                <div class="about-profile">
                    <div class="about-avatar-wrap">
                        <img src="${author.avatar}" alt="${author.name}" class="about-avatar">
                    </div>
                    <div>
                        <h1 class="about-nickname">${author.nickname}</h1>
                        <p class="about-name">${author.name}</p>
                        <p class="about-username">${author.username}</p>
                        <div class="about-details">
                            <div class="about-detail"><i class="fa-solid fa-location-dot"></i><span>${author.location}</span></div>
                            <div class="about-detail"><i class="fa-solid fa-briefcase"></i><span>${author.occupation}</span></div>
                        </div>
                    </div>
                </div>
                <p class="about-section-label">${t('introduction')}</p>
                <div class="about-bio">${bioContent}</div>
                <p class="about-section-label">${t('whereToFind')}</p>
                <div class="about-social-list">
                    ${author.social.map(link => `
                        <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="about-social-btn">
                            <i class="${link.icon}"></i> ${link.label}
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error rendering about:', error);
        renderError(contentElement, { message: t('failedToLoadAbout') });
    }
}