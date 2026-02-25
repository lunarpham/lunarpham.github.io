# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project overview

This is a small static blog site served as plain HTML/CSS/JS. There is no bundler or framework; everything runs directly in the browser using ES modules and a few CDN-hosted libraries (TailwindCSS, Font Awesome, Highlight.js, and `marked`).

Key pieces:
- `index.html` – root HTML document that wires up Tailwind, fonts, Highlight.js, and loads `init.js` as a module.
- `init.js` – main entrypoint; initializes navigation, header, footer, and decides which page to render based on URL query parameters.
- `config.js` – central configuration for blog metadata, author profile, social links, and navigation routes.
- `scripts/` – modular UI/rendering logic (navbar, header, footer, about page, post list, and article view).
- `posts/` – markdown blog posts with YAML-style front matter.
- `public/` – static assets (author avatar, banner, author bio `description.md`, and generated `posts.json`).
- `updatePostList.js` – Node script to (re)generate `public/posts.json` from markdown files in `posts/`.

There is no README or testing/linting configuration in this repo.

## Running and developing

There is no formal build step; everything is static.

### Local development / preview

From the repository root (`E:/Documents/Web Applications/lunar-blog`):

- Open `index.html` directly in a browser, **or** serve the folder with any static HTTP server (recommended so that `fetch` calls to `/posts/...` and `./public/posts.json` work):
  - Example with Node (if installed):
    - `npx serve .`
    - or `npx http-server .`

These commands are suggestions; the project itself does not define any npm scripts.

### Regenerating the post list JSON

Whenever you add, remove, or change markdown files in `posts/`, re-run the `updatePostList.js` script from the project root to regenerate `public/posts.json`:

- `node updatePostList.js`

`updatePostList.js`:
- Scans `./posts` for `.md` files.
- Parses each file’s front matter to extract `title`, `datetime`, `thumbnail`, and `summary`.
- Cleans these values and writes a sorted array of post metadata to `./public/posts.json` (sorted descending by `datetime`).

### Tests, linting, and build tooling

- No tests, linters, or build pipelines are currently configured in this repository.
- There is no `package.json`; use system Node only for running `updatePostList.js` or ad-hoc scripts.

## Content model and generation

### Markdown posts (`posts/*.md`)

Each blog post is a markdown file under `posts/` with a simple front-matter header and body content, e.g.:

```markdown
---
title: "..."
datetime: "YYYY-MM-DD"
thumbnail: "https://..."
summary: "Short description..."
---
<markdown body>
```

Important expectations derived from the code:
- `scripts/article.js` **requires** valid front matter with at least `title` and `datetime`. If these are missing or the `---` delimiters are wrong, viewing the post will throw an error.
- `updatePostList.js` assumes the four keys `title`, `datetime`, `thumbnail`, and `summary` exist in the front matter; missing values are replaced with safe defaults when generating `posts.json`.
- The body can use GitHub-flavored markdown; rendering is handled by `marked` with `gfm` and `breaks` enabled.

### Author bio (`public/description.md`)

- `scripts/about.js` loads `config.author.bio` (currently `/public/description.md`) and passes it through `marked`.
- The rendered HTML is inserted into the About page as the “Introduction” section.

### Generated post index (`public/posts.json`)

- Consumed at runtime by `scripts/postlist.js` via `fetch('./public/posts.json')`.
- Each entry contains:
  - `file` – base filename (used as `?post=${file}` in URLs).
  - `title` – display title.
  - `datetime` – display date string; also used for sorting.
  - `thumbnail` – image URL for card background.
  - `summary` – short description for the list view.

## Front-end architecture

### Entry and routing logic (`index.html` + `init.js`)

