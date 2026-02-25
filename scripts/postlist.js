import { config } from '../config.js';

// Resolve category slug to its label from config
function getCategoryLabel(slug) {
    const cat = config.categories.find(c => c.slug === slug);
    return cat ? cat.label : slug;
}

// Get display labels as clickable links for a post's categories
function getPostCategoryLinks(post) {
    if (!post.categories || post.categories.length === 0) return '<a href="/">General</a>';
    return post.categories.map(slug => {
        const label = getCategoryLabel(slug);
        return `<a href="/?label=${slug}" class="cat-link">${label}</a>`;
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
    let sectionTitle = 'Bài đăng mới nhất';

    if (labelFilter) {
        filtered = posts.filter(p =>
            p.categories && p.categories.includes(labelFilter)
        );
        const catLabel = getCategoryLabel(labelFilter);
        sectionTitle = `Label: ${catLabel}`;
    }

    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(query) ||
            p.summary.toLowerCase().includes(query)
        );
        sectionTitle = `Results for: "${searchQuery}"`;
    }

    const cardsHTML = filtered.length > 0
        ? filtered.map((post, i) => {
            const postUrl = `?post=${post.file.replace('.md', '')}`;
            return `
            <div class="post-card fade-in">
                <a href="${postUrl}" class="post-card-img">
                    <img src="${post.thumbnail}" alt="${post.title}" loading="lazy">
                    <span class="bookmark"><i class="fa-regular fa-bookmark"></i></span>
                </a>
                <div class="post-card-info">
                    <div class="post-card-cat">in ${getPostCategoryLinks(post)}</div>
                    <a href="${postUrl}" class="post-card-title">${post.title}</a>
                    <p class="post-card-desc">${post.summary}</p>
                    <div class="post-card-bottom">
                        <span class="badge badge-red">Published</span>
                        <span class="post-card-date">${post.datetime}</span>
                        <a href="${postUrl}" class="read-more-link">Đọc thêm</a>
                    </div>
                </div>
            </div>`;
        }).join('')
        : `<p class="empty-state">No posts found.</p>`;

    contentElement.innerHTML = `
        <div id="mobile-banner" class="mobile-banner">
            <img src="${config.author.banner}" alt="Banner">
        </div>
        <div id="mobile-labels" class="mobile-labels"></div>
        <div class="section-header">
            <h2>${sectionTitle}</h2>
            <div class="section-dots"><span></span><span></span><span></span><span></span></div>
        </div>
        <div class="posts-grid">
            ${cardsHTML}
        </div>
    `;
}
