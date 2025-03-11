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
        <a href="?post=${post.file.replace('.md', '')}" class="pointer">
            <article class="post-summary mt-4 flex flex-col-reverse align-start border border-black/0 rounded-md md:w-1/2 p-2">
            <div class="flex flex-row gap-2 items-center mb-2">
                        <div class="basis-1/12">
                            <img src="${config.author.avatar}" alt="${config.author.nickname}" class="profile-image w-full rounded-full bg-white">
                        </div>
                        <div class="basis-11/12">
                            <div class="flex gap-1">
                                <div class="text-xs font-medium lg:mt-0">${config.author.nickname}</div>
                                <p class="text-xs opacity-75 lg:mt-0">| ${post.datetime}</p>
                            </div>
                        </div>
                    </div>
                <div class="lg:basis-3/5 md:basis-2/4 py-4">
                    <h2 class="font-semibold mb-1 text-md leading-snug">${post.title}</a></h2>
                    <p class="text-sm">${post.summary}</p>
                </div>
                <div class="lg:basis-2/5 md:basis-2/4">
                    <a href="?post=${post.file.replace('.md', '')}" class="pointer"><div class="w-full min-h-56 lg:min-h-56 h-full bg-cover bg-center rounded-md shadow-sm hover:opacity-75 bg-[url(${post.thumbnail})]""/></div></a>
                </div>
            </article>
        </a>
    
    `).join('');
    contentElement.innerHTML = `
        <section class="post-list container mx-auto lg:px-60 py-4">
        <h1 class="font-bold uppercase text-lg text-center py-1">Latest posts</h1>
            <div class="flex flex-wrap mx-2">
                ${postListHTML}
            </div>  
        </section>`;
}
