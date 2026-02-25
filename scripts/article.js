import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';
import { renderError } from '../error.js';
import { config } from '../config.js';

export async function fetchPostContent(file) {
    try {
        const response = await fetch(`./posts/${file}`);
        if (!response.ok) throw new Error(`Failed to load post: ${response.statusText}`);
        const markdown = await response.text();
        const parts = markdown.split('---');
        if (parts.length < 3) throw new Error('Invalid markdown format');
        const frontMatter = parts[1].trim();
        const content = parts.slice(2).join('---').trim();
        const metadata = {};
        for (const line of frontMatter.split('\n')) {
            const [key, ...vals] = line.split(':');
            if (!key || vals.length === 0) continue;
            metadata[key.trim()] = vals.join(':').trim().replace(/["']/g, '');
        }
        if (!metadata.title || !metadata.datetime) throw new Error('Missing required fields');
        return { metadata, content };
    } catch (error) {
        console.error('Error in fetchPostContent:', error);
        throw error;
    }
}

export function renderPostContent(title, datetime, markdownContent, categories = []) {
    const contentElement = document.getElementById('content');
    try {
        marked.use({ breaks: true, gfm: true });

        // Build breadcrumb: Home > Category > Title
        const crumbs = [`<a href="/">Home</a>`];
        if (categories.length > 0) {
            const slug = categories[0];
            const cat = config.categories?.find(c => c.slug === slug);
            const label = cat ? cat.label : slug;
            crumbs.push(`<a href="/?label=${slug}">${label}</a>`);
        }
        crumbs.push(`<span class="breadcrumb-current">${title}</span>`);
        const breadcrumbHTML = crumbs.join('<span class="breadcrumb-sep">›</span>');

        contentElement.innerHTML = `
            <div class="article-container">
                <nav class="breadcrumb" aria-label="Breadcrumb">${breadcrumbHTML}</nav>
                <div class="article-meta">
                    <img src="${config.author.avatar}" alt="${config.author.nickname}">
                    <div>
                        <div class="article-meta-author">${config.author.nickname}</div>
                        <div class="article-meta-date">${datetime}</div>
                    </div>
                </div>
                <h1 class="article-title">${title}</h1>
                <div class="article-content">${marked.parse(markdownContent)}</div>
            </div>
        `;
        if (typeof hljs !== 'undefined') hljs.highlightAll();
    } catch (error) {
        console.error('Error rendering post:', error);
        renderError(contentElement, { message: `Error: ${error.message}` });
    }
}