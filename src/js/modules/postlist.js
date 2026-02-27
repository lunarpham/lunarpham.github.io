import { config } from '../app/config.js';
import { t } from './locales.js';
import { isBookmarked, toggleBookmark } from './bookmarks.js';

const POSTS_PER_PAGE = 10;

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

function buildPaginationHTML(currentPage, totalPages, baseParams) {
    if (totalPages <= 1) return '';

    const params = new URLSearchParams(baseParams);

    const makeLink = (page) => {
        params.set('p', page);
        return `?${params.toString()}`;
    };

    let html = '<div class="pagination">';

    // Previous button
    if (currentPage > 1) {
        html += `<a href="${makeLink(currentPage - 1)}" class="pagination-btn pagination-prev"><i class="fa-solid fa-chevron-left"></i> ${t('previous')}</a>`;
    } else {
        html += `<span class="pagination-btn pagination-prev disabled"><i class="fa-solid fa-chevron-left"></i> ${t('previous')}</span>`;
    }

    // Page numbers
    html += '<div class="pagination-pages">';

    const showPages = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) showPages.push(i);
    } else {
        showPages.push(1);
        if (currentPage > 3) showPages.push('...');

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) showPages.push(i);

        if (currentPage < totalPages - 2) showPages.push('...');
        showPages.push(totalPages);
    }

    showPages.forEach(p => {
        if (p === '...') {
            html += `<span class="pagination-ellipsis">…</span>`;
        } else if (p === currentPage) {
            html += `<span class="pagination-number active">${p}</span>`;
        } else {
            html += `<a href="${makeLink(p)}" class="pagination-number">${p}</a>`;
        }
    });

    html += '</div>';

    // Next button
    if (currentPage < totalPages) {
        html += `<a href="${makeLink(currentPage + 1)}" class="pagination-btn pagination-next">${t('next')} <i class="fa-solid fa-chevron-right"></i></a>`;
    } else {
        html += `<span class="pagination-btn pagination-next disabled">${t('next')} <i class="fa-solid fa-chevron-right"></i></span>`;
    }

    html += '</div>';
    return html;
}

function handleBookmarkResult(result, btn) {
    if (result === 'limit') {
        // Show temporary toast
        const toast = document.createElement('div');
        toast.className = 'bookmark-toast';
        toast.textContent = t('bookmarkLimitReached');
        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('visible'));
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
        return false; // Not toggled
    }

    // Toggle icon locally for instant feedback
    const isSaved = btn.classList.toggle('active');
    const icon = btn.querySelector('i');
    if (isSaved) {
        icon.className = 'fa-solid fa-bookmark';
    } else {
        icon.className = 'fa-regular fa-bookmark';
    }
    return true;
}

export function renderPostList(posts, labelFilter = null, searchQuery = '', currentPage = 1) {
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
        const searchWords = searchQuery.toLowerCase().split(/\s+/).filter(w => w.length > 0);
        filtered = filtered
            .map(post => {
                let score = 0;
                const titleLower = post.title.toLowerCase();
                const summaryLower = post.summary.toLowerCase();
                const allWordsMatch = searchWords.every(word =>
                    titleLower.includes(word) || summaryLower.includes(word)
                );
                if (!allWordsMatch) return null;
                searchWords.forEach(word => {
                    if (titleLower.includes(word)) score += 10;
                    if (summaryLower.includes(word)) score += 2;
                    if (titleLower.startsWith(word)) score += 5;
                });
                return { ...post, score };
            })
            .filter(p => p !== null)
            .sort((a, b) => b.score - a.score);
        sectionTitle = `${t('resultsFor')} "${searchQuery}"`;
    }

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
    currentPage = Math.max(1, Math.min(currentPage, totalPages));
    const startIdx = (currentPage - 1) * POSTS_PER_PAGE;
    const paginatedPosts = filtered.slice(startIdx, startIdx + POSTS_PER_PAGE);

    // Build base params for pagination links
    const baseParams = {};
    if (labelFilter) baseParams.label = labelFilter;
    if (searchQuery) baseParams.search = searchQuery;

    const cardsHTML = paginatedPosts.length > 0
        ? paginatedPosts.map((post, i) => {
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

    const paginationHTML = buildPaginationHTML(currentPage, totalPages, baseParams);

    let headerHTML = '';
    if (labelFilter || searchQuery) {
        const crumbs = [`<a href="/">${t('home')}</a>`];
        if (labelFilter) {
            crumbs.push(`<span class="breadcrumb-current">${getCategoryLabel(labelFilter)}</span>`);
        }
        if (searchQuery) {
            crumbs.push(`<span class="breadcrumb-current">${t('resultsFor')} "${searchQuery}"</span>`);
        }
        headerHTML = `<nav class="breadcrumb" aria-label="Breadcrumb">${crumbs.join('<span class="breadcrumb-sep">›</span>')}</nav>`;
    } else {
        headerHTML = `
        <div class="section-header">
            <h2 class="section-title">${sectionTitle}</h2>
            <div class="section-dots"><span></span><span></span><span></span><span></span></div>
        </div>`;
    }

    contentElement.innerHTML = `
        <div id="mobile-banner" class="mobile-banner">
            <img src="${config.author.banner}" alt="Banner">
        </div>
        <div id="mobile-labels" class="mobile-labels"></div>
        ${headerHTML}
        <div class="posts-grid">
            ${cardsHTML}
        </div>
        ${paginationHTML}
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
            const result = toggleBookmark(postData);
            handleBookmarkResult(result, btn);
        });
    });
}

export { handleBookmarkResult };
