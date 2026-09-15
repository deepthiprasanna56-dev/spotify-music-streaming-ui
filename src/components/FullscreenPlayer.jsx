import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import EqualizerBars from './EqualizerBars';

export default function FullscreenPlayer() {
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
    formatTime,
  } = useAudio();

  if (!showFullscreen || !currentTrack) return null;

  const isLiked = likedTrackIds.includes(currentTrack.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between p-6 sm:p-12 overflow-hidden select-none bg-black/95 animate-in fade-in zoom-in-95 duration-200">
      {/* Dynamic Ambient Background Glow */}
      <div
        className="absolute inset-0 opacity-40 blur-3xl pointer-events-none transform scale-150 transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at center, ${currentTrack.color || '#1db954'} 0%, transparent 70%)`,
        }}
      />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-zinc-400 font-semibold">
          <span>Playing from album</span>
          <span className="text-white font-bold">{currentTrack.album}</span>
        </div>

        <button
          onClick={() => setShowFullscreen(false)}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          aria-label="Close fullscreen"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Center: Artwork & Synced Lyrics Preview */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 my-auto max-w-5xl mx-auto w-full">
        {/* Cover Art */}
        <div className="w-64 sm:w-80 md:w-96 aspect-square rounded-xl overflow-hidden shadow-2xl shadow-black/80 border border-white/10 shrink-0 transform hover:scale-[1.02] transition-transform">
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Lyrics & Track Info */}
        <div className="flex flex-col text-left max-w-md w-full">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-1">
                {currentTrack.title}
              </h1>
              <p className="text-base sm:text-lg text-zinc-300 font-medium">
                {currentTrack.artist}
              </p>
            </div>
            <button
              onClick={() => toggleLike(currentTrack.id)}
              className={`p-2 transition-transform active:scale-90 ${
                isLiked ? 'text-[#1db954]' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Heart className={`w-7 h-7 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Equalizer badge */}
          <div className="flex items-center gap-2 mb-6">
            <EqualizerBars isPlaying={isPlaying} size="md" />
            <span className="text-xs text-[#1db954] font-medium tracking-wide">
              {isPlaying ? 'PLAYING NOW' : 'PAUSED'}
            </span>
          </div>

          {/* Lyrics Snippet Card */}
          <div className="p-5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 max-h-48 overflow-y-auto">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Lyrics Preview
            </h4>
            <p className="text-sm sm:text-base text-zinc-200 whitespace-pre-line leading-relaxed font-medium">
              {currentTrack.lyrics || 'Lyrics not available for this track.'}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-10 max-w-2xl mx-auto w-full flex flex-col items-center gap-4">
        {/* Scrubber */}
        <div className="w-full flex items-center gap-3 text-xs font-mono text-zinc-400 tabular-nums">
          <span>{formatTime(currentTime)}</span>
          <div className="relative flex-1 slider-container flex items-center group">
            <div className="absolute left-0 right-0 h-1.5 bg-white/20 rounded-full overflow-hidden pointer-events-none">
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
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="spotify-slider w-full z-10"
            />
          </div>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between w-full max-w-md px-4">
          <button
            onClick={toggleShuffle}
            className={`p-2 transition-colors ${
              isShuffle ? 'text-[#1db954]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button
            onClick={prevTrack}
            className="p-2 text-zinc-300 hover:text-white transition-colors"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>

          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-white hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-xl transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-current" />
            ) : (
              <Play className="w-7 h-7 fill-current ml-1" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="p-2 text-zinc-300 hover:text-white transition-colors"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>

          <button
            onClick={toggleRepeat}
            className={`p-2 transition-colors ${
              repeatMode !== 'off' ? 'text-[#1db954]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-5 h-5" />
            ) : (
              <Repeat className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
