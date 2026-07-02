const fs = require('fs');
const path = require('path');

const css = fs.readFileSync('styles.css', 'utf-8');

// A simple regex to find sections denoted by /* ... */
// and save them into separate files.
const sections = css.split(/\/\*\s*(.*?)\s*\*\//g);

let variablesAndBase = sections[0];
fs.writeFileSync('src/styles/base.css', variablesAndBase.trim());

let mainImports = `@import './base.css';\n`;

for (let i = 1; i < sections.length; i += 2) {
  const sectionName = sections[i].trim().toLowerCase().replace(/[^a-z0-9]/g, '-');
  const sectionContent = sections[i + 1].trim();
  
  if (sectionContent) {
    const filename = `components/${sectionName}.css`;
    fs.writeFileSync(`src/styles/${filename}`, `/* ${sections[i]} */\n${sectionContent}\n`);
    mainImports += `@import './${filename}';\n`;
  }
}

fs.writeFileSync('src/styles/main.css', mainImports);
console.log('CSS split complete.');
