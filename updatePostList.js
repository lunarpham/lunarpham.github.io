const fs = require('fs');
const path = require('path');

const postsDir = './posts';
const output = './public/posts.json';

// Function to clean strings of quotes and slashes
function cleanString(str) {
    return str
        .replace(/["']/g, '') // Remove quotes
        .replace(/\//g, '')   // Remove forward slashes
        .trim();
}

function cleanURL(str) {
    return str
        .replace(/["']/g, '') // Remove quotes
        .trim();
}

const posts = fs.readdirSync(postsDir)
    .filter(file => file.endsWith('.md'))
    .map(file => {
        const filePath = path.join(postsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const [metadata] = content.match(/---[\s\S]+?---/) || [''];
        const titleMatch = metadata.match(/title:\s*(.+)/);
        const datetimeMatch = metadata.match(/datetime:\s*(.+)/);
        const thumbnailMatch = metadata.match(/thumbnail:\s*(.+)/);
        const summaryMatch = metadata.match(/summary:\s*(.+)/);

        return {
            file: cleanString(file.replace('.md', '')),
            title: titleMatch ? cleanString(titleMatch[1]) : 'Untitled',
            datetime: datetimeMatch ? cleanString(datetimeMatch[1]) : 'Unknown Date',
            thumbnail: thumbnailMatch ? cleanURL(thumbnailMatch[1]) : 'https://i.imgur.com/ereERid.png' ,
            summary: summaryMatch ? cleanString(summaryMatch[1]) : 'No summary available.'
        };
    });

// Sort posts by datetime in descending order (newest first)
posts.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

fs.writeFileSync(output, JSON.stringify(posts, null, 2));