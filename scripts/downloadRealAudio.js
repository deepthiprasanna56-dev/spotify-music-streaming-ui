import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, '..', 'public', 'audio');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const songs = [
  // Original tracks
  { id: 'track-1', query: 'Blinding Lights The Weeknd', artist: 'The Weeknd' },
  { id: 'track-2', query: 'Levitating Dua Lipa', artist: 'Dua Lipa' },
  { id: 'track-3', query: 'The Less I Know The Better Tame Impala', artist: 'Tame Impala' },
  { id: 'track-4', query: 'bad guy Billie Eilish', artist: 'Billie Eilish' },
  { id: 'track-5', query: 'Starboy The Weeknd', artist: 'The Weeknd' },
  { id: 'track-6', query: 'Midnight City M83', artist: 'M83' },
  { id: 'track-7', query: 'Get Lucky Daft Punk', artist: 'Daft Punk' },
  { id: 'track-8', query: 'HUMBLE Kendrick Lamar', artist: 'Kendrick Lamar' },
  { id: 'track-9', query: 'Pink + White Frank Ocean', artist: 'Frank Ocean' },
  { id: 'track-10', query: 'Don\'t Start Now Dua Lipa', artist: 'Dua Lipa' },
  { id: 'track-11', query: 'Save Your Tears The Weeknd', artist: 'The Weeknd' },
  { id: 'track-12', query: 'Borderline Tame Impala', artist: 'Tame Impala' },
  { id: 'track-13', query: 'Instant Crush Daft Punk', artist: 'Daft Punk' },
  { id: 'track-14', query: 'DNA Kendrick Lamar', artist: 'Kendrick Lamar' },
  { id: 'track-15', query: 'ocean eyes Billie Eilish', artist: 'Billie Eilish' },
  { id: 'track-16', query: 'Lost in Yesterday Tame Impala', artist: 'Tame Impala' },

  // BTS Hits
  { id: 'track-bts-1', query: 'Dynamite BTS', artist: 'BTS' },
  { id: 'track-bts-2', query: 'Butter BTS', artist: 'BTS' },
  { id: 'track-bts-3', query: 'Boy With Luv BTS', artist: 'BTS' },
  { id: 'track-bts-4', query: 'Blood Sweat Tears BTS', artist: 'BTS' },
  { id: 'track-bts-5', query: 'Life Goes On BTS', artist: 'BTS' },
  { id: 'track-bts-6', query: 'Fake Love BTS', artist: 'BTS' },
  { id: 'track-bts-7', query: 'Spring Day BTS', artist: 'BTS' },
  { id: 'track-bts-8', query: 'DNA BTS', artist: 'BTS' },
  { id: 'track-bts-9', query: 'MIC Drop BTS', artist: 'BTS' },
  { id: 'track-bts-10', query: 'Permission to Dance BTS', artist: 'BTS' },

  // Taylor, Sabrina, Bruno, Billie, Kendrick, Post
  { id: 'track-taylor-1', query: 'Cruel Summer Taylor Swift', artist: 'Taylor Swift' },
  { id: 'track-taylor-2', query: 'Anti-Hero Taylor Swift', artist: 'Taylor Swift' },
  { id: 'track-sabrina-1', query: 'Espresso Sabrina Carpenter', artist: 'Sabrina Carpenter' },
  { id: 'track-sabrina-2', query: 'Please Please Please Sabrina Carpenter', artist: 'Sabrina Carpenter' },
  { id: 'track-bruno-1', query: 'Die With A Smile Bruno Mars Lady Gaga', artist: 'Bruno Mars' },
  { id: 'track-post-1', query: 'Sunflower Post Malone Swae Lee', artist: 'Post Malone' },
  { id: 'track-billie-2', query: 'BIRDS OF A FEATHER Billie Eilish', artist: 'Billie Eilish' },
  { id: 'track-kendrick-2', query: 'Not Like Us Kendrick Lamar', artist: 'Kendrick Lamar' },

  // New Global Artists: Drake
  { id: 'track-drake-1', query: 'God\'s Plan Drake', artist: 'Drake' },
  { id: 'track-drake-2', query: 'One Dance Drake', artist: 'Drake' },
  { id: 'track-drake-3', query: 'Hotline Bling Drake', artist: 'Drake' },

  // Bruno Mars
  { id: 'track-bruno-2', query: '24K Magic Bruno Mars', artist: 'Bruno Mars' },
  { id: 'track-bruno-3', query: 'That\'s What I Like Bruno Mars', artist: 'Bruno Mars' },

  // Post Malone
  { id: 'track-post-2', query: 'Circles Post Malone', artist: 'Post Malone' },
  { id: 'track-post-3', query: 'rockstar Post Malone', artist: 'Post Malone' },

  // Ariana Grande
  { id: 'track-ariana-1', query: 'we can\'t be friends Ariana Grande', artist: 'Ariana Grande' },
  { id: 'track-ariana-2', query: '7 rings Ariana Grande', artist: 'Ariana Grande' },
  { id: 'track-ariana-3', query: 'positions Ariana Grande', artist: 'Ariana Grande' },

  // Ed Sheeran
  { id: 'track-ed-1', query: 'Shape of You Ed Sheeran', artist: 'Ed Sheeran' },
  { id: 'track-ed-2', query: 'Perfect Ed Sheeran', artist: 'Ed Sheeran' },
  { id: 'track-ed-3', query: 'Bad Habits Ed Sheeran', artist: 'Ed Sheeran' },

  // Olivia Rodrigo
  { id: 'track-olivia-1', query: 'vampire Olivia Rodrigo', artist: 'Olivia Rodrigo' },
  { id: 'track-olivia-2', query: 'drivers license Olivia Rodrigo', artist: 'Olivia Rodrigo' },
  { id: 'track-olivia-3', query: 'good 4 u Olivia Rodrigo', artist: 'Olivia Rodrigo' },

  // Travis Scott
  { id: 'track-travis-1', query: 'FE!N Travis Scott', artist: 'Travis Scott' },
  { id: 'track-travis-2', query: 'SICKO MODE Travis Scott', artist: 'Travis Scott' },
  { id: 'track-travis-3', query: 'Goosebumps Travis Scott', artist: 'Travis Scott' },

  // Coldplay
  { id: 'track-coldplay-1', query: 'Yellow Coldplay', artist: 'Coldplay' },
  { id: 'track-coldplay-2', query: 'Viva La Vida Coldplay', artist: 'Coldplay' },
  { id: 'track-coldplay-3', query: 'My Universe Coldplay BTS', artist: 'Coldplay' },

  // SZA
  { id: 'track-sza-1', query: 'Kill Bill SZA', artist: 'SZA' },
  { id: 'track-sza-2', query: 'Snooze SZA', artist: 'SZA' },

  // Arijit Singh
  { id: 'track-arijit-1', query: 'Kesariya Arijit Singh', artist: 'Arijit Singh' },
  { id: 'track-arijit-2', query: 'Tum Hi Ho Arijit Singh', artist: 'Arijit Singh' },
  { id: 'track-arijit-3', query: 'Chaleya Arijit Singh', artist: 'Arijit Singh' },
];

