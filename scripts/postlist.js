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
        <a href="?post=${post.file.replace('.md', '')}" class="hover:underline">
            <article class="post-summary mt-6 flex md:flex-row-reverse flex-col-reverse">
                <div class="md:basis-3/4">
                    <p class="text-sm opacity-75 mt-2 lg:mt-0">${post.datetime}</p>
                    <h2 class="font-bold mb-1">${post.title}</a></h2>
                    <p class="text-sm">${post.summary}</p>
                </div>
                <div class="md:basis-1/4 md:mr-4">
                    <div class="w-full h-48 lg:h-32 bg-[url('${post.thumbnail}')] bg-cover"></div>  
                </div>      
            </article>
        </a>
    
    `).join('');
    contentElement.innerHTML = `
        <section class="post-list container mx-auto px-4 lg:px-56 py-4">
        <h1 class="font-bold uppercase text-lg">Latest posts</h1>
            ${postListHTML}
        </section>`;
}
