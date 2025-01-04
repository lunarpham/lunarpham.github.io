export function renderFooter() {
    const footer = document.getElementById('footer');
    footer.innerHTML = `
        <div class="w-full mt-20 py-6 bg-[#111723] text-white float-end">
            <div class="text-center uppercase font-medium text-sm">(c) 2024 - Lunar Pham</div>
            <div class="text-center uppercase font-medium text-sm hover:underline"><a href="#">Back to top</a></div>
        </div>
        
    `}