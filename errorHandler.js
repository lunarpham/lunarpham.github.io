export function renderError(element, { title, message, showDate = false, datetime = null }) {
    if (!element) return;

    element.innerHTML = `
        <div class="container mx-auto lg:px-64">
            <article class="post-detail error mt-8">
                ${title ? `<h1 class="text-4xl font-bold">${title}</h1>` : ''}
                ${showDate && datetime ? `<p><strong>Date:</strong> ${datetime}</p>` : ''}
                <div class="error-message text-center my-4">
                    <p class="uppercase font-bold text-red-500">Error: ${message}</p>
                </div>
            </article>
            <div class="text-center mt-4">
                    <a href="/" class="back-link font-medium text-sm uppercase opacity-75 hover:opacity-100 hover:underline">← Back to all posts</a>
            </div>
        </div>
    `;
}