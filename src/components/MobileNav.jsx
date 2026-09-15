import { Home, Search, Library, Play, Pause, Heart } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export default function MobileNav({ currentView, onNavigate }) {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    likedTrackIds,
    toggleLike,
    setShowFullscreen,
  } = useAudio();

  const isLiked = currentTrack ? likedTrackIds.includes(currentTrack.id) : false;
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 select-none">
      {/* Mini Player Docked Above Tab Bar */}
      {currentTrack && (
        <div
          onClick={() => setShowFullscreen(true)}
          className="relative mx-2 mb-1.5 p-2 bg-[#282828]/95 backdrop-blur-md rounded-lg shadow-2xl border border-white/10 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-transform"
        >
          {/* Thin Progress line */}
          <div className="absolute top-0 left-2 right-2 h-0.5 bg-zinc-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1db954]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Track Info */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-10 h-10 rounded object-cover shadow-xs shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-xs text-white truncate">
                {currentTrack.title}
              </div>
              <div className="text-[11px] text-zinc-400 truncate">
                {currentTrack.artist}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => toggleLike(currentTrack.id)}
              className={`p-2 transition-colors ${
                isLiked ? 'text-[#1db954]' : 'text-zinc-400'
              }`}
              aria-label={isLiked ? 'Unlike song' : 'Like song'}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shadow-md active:scale-90 transition-transform"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Tab Bar */}
      <div className="bg-black/95 backdrop-blur-md border-t border-white/10 px-6 py-2 flex items-center justify-around">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            currentView === 'home' ? 'text-white font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => onNavigate('search')}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            currentView === 'search' ? 'text-white font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Search className="w-5 h-5" />
          <span>Search</span>
        </button>

        <button
          onClick={() => onNavigate('library')}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            currentView === 'library' ? 'text-white font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Library className="w-5 h-5" />
          <span>Library</span>
        </button>
      </div>
    </div>
  );
}
