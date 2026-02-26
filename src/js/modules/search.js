import { t } from './locales.js';

export function initSearch(posts, app) {
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
            handleSearch(e.target.value, mobileSearchResults, null);
        });
        setupKeyboardNav(mobileSearchInput, mobileSearchResults, null);
    }
}