- `index.html` defines four key root containers: `#navbar`, `#header`, `#content`, and `#footer`.
- `init.js` is loaded as a module and exports `initBlog`, which is invoked on `DOMContentLoaded`.
- `initBlog`:
  - Calls `websiteMapNav()`, `renderHeader()`, and `renderFooter()` to render chrome.
  - Reads `page` and `post` from `window.location.search`.
    - If `page=about`, it calls `renderAboutPage()` and returns.
    - If `post` is present, it shows a loading state, then:
      - Calls `fetchPostContent('<post>.md')` to load markdown and parse front matter.
      - On success, calls `renderPostContent(title, datetime, content)`.
      - On failure, logs the error and calls `renderError()` with a “Post not found” message.
    - If neither is present, it:
      - Sets `#content` to “Loading posts...”.
      - Calls `fetchPosts()` to load `public/posts.json`.
      - Validates that the result is an array and calls `renderPostList(posts)`.
      - On failure, logs the error and calls `renderError()` with a “Failed to load the post list” message.
  - After rendering, if `#content` contains `pre code` elements, it calls `hljs.highlightAll()`.
  - On any critical error, it logs and calls `renderError(document.body, ...)` with a generic initialization error.

### Layout and shared components (`scripts/*.js`)

- `scripts/navbar.js` (`websiteMapNav`):
  - Uses `config.routes` for navigation links and `config.author.social` for external icons.
  - Renders both desktop and mobile layouts.
  - Adds a simple toggle to show/hide the mobile menu (`#nav-toggle`, `#nav-content`).

- `scripts/header.js` (`renderHeader`):
  - Uses `config.author.banner` as a CSS background image for the header banner.

- `scripts/footer.js` (`renderFooter`):
  - Static footer with © text and a “Back to top” anchor.

- `scripts/about.js`:
  - Loads the author bio markdown (`config.author.bio`).
  - Builds an About page with avatar, name, username, location, occupation, and social links from `config.author`.
  - Uses `marked` and `hljs.highlightAll()` for markdown and code highlighting.
  - Exposes `renderAbout()` and `renderAboutPage()`; `renderAboutPage()` is invoked from `init.js` when `page=about`.

- `scripts/postlist.js`:
  - `fetchPosts()` fetches and JSON-parses `./public/posts.json`; on error it logs and returns an empty array.
  - `renderPostList(posts)` builds a card layout for each post, using `config.author.avatar` and `post.thumbnail`.
  - The list view links to `?post=${post.file}` for each post.

- `scripts/article.js`:
  - `fetchPostContent(file)` fetches `/posts/${file}`.
    - Splits content on `---` to extract front matter and body.
    - Parses front matter into a plain object (keys are strings; quotes stripped).
    - Requires `metadata.title` and `metadata.datetime`.
  - `renderPostContent(title, datetime, markdownContent)`:
    - Renders the full article view, including author avatar and metadata.
    - Uses `marked.parse` to convert the markdown body to HTML.
    - Calls `hljs.highlightAll()` if available.

- `scripts/projects.js` is currently empty.

### Error handling (`errorHandler.js`)

- `renderError(element, { title, message, showDate = false, datetime = null })`:
  - Safely no-ops if `element` is falsy.
  - Injects a consistent error UI into the target element.
  - Optionally shows a date and includes a link back to the homepage.
- Used by `init.js`, `about.js`, and `article.js` to display human-friendly error messages.

## Configuration and deployment notes

- `config.js` is the single source of truth for blog metadata, author profile, navigation routes, and social links. Changes here affect navbar links, About page content, and various templates that consume `config.author`.
- `CNAME` contains the custom domain `lunarpham.me`, implying deployment on GitHub Pages or a similar static host. Any deployment process should preserve `CNAME` at the root of the published site.

## Guidelines for future Warp agents

- When adding posts, ensure front matter keys (`title`, `datetime`, `thumbnail`, `summary`) remain consistent with existing posts and keep the `---` delimiters intact.
- After modifying files in `posts/`, run `node updatePostList.js` so the homepage list stays in sync.
- Be cautious about changing URL structures (query parameter names or paths like `/posts/` and `./public/posts.json`), as they are hard-coded in multiple scripts.
- There are no automated tests; if you add any, prefer keeping them as standalone scripts or introduce a minimal `package.json` rather than adding heavy tooling unless the repository owner explicitly wants that.
