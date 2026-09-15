import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { tracks, playlists as initialPlaylists } from '../data/musicData';

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(tracks[0].durationSec || 200);
  const [volume, setVolumeState] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'
  const [queue, setQueue] = useState(tracks);
  const [queueIndex, setQueueIndex] = useState(0);

  // Modals & Panels
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Custom User Playlists (persisted)
  const [customPlaylists, setCustomPlaylists] = useState(() => {
    try {
      const saved = localStorage.getItem('spotify_custom_playlists');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const allPlaylists = [...initialPlaylists, ...customPlaylists];

  // Local storage persisted state
  const [likedTrackIds, setLikedTrackIds] = useState(() => {
    try {
      const saved = localStorage.getItem('spotify_liked_tracks');
      return saved ? JSON.parse(saved) : ['track-1', 'track-2', 'track-3', 'track-5', 'track-7', 'track-9', 'track-bts-1', 'track-bts-2'];
    } catch {
      return ['track-1', 'track-2', 'track-3', 'track-5', 'track-7', 'track-9', 'track-bts-1', 'track-bts-2'];
    }
  });

  const [followedArtistIds, setFollowedArtistIds] = useState(() => {
    try {
      const saved = localStorage.getItem('spotify_followed_artists');
      return saved ? JSON.parse(saved) : ['artist-the-weeknd', 'artist-dua-lipa', 'artist-bts'];
    } catch {
      return ['artist-the-weeknd', 'artist-dua-lipa', 'artist-bts'];
    }
  });

  const audioRef = useRef(null);
  const synthIntervalRef = useRef(null);
  const audioCtxRef = useRef(null);
  const isUsingSynthRef = useRef(false);

  // Persist liked songs
  useEffect(() => {
    try {
      localStorage.setItem('spotify_liked_tracks', JSON.stringify(likedTrackIds));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }, [likedTrackIds]);

  // Persist followed artists
  useEffect(() => {
    try {
      localStorage.setItem('spotify_followed_artists', JSON.stringify(followedArtistIds));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }, [followedArtistIds]);

  // Toast helper
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
  }, []);

  const hideToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  // Web Audio Synthesizer Fallback: guarantees music output in any environment
  const playSynthNote = useCallback((freq = 440, type = 'sine', durationSec = 0.3) => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }
      if (!audioCtxRef.current) return;
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const targetVol = isMuted ? 0 : volume * 0.2;
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(targetVol, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationSec);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + durationSec);
    } catch (err) {
      console.warn('Synth error:', err);
    }
  }, [isMuted, volume]);

  // Start synthetic rhythm when audio cannot load
  const startSynthFallback = useCallback(() => {
    if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
    isUsingSynthRef.current = true;

    // Pleasant pentatonic chord progression frequencies (C, E, G, A, D)
    const scale = [261.63, 329.63, 392.00, 440.00, 523.25, 659.25];
    let step = 0;

    synthIntervalRef.current = setInterval(() => {
      const note1 = scale[step % scale.length];
      const note2 = scale[(step + 2) % scale.length];
      playSynthNote(note1, 'triangle', 0.4);
      playSynthNote(note2 / 2, 'sine', 0.6); // bass note
      step++;

      setCurrentTime((prev) => {
        if (prev >= (currentTrack?.durationSec || 200)) {
          nextTrack();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  }, [playSynthNote, currentTrack]);

  const stopSynthFallback = useCallback(() => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    isUsingSynthRef.current = false;
  }, []);

  // Initialize HTML5 Audio instance
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(Math.floor(audio.duration));
      }
    };

    const handleTimeUpdate = () => {
      if (!isUsingSynthRef.current) {
        setCurrentTime(Math.floor(audio.currentTime));
      }
    };

    const handleEnded = () => {
      handleTrackEnd();
    };

    const handleError = () => {
      // If network / CORS blocked audio source, automatically use melodic Web Audio fallback
      console.log('Audio stream unreachable. Engaging audio synthesizer fallback.');
      if (isPlaying) {
        startSynthFallback();
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      stopSynthFallback();
    };
  }, []);

  // Update track audio source when currentTrack changes (if not already set)
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    const curSrc = audioRef.current.src || '';
    if (!curSrc.includes(currentTrack.audioSrc)) {
      stopSynthFallback();
      setCurrentTime(0);
      setDuration(currentTrack.durationSec || 200);

      audioRef.current.src = currentTrack.audioSrc;
      audioRef.current.volume = isMuted ? 0 : volume;

      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            startSynthFallback();
          });
        }
      }
    }
  }, [currentTrack]);

  // Volume & Mute handling
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle track ending logic based on repeatMode
  const handleTrackEnd = useCallback(() => {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      setCurrentTime(0);
    } else {
      nextTrack();
    }
  }, [repeatMode]);

  // Play / Pause toggle
  const togglePlay = useCallback(() => {
    if (!currentTrack) return;

    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      stopSynthFallback();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      if (audioRef.current && audioRef.current.src) {
        const promise = audioRef.current.play();
        if (promise !== undefined) {
          promise.catch(() => {
            startSynthFallback();
          });
        }
      } else {
        startSynthFallback();
      }
    }
  }, [isPlaying, currentTrack, startSynthFallback, stopSynthFallback]);

  // Play specific track, optionally setting queue
  const playTrack = useCallback((track, newQueue = null, index = -1) => {
    if (!track) return;

    if (newQueue && Array.isArray(newQueue)) {
      setQueue(newQueue);
      const idx = index >= 0 ? index : newQueue.findIndex((t) => t.id === track.id);
      setQueueIndex(idx >= 0 ? idx : 0);
    } else {
      const existingIdx = queue.findIndex((t) => t.id === track.id);
      if (existingIdx !== -1) {
        setQueueIndex(existingIdx);
      } else {
        setQueue((prev) => [track, ...prev]);
        setQueueIndex(0);
      }
    }

    // If same track is already playing/paused
    if (currentTrack && currentTrack.id === track.id) {
      if (!isPlaying) {
        togglePlay();
      }
      return;
    }

    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(track.durationSec || 200);
    stopSynthFallback();

    if (audioRef.current) {
      audioRef.current.src = track.audioSrc;
      audioRef.current.currentTime = 0;
      audioRef.current.volume = isMuted ? 0 : volume;
      const promise = audioRef.current.play();
      if (promise !== undefined) {
        promise.catch(() => {
          startSynthFallback();
        });
      }
    } else {
      startSynthFallback();
    }
  }, [queue, currentTrack, isPlaying, togglePlay, stopSynthFallback, startSynthFallback, isMuted, volume]);

  // Create Custom Playlist
  const createPlaylist = useCallback((newPlaylist) => {
    const playlist = {
      id: `custom-playlist-${Date.now()}`,
      title: newPlaylist.title || `My Playlist #${customPlaylists.length + 1}`,
      description: newPlaylist.description || 'Custom playlist created by you.',
      cover: newPlaylist.cover || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=85',
      saves: '1 save',
      owner: 'Alex Rivera',
      gradient: newPlaylist.gradient || 'from-emerald-950 via-zinc-900 to-black',
      accentColor: newPlaylist.accentColor || '#10b981',
      trackIds: newPlaylist.trackIds || ['track-bts-1', 'track-1', 'track-2', 'track-bts-2'],
    };
    setCustomPlaylists((prev) => {
      const updated = [...prev, playlist];
      try {
        localStorage.setItem('spotify_custom_playlists', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
    showToast(`Created playlist "${playlist.title}"`);
    return playlist.id;
  }, [customPlaylists.length, showToast]);

  // Next Track
  const nextTrack = useCallback(() => {
    if (queue.length === 0) return;

    let nextIdx = queueIndex + 1;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else if (nextIdx >= queue.length) {
      if (repeatMode === 'all') {
        nextIdx = 0;
      } else {
        setIsPlaying(false);
        if (audioRef.current) audioRef.current.pause();
        stopSynthFallback();
        return;
      }
    }

    setQueueIndex(nextIdx);
    setCurrentTrack(queue[nextIdx]);
    setIsPlaying(true);
  }, [queue, queueIndex, isShuffle, repeatMode, stopSynthFallback]);

  // Previous Track
  const prevTrack = useCallback(() => {
    if (queue.length === 0) return;

    if (currentTime > 3 && audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) {
      prevIdx = queue.length - 1;
    }

    setQueueIndex(prevIdx);
    setCurrentTrack(queue[prevIdx]);
    setIsPlaying(true);
  }, [queue, queueIndex, currentTime]);

  // Seek position
  const seek = useCallback((timeSec) => {
    const clamped = Math.max(0, Math.min(timeSec, duration));
    setCurrentTime(clamped);
    if (audioRef.current && !isUsingSynthRef.current) {
      audioRef.current.currentTime = clamped;
    }
  }, [duration]);

  // Volume slider
  const setVolume = useCallback((val) => {
    const v = Math.max(0, Math.min(1, val));
    setVolumeState(v);
    if (isMuted && v > 0) setIsMuted(false);
  }, [isMuted]);

  // Mute toggle
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // Shuffle toggle
  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => {
      const next = !prev;
      showToast(next ? 'Shuffle turned on' : 'Shuffle turned off');
      return next;
    });
  }, [showToast]);

  // Repeat toggle (off -> all -> one -> off)
  const toggleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === 'off') {
        showToast('Repeat all enabled');
        return 'all';
      }
      if (prev === 'all') {
        showToast('Repeat track enabled');
        return 'one';
      }
      showToast('Repeat disabled');
      return 'off';
    });
  }, [showToast]);

  // Like track toggle
  const toggleLike = useCallback((trackId) => {
    const targetId = trackId || currentTrack?.id;
    if (!targetId) return;

    setLikedTrackIds((prev) => {
      const exists = prev.includes(targetId);
      const updated = exists ? prev.filter((id) => id !== targetId) : [...prev, targetId];
      showToast(exists ? 'Removed from your Liked Songs' : 'Added to your Liked Songs');
      return updated;
    });
  }, [currentTrack, showToast]);

  // Follow artist toggle
  const toggleFollow = useCallback((artistId) => {
    if (!artistId) return;

    setFollowedArtistIds((prev) => {
      const exists = prev.includes(artistId);
      const updated = exists ? prev.filter((id) => id !== artistId) : [...prev, artistId];
      showToast(exists ? 'Removed from your Library' : 'Saved to your Library');
      return updated;
    });
  }, [showToast]);

  // Format seconds into MM:SS
  const formatTime = (secs) => {
    if (isNaN(secs) || secs === undefined) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const value = {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    queue,
    queueIndex,
    likedTrackIds,
    followedArtistIds,
    showFullscreen,
    showQueue,
    showLyrics,
    toastMessage,
    allPlaylists,
    customPlaylists,
    createPlaylist,
    showPremiumModal,
    setShowPremiumModal,
    showCreatePlaylistModal,
    setShowCreatePlaylistModal,
    playTrack,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    nextTrack,
    prevTrack,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    toggleFollow,
    setShowFullscreen,
    setShowQueue,
    setShowLyrics,
    showToast,
    hideToast,
    formatTime,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
