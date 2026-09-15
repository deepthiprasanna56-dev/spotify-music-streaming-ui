import { useState } from 'react';
import { Heart, Plus, Search, Grid, List, Play, Music, Radio, User } from 'lucide-react';
import { playlists, artists, podcasts, tracks } from '../data/musicData';
import { useAudio } from '../context/AudioContext';
import SongCard from '../components/SongCard';

export default function LibraryPage({ onSelectPlaylist, onSelectArtist }) {
  const {
    likedTrackIds,
    followedArtistIds,
    showToast,
    allPlaylists,
    setShowCreatePlaylistModal,
    playTrack,
  } = useAudio();

  const [filter, setFilter] = useState('all'); // 'all' | 'playlists' | 'artists' | 'podcasts'
  const [searchFilter, setSearchFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const followedArtists = artists.filter((a) => followedArtistIds.includes(a.id));
  const likedTracksCount = likedTrackIds.length;
  const currentPlaylists = allPlaylists || playlists;

  const handleCreatePlaylist = () => {
    setShowCreatePlaylistModal(true);
  };

  const q = searchFilter.trim().toLowerCase();

  const filteredPlaylists = currentPlaylists
    .filter((p) => p.id !== 'liked-songs')
    .filter((p) => !q || p.title.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));

  const filteredArtists = followedArtists.filter(
    (a) => !q || a.name.toLowerCase().includes(q) || a.genre.toLowerCase().includes(q)
  );

  const filteredPodcasts = podcasts.filter(
    (pod) => !q || pod.title.toLowerCase().includes(q) || pod.publisher.toLowerCase().includes(q)
  );

  const showPlaylists = filter === 'all' || filter === 'playlists';
  const showArtists = filter === 'all' || filter === 'artists';
  const showPodcasts = filter === 'all' || filter === 'podcasts';

  return (
    <div className="p-4 sm:p-8 pb-36 md:pb-28 select-none animate-in fade-in duration-200">
      {/* Header & Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Your Library
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Playlists, artists, podcasts, and saved music
          </p>
        </div>

        <button
          onClick={handleCreatePlaylist}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-xs font-bold hover:scale-105 active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span>New Playlist</span>
        </button>
      </div>

      {/* Filter Tabs & Search & View Mode */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'playlists', 'artists', 'podcasts'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                filter === tab
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search Library Filter */}
          <div className="relative flex items-center flex-1 sm:w-56">
            <Search className="absolute left-2.5 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search in Library"
              className="w-full pl-8 pr-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 focus:bg-white/20 text-xs text-white placeholder-zinc-400 outline-none transition-colors"
            />
          </div>

          {/* Grid / List View Toggle */}
          <div className="flex items-center bg-white/10 rounded-full p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full transition-colors ${
                viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-zinc-400 hover:text-white'
              }`}
              aria-label="Grid view"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-full transition-colors ${
                viewMode === 'list' ? 'bg-white/20 text-white' : 'text-zinc-400 hover:text-white'
              }`}
              aria-label="List view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* View Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {/* Liked Songs Special Card (Visible in All or Playlists) */}
          {showPlaylists && !q && (
            <div
              onClick={() => onSelectPlaylist('liked-songs')}
              className="col-span-2 group relative p-5 bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 rounded-lg cursor-pointer hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 shadow-xl flex flex-col justify-between min-h-[190px]"
            >
              <div className="flex justify-end">
                <Heart className="w-12 h-12 fill-current text-white/90 drop-shadow-md" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white mb-1">Liked Songs</h2>
                <p className="text-xs font-semibold text-white/80">
                  {likedTracksCount} liked {likedTracksCount === 1 ? 'song' : 'songs'}
                </p>
              </div>
            </div>
          )}

          {/* Playlists */}
          {showPlaylists &&
            filteredPlaylists.map((playlist) => (
              <SongCard
                key={playlist.id}
                image={playlist.cover}
                title={playlist.title}
                subtitle={`By ${playlist.owner}`}
                onClick={() => onSelectPlaylist(playlist.id)}
                onPlay={() => {
                  const playlistTracks = tracks.filter((t) => playlist.trackIds?.includes(t.id));
                  if (playlistTracks.length > 0) {
                    playTrack(playlistTracks[0], playlistTracks, 0);
                  } else {
                    onSelectPlaylist(playlist.id);
                  }
                }}
              />
            ))}

          {/* Artists */}
          {showArtists &&
            filteredArtists.map((artist) => (
              <SongCard
                key={artist.id}
                image={artist.avatar}
                title={artist.name}
                subtitle={artist.genre}
                isCircle={true}
                badge="Artist"
                onClick={() => onSelectArtist(artist.id)}
                onPlay={() => onSelectArtist(artist.id)}
              />
            ))}

          {/* Podcasts */}
          {showPodcasts &&
            filteredPodcasts.map((podcast) => (
              <SongCard
                key={podcast.id}
                image={podcast.cover}
                title={podcast.title}
                subtitle={podcast.publisher}
                badge="Podcast"
                onClick={() => showToast(`Opening podcast ${podcast.title}`)}
                onPlay={() => showToast(`Playing latest episode of ${podcast.title}`)}
              />
            ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-1">
          {showPlaylists && !q && (
            <div
              onClick={() => onSelectPlaylist('liked-songs')}
              className="group flex items-center justify-between p-3 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 fill-current text-white" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm text-white group-hover:text-[#1db954] transition-colors">
                    Liked Songs
                  </div>
                  <div className="text-xs text-zinc-400">
                    Playlist • {likedTracksCount} songs
                  </div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPlaylist('liked-songs');
                }}
                className="w-9 h-9 rounded-full bg-[#1db954] text-black flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-md hover:scale-105 transition-all"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </button>
            </div>
          )}

          {/* Playlists in list */}
          {showPlaylists &&
            filteredPlaylists.map((playlist) => (
              <div
                key={playlist.id}
                onClick={() => onSelectPlaylist(playlist.id)}
                className="group flex items-center justify-between p-3 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={playlist.cover}
                    alt={playlist.title}
                    className="w-12 h-12 rounded object-cover shrink-0 shadow-sm"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-white truncate group-hover:text-[#1db954] transition-colors">
                      {playlist.title}
                    </div>
                    <div className="text-xs text-zinc-400 truncate">
                      Playlist • {playlist.owner} • {playlist.saves} saves
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const pTracks = tracks.filter((t) => playlist.trackIds?.includes(t.id));
                    if (pTracks.length > 0) playTrack(pTracks[0], pTracks, 0);
                    else onSelectPlaylist(playlist.id);
                  }}
                  className="w-9 h-9 rounded-full bg-[#1db954] text-black flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-md hover:scale-105 transition-all"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
              </div>
            ))}

          {/* Artists in list */}
          {showArtists &&
            filteredArtists.map((artist) => (
              <div
                key={artist.id}
                onClick={() => onSelectArtist(artist.id)}
                className="group flex items-center justify-between p-3 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={artist.avatar}
                    alt={artist.name}
                    className="w-12 h-12 rounded-full object-cover shrink-0 shadow-sm"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-white truncate group-hover:text-[#1db954] transition-colors">
                      {artist.name}
                    </div>
                    <div className="text-xs text-zinc-400 truncate">
                      Artist • {artist.genre} • {artist.monthlyListeners} monthly listeners
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectArtist(artist.id);
                  }}
                  className="w-9 h-9 rounded-full bg-[#1db954] text-black flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-md hover:scale-105 transition-all"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
              </div>
            ))}

          {/* Podcasts in list */}
          {showPodcasts &&
            filteredPodcasts.map((podcast) => (
              <div
                key={podcast.id}
                onClick={() => showToast(`Opening podcast: ${podcast.title}`)}
                className="group flex items-center justify-between p-3 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={podcast.cover}
                    alt={podcast.title}
                    className="w-12 h-12 rounded object-cover shrink-0 shadow-sm"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-white truncate group-hover:text-[#1db954] transition-colors">
                      {podcast.title}
                    </div>
                    <div className="text-xs text-zinc-400 truncate">
                      Podcast • {podcast.publisher} • {podcast.latestEpisode}
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showToast(`Streaming latest episode: ${podcast.latestEpisode}`);
                  }}
                  className="w-9 h-9 rounded-full bg-[#1db954] text-black flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-md hover:scale-105 transition-all"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
