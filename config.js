export const config = {
    title: "Lunar Blog",
    author: {
        name: "Duy Trưởng Phạm",
        nickname: "Lunar Pham",
        username: "@lunarpham",
        avatar: "/public/avatar256.png",
        banner: "/public/banner.jpg",
        occupation: "VN-UK, The University of Danang",
        location: "Da Nang, Vietnam",
        bio: "/public/description.md",
        social: [
            {
                id: 1,
                label: "GitHub",
                url: "https://github.com/lunarpham",
                icon: "fa-brands fa-github"
            },
            {
                id: 2,
                label: "Twitter/X",
                url: "https://twitter.com/lunarruuna",
                icon: "fa-brands fa-twitter"
            },
            {
                id: 3,
                label: "Facebook",
                url: "https://facebook.com/lunarairisu",
                icon: "fa-brands fa-facebook"
            },
            {
                id: 4,
                label: "Email",
                url: "mailto:ruunapham@gmail.com",
                icon: "fa-solid fa-envelope"
            }
        ]
    },
    routes: [
        {
            id: 1,
            label: 'Home',
            redirectTo: '/',
        },
        {
            id: 2,
            label: 'About me',
            redirectTo: '/?page=about',
        }
    ]
};