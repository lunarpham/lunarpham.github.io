import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';

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
        // Configure marked options if needed
        marked.use({
            breaks: true,
            gfm: true
        });

        const postHTML = `
            <article class="post-detail">
                <h1>${title}</h1>
                <p><strong>Date:</strong> ${datetime}</p>
                <section>${marked.parse(markdownContent)}</section>
                <a href="/" class="back-link">← Back to all posts</a>
            </article>
        `;
        contentElement.innerHTML = postHTML;

        // Highlight any code blocks
        if (typeof hljs !== 'undefined') {
            hljs.highlightAll();
        }
    } catch (error) {
        console.error('Error rendering post content:', error);
        contentElement.innerHTML = `
            <article class="post-detail error">
                <h1>${title}</h1>
                <p><strong>Date:</strong> ${datetime}</p>
                <div class="error-message">
                    <p>Error rendering content: ${error.message}</p>
                </div>
                <pre>${markdownContent}</pre>
                <a href="/" class="back-link">← Back to all posts</a>
            </article>
        `;
    }
}