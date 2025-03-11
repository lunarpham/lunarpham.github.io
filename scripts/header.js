import { config } from '../config.js';

export function renderHeader() {
    const header = document.getElementById('header');
    header.innerHTML = `
        <div class="container mx-auto mt-2 sm:px-4 lg:px-64">
            <div class="h-48 bg-[url('${config.author.banner}')] bg-cover bg-center rounded-md"></div>
        </div>            
    `;
}
