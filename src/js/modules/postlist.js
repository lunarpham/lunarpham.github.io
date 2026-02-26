import { config } from '../app/config.js';
import { t } from './locales.js';
import { isBookmarked, toggleBookmark } from './bookmarks.js';

// Resolve category slug to its label from config
function getCategoryLabel(slug) {
    return t(slug) || slug;
}

// Get display labels as clickable links for a post's categories
function getPostCategoryLinks(post) {
    if (!post.categories || post.categories.length === 0) return `<a href="./">${t('general')}</a>`;
    return post.categories.map(slug => {
        const label = getCategoryLabel(slug);
        return `<a href="?label=${slug}" class="cat-link">${label}</a>`;
    }).join(', ');
}

export async function fetchPosts() {
    try {
        const response = await fetch('./public/posts.json');
        if (!response.ok) throw new Error('Failed to fetch posts list');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export function renderPostList(posts, labelFilter = null, searchQuery = '') {
    const contentElement = document.getElementById('content');

    // Filter by label if provided
    let filtered = posts;
    let sectionTitle = t('latestPosts');

    if (labelFilter) {
        filtered = posts.filter(p =>
            p.categories && p.categories.includes(labelFilter)
        );
        const catLabel = getCategoryLabel(labelFilter);
        sectionTitle = `${t('labelFilter')}${catLabel}`;
    }

    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(query) ||
            p.summary.toLowerCase().includes(query)
        );
        sectionTitle = `${t('resultsFor')} "${searchQuery}"`;
    }

    const cardsHTML = filtered.length > 0
        ? filtered.map((post, i) => {
            const postUrl = `?post=${post.file.replace('.md', '')}`;
            const isSaved = isBookmarked(post.file);
            const bookmarkIcon = isSaved ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark';

            return `
            <div class="post-card fade-in">
                <a href="${postUrl}" class="post-card-img">
                    <img src="${post.thumbnail}" alt="${post.title}" loading="lazy">
                </a>
                <button class="bookmark-btn ${isSaved ? 'active' : ''}" data-id="${post.file}" data-title="${post.title}" data-url="${postUrl}" data-thumbnail="${post.thumbnail}" data-category="${getCategoryLabel(post.categories?.[0] || 'general')}" aria-label="Bookmark">
                    <i class="${bookmarkIcon}"></i>
                </button>
                <div class="post-card-info">
                    <div class="post-card-cat">${t('in')} ${getPostCategoryLinks(post)}</div>
                    <a href="${postUrl}" class="post-card-title">${post.title}</a>
                    <p class="post-card-desc">${post.summary}</p>
                    <div class="post-card-bottom">
                        <span class="badge badge-green">${t('published')}</span>
                        <span class="post-card-date">${post.datetime}</span>
                        <a href="${postUrl}" class="read-more-link">${t('readMore')}</a>
                    </div>
                </div>
            </div>`;
        }).join('')
        : `<p class="empty-state">${t('noPostsFound')}</p>`;

    contentElement.innerHTML = `
        <div id="mobile-banner" class="mobile-banner">
            <img src="${config.author.banner}" alt="Banner">
        </div>
        <div id="mobile-labels" class="mobile-labels"></div>
        <div class="section-header">
            <h2 class="section-title">${sectionTitle}</h2>
            <div class="section-dots"><span></span><span></span><span></span><span></span></div>
        </div>
        <div class="posts-grid">
            ${cardsHTML}
        </div>
    `;

    // Add event listeners for bookmark buttons
    contentElement.querySelectorAll('.bookmark-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const postData = {
                id: btn.getAttribute('data-id'),
                title: btn.getAttribute('data-title'),
                url: btn.getAttribute('data-url'),
                thumbnail: btn.getAttribute('data-thumbnail'),
                categoryLabel: btn.getAttribute('data-category')
            };
            toggleBookmark(postData);

            // Toggle icon locally for instant feedback
            const isSaved = btn.classList.toggle('active');
            const icon = btn.querySelector('i');
            if (isSaved) {
                icon.className = 'fa-solid fa-bookmark';
            } else {
                icon.className = 'fa-regular fa-bookmark';
            }
        });
    });
}
