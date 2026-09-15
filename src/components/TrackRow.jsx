import { Play, Pause, Heart, MoreHorizontal } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import EqualizerBars from './EqualizerBars';

export default function TrackRow({
  track,
  index,
  onPlay,
  onSelectArtist,
  showAlbum = true,
  showDateAdded = false,
  dateAdded = '2 days ago',
  showPlays = false,
}) {
  const { currentTrack, isPlaying, togglePlay, likedTrackIds, toggleLike, showToast } = useAudio();

  const isCurrentTrack = currentTrack?.id === track.id;
  const isLiked = likedTrackIds.includes(track.id);

  const handleRowClick = () => {
    if (isCurrentTrack) {
      togglePlay();
    } else if (onPlay) {
      onPlay();
    }
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    toggleLike(track.id);
  };

  const handleArtistClick = (e) => {
    e.stopPropagation();
    if (onSelectArtist && track.artistId) {
      onSelectArtist(track.artistId);
    }
  };

  const handleMoreClick = (e) => {
    e.stopPropagation();
    showToast(`Options for "${track.title}"`);
  };

  return (
    <div
      onClick={handleRowClick}
      className={`group flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 rounded-md hover:bg-white/10 transition-colors cursor-pointer text-xs sm:text-sm select-none ${
        isCurrentTrack ? 'bg-white/10' : ''
      }`}
    >
      {/* Index / Play / Equalizer */}
      <div className="w-6 sm:w-8 flex items-center justify-center shrink-0">
        {isCurrentTrack ? (
          isPlaying ? (
            <div className="group-hover:hidden">
              <EqualizerBars isPlaying={true} />
            </div>
          ) : (
            <span className="text-[#1db954] font-medium text-xs sm:text-sm group-hover:hidden">
              {index + 1}
            </span>
          )
        ) : (
          <span className="text-zinc-400 group-hover:hidden text-xs sm:text-sm">
            {index + 1}
          </span>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRowClick();
          }}
          className="hidden group-hover:flex items-center justify-center text-white hover:scale-110 transition-transform"
          aria-label={isCurrentTrack && isPlaying ? 'Pause' : 'Play'}
        >
          {isCurrentTrack && isPlaying ? (
            <Pause className="w-4 h-4 fill-current text-white" />
          ) : (
            <Play className="w-4 h-4 fill-current text-white ml-0.5" />
          )}
        </button>
      </div>

      {/* Track Art & Title */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <img
          src={track.cover}
          alt={track.title}
          className="w-10 h-10 rounded object-cover shadow-sm shrink-0"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <div
            className={`font-semibold truncate text-xs sm:text-sm ${
              isCurrentTrack ? 'text-[#1db954]' : 'text-white group-hover:text-white'
            }`}
          >
            {track.title}
          </div>
          <button
            onClick={handleArtistClick}
            className="text-xs text-zinc-400 hover:text-white hover:underline truncate block text-left transition-colors"
          >
            {track.artist}
          </button>
        </div>
      </div>

      {/* Plays Count (Optional, for Artist Profile) */}
      {showPlays && (
        <div className="hidden md:block w-32 text-right text-xs text-zinc-400 truncate">
          {track.plays}
        </div>
      )}

      {/* Album (Optional) */}
      {showAlbum && (
        <div className="hidden md:block flex-1 min-w-0 text-xs text-zinc-400 truncate hover:text-white transition-colors">
          {track.album}
        </div>
      )}

      {/* Date Added (Optional) */}
      {showDateAdded && (
        <div className="hidden lg:block w-28 text-xs text-zinc-400 truncate">
          {dateAdded}
        </div>
      )}

      {/* Actions: Heart, Duration, More */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0 text-xs text-zinc-400">
        <button
          onClick={handleLikeClick}
          className={`p-1 transition-colors ${
            isLiked
              ? 'text-[#1db954]'
              : 'text-zinc-400 opacity-0 group-hover:opacity-100 hover:text-white'
          }`}
          aria-label={isLiked ? 'Unlike song' : 'Like song'}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        <span className="w-10 text-right tabular-nums text-zinc-400">
          {track.duration}
        </span>

        <button
          onClick={handleMoreClick}
          className="p-1 text-zinc-400 opacity-0 group-hover:opacity-100 hover:text-white transition-opacity"
          aria-label="More options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
