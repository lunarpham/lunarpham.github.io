export function renderFooter() {
    const footer = document.getElementById('footer');
    footer.innerHTML = `
        <div class="text-center">(c) 2024 - Lunar Pham</div>
        <div class="text-center hover:underline"><a href="#">Back to top</a></div>
    `}