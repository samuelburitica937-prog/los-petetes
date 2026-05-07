import fs from 'fs';
let content = fs.readFileSync('lib/imported_data.ts', 'utf-8');
content = content.replace(/"rating": 5/g, '"rating": 0');
content = content.replace(/"vendidos": 100/g, '"vendidos": 0');
fs.writeFileSync('lib/imported_data.ts', content);
