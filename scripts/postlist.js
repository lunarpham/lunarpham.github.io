export async function fetchPosts() {
    try {
        const response = await fetch('./public/posts.json');
        if (!response.ok) throw new Error('Failed to fetch posts list');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export function renderPostList(posts) {
    const contentElement = document.getElementById('content');
    const postListHTML = posts.map(post => `
        <article class="post-summary">
            <h2><a href="?post=${post.file.replace('.md', '')}">${post.title}</a></h2>
            <p><strong>Date:</strong> ${post.datetime}</p>
            <img src="${post.thumbnail}"/>
            <p>${post.summary}</p>
        </article>
    `).join('');
    contentElement.innerHTML = `<section class="post-list">${postListHTML}</section>`;
}
