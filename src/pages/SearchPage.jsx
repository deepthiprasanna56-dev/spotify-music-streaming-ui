import { useState } from 'react';
import { Search, Play, X } from 'lucide-react';
import { tracks, playlists, artists, categories, albums } from '../data/musicData';
import { useAudio } from '../context/AudioContext';
import CategoryCard from '../components/CategoryCard';
import SongCard from '../components/SongCard';
import TrackRow from '../components/TrackRow';

export default function SearchPage({
  searchQuery,
  setSearchQuery,
  onSelectPlaylist,
  onSelectArtist,
}) {
  const { playTrack, currentTrack, isPlaying } = useAudio();
  const [filterType, setFilterType] = useState('all'); // 'all' | 'songs' | 'artists' | 'albums' | 'playlists'

  const normalize = (value = '') =>
    value
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, ' ')
      .trim();

  const query = normalize(searchQuery);
  const queryTerms = query.split(' ').filter(Boolean);
  const matchesQuery = (...values) => {
    const haystack = normalize(values.filter(Boolean).join(' '));
    return queryTerms.every((term) => haystack.includes(term));
  };
  const scoreMatch = (item) => {
    const title = normalize(item.title);
    const artist = normalize(item.artist || item.name);
    if (title === query || artist === query) return 3;
    if (title.startsWith(query) || artist.startsWith(query)) return 2;
    return 1;
  };

  // Filter Data
  const matchingTracks = query
    ? tracks
        .filter((t) => matchesQuery(t.title, t.artist, t.album, ...(t.aliases || [])))
        .sort((a, b) => scoreMatch(b) - scoreMatch(a))
    : [];

  const matchingArtists = query
    ? artists
        .filter((a) => matchesQuery(a.name, a.genre, ...(a.aliases || [])))
        .sort((a, b) => scoreMatch(b) - scoreMatch(a))
    : [];

  const matchingAlbums = query
    ? albums.filter((alb) => matchesQuery(alb.title, alb.artist, alb.description))
    : [];

  const matchingPlaylists = query
    ? playlists.filter((p) => matchesQuery(p.title, p.description))
    : [];

  const hasResults =
    matchingTracks.length > 0 ||
    matchingArtists.length > 0 ||
    matchingAlbums.length > 0 ||
    matchingPlaylists.length > 0;

  const topResult =
    matchingTracks[0] ||
    (matchingArtists[0] ? { ...matchingArtists[0], isArtist: true } : null) ||
    (matchingAlbums[0] ? { ...matchingAlbums[0], isAlbum: true } : null);

  const handleCategoryClick = (category) => {
    setSearchQuery(category.name);
  };

  return (
    <div className="p-4 sm:p-8 pb-36 md:pb-28 select-none animate-in fade-in duration-200">
      {/* Search Input for Mobile */}
      <div className="sm:hidden mb-6">
        <div className="relative flex items-center w-full">
          <Search className="absolute left-3 w-4 h-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search artists, songs, or podcasts..."
            className="w-full pl-10 pr-10 py-2.5 rounded-full bg-[#242424] text-white text-sm placeholder-zinc-400 outline-none focus:ring-2 focus:ring-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 p-1 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* When Search Query is Empty -> Show Browse All Categories */}
      {!query ? (
        <div>
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
              Browse all
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Explore charts, genres, mood playlists, and podcast episodes
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => handleCategoryClick(category)}
              />
            ))}
          </div>
        </div>
      ) : hasResults ? (
        /* When Search Query Has Results */
        <div className="space-y-8">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', label: 'All' },
              { id: 'songs', label: `Songs (${matchingTracks.length})` },
              { id: 'artists', label: `Artists (${matchingArtists.length})` },
              { id: 'albums', label: `Albums (${matchingAlbums.length})` },
              { id: 'playlists', label: `Playlists (${matchingPlaylists.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  filterType === tab.id
                    ? 'bg-white text-black shadow-md'
                    : 'bg-[#242424] text-white hover:bg-[#2a2a2a]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Top Result + Top Songs Layout (Shown on 'all' or 'songs') */}
          {(filterType === 'all' || filterType === 'songs') && topResult && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Top Result Card */}
              <div className="lg:col-span-5">
                <h3 className="text-lg font-bold text-white mb-3">Top result</h3>
                <div
                  onClick={() => {
                    if (topResult.isArtist) {
                      onSelectArtist(topResult.id);
                    } else {
                      playTrack(topResult, matchingTracks, 0);
                    }
                  }}
                  className="group relative p-5 bg-[#181818] hover:bg-[#282828] rounded-lg transition-all duration-200 cursor-pointer shadow-lg flex flex-col justify-between"
                >
                  <div className="w-24 h-24 rounded-lg overflow-hidden shadow-md mb-4 bg-zinc-900">
                    <img
                      src={topResult.cover || topResult.avatar}
                      alt={topResult.title || topResult.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h2 className="text-2xl font-extrabold text-white mb-1 truncate">
                      {topResult.title || topResult.name}
                    </h2>
                    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                      <span>{topResult.artist || topResult.genre}</span>
                      <span className="px-2 py-0.5 rounded-full bg-black/50 text-[10px] uppercase tracking-wider text-white">
                        {topResult.isArtist ? 'Artist' : 'Song'}
                      </span>
                    </div>
                  </div>

                  {/* Green Play Button */}
                  <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!topResult.isArtist) {
                          playTrack(topResult, matchingTracks, 0);
                        } else {
                          onSelectArtist(topResult.id);
                        }
                      }}
                      className="w-12 h-12 rounded-full bg-[#1db954] hover:bg-[#1ed760] text-black flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
                      aria-label="Play top result"
                    >
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Songs List */}
              <div className="lg:col-span-7">
                <h3 className="text-lg font-bold text-white mb-3">Songs</h3>
                <div className="space-y-1">
                  {(filterType === 'all' ? matchingTracks : matchingTracks.slice(0, 5)).map((track, idx) => (
                    <TrackRow
                      key={track.id}
                      track={track}
                      index={idx}
                      onPlay={() => playTrack(track, matchingTracks, idx)}
                      onSelectArtist={onSelectArtist}
                      showAlbum={false}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* If 'songs' only filter is active and more songs exist */}
          {filterType === 'songs' && matchingTracks.length > 5 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-3">More Songs</h3>
              <div className="space-y-1">
                {matchingTracks.slice(5).map((track, idx) => (
                  <TrackRow
                    key={track.id}
                    track={track}
                    index={idx + 5}
                    onPlay={() => playTrack(track, matchingTracks, idx + 5)}
                    onSelectArtist={onSelectArtist}
                    showAlbum={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Matching Artists */}
          {(filterType === 'all' || filterType === 'artists') && matchingArtists.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Artists</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {matchingArtists.map((artist) => (
                  <SongCard
                    key={artist.id}
                    image={artist.avatar}
                    title={artist.name}
                    subtitle={artist.genre}
                    isCircle={true}
                    badge="Artist"
                    onClick={() => onSelectArtist(artist.id)}
                    onPlay={() => {
                      const artistTracks = tracks.filter((t) =>
                        artist.popularTrackIds?.includes(t.id)
                      );
                      if (artistTracks.length > 0) {
                        playTrack(artistTracks[0], artistTracks, 0);
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Matching Albums */}
          {(filterType === 'all' || filterType === 'albums') && matchingAlbums.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Albums</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {matchingAlbums.map((album) => {
                  const albumTracks = tracks.filter((t) =>
                    album.trackIds?.includes(t.id)
                  );
                  return (
                    <SongCard
                      key={album.id}
                      image={album.cover}
                      title={album.title}
                      subtitle={`${album.artist} • ${album.year}`}
                      onClick={() => onSelectArtist(album.artistId)}
                      onPlay={() => {
                        if (albumTracks.length > 0) {
                          playTrack(albumTracks[0], albumTracks, 0);
                        }
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Matching Playlists */}
          {(filterType === 'all' || filterType === 'playlists') && matchingPlaylists.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Playlists</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {matchingPlaylists.map((playlist) => (
                  <SongCard
                    key={playlist.id}
                    image={playlist.cover}
                    title={playlist.title}
                    subtitle={playlist.description}
                    onClick={() => onSelectPlaylist(playlist.id)}
                    onPlay={() => {
                      const plTracks = tracks.filter((t) =>
                        playlist.trackIds.includes(t.id)
                      );
                      if (plTracks.length > 0) {
                        playTrack(plTracks[0], plTracks, 0);
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center select-none">
          <h3 className="text-xl font-bold text-white mb-2">
            No results found for &ldquo;{searchQuery}&rdquo;
          </h3>
          <p className="text-sm text-zinc-400 max-w-md mx-auto mb-6">
            Please make sure your words are spelled correctly, or try searching for an artist like &ldquo;Drake&rdquo;, &ldquo;BTS&rdquo;, &ldquo;Bruno Mars&rdquo;, or &ldquo;Taylor Swift&rdquo;.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-6 py-2 rounded-full bg-white text-black font-bold text-sm hover:scale-105 active:scale-95 transition-transform"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}

