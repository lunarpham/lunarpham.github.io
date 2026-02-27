import { websiteMapNav } from '../modules/navbar.js';
import { renderAboutPage } from "../modules/about.js";
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';
import { renderError } from './error.js';
import { fetchPosts, renderPostList } from '../modules/postlist.js';
import { fetchPostContent, renderPostContent } from '../modules/article.js';
import { renderCategoriesSidebar } from '../modules/categories.js';
import { config } from './config.js';
import { t, getLang } from '../modules/locales.js';
import { initSearch } from '../modules/search.js';
import { initScrollToTop } from '../modules/scroll.js';

async function fetchDescriptionHTML() {
    try {
        const lang = getLang();
        const response = await fetch(`public/description.${lang}.md`);
        if (!response.ok) return '';
        marked.use({ breaks: true, gfm: true });
        return marked.parse(await response.text());
    } catch (e) {
        console.error('Failed to fetch description:', e);
        return '';
    }
}

export async function initBlog() {
    try {
        const app = document.getElementById('app');
        const urlParams = new URLSearchParams(window.location.search);
        const postFile = urlParams.get('post');
        const page = urlParams.get('page');
        const label = urlParams.get('label');

        // Set page type for CSS layout control
        if (postFile) app.setAttribute('data-page', 'post');
        else if (page === 'about') app.setAttribute('data-page', 'about');
        else app.setAttribute('data-page', 'home');

        websiteMapNav();

        // Enable transitions after initial render to avoid flash of wrong theme
        setTimeout(() => {
            document.body.classList.add('theme-transition');
        }, 50);

        const contentElement = document.getElementById('content');
        if (!contentElement) throw new Error('Content element not found');

        const delayPromise = new Promise(resolve => setTimeout(resolve, 500));

        if (page === 'about') {
            contentElement.innerHTML = `<div class="loading-container"><div class="loading-spinner"></div><p class="loading-text">${t('loading')}</p></div>`;
            await Promise.all([
                renderAboutPage(),
                delayPromise
            ]);
            return;
        }

        let loadingHTML = `<div class="loading-container"><div class="loading-spinner"></div><p class="loading-text">${t('loading')}</p></div>`;

        if (page !== 'about') {
            let prefixHTML = `
                <div id="mobile-banner" class="mobile-banner">
                    <img src="${config.author.banner}" alt="Banner">
                </div>
                <div id="mobile-labels" class="mobile-labels"></div>
            `;
            if (!postFile) {
                let sectionTitle = t('latestPosts');
                if (label) {
                    sectionTitle = `${t('labelFilter')}${t(label) || label}`;
                }
                prefixHTML += `
                <div class="section-header">
                    <h2 class="section-title">${sectionTitle}</h2>
                    <div class="section-dots"><span></span><span></span><span></span><span></span></div>
                </div>
                `;
            }
            loadingHTML = prefixHTML + loadingHTML;
        }

        contentElement.innerHTML = loadingHTML;

        const [descriptionHTML, posts] = await Promise.all([
            fetchDescriptionHTML(),
            fetchPosts(),
        ]);

        if (!Array.isArray(posts)) throw new Error('Invalid posts data');

        // --- Smart Search Logic ---
        initSearch(posts, app);


        if (postFile) {
            try {
                // If it's a specific post, fetch its content.
                const { metadata, content } = await fetchPostContent(`${postFile}.md`);
                if (!metadata?.title || !content) throw new Error('Invalid post data');
                const matchingPost = posts.find(p => p.file === postFile || p.file === `${postFile}.md`);

                // Show right sidebar immediately
                renderCategoriesSidebar(posts, descriptionHTML);

                await delayPromise;

                renderPostContent(metadata.title, metadata.datetime, content, matchingPost?.categories || [], matchingPost);

                // Re-populate mobile labels, which were overwritten
                renderCategoriesSidebar(posts, descriptionHTML);
            } catch (err) {
                console.error('Error loading post:', err);
                await delayPromise;
                renderError(contentElement, { message: t('postNotFound') });
            }
        } else {
            // Show right sidebar immediately
            renderCategoriesSidebar(posts, descriptionHTML);

            await delayPromise;

            renderPostList(posts, label);

            // Re-populate mobile labels, which were overwritten
            renderCategoriesSidebar(posts, descriptionHTML);
        }

        // --- Scroll Button with Progress ---
        initScrollToTop();

        if (contentElement.querySelector('pre code') && typeof hljs !== 'undefined') {
            hljs.highlightAll();
        }
    } catch (error) {
        console.error('Critical error:', error);
        renderError(document.body, { title: 'Initialization Error', message: error.message });
    }
}
