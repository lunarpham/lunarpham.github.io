import { renderHeader } from './scripts/header.js';
import { renderFooter } from "./scripts/footer.js";
import { websiteMapNav } from './scripts/navbar.js';
import { fetchPosts, renderPostList } from './scripts/postlist.js';
import { fetchPostContent, renderPostContent } from './scripts/article.js';

export async function initBlog() {
    try {
        websiteMapNav();
        renderHeader();
        renderFooter();

        const contentElement = document.getElementById('content');
        if (!contentElement) {
            throw new Error('Content element not found in the DOM');
        }

        const urlParams = new URLSearchParams(window.location.search);
        const postFile = urlParams.get('post');

        if (postFile) {
            // Show loading state
            contentElement.innerHTML = '<p>Loading post...</p>';

            try {
                const { metadata, content } = await fetchPostContent(`${postFile}.md`);

                if (!metadata || !metadata.title || !content) {
                    throw new Error('Invalid post data received');
                }

                renderPostContent(metadata.title, metadata.datetime, content);
            } catch (postError) {
                console.error('Error loading post:', postError);
                contentElement.innerHTML = `
                    <div class="error-message">
                        <h2>Error Loading Post</h2>
                        <p>Failed to load the post content: ${postError.message}</p>
                        <a href="/">← Back to all posts</a>
                    </div>
                `;
            }
        } else {
            contentElement.innerHTML = '<p>Loading posts...</p>';

            try {
                const posts = await fetchPosts();
                if (!Array.isArray(posts)) {
                    throw new Error('Invalid posts data received');
                }
                renderPostList(posts);
            } catch (listError) {
                console.error('Error loading post list:', listError);
                contentElement.innerHTML = `
                    <div class="error-message">
                        <h2>Error Loading Posts</h2>
                        <p>Failed to load the post list: ${listError.message}</p>
                    </div>
                `;
            }
        }

        // Initialize code highlighting only if content was successfully loaded
        if (contentElement.querySelector('pre code')) {
            hljs.highlightAll();
        }
    } catch (error) {
        console.error('Critical initialization error:', error);
        document.body.innerHTML = `
            <div class="error-message">
                <h1>Blog Initialization Error</h1>
                <p>Failed to initialize the blog: ${error.message}</p>
            </div>
        `;
    }
}