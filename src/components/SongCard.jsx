import { Play, Pause } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export default function SongCard({
  image,
  title,
  subtitle,
  isCircle = false,
  onClick,
  onPlay,
  isPlayingThis = false,
  badge = null,
}) {
  const { isPlaying, togglePlay } = useAudio();

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (isPlayingThis) {
      togglePlay();
    } else if (onPlay) {
      onPlay();
    }
  };

  return (
    <article
      onClick={onClick}
      className="song-card group relative p-3.5 bg-[#181818]/80 hover:bg-[#282828] rounded-md transition-all duration-300 cursor-pointer flex flex-col hover:shadow-xl select-none"
    >
      {/* Cover Image Container */}
      <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-md shadow-md bg-zinc-900">
        <img
          src={image}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            isCircle ? 'rounded-full' : 'rounded-md'
          }`}
          loading="lazy"
        />

        {badge && (
          <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-black/60 backdrop-blur-sm text-white">
            {badge}
          </span>
        )}

        {/* Floating Green Play Button with Slide-Up */}
        <div
          className={`play-overlay absolute bottom-2 right-2 ${
            isPlayingThis && isPlaying ? 'opacity-100 transform-none' : ''
          }`}
        >
          <button
            onClick={handlePlayClick}
            className="w-11 h-11 rounded-full bg-[#1db954] hover:bg-[#1ed760] text-black flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all"
            aria-label={isPlayingThis && isPlaying ? 'Pause' : 'Play'}
          >
            {isPlayingThis && isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col min-h-[44px]">
        <h3
          className={`font-bold text-sm truncate mb-1 transition-colors ${
            isPlayingThis ? 'text-[#1db954]' : 'text-white group-hover:text-white'
          }`}
        >
          {title}
        </h3>
        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
          {subtitle}
        </p>
      </div>
    </article>
  );
}
