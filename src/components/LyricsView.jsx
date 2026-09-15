import { useEffect, useRef } from 'react';
import { X, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export default function LyricsView() {
  const {
    showLyrics,
    setShowLyrics,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    toggleLike,
    likedTrackIds,
    volume,
    isMuted,
    toggleMute,
    formatTime,
  } = useAudio();

  const containerRef = useRef(null);
  const activeLineRef = useRef(null);

  // Parse lyrics into array of lines
  const rawLyrics = currentTrack?.lyrics || 'No lyrics available for this song.';
  const lyricsLines = rawLyrics.split('\n').filter((l) => l.trim().length > 0);

  // Approximate current line index based on playback progress
  const activeIndex =
    duration > 0 && lyricsLines.length > 0
      ? Math.min(
          lyricsLines.length - 1,
          Math.floor((currentTime / duration) * lyricsLines.length)
        )
      : 0;

  // Auto-scroll active line to center
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex]);

  if (!showLyrics || !currentTrack) return null;

  const isLiked = likedTrackIds.includes(currentTrack.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleLineClick = (idx) => {
    if (duration > 0 && lyricsLines.length > 0) {
      const targetTime = (idx / lyricsLines.length) * duration;
      seek(targetTime);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between overflow-hidden select-none bg-black/95 text-white animate-in fade-in duration-200">
      {/* Dynamic Ambient Background Blur */}
      <div
        className="absolute inset-0 opacity-40 blur-3xl pointer-events-none transform scale-125 transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${currentTrack.color || '#1db954'} 0%, #000000 75%)`,
        }}
      />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between px-6 sm:px-12 py-6 border-b border-white/10 bg-black/30 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-12 h-12 rounded-md object-cover shadow-lg border border-white/10"
          />
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white leading-tight">
              {currentTrack.title}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 font-medium">
              {currentTrack.artist} • {currentTrack.album}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowLyrics(false)}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-transform hover:scale-105"
          aria-label="Close lyrics"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Center: Synced Scrolling Lyrics */}
      <div
        ref={containerRef}
        className="relative z-10 flex-1 overflow-y-auto px-6 sm:px-16 md:px-24 py-16 flex flex-col gap-6 max-w-4xl mx-auto w-full text-center sm:text-left scroll-smooth"
      >
        <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-4">
          Lyrics • Tap any line to jump to that moment
        </div>

        {lyricsLines.map((line, idx) => {
          const isActive = idx === activeIndex;
          const isPassed = idx < activeIndex;

          return (
            <p
              key={idx}
              ref={isActive ? activeLineRef : null}
              onClick={() => handleLineClick(idx)}
              className={`cursor-pointer transition-all duration-300 text-xl sm:text-3xl md:text-4xl font-extrabold leading-snug rounded-lg p-2 ${
                isActive
                  ? 'text-white scale-[1.02] translate-x-1 sm:translate-x-2 drop-shadow-md'
                  : isPassed
                  ? 'text-zinc-500 hover:text-zinc-300'
                  : 'text-zinc-600 hover:text-zinc-400'
              }`}
            >
              {line}
            </p>
          );
        })}
      </div>

      {/* Bottom Floating Player Controls */}
      <div className="relative z-10 px-6 sm:px-12 py-4 bg-black/60 backdrop-blur-md border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Track Title + Like */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleLike(currentTrack.id)}
            className={`p-2 transition-transform active:scale-90 ${
              isLiked ? 'text-[#1db954]' : 'text-zinc-400 hover:text-white'
            }`}
            aria-label="Like track"
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <div className="text-xs text-zinc-400 font-mono">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {/* Center Controls */}
        <div className="flex items-center gap-6">
          <button
            onClick={prevTrack}
            className="text-zinc-400 hover:text-white transition-transform active:scale-90"
            aria-label="Previous"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={togglePlay}
            className="w-11 h-11 rounded-full bg-[#1db954] hover:bg-[#1ed760] text-black flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="text-zinc-400 hover:text-white transition-transform active:scale-90"
            aria-label="Next"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>

        {/* Volume & Close Action */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleMute}
            className="text-zinc-400 hover:text-white transition-colors"
            aria-label="Mute/Unmute"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => setShowLyrics(false)}
            className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