async function searchTrack(query, artist, retries = 3) {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=5`;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url);
      const text = await res.text();
      if (text.startsWith('{')) {
        const data = JSON.parse(text);
        if (data.results && data.results.length > 0) {
          const artistLower = artist.toLowerCase();
          const match = data.results.find((r) =>
            r.artistName.toLowerCase().includes(artistLower) || artistLower.includes(r.artistName.toLowerCase())
          );
          return match || data.results[0];
        }
        return null;
      } else {
        // Rate limited or HTML error, wait and retry
        console.log(`      Waiting 1.5s (attempt ${attempt + 1}/${retries})...`);
        await new Promise((r) => setTimeout(r, 1500));
      }
    } catch (e) {
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
  return null;
}

async function downloadFile(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download: ${res.statusText}`);
  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
}

async function main() {
  console.log(`Starting authentic audio preview acquisition for ${songs.length} tracks...`);

  let successCount = 0;

  for (let i = 0; i < songs.length; i++) {
    const item = songs[i];
    const outM4a = path.join(outputDir, `${item.id}.m4a`);

    try {
      if (fs.existsSync(outM4a) && fs.statSync(outM4a).size > 10000) {
        console.log(`[${i + 1}/${songs.length}] Already exists: ${item.id} (${item.query})`);
        successCount++;
        continue;
      }

      console.log(`[${i + 1}/${songs.length}] Searching: ${item.query}...`);
      const result = await searchTrack(item.query, item.artist);

      if (!result || !result.previewUrl) {
        console.warn(`⚠️ No preview found for: ${item.query}`);
        continue;
      }

      console.log(`   Found: "${result.trackName}" by "${result.artistName}"`);
      await downloadFile(result.previewUrl, outM4a);
      const sizeKb = (fs.statSync(outM4a).size / 1024).toFixed(1);
      console.log(`   Saved: ${item.id}.m4a (${sizeKb} KB)`);
      successCount++;

      await new Promise((r) => setTimeout(r, 800));
    } catch (err) {
      console.error(`❌ Error with ${item.id}:`, err.message);
    }
  }

  console.log(`\n🎉 Completed! Successfully acquired ${successCount}/${songs.length} audio tracks.`);
}

main();
