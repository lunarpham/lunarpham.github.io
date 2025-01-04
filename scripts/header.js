import { config } from '../config.js';

export function renderHeader() {
    const header = document.getElementById('header');
    header.innerHTML = `
        <div class="container mx-auto px-4 lg:px-64">
            <div class="h-48 bg-[url('${config.author.banner}')] bg-cover bg-center"></div>
        </div>
        <!--<div class="container flex flex-col items-center px-4 -mt-16 mx-auto lg:text-start lg:px-56 profile gap-4 items-center lg:grid lg:grid-cols-10 mb-4 lg:my-4">
            <div class="md:col-span-3 lg:col-span-2 px-24 lg:px-0">
                <img src="${config.author.avatar}" alt="${config.author.name}" class="profile-image w-full p-1 rounded-full border-4 border-[#7f9d7b] bg-white">
            </div>
            <div class="md:col-span-7 lg:col-span-8">
                <a href="/"><h2 class="font-bold text-xl text-center lg:text-start">${config.author.name}</h2></a>
                <h3 class="opacity-75 text-sm text-center lg:text-start">${config.author.username}</h3>
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
        </div> !-->
        
    `;
}
