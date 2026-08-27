const fs = require('fs');
const path = require('path');
const dir = 'd:/Projects/kidsWorld/kidsWorld/web/src/pages/parent';
const files = fs.readdirSync(dir);

for (const file of files) {
  if (file.endsWith('.tsx')) {
    const fullPath = path.join(dir, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    const title = file.replace('Page.tsx', '');
    // Regex matches the broken PageHeader line
    content = content.replace(/<PageHeader title=".*?" description=\{Viewing records for child ID: \\\} \/>/g, `<PageHeader title="${title}" description={"Viewing records for child ID: " + (selectedChildId || "None")} />`);
    fs.writeFileSync(fullPath, content);
  }
}
console.log("Fixed files!");
