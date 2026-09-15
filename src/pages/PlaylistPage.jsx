import { useState } from 'react';
import { Play, Pause, Heart, Clock, MoreHorizontal, Download, ArrowDownCircle, CheckCircle2, Share2, ListPlus } from 'lucide-react';
import { playlists, tracks, userProfile } from '../data/musicData';
import { useAudio } from '../context/AudioContext';
import TrackRow from '../components/TrackRow';

export default function PlaylistPage({ playlistId, onSelectArtist }) {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    playTrack,
    likedTrackIds,
    toggleLike,
    showToast,
    allPlaylists,
  } = useAudio();

  // Find playlist or render Liked Songs
  const isLikedPage = playlistId === 'liked-songs';

  const playlist = isLikedPage
    ? {
        id: 'liked-songs',
        title: 'Liked Songs',
        description: 'All of your favorite tracks saved in your personal collection.',
        owner: userProfile.name,
        saves: 'Only you',
        gradient: 'from-violet-900 via-indigo-950 to-black',
        accentColor: '#8b5cf6',
        cover: null, // use gradient heart
      }
    : (allPlaylists && allPlaylists.find((p) => p.id === playlistId)) || playlists.find((p) => p.id === playlistId) || playlists[0];

  // Resolve tracks
  const playlistTracks = isLikedPage
    ? tracks.filter((t) => likedTrackIds.includes(t.id))
    : tracks.filter((t) => playlist.trackIds?.includes(t.id));

  const isCurrentPlaylistPlaying =
    isPlaying && playlistTracks.some((t) => t.id === currentTrack?.id);

  const handlePlayPlaylist = () => {
    if (playlistTracks.length === 0) return;

    if (isCurrentPlaylistPlaying) {
      togglePlay();
    } else {
      playTrack(playlistTracks[0], playlistTracks, 0);
    }
  };

  const [isSaved, setIsSaved] = useState(true);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const handleToggleSave = () => {
    setIsSaved((prev) => {
      const next = !prev;
      showToast(next ? `Saved "${playlist.title}" to Your Library` : `Removed "${playlist.title}" from Your Library`);
      return next;
    });
  };

  const handleDownload = () => {
    setIsDownloaded((prev) => {
      const next = !prev;
      showToast(next ? `Downloaded "${playlist.title}" for offline playback` : `Removed offline download for "${playlist.title}"`);
      return next;
    });
  };

  return (
    <div className="pb-36 md:pb-28 select-none animate-in fade-in duration-300">
      {/* Dynamic Header with Ambient Color Glow */}
      <div
        className={`bg-gradient-to-b ${
          isLikedPage
            ? 'from-indigo-900 via-zinc-950 to-black'
            : playlist.gradient || 'from-emerald-950 via-zinc-950 to-black'
        } p-6 sm:p-8 pt-8 sm:pt-12 text-white`}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 max-w-6xl">
          {/* Cover Art */}
          <div className="w-44 sm:w-56 h-44 sm:h-56 rounded-lg overflow-hidden shadow-2xl shrink-0 bg-zinc-900 border border-white/10">
            {isLikedPage ? (
              <div className="w-full h-full bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 flex items-center justify-center shadow-inner">
                <Heart className="w-20 h-20 fill-current text-white" />
              </div>
            ) : (
              <img
                src={playlist.cover}
                alt={playlist.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <span className="text-xs uppercase font-extrabold tracking-widest text-zinc-300">
              Playlist
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight my-2 leading-none">
              {playlist.title}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 max-w-2xl mb-4 font-medium">
              {playlist.description}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-xs text-zinc-300 font-medium">
              <span className="font-bold text-white">{playlist.owner || 'Soundwave'}</span>
              <span>•</span>
              <span>{playlist.saves} saves</span>
              <span>•</span>
              <span className="font-semibold text-white">
                {playlistTracks.length} songs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="px-4 sm:px-8 pt-6">
        {/* Actions Bar */}
        <div className="flex items-center gap-6 mb-6">
          <button
            onClick={handlePlayPlaylist}
            disabled={playlistTracks.length === 0}
            className="w-14 h-14 rounded-full bg-[#1db954] hover:bg-[#1ed760] disabled:bg-zinc-700 text-black flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all"
            aria-label={isCurrentPlaylistPlaying ? 'Pause playlist' : 'Play playlist'}
          >
            {isCurrentPlaylistPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-0.5" />
            )}
          </button>

          {!isLikedPage && (
            <button
              onClick={handleToggleSave}
              className={`transition-colors ${
                isSaved ? 'text-[#1db954] hover:text-[#1ed760]' : 'text-zinc-400 hover:text-white'
              }`}
              aria-label={isSaved ? 'Remove from Library' : 'Save to Library'}
            >
              <Heart className={`w-8 h-8 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          )}

          <button
            onClick={handleDownload}
            className={`transition-colors ${
              isDownloaded ? 'text-[#1db954] hover:text-[#1ed760]' : 'text-zinc-400 hover:text-white'
            }`}
            aria-label="Download playlist"
          >
            {isDownloaded ? (
              <CheckCircle2 className="w-8 h-8 fill-current" />
            ) : (
              <ArrowDownCircle className="w-8 h-8" />
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowOptionsMenu((prev) => !prev)}
              className="p-1 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              aria-label="More options"
            >
              <MoreHorizontal className="w-7 h-7" />
            </button>

            {showOptionsMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowOptionsMenu(false)}
                />
                <div className="absolute left-0 mt-2 w-52 bg-[#282828] rounded-md shadow-2xl border border-white/10 py-1.5 z-50 text-xs text-zinc-200">
                  <button
                    onClick={() => {
                      showToast(`Added ${playlistTracks.length} tracks to queue`);
                      setShowOptionsMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-white/10 hover:text-white flex items-center gap-2 transition-colors"
                  >
                    <ListPlus className="w-3.5 h-3.5" />
                    <span>Add to queue</span>
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      showToast('Playlist link copied to clipboard');
                      setShowOptionsMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-white/10 hover:text-white flex items-center gap-2 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share playlist</span>
                  </button>
                  {!isLikedPage && (
                    <button
                      onClick={() => {
                        handleToggleSave();
                        setShowOptionsMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      {isSaved ? 'Remove from Your Library' : 'Save to Your Library'}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Songs List Table */}
        {playlistTracks.length === 0 ? (
          <div className="py-20 text-center text-zinc-400">
            <Heart className="w-12 h-12 mx-auto text-zinc-600 mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Songs you like will appear here</h3>
            <p className="text-xs text-zinc-400">
              Save songs by tapping the heart icon anywhere in the app.
            </p>
          </div>
        ) : (
          <div>
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-zinc-400">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-11 md:col-span-6">Title</div>
              <div className="hidden md:block md:col-span-3">Album</div>
              <div className="hidden lg:block lg:col-span-2">Date Added</div>
              <div className="hidden md:flex md:col-span-2 lg:col-span-1 justify-end items-center pr-4">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            {/* Track Rows */}
            <div className="mt-2 space-y-1">
              {playlistTracks.map((track, idx) => (
                <TrackRow
                  key={`${track.id}-${idx}`}
                  track={track}
                  index={idx}
                  onPlay={() => playTrack(track, playlistTracks, idx)}
                  onSelectArtist={onSelectArtist}
                  showAlbum={true}
                  showDateAdded={true}
                  dateAdded="3 days ago"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

