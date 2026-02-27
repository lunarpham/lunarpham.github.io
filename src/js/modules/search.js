import { t } from './locales.js';

export function initSearch(posts, app) {
    const highlightMatch = (text, query) => {
        if (!query) return text;
        const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 0);
        let highlighted = text;
        words.forEach(word => {
            const regex = new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            highlighted = highlighted.replace(regex, '<mark>$1</mark>');
        });
        return highlighted;
    };

    const searchAndScore = (query) => {
        const searchWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 0);

        return posts.map(post => {
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
    };

    const DROPDOWN_LIMIT = 5;

    const handleSearch = (query, resultsContainer, dropdown, isMobile = false) => {
        if (!query.trim()) {
            dropdown?.classList.remove('active');
            if (resultsContainer) resultsContainer.innerHTML = '';
            return;
        }

        const allResults = searchAndScore(query);
        const filtered = allResults.slice(0, DROPDOWN_LIMIT);

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

            // "Show more results" link
            if (allResults.length > DROPDOWN_LIMIT) {
                const searchUrl = `?search=${encodeURIComponent(query)}`;
                html += `<a href="${searchUrl}" class="search-show-more">${t('showMoreResults')} (${allResults.length})<i class="fa-solid fa-arrow-right"></i></a>`;
            }
        } else {
            html += `<div class="search-header-info">${t('noResults')}</div>`;
        }

        if (resultsContainer) resultsContainer.innerHTML = html;
    };

    const setupKeyboardNav = (input, container, dropdown) => {
        let selectedIndex = -1;

        input.addEventListener('keydown', (e) => {
            const items = container.querySelectorAll('.search-result-item');

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (!items.length) return;
                selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
                updateSelection(items);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (!items.length) return;
                selectedIndex = Math.max(selectedIndex - 1, 0);
                updateSelection(items);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (selectedIndex >= 0 && items[selectedIndex]) {
                    items[selectedIndex].click();
                } else if (input.value.trim()) {
                    // Navigate to search results page
                    window.location.href = `?search=${encodeURIComponent(input.value.trim())}`;
                }
            } else if (e.key === 'Escape') {
                dropdown?.classList.remove('active');
                selectedIndex = -1;
            }
        });

        input.addEventListener('input', () => {
            selectedIndex = -1;
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
            handleSearch(val, searchDropdown, searchDropdown, false);
            if (searchClearBtn) {
                if (val) searchClearBtn.classList.add('visible');
                else searchClearBtn.classList.remove('visible');
            }
        });

        searchClearBtn?.addEventListener('click', () => {
            searchInput.value = '';
            handleSearch('', searchDropdown, searchDropdown, false);
            searchClearBtn.classList.remove('visible');
            searchInput.focus();
        });

        setupKeyboardNav(searchInput, searchDropdown, searchDropdown);

        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchDropdown?.contains(e.target)) {
                searchDropdown?.classList.remove('active');
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
            handleSearch(e.target.value, mobileSearchResults, null, true);
        });
        setupKeyboardNav(mobileSearchInput, mobileSearchResults, null);
    }
}
