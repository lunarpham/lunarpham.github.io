const BOOKMARKS_KEY = 'lunar_bookmarks';

export function getBookmarks() {
    try {
        const stored = localStorage.getItem(BOOKMARKS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

export function isBookmarked(postId) {
    const bookmarks = getBookmarks();
    return bookmarks.some(b => b.id === postId);
}

export function toggleBookmark(post) {
    let bookmarks = getBookmarks();
    const existingIndex = bookmarks.findIndex(b => b.id === post.id);
    if (existingIndex >= 0) {
        bookmarks.splice(existingIndex, 1);
    } else {
        bookmarks.push({
            id: post.id,
            title: post.title,
            url: post.url,
            thumbnail: post.thumbnail,
            categoryLabel: post.categoryLabel
        });
    }
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    // Trigger custom event so other components can update
    window.dispatchEvent(new Event('bookmarks-updated'));
}

export function removeBookmark(postId) {
    let bookmarks = getBookmarks();
    bookmarks = bookmarks.filter(b => b.id !== postId);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    window.dispatchEvent(new Event('bookmarks-updated'));
}
