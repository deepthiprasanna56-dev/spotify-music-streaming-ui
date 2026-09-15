import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const musicDataPath = path.join(__dirname, '..', 'src', 'data', 'musicData.js');
let content = fs.readFileSync(musicDataPath, 'utf8');

// Replace lyrics: "..." that contain raw newlines with template literals
content = content.replace(/lyrics:\s*"([^"]*?\n[^"]*?)"/g, (match, p1) => {
  return 'lyrics: `' + p1 + '`';
});

fs.writeFileSync(musicDataPath, content, 'utf8');
console.log('Fixed lyrics in musicData.js');
