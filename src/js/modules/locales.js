export const locales = {
    en: {
        // Navbar & Layout
        searchPlaceholder: "Looking for something?",
        searchMobilePlaceholder: "Search...",
        sitemap: "Sitemap",
        disclaimer: "Disclaimer",
        allRightsReserved: "All rights reserved.",
        toggleTheme: "Toggle theme",
        toggleSidebar: "Toggle sidebar",
        search: "Search",
        menu: "Menu",
        themeDisclaimer: "Theme inspired by Plus UI with the help of Gemini for CSS",

        // Post List & Search
        resultsFor: "Results for: ",
        noResults: "No results found",
        in: "in",
        general: "General",
        latestPosts: "Latest Posts",
        labelFilter: "Label: ",
        published: "Published",
        readMore: "Read more",
        noPostsFound: "No posts found.",

        // Article & Categories
        loading: "Loading article...",
        postNotFound: "Post not found",
        aboutThisBlog: "About this blog",
        labels: "Labels",
        home: "Home",
        introduction: "Introduction",
        whereToFind: "Where to find",

        // Config defaults
        routeHome: "Home",
        routeAbout: "About me",

        // Categories (slug placeholders)
        "anime-review": "Anime Review",
        "yuri-manga": "Yuri Manga",
        "technology": "Technology",
        "tutorial": "Tutorial",

        // Error
        backToHome: "Back to Home",
        backToPosts: "Back to all posts",
        errorOccurred: "An error occurred",
        failedToLoadAbout: "Failed to load about page",

        // Bookmarks
        bookmarkPosts: "Bookmark Posts",
        noBookmarks: "No bookmarks yet.",
        removeBookmark: "Remove bookmark",
        addedBookmark: "Added to bookmarks",
        removedBookmark: "Removed from bookmarks",
        bookmarkLimitReached: "Bookmark limit reached (10 max)",
        shareWith: "Share with other apps",
        orCopyLink: "or copy link",

        // Search & Pagination
        showMoreResults: "Show more results",
        previous: "Previous",
        next: "Next"
    },
    vi: {
        // Navbar & Layout
        searchPlaceholder: "Bạn đang tìm gì đó?",
        searchMobilePlaceholder: "Tìm kiếm...",
        sitemap: "Sơ đồ trang",
        disclaimer: "Tuyên bố miễn trừ",
        allRightsReserved: "Mọi quyền được bảo lưu.",
        toggleTheme: "Chuyển giao diện",
        toggleSidebar: "Chuyển sidebar",
        search: "Tìm kiếm",
        menu: "Trình đơn",
        themeDisclaimer: "Giao diện lấy cảm hứng từ Plus UI với sự hỗ trợ CSS của Gemini",

        // Post List & Search
        resultsFor: "Kết quả cho: ",
        noResults: "Không tìm thấy kết quả nào",
        in: "thư mục",
        general: "Chung",
        latestPosts: "Bài đăng mới nhất",
        labelFilter: "Chủ đề: ",
        published: "Đã đăng",
        readMore: "Đọc thêm",
        noPostsFound: "Không có bài đăng nào.",

        // Article & Categories
        loading: "Đang tải bài viết...",
        postNotFound: "Không tìm thấy bài viết",
        aboutThisBlog: "Về blog này",
        labels: "Chủ đề",
        home: "Trang chủ",
        introduction: "Giới thiệu",
        whereToFind: "Liên hệ",

        // Config defaults
        routeHome: "Trang chủ",
        routeAbout: "Giới thiệu",

        // Categories
        "anime-review": "Đánh giá Anime",
        "yuri-manga": "Manga Yuri",
        "technology": "Công nghệ",
        "tutorial": "Hướng dẫn",

        // Error
        backToHome: "Về trang chủ",
        backToPosts: "Quay lại tất cả bài viết",
        errorOccurred: "Đã xảy ra lỗi",
        failedToLoadAbout: "Không thể tải trang giới thiệu",

        // Bookmarks
        bookmarkPosts: "Bài viết đã lưu",
        noBookmarks: "Chưa có bài viết nào.",
        removeBookmark: "Bỏ lưu",
        addedBookmark: "Đã thêm vào mục lưu",
        removedBookmark: "Đã xóa khỏi mục lưu",
        bookmarkLimitReached: "Đã đạt giới hạn lưu (tối đa 10)",
        shareWith: "Chia sẻ với ứng dụng khác",
        orCopyLink: "hoặc sao chép liên kết",

        // Search & Pagination
        showMoreResults: "Xem thêm kết quả",
        previous: "Trước",
        next: "Tiếp"
    }
};

export function getLang() {
    return localStorage.getItem('lang') || 'en';
}

export function setLang(lang) {
    localStorage.setItem('lang', lang);
    document.documentElement.setAttribute('lang', lang);
}

export function t(key) {
    const lang = getLang();
    return locales[lang]?.[key] || key;
}
