import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';
import { renderError } from '../errorHandler.js';
import { config } from "../config.js";

async function fetchBioContent(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Failed to load bio content: ${response.statusText}`);
        }
        const markdown = await response.text();

        marked.use({
            breaks: true,
            gfm: true
        });

        return marked.parse(markdown);
    } catch (error) {
        console.error('Error loading bio content:', error);
        throw error;
    }
}

export async function renderAbout() {
    const contentElement = document.getElementById('content');
    const { author } = config;

    try {
        const bioContent = await fetchBioContent(author.bio);

        const aboutHTML = `
            <div class="container px-4 mx-auto lg:px-64 gap-3 flex flex-col md:flex-row">
                <div class="md:basis-4/12 -mt-8 justify-center md:px-4">
                    <div class="w-48 h-48 mx-auto md:w-full md:h-auto aspect-square">
                        <img 
                            src="${config.author.avatar}" 
                            alt="${config.author.name}" 
                            class="w-full h-full object-cover p-1 bg-red-300 rounded-full border-4 border-[#f2f2f2]"
                        >
                    </div>
                </div>
                <div class="md:basis-8/12">
                    <h2 class="font-bold text-xl text-center mt-0 md:text-start md:mt-3">${config.author.nickname}</h2>
                    <h3 class="font-medium text-lgz text-center md:text-start">(${config.author.name})</h3>
                    <h4 class="opacity-75 text-sm text-center md:text-start">${config.author.username}</h4>
                    <div class="flex flex-col items-start justify-start md:gap-6 mt-1 md:flex-row">
                        <div class="flex flex-row items-center gap-2 opacity-75">
                            <div class="md:basis-1/8">
                                <i class="fa-solid fa-location-dot"></i>
                            </div>
                            <div class="md:basis-7/8">
                                <div class="text-sm">${config.author.location}</div>
                            </div>
                        </div>
                        <div class="flex flex-row items-center gap-2 opacity-75">
                            <div class="md:basis-1/8">
                                <i class="fa-solid fa-briefcase"></i>
                            </div>
                            <div class="md:basis-7/8">
                                <div class="text-sm">${config.author.occupation}</div>
                            </div>
                        </div>
                    </div>
                    <div class="uppercase text-sm font-medium opacity-75 mt-8">Introduction</div>
                    <div class="text-sm mt-1 prose prose-invert">${bioContent}</div>
                    
                    <div class="uppercase text-sm font-medium opacity-75 mt-8">Where to find</div>
                    <ul class="flex gap-2 mt-2 flex-col lg:flex-row">
                    ${config.author.social.map(link => `
                            <a
                                href="${link.url}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="py-2 px-4 bg-white flex uppercase text-sm font-medium border border-black/0 hover:border-black/25"
                            >
                                <div class="flex flex-row items-center gap-2 opacity-75">
                                    <div class="md:basis-1/8">
                                        <i class="${link.icon}"></i>
                                    </div>
                                    <div class="md:basis-7/8">
                                        <div class="text-sm">${link.label}</div>
                                    </div>
                                </div>                            
                            </a>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;

        contentElement.innerHTML = aboutHTML;

        if (typeof hljs !== 'undefined') {
            hljs.highlightAll();
        }
    } catch (error) {
        console.error('Error rendering about page:', error);
        renderError(contentElement, {
            message: 'Failed to load the about page'
        });
    }
}

export async function renderAboutPage() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page');

        if (page === 'about') {
            await renderAbout();
        }
    } catch (error) {
        console.error('Error rendering about page:', error);
        renderError(document.getElementById('content'), {
            message: 'Failed to load the about page'
        });
    }
}