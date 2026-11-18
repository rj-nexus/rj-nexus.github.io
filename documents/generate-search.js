const fs = require('fs');
const path = require('path');

// Qovluq yolları
const contentDir = path.join(__dirname, 'documentation', 'content');
const outputFile = path.join(__dirname, 'documentation', 'search.json');

// Markdown-dan başlığı çıxaran funksiya
function extractTitle(markdown) {
    const match = markdown.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : 'Untitled Document';
}

// Markdown işarələrini təmizləyib sadəcə yazını saxlayan funksiya
function stripMarkdown(markdown) {
    return markdown
        .replace(/^#{1,6}\s+/gm, '') // Başlıqları sil
        .replace(/(\*\*|__)(.*?)\1/g, '$2') // Qalın hərfləri təmizlə
        .replace(/(\*|_)(.*?)\1/g, '$2') // Kursivləri təmizlə
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Linkləri təmizlə (sadəcə mətn qalsın)
        .replace(/`{1,3}[^`]*`{1,3}/g, '') // Kod bloklarını sil (axtarışa daxil olmasın)
        .replace(/```[\s\S]*?```/g, '') // Çoxsətirli kod bloklarını sil
        .replace(/!\[[^\]]*\]\([^\)]+\)/g, '') // Şəkilləri sil
        .replace(/\s+/g, ' ') // Artıq boşluqları tək boşluğa endir
        .trim();
}

// content/ qovluğu varsa, skan edirik
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

    // Nəticəni search.json faylına yazırıq
    fs.writeFileSync(outputFile, JSON.stringify(searchData, null, 2));
    console.log(`✅ Uğurlu! ${files.length} sənəd oxundu və search.json yeniləndi.`);
} else {
    console.error('❌ Xəta: documentation/content qovluğu tapılmadı!');
}
