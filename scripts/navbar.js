import { config } from '../config.js';

const navlinks = [
    {
        id: 1,
        label: 'Home',
        redirectTo: '/',
        icon: 'fa-house'
    },
    {
        id: 2,
        label: 'Contact',
        redirectTo: '/contact',
        icon: 'fa-address-card'
    },
    {
        id: 3,
        label: 'Projects',
        redirectTo: 'https://github.com/lunarpham?tab=repositories',
        icon: 'fa-list-check'
    }
]

export function websiteMapNav() {
    const navigator = document.getElementById('navbar');
    navigator.innerHTML=`
            <div class="container" id="navbar-default">
                <ul class="font-bold text-sm uppercase flex justify-center items-center gap-24 lg:gap-8 w-full px-4 lg:px-56">
                    ${navlinks.map(link => `
                        <li>
                            <a href="${link.redirectTo}"
                               class="block py-2 opacity-75 hover:opacity-100 hover:underline">
                                <div class="flex flex-row items-center gap-2">
                                    <div class="lg:basis-1/8">
                                        <i class="fa-solid ${link.icon}"></i>
                                    </div>
                                    <div class="hidden lg:block lg:basis-7/8">
                                        <div>${link.label}</div>
                                    </div>
                                </div>
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `
}
