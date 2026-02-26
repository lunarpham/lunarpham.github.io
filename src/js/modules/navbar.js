import { config } from '../app/config.js';
import { t, getLang, setLang } from './locales.js';
import { getBookmarks, removeBookmark } from './bookmarks.js';

function getTheme() {
    return localStorage.getItem('theme') || 'dark';
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function getSidebarState() {
    return localStorage.getItem('sidebar-collapsed') === 'true';
}

function setSidebarState(collapsed) {
    localStorage.setItem('sidebar-collapsed', collapsed);
}

export function websiteMapNav() {
    setTheme(getTheme());

    // ===== Horizontal sticky header =====
    const header = document.getElementById('site-header');
    if (header) {
        header.innerHTML = `
            <div class="header-left">
                <button class="header-hamburger" id="header-hamburger" aria-label="Menu">
                    <i class="fa-solid fa-bars"></i>
                </button>
                <a href="./" class="header-brand-link">
                    <span class="header-brand">${config.title}</span>
                </a>
            </div>
            <div class="header-right">
                <button class="header-btn mobile-only" id="mobile-search-btn" aria-label="Search">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </button>
                <div class="header-search desktop-only">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="${t('searchPlaceholder')}" id="search-input" autocomplete="off">
                    <button class="search-clear-btn" id="search-clear-btn" style="display: none;">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                    <div id="search-dropdown" class="search-dropdown"></div>
                </div>
                <div class="header-bookmarks" id="header-bookmarks">
                    <button class="header-btn" id="bookmark-toggle" aria-label="Bookmarks">
                        <i class="fa-regular fa-bookmark"></i>
                        <span class="bookmark-badge" id="bookmark-badge" style="display: none;">0</span>
                    </button>
                    <div id="bookmark-dropdown" class="bookmark-dropdown">
                        <div class="bookmark-dropdown-header">${t('bookmarkPosts')}</div>
                        <div id="bookmark-dropdown-list" class="bookmark-dropdown-list"></div>
                    </div>
                </div>
                <button class="header-btn" id="lang-toggle" aria-label="Toggle language">
                    <span id="lang-text" style="font-weight: bold; font-size: 14px;">${getLang().toUpperCase()}</span>
                </button>
                <button class="header-btn" id="theme-toggle" aria-label="Toggle theme">
                    <i class="fa-solid ${getTheme() === 'dark' ? 'fa-sun' : 'fa-moon'}" id="theme-icon"></i>
                </button>
            </div>
            
            <!-- Mobile Bookmark Modal -->
            <div id="mobile-bookmark-modal" class="mobile-search-modal" style="z-index: 201;">
                <div class="mobile-search-container">
                    <div class="mobile-search-header" style="justify-content: space-between; padding-left: 20px;">
                        <span style="font-weight: 600; font-size: 16px;">${t('bookmarkPosts')}</span>
                        <button class="mobile-search-close" id="mobile-bookmark-close">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div id="mobile-bookmark-list" class="bookmark-dropdown-list" style="max-height: calc(100vh - 65px)"></div>
                </div>
            </div>

            <div id="mobile-search-modal" class="mobile-search-modal">
                <div class="mobile-search-container">
                    <div class="mobile-search-header">
                        <div class="header-search">
                            <i class="fa-solid fa-magnifying-glass"></i>
                            <input type="text" placeholder="${t('searchMobilePlaceholder')}" id="mobile-search-input" autocomplete="off">
                        </div>
                        <button class="mobile-search-close" id="mobile-search-close">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div id="mobile-search-results" class="mobile-search-results"></div>
                </div>
            </div>
        `;

        // Mobile Search Modal logic
        const mobileSearchBtn = document.getElementById('mobile-search-btn');
        const mobileSearchModal = document.getElementById('mobile-search-modal');
        const mobileSearchClose = document.getElementById('mobile-search-close');
        const mobileSearchInput = document.getElementById('mobile-search-input');

        mobileSearchBtn?.addEventListener('click', () => {
            mobileSearchModal?.classList.add('active');
            mobileSearchInput?.focus();
        });

        mobileSearchClose?.addEventListener('click', () => {
            mobileSearchModal?.classList.remove('active');
        });

        mobileSearchModal?.addEventListener('click', (e) => {
            if (e.target === mobileSearchModal) {
                mobileSearchModal.classList.remove('active');
            }
        });

        // Theme toggle
        document.getElementById('theme-toggle')?.addEventListener('click', () => {
            const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            setTheme(next);
            document.getElementById('theme-icon').className = `fa-solid ${next === 'dark' ? 'fa-sun' : 'fa-moon'}`;
        });

        // Language toggle
        document.getElementById('lang-toggle')?.addEventListener('click', () => {
            const nextLang = getLang() === 'en' ? 'vi' : 'en';
            setLang(nextLang);
            window.location.reload(); // Reload to apply translations
        });

        // Bookmarks dropdown toggle
        const bookmarkToggle = document.getElementById('bookmark-toggle');
        const bookmarkDropdown = document.getElementById('bookmark-dropdown');
        const bookmarkList = document.getElementById('bookmark-dropdown-list');
        const bookmarkBadge = document.getElementById('bookmark-badge');

        function updateBookmarkDropdown() {
            const bookmarks = getBookmarks();
            if (bookmarkBadge) {
                if (bookmarks.length > 0) {
                    bookmarkBadge.style.display = 'flex';
                    bookmarkBadge.textContent = bookmarks.length;
                } else {
                    bookmarkBadge.style.display = 'none';
                }
            }

            const mobileBookmarkList = document.getElementById('mobile-bookmark-list');
            const listsToUpdate = [bookmarkList, mobileBookmarkList].filter(Boolean);

            if (bookmarks.length === 0) {
                listsToUpdate.forEach(list => {
                    list.innerHTML = `<div class="empty-bookmarks" style="padding-top: 40px">${t('noBookmarks')}</div>`;
                });
                return;
            }

            const html = bookmarks.map(b => `
                <div class="bookmark-item" data-id="${b.id}">
                    <a href="${b.url}" class="bookmark-item-link">
                        <img src="${b.thumbnail}" alt="${b.title}">
                        <div class="bookmark-item-info">
                            <div class="bookmark-item-title">${b.title}</div>
                            <div class="bookmark-item-meta">${t('in')} ${b.categoryLabel}</div>
                        </div>
                    </a>
                    <button class="bookmark-remove-btn" data-id="${b.id}" aria-label="${t('removeBookmark')}">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `).join('');

            listsToUpdate.forEach(list => {
                list.innerHTML = html;
                list.querySelectorAll('.bookmark-remove-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        const id = btn.getAttribute('data-id');
                        removeBookmark(id);
                    });
                });

                // Add click listener to links in mobile modal to close modal when navigating
                if (list === mobileBookmarkList) {
                    list.querySelectorAll('.bookmark-item-link').forEach(link => {
                        link.addEventListener('click', () => {
                            document.getElementById('mobile-bookmark-modal')?.classList.remove('active');
                        });
                    });
                }
            });
        }

        const mobileBookmarkModal = document.getElementById('mobile-bookmark-modal');
        const mobileBookmarkClose = document.getElementById('mobile-bookmark-close');

        bookmarkToggle?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.innerWidth <= 768) {
                // Mobile behavior: Open full screen modal
                mobileBookmarkModal?.classList.add('active');
            } else {
                // Desktop behavior: Toggle dropdown
                bookmarkDropdown?.classList.toggle('active');
            }
            updateBookmarkDropdown();
        });

        mobileBookmarkClose?.addEventListener('click', () => {
            mobileBookmarkModal?.classList.remove('active');
        });

        mobileBookmarkModal?.addEventListener('click', (e) => {
            if (e.target === mobileBookmarkModal) {
                mobileBookmarkModal.classList.remove('active');
            }
        });

        document.addEventListener('click', (e) => {
            if (window.innerWidth > 768 && bookmarkDropdown && bookmarkToggle && !bookmarkDropdown.contains(e.target) && !bookmarkToggle.contains(e.target)) {
                bookmarkDropdown.classList.remove('active');
            }
        });

        window.addEventListener('bookmarks-updated', updateBookmarkDropdown);
        updateBookmarkDropdown();
    }

    // ===== Left sidebar (nav links + footer + collapse toggle) =====
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = `
        <nav class="sidebar-nav">
            ${config.routes.map(route => {
        const labelKey = route.label === 'Home' ? 'routeHome' : (route.label === 'About me' ? 'routeAbout' : route.label);
        return `
                <a href="${route.redirectTo}" class="sidebar-nav-link" title="${t(labelKey)}">
                    <i class="${route.icon || 'fa-solid fa-link'}"></i>
                    <span class="nav-label">${t(labelKey)}</span>
                </a>
            `}).join('')}
        </nav>
        <div class="sidebar-footer">
            <div class="sidebar-footer-links">
                <a href="./">${t('sitemap')}</a>
                <span>·</span>
                <a href="./">${t('disclaimer')}</a>
            </div>
            <div class="sidebar-footer-social">
                ${config.author.social.map(link => `
                    <a href="${link.url}" target="_blank" rel="noopener noreferrer" aria-label="${link.label}">
                        <i class="${link.icon}"></i>
                    </a>
                `).join('')}
            </div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 12px; white-space: normal; line-height: 1.4;">
                ${t('themeDisclaimer')}
            </div>
        </div>
        <button class="sidebar-collapse-btn" id="sidebar-collapse-btn" aria-label="Toggle sidebar">
            <i class="fa-solid fa-angles-left" id="sidebar-collapse-icon"></i>
        </button>
    `;

    // Apply saved sidebar state
    if (getSidebarState()) {
        sidebar.classList.add('collapsed');
        document.querySelector('.main-area')?.classList.add('sidebar-collapsed');
        const icon = document.getElementById('sidebar-collapse-icon');
        if (icon) icon.className = 'fa-solid fa-angles-right';
    }

    // Highlight active nav link
    const urlParams = new URLSearchParams(window.location.search);
    const currentLabel = urlParams.get('label');
    const currentPage = urlParams.get('page');
    const currentPost = urlParams.get('post');

    sidebar.querySelectorAll('.sidebar-nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (currentLabel && href === `./?label=${currentLabel}`) {
            link.classList.add('active');
        } else if (currentPage === 'about' && href === './?page=about') {
            link.classList.add('active');
        } else if (!currentLabel && !currentPage && !currentPost && (href === './' || href === '')) {
            link.classList.add('active');
        }
    });

    // Sidebar collapse toggle
    document.getElementById('sidebar-collapse-btn')?.addEventListener('click', () => {
        const isCollapsed = sidebar.classList.toggle('collapsed');
        document.querySelector('.main-area')?.classList.toggle('sidebar-collapsed');
        setSidebarState(isCollapsed);
        const icon = document.getElementById('sidebar-collapse-icon');
        if (icon) {
            icon.className = `fa-solid ${isCollapsed ? 'fa-angles-right' : 'fa-angles-left'}`;
        }
    });

    // Hamburger toggle for sidebar on mobile
    const overlay = document.getElementById('sidebar-overlay');

    document.getElementById('header-hamburger')?.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay?.classList.toggle('active');
    });

    overlay?.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    });

    // ===== Site footer (Mobile only) =====
    const siteFooter = document.getElementById('site-footer');
    if (siteFooter) {
        siteFooter.innerHTML = `
            <div class="sidebar-footer-social" style="display: flex !important; justify-content: center; margin-bottom: 12px;">
                ${config.author.social.map(link => `
                    <a href="${link.url}" target="_blank" rel="noopener noreferrer" aria-label="${link.label}" style="margin: 0 10px;">
                        <i class="${link.icon}"></i>
                    </a>
                `).join('')}
            </div>
            <div class="sidebar-footer-links" style="justify-content: center;">
                <a href="./">${t('sitemap')}</a>
                <span>·</span>
                <a href="./">${t('disclaimer')}</a>
            </div>
            <p style="font-size: 11px; color: var(--text-muted); margin-top: 12px; margin-bottom: 4px;">© ${new Date().getFullYear()} ${config.title}. ${t('allRightsReserved')}</p>
            <p style="font-size: 11px; color: var(--text-muted);">${t('themeDisclaimer')}</p>
        `;
    }
}