import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.join(__dirname, '..', 'public', 'audio');

const remaining = [
  { id: 'track-bts-3', query: 'Boy With Luv BTS' },
  { id: 'track-post-2', query: 'Circles Post Malone' },
  { id: 'track-ariana-2', query: '7 rings Ariana Grande' },
  { id: 'track-ed-3', query: 'Bad Habits Ed Sheeran' },
  { id: 'track-olivia-3', query: 'good 4 u Olivia Rodrigo' },
  { id: 'track-travis-1', query: 'FEIN Travis Scott' },
  { id: 'track-travis-2', query: 'SICKO MODE Travis Scott' },
];

async function run() {
  for (const item of remaining) {
    const outPath = path.join(outputDir, `${item.id}.m4a`);
    if (fs.existsSync(outPath) && fs.statSync(outPath).size > 10000) {
      console.log(`Already have ${item.id}`);
      continue;
    }

    console.log(`Fetching ${item.query}...`);
    try {
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(item.query)}&entity=song&limit=1`);
      const data = await res.json();
      if (data.results && data.results[0] && data.results[0].previewUrl) {
        const fileRes = await fetch(data.results[0].previewUrl);
        const buf = Buffer.from(await fileRes.arrayBuffer());
        fs.writeFileSync(outPath, buf);
        console.log(`✅ Saved ${item.id} (${(buf.length / 1024).toFixed(1)} KB): ${data.results[0].trackName}`);
      } else {
        console.warn(`❌ No preview found for ${item.query}`);
      }
    } catch (err) {
      console.error(`Error on ${item.id}:`, err.message);
    }
    // Wait 3.5 seconds
    await new Promise(r => setTimeout(r, 3500));
  }
  console.log('Finished remaining downloads!');
}

run();
