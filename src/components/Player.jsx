import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
  Heart,
  Maximize2,
  ListMusic,
  Mic2,
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import EqualizerBars from './EqualizerBars';

export default function Player({ onSelectArtist }) {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    likedTrackIds,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    nextTrack,
    prevTrack,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    showFullscreen,
    setShowFullscreen,
    showQueue,
    setShowQueue,
    showLyrics,
    setShowLyrics,
    formatTime,
  } = useAudio();

  if (!currentTrack) return null;

  const isLiked = likedTrackIds.includes(currentTrack.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeekChange = (e) => {
    const val = parseFloat(e.target.value);
    seek(val);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
  };

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-20 sm:h-[88px] bg-[#181818]/95 backdrop-blur-md border-t border-white/10 px-3 sm:px-6 flex items-center justify-between z-40 select-none">
      {/* LEFT: Current Track Info */}
      <div className="flex items-center gap-3 w-1/4 min-w-[140px] sm:min-w-[180px]">
        <div className="relative group shrink-0">
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded object-cover shadow-md"
          />
          <button
            onClick={() => setShowFullscreen(!showFullscreen)}
            className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Expand view"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs sm:text-sm text-white truncate hover:underline cursor-pointer">
              {currentTrack.title}
            </span>
            {isPlaying && <EqualizerBars size="sm" isPlaying={isPlaying} />}
          </div>
          <button
            onClick={() => onSelectArtist && onSelectArtist(currentTrack.artistId)}
            className="text-[11px] sm:text-xs text-zinc-400 hover:text-white hover:underline truncate block text-left transition-colors"
          >
            {currentTrack.artist}
          </button>
        </div>

        <button
          onClick={() => toggleLike(currentTrack.id)}
          className={`p-1.5 transition-colors shrink-0 ${
            isLiked ? 'text-[#1db954]' : 'text-zinc-400 hover:text-white'
          }`}
          aria-label={isLiked ? 'Unlike song' : 'Like song'}
        >
          <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* CENTER: Player Controls & Scrub Bar */}
      <div className="flex flex-col items-center max-w-[45%] w-full flex-1 px-2 sm:px-4">
        {/* Buttons Row */}
        <div className="flex items-center gap-3 sm:gap-6 mb-1.5 sm:mb-2">
          {/* Shuffle */}
          <button
            onClick={toggleShuffle}
            className={`transition-colors relative ${
              isShuffle ? 'text-[#1db954]' : 'text-zinc-400 hover:text-white'
            }`}
            aria-label="Shuffle"
          >
            <Shuffle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {isShuffle && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#1db954]" />
            )}
          </button>

          {/* Previous */}
          <button
            onClick={prevTrack}
            className="text-zinc-400 hover:text-white active:scale-90 transition-all"
            aria-label="Previous track"
          >
            <SkipBack className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
          </button>

          {/* Big Play / Pause */}
          <button
            onClick={togglePlay}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-lg transition-transform"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            ) : (
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
            )}
          </button>

          {/* Next */}
          <button
            onClick={nextTrack}
            className="text-zinc-400 hover:text-white active:scale-90 transition-all"
            aria-label="Next track"
          >
            <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
          </button>

          {/* Repeat */}
          <button
            onClick={toggleRepeat}
            className={`transition-colors relative ${
              repeatMode !== 'off' ? 'text-[#1db954]' : 'text-zinc-400 hover:text-white'
            }`}
            aria-label="Repeat"
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Repeat className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
            {repeatMode !== 'off' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#1db954]" />
            )}
          </button>
        </div>

        {/* Progress Scrubber */}
        <div className="w-full flex items-center gap-2 text-[11px] font-mono text-zinc-400 tabular-nums">
          <span className="w-9 text-right">{formatTime(currentTime)}</span>

          <div className="relative flex-1 slider-container flex items-center group">
            {/* Visual Track Bar */}
            <div className="absolute left-0 right-0 h-1 bg-zinc-700 rounded-full overflow-hidden pointer-events-none group-hover:h-1.5 transition-all">
              <div
                className="h-full bg-white group-hover:bg-[#1db954] transition-colors"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.5}
              value={currentTime}
              onChange={handleSeekChange}
              className="spotify-slider w-full z-10 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Track progress"
            />
          </div>

          <span className="w-9 text-left">{formatTime(duration)}</span>
        </div>
      </div>

      {/* RIGHT: Tools, Volume, Fullscreen */}
      <div className="flex items-center justify-end gap-2 sm:gap-3 w-1/4 min-w-[120px] sm:min-w-[180px]">
        {/* Lyrics */}
        <button
          onClick={() => setShowLyrics(!showLyrics)}
          className={`p-1.5 rounded-full transition-colors ${
            showLyrics ? 'text-[#1db954]' : 'text-zinc-400 hover:text-white'
          }`}
          aria-label="Lyrics"
        >
          <Mic2 className="w-4 h-4" />
        </button>

        {/* Queue */}
        <button
          onClick={() => setShowQueue(!showQueue)}
          className={`p-1.5 rounded-full transition-colors ${
            showQueue ? 'text-[#1db954]' : 'text-zinc-400 hover:text-white'
          }`}
          aria-label="Queue"
        >
          <ListMusic className="w-4 h-4" />
        </button>

        {/* Volume */}
        <div className="hidden sm:flex items-center gap-2 group w-24 sm:w-28">
          <button
            onClick={toggleMute}
            className="text-zinc-400 hover:text-white transition-colors"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            <VolumeIcon className="w-4 h-4" />
          </button>

          <div className="relative flex-1 slider-container flex items-center group">
            <div className="absolute left-0 right-0 h-1 bg-zinc-700 rounded-full overflow-hidden pointer-events-none group-hover:h-1.5 transition-all">
              <div
                className="h-full bg-white group-hover:bg-[#1db954] transition-colors"
                style={{ width: `${isMuted ? 0 : volume * 100}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="spotify-slider w-full z-10 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Volume"
            />
          </div>
        </div>

        {/* Fullscreen Player Toggle */}
        <button
          onClick={() => setShowFullscreen(!showFullscreen)}
          className="text-zinc-400 hover:text-white transition-colors p-1"
          aria-label="Fullscreen player"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
}
