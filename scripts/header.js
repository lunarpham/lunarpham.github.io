import { config } from '../config.js';

export function renderHeader() {
    const header = document.getElementById('header');
    header.innerHTML = `
        <div class="container mx-auto mt-2 sm:px-4 lg:px-64">
            <div class="h-36 bg-[url('${config.author.banner}')] bg-cover bg-start md:bg-center md:rounded-md md:h-48"></div>
        </div>            
    `;
}
