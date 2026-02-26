javascript: (function () {
    try {
        let images = [];
        const host = window.location.hostname;

        if (host.includes('imgchest.com')) {
            // ImgChest puts direct links in specific image containers
            const links = document.querySelectorAll('.image-container img');
            links.forEach(img => {
                const src = img.getAttribute('src') || img.getAttribute('data-src');
                if (src && src.includes('imgchest.com') && src.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                    images.push(`![](${src.split('?')[0]})`);
                }
            });
            // Try fallback for data-src
            if (images.length === 0) {
                document.querySelectorAll('img[data-src]').forEach(img => {
                    const src = img.getAttribute('data-src');
                    if (src && src.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                        images.push(`![](${src})`);
                    }
                });
            }
        }
        else if (host.includes('catbox.moe')) {
            // Catbox usually lists items in a table with a link, or if it's an album view, it has images.
            // Let's try to find all image elements first
            document.querySelectorAll('img').forEach(img => {
                let src = img.getAttribute('src');
                if (src && src.match(/\.(jpg|jpeg|png|gif|webp)$/i) && !src.includes('logo')) {
                    // Make sure it's an absolute url if it's relative
                    if (src.startsWith('/')) src = 'https://' + host + src;
                    images.push(`![](${src})`);
                }
            });

            // If it's a directory listing or album with links to raw files
            document.querySelectorAll('a').forEach(a => {
                let href = a.getAttribute('href');
                if (href && href.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                    if (href.startsWith('/')) href = 'https://' + host + href;
                    images.push(`![](${href})`);
                }
            });
        } else {
            alert('This bookmarklet only works on ImgChest or Catbox.moe.');
            return;
        }

        // Deduplicate
        images = [...new Set(images)];

        if (images.length === 0) {
            alert('Could not find any images on this page!');
            return;
        }

        const markdownText = images.join('\n');

        // Copy to clipboard
        navigator.clipboard.writeText(markdownText).then(() => {
            alert(`✅ Successfully copied ${images.length} images to clipboard as Markdown!`);
        }).catch(err => {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = markdownText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            alert(`✅ Successfully copied ${images.length} images to clipboard as Markdown!`);
        });

    } catch (error) {
        alert('Error extracting images: ' + error.message);
    }
})();
