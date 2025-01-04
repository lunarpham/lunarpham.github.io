import { config } from '../config.js';

export function websiteMapNav() {
    const navigator = document.getElementById('navbar');

    navigator.innerHTML = `
        <nav>
            <div class="container mx-auto px-4 lg:px-64 py-4">
            
                <!-- Desktop View -->
                <div class="hidden md:flex justify-between items-center">
                    <div class="flex gap-8">
                        ${config.routes.map(route => `
                            <a href="${route.redirectTo}" class="text-sm uppercase font-medium opacity-75 hover:opacity-100 hover:underline">${route.label}</a>
                        `).join('')}
                    </div>
                    
                    <a href="/" class="font-bold text-xl">LUNAR BLOG</a>
                    
                    <div class="flex gap-6">
                        ${config.author.social.map(socialLink => `
                            <a href="${socialLink.url}" class="opacity-75 hover:opacity-100" target="_blank">
                                <i class="${socialLink.icon}"></i>
                            </a>
                        `).join('')}
                    </div>
                </div>

                <!-- Mobile View -->
                <div class="md:hidden">
                    <div class="flex justify-between items-center">
                        <a href="/" class="font-bold text-xl">LUNAR BLOG</a>
                        <button id="nav-toggle">
                            <i class="fa-solid fa-bars"></i>
                        </button>
                    </div>
                    
                    <!-- Mobile Menu -->
                    <div id="nav-content" class="hidden mt-4">
                        <div class="flex flex-col gap-4">
                            ${config.routes.map(route => `
                                <a href="${route.redirectTo}" class="text-sm uppercase font-medium opacity-75 hover:opacity-100 hover:underline">${route.label}</a>
                            `).join('')}
                        </div>
                        <div class="flex gap-6 mt-4 pt-4 border-t">
                            ${config.author.social.map(socialLink => `
                                <a href="${socialLink.url}" class="opacity-75 hover:opacity-100" target="_blank">
                                    <i class="${socialLink.icon}"></i>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    `;

    // Simple toggle functionality
    const toggle = document.getElementById('nav-toggle');
    const content = document.getElementById('nav-content');

    toggle?.addEventListener('click', () => {
        content.classList.toggle('hidden');
    });
}