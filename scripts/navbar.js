import { config } from '../config.js';

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
                    <input type="text" placeholder="Looking for something?" id="search-input" autocomplete="off">
                    <button class="search-clear-btn" id="search-clear-btn" style="display: none;">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                    <div id="search-dropdown" class="search-dropdown"></div>
                </div>
                <button class="header-btn" id="theme-toggle" aria-label="Toggle theme">
                    <i class="fa-solid ${getTheme() === 'dark' ? 'fa-sun' : 'fa-moon'}" id="theme-icon"></i>
                </button>
            </div>
            <!-- Mobile Search Modal -->
            <div id="mobile-search-modal" class="mobile-search-modal">
                <div class="mobile-search-container">
                    <div class="mobile-search-header">
                        <div class="header-search">
                            <i class="fa-solid fa-magnifying-glass"></i>
                            <input type="text" placeholder="Search..." id="mobile-search-input" autocomplete="off">
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
    }

    // ===== Left sidebar (nav links + footer + collapse toggle) =====
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = `
        <nav class="sidebar-nav">
            ${config.routes.map(route => `
                <a href="${route.redirectTo}" class="sidebar-nav-link" title="${route.label}">
                    <i class="${route.icon || 'fa-solid fa-link'}"></i>
                    <span class="nav-label">${route.label}</span>
                </a>
            `).join('')}
        </nav>
        <div class="sidebar-footer">
            <div class="sidebar-footer-links">
                <a href="./">Sitemap</a>
                <span>·</span>
                <a href="./">Disclaimer</a>
                <span>·</span>
                <a href="./">Privacy</a>
            </div>
            <div class="sidebar-footer-social">
                ${config.author.social.map(link => `
                    <a href="${link.url}" target="_blank" rel="noopener noreferrer" aria-label="${link.label}">
                        <i class="${link.icon}"></i>
                    </a>
                `).join('')}
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
        if (currentLabel && href === `?label=${currentLabel}`) {
            link.classList.add('active');
        } else if (currentPage === 'about' && href === '?page=about') {
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
                <a href="./">Sitemap</a>
                <span>·</span>
                <a href="./">Disclaimer</a>
                <span>·</span>
                <a href="./">Privacy</a>
            </div>
            <p style="font-size: 11px; color: var(--text-muted); margin-top: 12px;">© ${new Date().getFullYear()} ${config.title}. All rights reserved.</p>
        `;
    }
}