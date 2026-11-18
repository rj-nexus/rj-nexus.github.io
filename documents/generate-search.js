const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, 'documentation', 'content');
const outputDir = path.join(__dirname, 'documentation');
const outputFile = path.join(outputDir, 'search.json');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
    console.log('content folder created. Add .md files.');
    process.exit(0);
}

function extractTitle(markdown, slug) {
    const h1 = markdown.match(/^#\s+(.+?)\s*$/m);
    if (h1) return h1[1].trim();
    const h2 = markdown.match(/^##\s+(.+?)\s*$/m);
    if (h2) return h2[1].trim();
    return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function extractHeadings(markdown) {
    const matches = markdown.matchAll(/^#{1,6}\s+(.+?)\s*$/gm);
    return Array.from(matches).map(m => m[1].trim()).join(' | ');
}

function cleanContent(markdown) {
    return markdown
        .replace(/^---[\s\S]*?---\n/, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '$1')
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
        .replace(/(\*\*|__)(.+?)\1/g, '$2')
        .replace(/(\*|_)(.+?)\1/g, '$2')
        .replace(/```\w*\s*/g, ' ')
        .replace(/```/g, ' ')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/^>\s*/gm, '')
        .replace(/^\s*[-*+]\s+/gm, '')
        .replace(/^\s*\d+\.\s+/gm, '')
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function makeExcerpt(content, maxLen = 200) {
    if (content.length <= maxLen) return content;
    const cut = content.slice(0, maxLen);
    const lastSpace = cut.lastIndexOf(' ');
    return cut.slice(0, lastSpace > 100 ? lastSpace : maxLen) + '...';
}

const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));

const searchData = files.map(file => {
    const slug = path.basename(file, '.md');
    const filePath = path.join(contentDir, file);
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const clean = cleanContent(rawContent);
    const headings = extractHeadings(rawContent);

    return {
        slug,
        title: extractTitle(rawContent, slug),
        headings,
        content: clean,
        excerpt: makeExcerpt(clean)
    };
});

fs.writeFileSync(outputFile, JSON.stringify(searchData, null, 2));
console.log(`Success: ${files.length} documents processed`);
