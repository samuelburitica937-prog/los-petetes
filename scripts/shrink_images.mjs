import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = 'public/images/catalogos/sexshop';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));

async function processAll() {
    console.log(`Shrinking ${files.length} images...`);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const tmpPath = path.join(dir, 'tmp_' + file);
        
        try {
            await sharp(filePath)
                .resize({ width: 600, withoutEnlargement: true })
                .png({ quality: 80, compressionLevel: 9 })
                .toFile(tmpPath);
                
            fs.unlinkSync(filePath);
            fs.renameSync(tmpPath, filePath);
            console.log(`Shrunk ${file}`);
        } catch (err) {
            console.error(`Failed to shrink ${file}`, err);
        }
    }
    console.log("Done!");
}

processAll();
