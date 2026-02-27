import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';
import { renderError } from '../app/error.js';
import { config } from '../app/config.js';
import { t } from './locales.js';
import { isBookmarked, toggleBookmark } from './bookmarks.js';

export async function fetchPostContent(file) {
    try {
        const response = await fetch(`./posts/${file}`);
        if (!response.ok) throw new Error(`Failed to load post: ${response.statusText}`);
        const markdown = await response.text();
        const parts = markdown.split('---');
        if (parts.length < 3) throw new Error('Invalid markdown format');
        const frontMatter = parts[1].trim();
        const content = parts.slice(2).join('---').trim();
        const metadata = {};
        for (const line of frontMatter.split('\n')) {
            const [key, ...vals] = line.split(':');
            if (!key || vals.length === 0) continue;
            metadata[key.trim()] = vals.join(':').trim().replace(/["']/g, '');
        }
        if (!metadata.title || !metadata.datetime) throw new Error('Missing required fields');
        return { metadata, content };
    } catch (error) {
        console.error('Error in fetchPostContent:', error);
        throw error;
    }
}

export function renderPostContent(title, datetime, markdownContent, categories = [], postObj = null) {
    const contentElement = document.getElementById('content');
    try {
        marked.use({ breaks: true, gfm: true });

        // Build breadcrumb: Home > Category > Title
        const crumbs = [`<a href="/">${t('home')}</a>`];
        if (categories.length > 0) {
            const slug = categories[0];
            const label = t(slug) || slug;
            crumbs.push(`<a href="/?label=${slug}">${label}</a>`);
        }
        crumbs.push(`<span class="breadcrumb-current">${title}</span>`);
        const breadcrumbHTML = crumbs.join('<span class="breadcrumb-sep">›</span>');

        let bookmarkButtonHTML = '';
        if (postObj) {
            const isSaved = isBookmarked(postObj.file);
            const iconClass = isSaved ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark';
            const btnClass = isSaved ? 'bookmark-btn active' : 'bookmark-btn';
            bookmarkButtonHTML = `
                <button class="${btnClass}" id="article-bookmark-btn" aria-label="Bookmark" style="margin-left: auto; background: none; border: none; font-size: 1.25rem; color: var(--text-color); cursor: pointer; transition: color 0.2s;">
                    <i class="${iconClass}"></i>
                </button>
            `;
        }

        contentElement.innerHTML = `
            <div id="mobile-banner" class="mobile-banner">
                <img src="${config.author.banner}" alt="Banner">
            </div>
            <div id="mobile-labels" class="mobile-labels"></div>
            <div class="article-container">
                <nav class="breadcrumb" aria-label="Breadcrumb">${breadcrumbHTML}</nav>
                <div class="article-meta" style="display: flex; align-items: center;">
                    <img src="${config.author.avatar}" alt="${config.author.nickname}">
                    <div>
                        <div class="article-meta-author">${config.author.nickname}</div>
                        <div class="article-meta-date">${datetime}</div>
                    </div>
                    ${bookmarkButtonHTML}
                </div>
                <h1 class="article-title">${title}</h1>
                <div class="article-content">${marked.parse(markdownContent)}</div>
                <div class="back-to-posts-container">
                    <a href="/" class="back-to-posts-btn">
                        <i class="fa-solid fa-arrow-left"></i> ${t('backToPosts')}
                    </a>
                </div>
            </div>
        `;
        if (typeof hljs !== 'undefined') hljs.highlightAll();

        // Add event listener for bookmark inside article
        if (postObj) {
            const articleBookmarkBtn = document.getElementById('article-bookmark-btn');
            if (articleBookmarkBtn) {
                articleBookmarkBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    let catLabel = t('general');
                    if (categories && categories.length > 0) {
                        catLabel = t(categories[0]) || categories[0];
                    }
                    const postData = {
                        id: postObj.file,
                        title: title,
                        url: `?post=${postObj.file.replace('.md', '')}`,
                        thumbnail: postObj.thumbnail,
                        categoryLabel: catLabel
                    };
                    toggleBookmark(postData);

                    const isSaved = articleBookmarkBtn.classList.toggle('active');
                    const icon = articleBookmarkBtn.querySelector('i');
                    if (isSaved) {
                        icon.className = 'fa-solid fa-bookmark';
                    } else {
                        icon.className = 'fa-regular fa-bookmark';
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error rendering post:', error);
        renderError(contentElement, { message: `Error: ${error.message}` });
    }
}