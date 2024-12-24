import { renderHeader } from './scripts/header.js';
import { renderFooter } from "./scripts/footer.js";
import { websiteMapNav } from './scripts/navbar.js';
import { renderError } from './errorHandler.js';
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
            contentElement.innerHTML = '<p>Loading post...</p>';

            try {
                const { metadata, content } = await fetchPostContent(`${postFile}.md`);

                if (!metadata || !metadata.title || !content) {
                    throw new Error('Invalid post data received');
                }

                renderPostContent(metadata.title, metadata.datetime, content);
            } catch (postError) {
                console.error('Error loading post:', postError);
                renderError(contentElement, {
                    message: 'Post not found'
                });
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
                renderError(contentElement, {
                    message: `Failed to load the post list: ${listError.message}`
                });
            }
        }

        if (contentElement.querySelector('pre code')) {
            hljs.highlightAll();
        }
    } catch (error) {
        console.error('Critical initialization error:', error);
        renderError(document.body, {
            title: 'Blog Initialization Error',
            message: `Failed to initialize the blog: ${error.message}`
        });
    }
}
