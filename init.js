import { websiteMapNav } from './scripts/navbar.js';
import { renderAboutPage } from "./scripts/about.js";
import { renderError } from './error.js';
import { fetchPosts, renderPostList } from './scripts/postlist.js';
import { fetchPostContent, renderPostContent } from './scripts/article.js';
import { renderCategoriesSidebar } from './scripts/categories.js';
import { config } from './config.js';

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

        const contentElement = document.getElementById('content');
        if (!contentElement) throw new Error('Content element not found');

        if (page === 'about') {
            await renderAboutPage();
            return;
        }

        const posts = await fetchPosts();
        if (!Array.isArray(posts)) throw new Error('Invalid posts data');

        // --- Smart Search Logic ---

        const highlightMatch = (text, query) => {
            if (!query) return text;
            const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 0);
            let highlighted = text;
            words.forEach(word => {
                const regex = new RegExp(`(${word})`, 'gi');
                highlighted = highlighted.replace(regex, '<mark>$1</mark>');
            });
            return highlighted;
        };

        const handleSearch = (query, resultsContainer, dropdown) => {
            if (!query.trim()) {
                dropdown?.classList.remove('active');
                if (resultsContainer) resultsContainer.innerHTML = '';
                return;
            }

            const searchWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 0);

            const filtered = posts.map(post => {
                let score = 0;
                const titleLower = post.title.toLowerCase();
                const summaryLower = post.summary.toLowerCase();

                // Check if all words match somewhere
                const allWordsMatch = searchWords.every(word =>
                    titleLower.includes(word) || summaryLower.includes(word)
                );

                if (!allWordsMatch) return null;

                // Simple scoring: matches in title are worth more
                searchWords.forEach(word => {
                    if (titleLower.includes(word)) score += 10;
                    if (summaryLower.includes(word)) score += 2;
                    // Exact start of title is bonus
                    if (titleLower.startsWith(word)) score += 5;
                });

                return { ...post, score };
            })
                .filter(p => p !== null)
                .sort((a, b) => b.score - a.score)
                .slice(0, 8);

            dropdown?.classList.add('active');

            let html = `<div class="search-header-info">Kết quả cho: <span>${query}</span></div>`;

            if (filtered.length > 0) {
                html += filtered.map((post, idx) => {
                    const postUrl = `?post=${post.file.replace('.md', '')}`;
                    const cats = (post.categories || []).map(slug => {
                        const c = config.categories.find(cc => cc.slug === slug);
                        return c ? c.label : slug;
                    }).join(' / ');

                    return `
                        <a href="${postUrl}" class="search-result-item" data-index="${idx}">
                            <div class="search-result-thumb">
                                <img src="${post.thumbnail}" alt="">
                            </div>
                            <div class="search-result-info">
                                <span class="search-result-title">${highlightMatch(post.title, query)}</span>
                                <div class="search-result-meta">in <span>${cats || 'General'}</span></div>
                            </div>
                        </a>
                    `;
                }).join('');
            } else {
                html += `<div class="search-header-info">Không tìm thấy kết quả nào</div>`;
            }

            if (resultsContainer) resultsContainer.innerHTML = html;
        };

        // --- Search Input Setup & Keyboard Nav ---

        const setupKeyboardNav = (input, container, dropdown) => {
            let selectedIndex = -1;

            input.addEventListener('keydown', (e) => {
                const items = container.querySelectorAll('.search-result-item');
                if (!items.length) return;

                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
                    updateSelection(items);
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    selectedIndex = Math.max(selectedIndex - 1, 0);
                    updateSelection(items);
                } else if (e.key === 'Enter') {
                    if (selectedIndex >= 0) {
                        e.preventDefault();
                        items[selectedIndex].click();
                    }
                } else if (e.key === 'Escape') {
                    dropdown?.classList.remove('active');
                    selectedIndex = -1;
                }
            });

            input.addEventListener('input', () => {
                selectedIndex = -1; // Reset selection on new input
            });

            function updateSelection(items) {
                items.forEach((item, i) => {
                    if (i === selectedIndex) {
                        item.classList.add('selected');
                        item.scrollIntoView({ block: 'nearest' });
                    } else {
                        item.classList.remove('selected');
                    }
                });
            }
        };

        const searchInput = document.getElementById('search-input');
        const searchDropdown = document.getElementById('search-dropdown');
        const searchClearBtn = document.getElementById('search-clear-btn');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const val = e.target.value;
                handleSearch(val, searchDropdown, searchDropdown);
                if (searchClearBtn) searchClearBtn.style.display = val ? 'block' : 'none';
            });

            searchClearBtn?.addEventListener('click', () => {
                searchInput.value = '';
                handleSearch('', searchDropdown, searchDropdown);
                searchClearBtn.style.display = 'none';
                searchInput.focus();
            });

            setupKeyboardNav(searchInput, searchDropdown, searchDropdown);

            document.addEventListener('click', (e) => {
                if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
                    searchDropdown.classList.remove('active');
                }
            });

            // Focus on '/' press
            document.addEventListener('keydown', (e) => {
                const isInputActive = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
                if (e.key === '/' && !isInputActive && !app.querySelector('.mobile-search-modal.active')) {
                    e.preventDefault();
                    searchInput.focus();
                }
            });
        }

        const mobileSearchInput = document.getElementById('mobile-search-input');
        const mobileSearchResults = document.getElementById('mobile-search-results');
        if (mobileSearchInput) {
            mobileSearchInput.addEventListener('input', (e) => {
                handleSearch(e.target.value, mobileSearchResults, null);
            });
            setupKeyboardNav(mobileSearchInput, mobileSearchResults, null);
        }

        if (postFile) {
            contentElement.innerHTML = '<div class="loading-container"><div class="loading-spinner"></div><p class="loading-text">Loading article...</p></div>';
            try {
                const { metadata, content } = await fetchPostContent(`${postFile}.md`);
                if (!metadata?.title || !content) throw new Error('Invalid post data');
                renderPostContent(metadata.title, metadata.datetime, content, posts.find(p => p.file === postFile || p.file === `${postFile}.md`)?.categories || []);
                renderCategoriesSidebar(posts);
            } catch (err) {
                console.error('Error loading post:', err);
                renderError(contentElement, { message: 'Post not found' });
            }
        } else {
            renderPostList(posts, label);
            renderCategoriesSidebar(posts);
        }

        if (contentElement.querySelector('pre code') && typeof hljs !== 'undefined') {
            hljs.highlightAll();
        }
    } catch (error) {
        console.error('Critical error:', error);
        renderError(document.body, { title: 'Initialization Error', message: error.message });
    }
}
