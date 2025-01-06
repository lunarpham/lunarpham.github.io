import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';
import { renderError } from '../errorHandler.js';
import { config } from '../config.js';

export async function fetchPostContent(file) {
    try {
        const response = await fetch(`/posts/${file}`);

        if (!response.ok) {
            throw new Error(`Failed to load post content: ${response.statusText}`);
        }

        const markdown = await response.text();

        const contentParts = markdown.split('---');

        if (contentParts.length < 3) {
            throw new Error('Invalid markdown format: Incomplete front matter');
        }

        const frontMatter = contentParts[1].trim();
        const content = contentParts.slice(2).join('---').trim();

        const metadata = {};
        for (const line of frontMatter.split('\n')) {
            const [key, ...valueParts] = line.split(':');
            if (!key || valueParts.length === 0) continue;
            const value = valueParts.join(':').trim();
            metadata[key.trim()] = value.replace(/["']/g, '');
        }

        if (!metadata.title || !metadata.datetime) {
            throw new Error('Invalid front matter: Missing required fields');
        }

        return { metadata, content };
    } catch (error) {
        console.error('Error in fetchPostContent:', error);
        throw error;
    }
}

export function renderPostContent(title, datetime, markdownContent) {
    const contentElement = document.getElementById('content');

    try {
        marked.use({
            breaks: true,
            gfm: true
        });

        const postHTML = `
            <div class="container mx-auto px-4 lg:px-64">
                <article class="post-detail mt-8">
                    <div class="flex flex-row gap-2 items-center mb-4">
                        <div>
                            <img src="${config.author.avatar}" alt="${config.author.nickname}" class="profile-image h-8 rounded-full bg-white">
                        </div>
                        <div>
                            <div class="text-sm"><strong>${config.author.nickname}</strong><span class="opacity-75"> · </span><span class="opacity-100">${datetime}</span></div>
                        </div>
                    </div>
                    <h1 class="text-4xl font-bold">${title}</h1>
                    <section class="prose prose-invert my-6">${marked.parse(markdownContent)}</section>
                </article>
                <div class="text-center mt-8 border-t border-black/25 p-4">
                    <a href="/" class="back-link font-medium text-sm uppercase opacity-75 hover:opacity-100 hover:underline">← Back to all posts</a>
                </div>
            </div>    
        `;
        contentElement.innerHTML = postHTML;

        if (typeof hljs !== 'undefined') {
            hljs.highlightAll();
        }
    } catch (error) {
        console.error('Error rendering post content:', error);
        renderError(contentElement, {
            title,
            datetime,
            showDate: true,
            message: `Error rendering content: ${error.message}`
        });
    }
}