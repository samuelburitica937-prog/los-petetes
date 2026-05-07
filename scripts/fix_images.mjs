import fs from 'fs';
import path from 'path';

const fileStr = fs.readFileSync('lib/sexshop_data.ts', 'utf-8');
const files = fs.readdirSync('public/images/catalogos/sexshop');

// Find all image urls in the file:
const regex = /\/images\/catalogos\/sexshop\/([^"]+)\.png/g;

let updatedFile = fileStr;

// Create a mapping from expected name to actual file
const mapping = {};

for (const match of fileStr.matchAll(regex)) {
    const rawName = match[1] + '.png';
    let cleanName = rawName.replace(/\*/g, '').replace(/\//g, '_');
    
    // Some manual cleanups based on observed mismatches
    if (cleanName.includes(' (C23009)')) {
        cleanName = cleanName.replace(' (C23009)', '');
    }

    if (!files.includes(cleanName)) {
        // Try to find a partial match
        const partial = files.find(f => f.replace('.png', '').includes(cleanName.replace('.png', '')) || cleanName.replace('.png', '').includes(f.replace('.png', '')));
        if (partial) {
            cleanName = partial;
        } else {
            console.log("Still missing:", rawName, "-> tried:", cleanName);
        }
    }

    if (files.includes(cleanName)) {
        updatedFile = updatedFile.replace(match[0], `/images/catalogos/sexshop/${cleanName}`);
    }
}

fs.writeFileSync('lib/sexshop_data.ts', updatedFile);
console.log("Finished updating sexshop_data.ts");
