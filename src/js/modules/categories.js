import { config } from '../app/config.js';
import { t } from './locales.js';

/**
 * Renders the "Labels" sidebar on post detail pages.
 * Shows all categories from config with post counts in a 2-column grid.
 * @param {Array} posts - All posts from posts.json
 * @param {string} descriptionHTML - The HTML string rendered from the description markdown
 */
export function renderCategoriesSidebar(posts, descriptionHTML) {
    const sidebarRight = document.getElementById('sidebar-right');
    if (!sidebarRight) return;

    // Count posts per category slug
    const counts = {};
    for (const cat of config.categories) {
        counts[cat.slug] = 0;
    }
    for (const post of posts) {
        if (!post.categories) continue;
        for (const slug of post.categories) {
            if (slug in counts) counts[slug]++;
        }
    }

    const labelsHTML = config.categories.map(cat => `
        <a href="?label=${cat.slug}" class="label-item">
            <i class="fa-solid fa-tag"></i>
            <span class="label-name">${t(cat.slug)}</span>
            <span class="label-count">(${counts[cat.slug] || 0})</span>
        </a>
    `).join('');

    const sidebarAboutHTML = `
        <div class="section-header">
            <h2>${t('aboutThisBlog')}</h2>
            <div class="section-dots"><span></span><span></span><span></span><span></span></div>
        </div>
        <div class="sidebar-about">
            <div class="sidebar-banner">
                <img src="${config.author.banner}" alt="Banner">
            </div>
            <div class="sidebar-description">${descriptionHTML}</div>
        </div>
    `;

    const mobileAboutHTML = `
        <div class="section-header">
            <h2>${t('aboutThisBlog')}</h2>
            <div class="section-dots"><span></span><span></span><span></span><span></span></div>
        </div>
        <div class="sidebar-about">
            <div class="sidebar-description">${descriptionHTML}</div>
        </div>
    `;

    sidebarRight.innerHTML = `
        ${sidebarAboutHTML}
        <div class="section-header">
            <h2>${t('labels')}</h2>
            <div class="section-dots"><span></span><span></span><span></span><span></span></div>
        </div>
        <div class="labels-grid">
            ${labelsHTML}
        </div>
    `;

    const mobileLabels = document.getElementById('mobile-labels');
    if (mobileLabels) {
        mobileLabels.innerHTML = `
            ${mobileAboutHTML}
            <div class="section-header">
                <h2>${t('labels')}</h2>
                <div class="section-dots"><span></span><span></span><span></span><span></span></div>
            </div>
            <div class="labels-grid">
                ${labelsHTML}
            </div>
        `;
    }
}
