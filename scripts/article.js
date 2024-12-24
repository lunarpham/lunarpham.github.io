import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';
import { renderError } from '../errorHandler.js';

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
            <div class="container mx-auto md:px-56">
                <article class="post-detail mt-4">
                    <div class="border-b-2 border-black/25">
                        <h1 class="text-4xl font-bold">${title}</h1>
                        <p class="text-sm my-2">Posted on <strong>${datetime}</strong></p>
                    </div>
                    <section class="prose prose-invert my-4">${marked.parse(markdownContent)}</section>
                    <div class="w-full flex items-center justify-center my-6 border-t-2 border-black/25">
                        <a href="/" class="back-link mt-2 font-bold text-sm uppercase opacity-75 hover:opacity-100 hover:underline">← Back to all posts</a>
                    </div>
                </article>
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