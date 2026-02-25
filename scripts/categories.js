import { config } from '../config.js';

/**
 * Renders the "Labels" sidebar on post detail pages.
 * Shows all categories from config with post counts in a 2-column grid.
 * @param {Array} posts - All posts from posts.json
 */
export function renderCategoriesSidebar(posts) {
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
            <span class="label-name">${cat.label}</span>
            <span class="label-count">(${counts[cat.slug] || 0})</span>
        </a>
    `).join('');

    const sidebarAboutHTML = `
        <div class="section-header">
            <h2>About this blog</h2>
            <div class="section-dots"><span></span><span></span><span></span><span></span></div>
        </div>
        <div class="sidebar-about">
            <div class="sidebar-banner">
                <img src="${config.author.banner}" alt="Banner">
            </div>
            <p class="sidebar-description">Welcome to my blog! I share insights on technology, yuri manga, and various tutorials here.</p>
        </div>
    `;

    const mobileAboutHTML = `
        <div class="section-header">
            <h2>About this blog</h2>
            <div class="section-dots"><span></span><span></span><span></span><span></span></div>
        </div>
        <div class="sidebar-about">
            <p class="sidebar-description">Welcome to my blog! I share insights on technology, yuri manga, and various tutorials here.</p>
        </div>
    `;

    sidebarRight.innerHTML = `
        ${sidebarAboutHTML}
        <div class="section-header">
            <h2>Labels</h2>
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
                <h2>Labels</h2>
                <div class="section-dots"><span></span><span></span><span></span><span></span></div>
            </div>
            <div class="labels-grid">
                ${labelsHTML}
            </div>
        `;
    }
}
