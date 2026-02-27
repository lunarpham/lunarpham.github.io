const BOOKMARKS_KEY = 'lunar_bookmarks';
export const MAX_BOOKMARKS = 20;

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

/**
 * Toggle a bookmark. Returns:
 * - 'added' if bookmark was added
 * - 'removed' if bookmark was removed
 * - 'limit' if bookmark limit was reached and nothing was added
 */
export function toggleBookmark(post) {
    let bookmarks = getBookmarks();
    const existingIndex = bookmarks.findIndex(b => b.id === post.id);
    let result;
    if (existingIndex >= 0) {
        bookmarks.splice(existingIndex, 1);
        result = 'removed';
    } else {
        if (bookmarks.length >= MAX_BOOKMARKS) {
            return 'limit';
        }
        bookmarks.push({
            id: post.id,
            title: post.title,
            url: post.url,
            thumbnail: post.thumbnail,
            categoryLabel: post.categoryLabel
        });
        result = 'added';
    }
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    // Trigger custom event so other components can update
    window.dispatchEvent(new Event('bookmarks-updated'));
    return result;
}

export function removeBookmark(postId) {
    let bookmarks = getBookmarks();
    bookmarks = bookmarks.filter(b => b.id !== postId);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    window.dispatchEvent(new Event('bookmarks-updated'));
}
