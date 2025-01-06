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
                <div class="lg:basis-3/5 md:basis-2/4 p-6">
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
                    <h2 class="font-bold mb-1 text-lg leading-snug">${post.title}</a></h2>
                    <p class="text-sm">${post.summary}</p>
                </div>
                <div class="lg:basis-2/5 md:basis-2/4">
                    <div class="w-full min-h-52 lg:min-h-52 h-full bg-[url('${post.thumbnail}')] bg-cover bg-center"></div>  
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
