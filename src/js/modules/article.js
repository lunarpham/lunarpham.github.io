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

        let actionButtonsHTML = '';
        if (postObj) {
            const isSaved = isBookmarked(postObj.file);
            const iconClass = isSaved ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark';
            const btnClass = isSaved ? 'bookmark-btn active' : 'bookmark-btn';

            actionButtonsHTML = `
                <div class="article-actions" style="margin-left: auto; display: flex; gap: 8px; align-items: center;">
                    <button class="article-action-btn ${isSaved ? 'active' : ''}" id="article-bookmark-btn" aria-label="Bookmark">
                        <i class="${iconClass}"></i>
                    </button>
                    <button class="article-action-btn" id="article-share-btn" aria-label="Share">
                        <i class="fa-regular fa-paper-plane"></i>
                    </button>
                </div>
            `;
        }

        let modalThumbnail = postObj && postObj.thumbnail ? postObj.thumbnail : config.author.banner;
        const shareModalHTML = `
            <div id="share-modal" class="share-modal">
                <div class="share-modal-overlay"></div>
                <div class="share-modal-content">
                    <div class="share-modal-header">
                        <h3>${t('shareWith')}</h3>
                        <button id="close-share-modal" class="share-modal-close">Close <i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="share-modal-preview">
                        <img src="${modalThumbnail}" alt="Thumbnail">
                        <div class="share-preview-info">
                            <div class="share-preview-title">${title}</div>
                            <div class="share-preview-domain">${window.location.hostname}</div>
                        </div>
                    </div>
                    <div class="share-options">
                        <button class="share-btn-option" data-platform="facebook"><i class="fa-brands fa-facebook-f"></i><span>Facebook</span></button>
                        <button class="share-btn-option" data-platform="whatsapp"><i class="fa-brands fa-whatsapp"></i><span>WhatsApp</span></button>
                        <button class="share-btn-option" data-platform="twitter"><i class="fa-brands fa-x-twitter"></i><span>X / Twitter</span></button>
                        <button class="share-btn-option" data-platform="telegram"><i class="fa-brands fa-telegram"></i><span>Telegram</span></button>
                        <button class="share-btn-option" data-platform="pinterest"><i class="fa-brands fa-pinterest"></i><span>Pinterest</span></button>
                        <button class="share-btn-option" data-platform="linkedin"><i class="fa-brands fa-linkedin-in"></i><span>LinkedIn</span></button>
                        <button class="share-btn-option" data-platform="line"><i class="fa-brands fa-line"></i><span>Line</span></button>
                        <button class="share-btn-option" data-platform="email"><i class="fa-solid fa-envelope"></i><span>Email</span></button>
                    </div>
                    <div class="share-link-section">
                        <div class="share-link-text">${t('orCopyLink')}</div>
                        <div class="share-copy-container">
                            <i class="fa-solid fa-link share-link-icon"></i>
                            <input type="text" id="share-link-input" value="${window.location.href}" readonly>
                            <button id="share-copy-btn"><i class="fa-regular fa-clipboard"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `;

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
                    ${actionButtonsHTML}
                </div>
                <h1 class="article-title">${title}</h1>
                <div class="article-content">${marked.parse(markdownContent)}</div>
                <div class="back-to-posts-container">
                    <a href="/" class="back-to-posts-btn">
                        <i class="fa-solid fa-arrow-left"></i> ${t('backToPosts')}
                    </a>
                </div>
            </div>
            ${shareModalHTML}
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
                    const result = toggleBookmark(postData);

                    if (result === 'limit') {
                        const toast = document.createElement('div');
                        toast.className = 'bookmark-toast';
                        toast.textContent = t('bookmarkLimitReached');
                        document.body.appendChild(toast);
                        requestAnimationFrame(() => toast.classList.add('visible'));
                        setTimeout(() => {
                            toast.classList.remove('visible');
                            setTimeout(() => toast.remove(), 300);
                        }, 2500);
                        return;
                    }

                    const isSaved = articleBookmarkBtn.classList.toggle('active');
                    const icon = articleBookmarkBtn.querySelector('i');
                    if (isSaved) {
                        icon.className = 'fa-solid fa-bookmark';
                    } else {
                        icon.className = 'fa-regular fa-bookmark';
                    }
                });
            }

            const shareBtn = document.getElementById('article-share-btn');
            const shareModal = document.getElementById('share-modal');
            const closeBtn = document.getElementById('close-share-modal');
            const overlay = shareModal?.querySelector('.share-modal-overlay');
            const copyBtn = document.getElementById('share-copy-btn');
            const copyInput = document.getElementById('share-link-input');
            const optionBtns = document.querySelectorAll('.share-btn-option');

            if (shareBtn && shareModal) {
                const openModal = () => shareModal.classList.add('active');
                const closeModal = () => shareModal.classList.remove('active');

                shareBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    openModal();
                });

                closeBtn?.addEventListener('click', closeModal);
                overlay?.addEventListener('click', closeModal);

                copyBtn?.addEventListener('click', async () => {
                    try {
                        await navigator.clipboard.writeText(copyInput.value);
                        copyInput.select();
                        const oldIcon = copyBtn.innerHTML;
                        copyBtn.innerHTML = '<i class="fa-solid fa-check" style="color: var(--green);"></i>';
                        setTimeout(() => copyBtn.innerHTML = oldIcon, 2000);
                    } catch (err) {
                        console.error('Copy failed', err);
                    }
                });

                optionBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const platform = btn.getAttribute('data-platform');
                        const url = encodeURIComponent(window.location.href);
                        const text = encodeURIComponent(title);
                        let shareUrl = '';

                        switch (platform) {
                            case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
                            case 'twitter': shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`; break;
                            case 'whatsapp': shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`; break;
                            case 'telegram': shareUrl = `https://t.me/share/url?url=${url}&text=${text}`; break;
                            case 'linkedin': shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`; break;
                            case 'pinterest': shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&description=${text}`; break;
                            case 'line': shareUrl = `https://social-plugins.line.me/lineit/share?url=${url}`; break;
                            case 'email': shareUrl = `mailto:?subject=${text}&body=${url}`; break;
                        }
                        if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=600');
                        closeModal();
                    });
                });
            }
        }
    } catch (error) {
        console.error('Error rendering post:', error);
        renderError(contentElement, { message: `Error: ${error.message}` });
    }
}