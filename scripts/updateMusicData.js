import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const musicDataPath = path.join(__dirname, '..', 'src', 'data', 'musicData.js');
let content = fs.readFileSync(musicDataPath, 'utf8');

// Replace all SoundHelix URLs with /audio/<id>.wav
content = content.replace(
  /id: '([^']+)',\s+title: '([^']+)',[\s\S]*?audioSrc: '[^']+'/g,
  (match, id) => {
    return match.replace(/audioSrc: '[^']+'/, `audioSrc: '/audio/${id}.wav'`);
  }
);

// 5 New BTS tracks to insert
const newBtsTracks = `  {
    id: 'track-bts-6',
    title: 'Fake Love',
    artist: 'BTS',
    artistId: 'artist-bts',
    album: 'Love Yourself: Tear',
    duration: '4:02',
    durationSec: 242,
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=85',
    audioSrc: '/audio/track-bts-6.wav',
    plays: '812,490,200',
    lyrics: "널 위해서라면 난\n슬퍼도 기쁜 척 할 수가 있었어\n널 위해서라면 난\n아파도 강한 척 할 수가 있었어\n사랑이 사랑만으로 완벽하길\n내 모든 약점들은 다 숨겨지길\n이뤄지지 않는 꿈속에서\n피울 수 없는 꽃을 키웠어\nI'm so sick of this fake love, fake love, fake love\nI'm so sorry but it's fake love, fake love, fake love",
    color: '#3b82f6',
  },
  {
    id: 'track-bts-7',
    title: 'Spring Day',
    artist: 'BTS',
    artistId: 'artist-bts',
    album: 'You Never Walk Alone',
    duration: '4:34',
    durationSec: 274,
    cover: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=85',
    audioSrc: '/audio/track-bts-7.wav',
    plays: '620,119,400',
    lyrics: "보고 싶다\n이렇게 말하니까 더 보고 싶다\n너희 사진을 보고 있어도\n보고 싶다\n너무 야속한 시간\n나는 우리가 밉다\n이젠 얼굴 한 번 보는 것 조차\n힘겨워진 우리가\n여긴 온통 겨울 뿐이야\n8월에도 겨울이 와\n마음은 시간을 달려가네\n홀로 남은 설국열차\n니 손 잡고 지구 반대편까지 가\n겨울을 끝내고파",
    color: '#06b6d4',
  },
  {
    id: 'track-bts-8',
    title: 'DNA',
    artist: 'BTS',
    artistId: 'artist-bts',
    album: 'Love Yourself: Her',
    duration: '3:43',
    durationSec: 223,
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=85',
    audioSrc: '/audio/track-bts-8.wav',
    plays: '945,830,100',
    lyrics: "첫눈에 널 알아보게 됐어\n서롤 불러왔던 것처럼\n내 혈관 속 DNA가 말해줘\n내가 찾아 헤매던 너라는 걸\n우리 만남은 수학의 공식\n종교의 율법 우주의 섭리\n내게 주어진 운명의 증거\n너는 내 꿈의 출처\nTake it, take it\n너에게 내민 내 손은 정해진 숙명\n걱정하지 마 love\n이 모든 건 우연이 아니니까",
    color: '#eab308',
  },
  {
    id: 'track-bts-9',
    title: 'Mic Drop (Steve Aoki Remix)',
    artist: 'BTS',
    artistId: 'artist-bts',
    album: 'Love Yourself: Her',
    duration: '3:58',
    durationSec: 238,
    cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=85',
    audioSrc: '/audio/track-bts-9.wav',
    plays: '740,290,500',
    lyrics: "Yeah, 누가 내 수저 더럽대\nI don't care, 마이크 잡음 금수저 여럿 패\n버럭해 잘 못 익은 것들 스태키 여러 개\n거듭해서 씹어줄게 스타의 저녁에\nWorld business 핵심\n섭외 1순위 매진\n매각 없는 클라스 가치를 누려\n좋은 향기에 악취는 반칙\nMic mic bungee, bright lights 전진\n망할 것 같았겠지만 I'm fine, sorry\n미안해 Billboard, 미안해 worldwide\n아들이 넘 잘나가서 미안해 엄마",
    color: '#ef4444',
  },
  {
    id: 'track-bts-10',
    title: 'Permission to Dance',
    artist: 'BTS',
    artistId: 'artist-bts',
    album: 'Butter',
    duration: '3:07',
    durationSec: 187,
    cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&auto=format&fit=crop&q=85',
    audioSrc: '/audio/track-bts-10.wav',
    plays: '830,440,200',
    lyrics: "It's the thought of being young\nWhen your heart's just like a drum\nBeating at the pace of our emotions\nThere's no need to talk the talk, just walk the walk tonight\n'Cause we don't need permission to dance\nThere's always something that's standing in the way\nBut if you don't let it faze ya\nYou'll know just how to break\nJust keep the right vibe, yeah\n'Cause there's no looking back\nThere ain't no one to prove\nWe don't need permission to dance!",
    color: '#a855f7',
  },`;

// Insert after track-bts-5
if (!content.includes('track-bts-6')) {
  content = content.replace(
    /(\{\s+id: 'track-bts-5'[\s\S]*?color: '#06b6d4',\s+\},)/,
    `$1\n${newBtsTracks}`
  );
}

// Update BTS Artist popularTrackIds
content = content.replace(
  /popularTrackIds:\s*\['track-bts-1',\s*'track-bts-2',\s*'track-bts-3',\s*'track-bts-4',\s*'track-bts-5'\],/,
  "popularTrackIds: ['track-bts-1', 'track-bts-2', 'track-bts-3', 'track-bts-4', 'track-bts-5', 'track-bts-6', 'track-bts-7', 'track-bts-8', 'track-bts-9', 'track-bts-10'],"
);

// Update This Is BTS Playlist trackIds
content = content.replace(
  /id: 'this-is-bts'[\s\S]*?trackIds:\s*\[[^\]]+\]/,
  (match) => {
    return match.replace(
      /trackIds:\s*\[[^\]]+\]/,
      "trackIds: ['track-bts-1', 'track-bts-2', 'track-bts-3', 'track-bts-4', 'track-bts-5', 'track-bts-6', 'track-bts-7', 'track-bts-8', 'track-bts-9', 'track-bts-10']"
    );
  }
);

// Make sure all soundhelix is gone
content = content.replaceAll(
  /https:\/\/www\.soundhelix\.com\/examples\/mp3\/SoundHelix-[^']+\.mp3/g,
  '/audio/track-1.wav'
);

fs.writeFileSync(musicDataPath, content, 'utf8');
console.log('musicData.js updated successfully!');
