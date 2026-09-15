import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, '..', 'public', 'audio');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate a high quality 16-bit PCM Mono WAV file with multi-layer instruments
function generateTrackWav({
  filename,
  durationSec = 25,
  sampleRate = 22050,
  bpm = 120,
  rootFreq = 261.63, // C4
  scale = [0, 2, 4, 7, 9, 12, 14, 16], // Major pentatonic
  style = 'pop', // 'disco', 'pop', 'hiphop', 'ballad', 'edm', 'rnb', 'rock'
}) {
  const numSamples = Math.floor(sampleRate * durationSec);
  const buffer = Buffer.alloc(44 + numSamples * 2);

  // Write WAV Header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Chunk size
  buffer.writeUInt16LE(1, 20); // Audio format: PCM
  buffer.writeUInt16LE(1, 22); // Mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28); // Byte rate
  buffer.writeUInt16LE(2, 32); // Block align
  buffer.writeUInt16LE(16, 34); // Bits per sample
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);

  const beatsPerSec = bpm / 60;
  const chordSteps = [0, 5, 3, 4]; // I - vi - IV - V progression

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const beat = t * beatsPerSec;
    const beatInBar = beat % 4;
    const barNum = Math.floor(beat / 4);
    const chordRootSemitone = chordSteps[barNum % chordSteps.length];
    const chordBaseFreq = rootFreq * Math.pow(2, chordRootSemitone / 12);

    let sample = 0;

    // 1. Kick Drum
    const kickPhase = beat % 1;
    if (style === 'disco' || style === 'edm' || style === 'pop') {
      const kickFreq = 140 * Math.exp(-kickPhase * 18) + 45;
      const kick = Math.sin(2 * Math.PI * kickFreq * t) * Math.exp(-kickPhase * 10);
      sample += kick * 0.45;
    } else if (style === 'hiphop') {
      const isKickTime = (beatInBar < 0.3) || (beatInBar > 2.4 && beatInBar < 2.7);
      if (isKickTime) {
        const subPhase = (beatInBar < 0.3 ? beatInBar : beatInBar - 2.5) % 1;
        const kickFreq = 110 * Math.exp(-subPhase * 14) + 40;
        const kick = Math.sin(2 * Math.PI * kickFreq * t) * Math.exp(-subPhase * 7);
        sample += kick * 0.5;
      }
    } else {
      const isKickTime = (beatInBar < 0.4) || (beatInBar > 2.0 && beatInBar < 2.4);
      if (isKickTime) {
        const subPhase = (beatInBar < 0.4 ? beatInBar : beatInBar - 2) % 1;
        const kickFreq = 90 * Math.exp(-subPhase * 12) + 40;
        const kick = Math.sin(2 * Math.PI * kickFreq * t) * Math.exp(-subPhase * 8);
        sample += kick * 0.35;
      }
    }

    // 2. Snare / Clap
    const snarePhase = (beatInBar % 2) - 1;
    if (snarePhase >= 0 && snarePhase < 0.35) {
      const noise = (Math.random() * 2 - 1) * Math.exp(-snarePhase * 14);
      const tone = Math.sin(2 * Math.PI * 190 * t) * Math.exp(-snarePhase * 16);
      sample += (noise * 0.28 + tone * 0.22);
    }

    // 3. Hi-Hat
    const hatDivision = style === 'hiphop' ? 4 : 2;
    const hatPhase = (beat * hatDivision) % 1;
    if (hatPhase < 0.15) {
      const hatNoise = (Math.random() * 2 - 1) * Math.exp(-hatPhase * 25);
      sample += hatNoise * 0.12;
    }

    // 4. Bassline
    const bassNoteOffset = (Math.floor(beat * 2) % 4 === 2) ? 7 : 0;
    const bassFreq = (chordBaseFreq / 2) * Math.pow(2, bassNoteOffset / 12);
    const bassEnv = Math.exp(-(beat % 0.5) * 5);
    const bass = (Math.sin(2 * Math.PI * bassFreq * t) + 0.3 * Math.sin(4 * Math.PI * bassFreq * t)) * bassEnv;
    sample += bass * 0.32;

    // 5. Chord Pad
    const pad1 = Math.sin(2 * Math.PI * chordBaseFreq * t);
    const pad2 = Math.sin(2 * Math.PI * (chordBaseFreq * Math.pow(2, 4 / 12)) * t);
    const pad3 = Math.sin(2 * Math.PI * (chordBaseFreq * Math.pow(2, 7 / 12)) * t);
    const pad = (pad1 + pad2 + pad3) / 3;
    sample += pad * 0.18;

    // 6. Melodic Lead Hook
    const melodyIndex = Math.floor(beat * 2) % scale.length;
    const melodySemitone = scale[melodyIndex];
    const melodyFreq = chordBaseFreq * Math.pow(2, (12 + melodySemitone) / 12);
    const melodyEnv = Math.exp(-((beat * 2) % 1) * 3.5);
    const lead = (
      Math.sin(2 * Math.PI * melodyFreq * t) * 0.7 +
      Math.sin(4 * Math.PI * melodyFreq * t) * 0.3
    ) * melodyEnv;
    sample += lead * 0.22;

    const clamped = Math.max(-0.95, Math.min(0.95, sample));
    buffer.writeInt16LE(Math.floor(clamped * 32767), offset);
    offset += 2;
  }

  const filePath = path.join(outputDir, filename);
  fs.writeFileSync(filePath, buffer);
  console.log(`Generated: ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

const trackList = [
  // BTS Songs
  { id: 'track-bts-1', bpm: 114, root: 293.66, style: 'disco', scale: [0, 4, 7, 9, 12, 11, 9, 7] }, // Dynamite
  { id: 'track-bts-2', bpm: 110, root: 277.18, style: 'pop', scale: [0, 2, 4, 7, 9, 12, 9, 4] },    // Butter
  { id: 'track-bts-3', bpm: 120, root: 329.63, style: 'pop', scale: [0, 4, 7, 9, 12, 14, 12, 9] },   // Boy With Luv
  { id: 'track-bts-4', bpm: 105, root: 220.00, style: 'edm', scale: [0, 3, 5, 7, 10, 12, 10, 7] },   // Blood Sweat & Tears
  { id: 'track-bts-5', bpm: 90, root: 246.94, style: 'ballad', scale: [0, 2, 4, 7, 9, 12, 7, 2] },  // Life Goes On
  { id: 'track-bts-6', bpm: 108, root: 233.08, style: 'rock', scale: [0, 3, 5, 7, 8, 12, 10, 7] },   // Fake Love
  { id: 'track-bts-7', bpm: 94, root: 261.63, style: 'ballad', scale: [0, 4, 5, 7, 9, 12, 7, 4] },  // Spring Day
  { id: 'track-bts-8', bpm: 130, root: 293.66, style: 'edm', scale: [0, 2, 4, 7, 9, 12, 14, 12] },  // DNA
  { id: 'track-bts-9', bpm: 100, root: 220.00, style: 'hiphop', scale: [0, 3, 5, 7, 10, 12, 15, 12] }, // Mic Drop
  { id: 'track-bts-10', bpm: 125, root: 277.18, style: 'pop', scale: [0, 2, 4, 7, 9, 11, 12, 9] }, // Permission to Dance

  // Global Hits
  { id: 'track-1', bpm: 128, root: 293.66, style: 'disco', scale: [0, 2, 3, 7, 8, 12, 10, 7] },
  { id: 'track-2', bpm: 124, root: 246.94, style: 'disco', scale: [0, 2, 3, 7, 9, 12, 10, 7] },
  { id: 'track-3', bpm: 116, root: 261.63, style: 'rnb', scale: [0, 3, 5, 7, 10, 12, 7, 3] },
  { id: 'track-4', bpm: 135, root: 246.94, style: 'pop', scale: [0, 3, 5, 6, 7, 10, 12, 7] },
  { id: 'track-5', bpm: 120, root: 261.63, style: 'rnb', scale: [0, 3, 5, 7, 10, 12, 10, 7] },
  { id: 'track-6', bpm: 105, root: 277.18, style: 'edm', scale: [0, 2, 4, 7, 9, 12, 11, 7] },
  { id: 'track-7', bpm: 116, root: 246.94, style: 'disco', scale: [0, 2, 3, 7, 9, 12, 10, 7] },
  { id: 'track-8', bpm: 150, root: 220.00, style: 'hiphop', scale: [0, 3, 5, 7, 10, 12, 7, 3] },
  { id: 'track-9', bpm: 95, root: 261.63, style: 'ballad', scale: [0, 2, 4, 7, 9, 12, 9, 4] },
  { id: 'track-10', bpm: 120, root: 293.66, style: 'disco', scale: [0, 4, 7, 9, 12, 14, 12, 9] },
  { id: 'track-11', bpm: 118, root: 261.63, style: 'rnb', scale: [0, 3, 5, 7, 10, 12, 7, 5] },
  { id: 'track-12', bpm: 85, root: 246.94, style: 'rnb', scale: [0, 2, 4, 7, 9, 12, 7, 4] },
  { id: 'track-13', bpm: 128, root: 261.63, style: 'disco', scale: [0, 4, 7, 9, 12, 9, 7, 4] },
  { id: 'track-14', bpm: 140, root: 220.00, style: 'hiphop', scale: [0, 3, 5, 7, 10, 12, 10, 7] },
  { id: 'track-15', bpm: 120, root: 277.18, style: 'pop', scale: [0, 4, 7, 9, 12, 14, 12, 7] },
  { id: 'track-16', bpm: 90, root: 261.63, style: 'ballad', scale: [0, 2, 4, 7, 9, 12, 7, 2] },
  { id: 'track-taylor-1', bpm: 120, root: 293.66, style: 'pop', scale: [0, 2, 4, 7, 9, 12, 9, 4] },
  { id: 'track-taylor-2', bpm: 112, root: 261.63, style: 'pop', scale: [0, 2, 4, 7, 9, 12, 7, 2] },
  { id: 'track-sabrina-1', bpm: 120, root: 277.18, style: 'pop', scale: [0, 4, 7, 9, 12, 14, 12, 9] },
  { id: 'track-sabrina-2', bpm: 115, root: 261.63, style: 'pop', scale: [0, 2, 4, 7, 9, 12, 7, 4] },
];

console.log(`Generating ${trackList.length} high-fidelity musical audio tracks...`);
for (const track of trackList) {
  generateTrackWav({
    filename: `${track.id}.wav`,
    durationSec: 25,
    bpm: track.bpm,
    rootFreq: track.root,
    scale: track.scale,
    style: track.style,
  });
}
console.log('All audio files generated successfully!');
