const fs = require('fs');
const path = require('path');

// Qovluq yolları
const contentDir = path.join(__dirname, 'documentation', 'content');
const outputDir = path.join(__dirname, 'documentation');
const outputFile = path.join(outputDir, 'search.json');

// Qovluqlar yoxdursa, yaradırıq (Xətanın qarşısını alır)
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}
if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
    console.log('⚠️ content qovluğu yaradıldı. İçinə .md faylları əlavə edin.');
}

function extractTitle(markdown) {
    const match = markdown.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : 'Untitled Document';
}

function stripMarkdown(markdown) {
    return markdown
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/(\*\*|__)(.*?)\1/g, '$2')
        .replace(/(\*|_)(.*?)\1/g, '$2')
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
        .replace(/`{1,3}[^`]*`{1,3}/g, '')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/!\[[^\]]*\]\([^\)]+\)/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

if (fs.existsSync(contentDir)) {
    const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
    
    const searchData = files.map(file => {
        const slug = path.basename(file, '.md');
        const filePath = path.join(contentDir, file);
        const rawContent = fs.readFileSync(filePath, 'utf-8');
        
        return {
            slug: slug,
            title: extractTitle(rawContent),
            content: stripMarkdown(rawContent)
        };
    });

    fs.writeFileSync(outputFile, JSON.stringify(searchData, null, 2));
    console.log(`✅ Uğurlu! ${files.length} sənəd oxundu və search.json yeniləndi.`);
} else {
    console.log('❌ Xəta: content qovluğu tapılmadı!');
}
