import { config } from '../config.js';
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
        <a href="?post=${post.file.replace('.md', '')}">
            <article class="post-summary mt-4 flex md:flex-row-reverse flex-col-reverse border border-black/0 bg-white hover:border-black/25">
                <div class="md:basis-3/5 py-6 px-4">
                    <div class="flex flex-row gap-2 items-center mb-2">
                        <div class="basis-1/12">
                            <img src="${config.author.avatar}" alt="${config.author.nickname}" class="profile-image w-full rounded-full bg-white">
                        </div>
                        <div class="basis-11/12">
                            <div class="flex flex-col gap-0">
                                <div class="text-xs font-medium lg:mt-0">${config.author.nickname}</div>
                                <p class="text-xs opacity-75 lg:mt-0">${post.datetime}</p>
                            </div>
                        </div>
                    </div>
                    <h2 class="font-bold mb-1 text-lg">${post.title}</a></h2>
                    <p class="text-sm">${post.summary}</p>
                </div>
                <div class="md:basis-2/5 md:mr-4">
                    <div class="w-full h-48 lg:h-48 bg-[url('${post.thumbnail}')] bg-cover"></div>  
                </div>      
            </article>
        </a>
    
    `).join('');
    contentElement.innerHTML = `
        <section class="post-list container mx-auto px-4 lg:px-64 py-4">
        <h1 class="font-bold uppercase text-lg text-center py-1">Latest posts</h1>
            ${postListHTML}
        </section>`;
}
