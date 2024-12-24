import { config } from '../config.js';

export function renderHeader() {
    const header = document.getElementById('header');
    header.innerHTML = `
        <div class="container mx-auto md:px-56 profile gap-8 items-center grid lg:grid-cols-10">
            <div class="lg:col-span-2">
                <img src="${config.author.avatar}" alt="${config.author.name}" class="profile-image p-1 rounded-full border-4 border-pink-700 my-4">
            </div>
            <div class="lg:col-span-8">
                <a href="/"><h2 class="font-bold text-xl">${config.author.name}</h2></a>
                <h3 class="opacity-75 text-sm">${config.author.username}</h3>
                <p class="my-2">${config.author.bio}</p>
                <div class="flex flex-row items-center gap-2 opacity-75">
                    <div class="md:basis-1/8">
                        <i class="fa-solid fa-briefcase"></i>
                    </div>
                    <div class="md:basis-7/8">
                        <div class="text-sm">${config.author.occupation}</div>
                    </div>
                </div>
                <div class="flex flex-row items-center gap-2 opacity-75">
                    <div class="md:basis-1/8">
                        <i class="fa-solid fa-location-dot"></i>
                    </div>
                    <div class="md:basis-7/8">
                        <div class="text-sm">${config.author.location}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="divide-y"></div>
    `;
}
