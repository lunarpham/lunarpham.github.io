import { websiteMapNav } from '../modules/navbar.js';
import { renderAboutPage } from "../modules/about.js";
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';
import { renderError } from './error.js';
import { fetchPosts, renderPostList } from '../modules/postlist.js';
import { fetchPostContent, renderPostContent } from '../modules/article.js';
import { renderCategoriesSidebar } from '../modules/categories.js';
import { config } from './config.js';
import { t, getLang } from '../modules/locales.js';

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

        if (page === 'about') {
            await renderAboutPage();
            return;
        }

        const descriptionHTML = await fetchDescriptionHTML();

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

            let html = `<div class="search-header-info">${t('resultsFor')} <span>${query}</span></div>`;

            if (filtered.length > 0) {
                html += filtered.map((post, idx) => {
                    const postUrl = `?post=${post.file.replace('.md', '')}`;
                    const cats = (post.categories || []).map(slug => {
                        return t(slug) || slug;
                    }).join(', ');

                    return `
                        <a href="${postUrl}" class="search-result-item" data-index="${idx}">
                            <div class="search-result-thumb">
                                <img src="${post.thumbnail}" alt="">
                            </div>
                            <div class="search-result-info">
                                <span class="search-result-title">${highlightMatch(post.title, query)}</span>
                                <div class="search-result-meta">${t('in')} <span>${cats || t('general')}</span></div>
                            </div>
                        </a>
                    `;
                }).join('');
            } else {
                html += `<div class="search-header-info">${t('noResults')}</div>`;
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
            contentElement.innerHTML = `<div class="loading-container"><div class="loading-spinner"></div><p class="loading-text">${t('loading')}</p></div>`;
            try {
                const { metadata, content } = await fetchPostContent(`${postFile}.md`);
                if (!metadata?.title || !content) throw new Error('Invalid post data');
                const matchingPost = posts.find(p => p.file === postFile || p.file === `${postFile}.md`);
                renderPostContent(metadata.title, metadata.datetime, content, matchingPost?.categories || [], matchingPost);
                renderCategoriesSidebar(posts, descriptionHTML);
            } catch (err) {
                console.error('Error loading post:', err);
                renderError(contentElement, { message: t('postNotFound') });
            }
        } else {
            renderPostList(posts, label);
            renderCategoriesSidebar(posts, descriptionHTML);
        }

        // --- Scroll Button with Progress ---
        const scrollBtnHTML = `
            <button id="scroll-to-top" class="scroll-to-top" aria-label="Scroll page">
                <svg class="progress-circle" width="100%" height="100%" viewBox="-1 -1 102 102">
                    <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" />
                </svg>
                <i class="fa-solid fa-chevron-down" id="scroll-icon" style="transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);"></i>
            </button>
        `;

        if (!document.getElementById('scroll-to-top')) {
            document.body.insertAdjacentHTML('beforeend', scrollBtnHTML);
        }

        const scrollBtn = document.getElementById('scroll-to-top');
        const scrollIcon = document.getElementById('scroll-icon');
        const progressPath = scrollBtn?.querySelector('path');

        if (progressPath) {
            const pathLength = progressPath.getTotalLength();
            progressPath.style.transition = 'none';
            progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
            progressPath.style.strokeDashoffset = pathLength;
            progressPath.getBoundingClientRect(); // trigger layout
            progressPath.style.transition = 'stroke-dashoffset 10ms linear';

            let isAtTop = true;

            const updateProgress = () => {
                const scroll = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;

                // Show button always, but flip icon
                if (scroll > 100) {
                    if (isAtTop) {
                        isAtTop = false;
                        scrollIcon.style.transform = 'rotate(180deg)';
                        scrollIcon.style.marginTop = '-2px';
                    }
                } else {
                    if (!isAtTop) {
                        isAtTop = true;
                        scrollIcon.style.transform = 'rotate(0deg)';
                        scrollIcon.style.marginTop = '0';
                    }
                }

                // Show button immediately so they can click down
                scrollBtn.classList.add('visible');

                // Calculate progress
                if (docHeight > 0) {
                    const progress = scroll / docHeight;
                    progressPath.style.strokeDashoffset = pathLength - (progress * pathLength);
                }
            };

            window.addEventListener('scroll', updateProgress, { passive: true });

            // Allow layout to settle before initial check
            setTimeout(updateProgress, 100);

            scrollBtn?.addEventListener('click', () => {
                if (isAtTop) {
                    // Scroll to bottom
                    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
                } else {
                    // Scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        }

        if (contentElement.querySelector('pre code') && typeof hljs !== 'undefined') {
            hljs.highlightAll();
        }
    } catch (error) {
        console.error('Critical error:', error);
        renderError(document.body, { title: 'Initialization Error', message: error.message });
    }
}
