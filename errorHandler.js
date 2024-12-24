export function renderError(element, { title, message, showDate = false, datetime = null }) {
    if (!element) return;

    element.innerHTML = `
        <div class="container mx-auto md:px-56">
            <article class="post-detail error mt-4">
                ${title ? `<h1 class="text-4xl font-bold">${title}</h1>` : ''}
                ${showDate && datetime ? `<p><strong>Date:</strong> ${datetime}</p>` : ''}
                <div class="error-message text-center my-4">
                    <p class="uppercase font-bold text-red-500">Error: ${message}</p>
                </div>
                <div class="w-full flex items-center justify-center my-6 border-t-2 border-black/25">
                    <a href="/" class="back-link mt-2 font-bold text-sm uppercase opacity-75 hover:opacity-100 hover:underline">← Back to all posts</a>
                </div>
            </article>
        </div>
    `;
}