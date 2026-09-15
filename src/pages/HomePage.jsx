import { useState } from 'react';
import { Play, Pause, Heart, Sparkles, ChevronRight, Disc, Users, Radio, Music2 } from 'lucide-react';
import { tracks, playlists, artists, podcasts, albums } from '../data/musicData';
import { useAudio } from '../context/AudioContext';
import SongCard from '../components/SongCard';

export default function HomePage({ onSelectPlaylist, onSelectArtist, onNavigate }) {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    playTrack,
    likedTrackIds,
    toggleLike,
  } = useAudio();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'music' | 'podcasts' | 'artists'

  // Dynamic Greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const btsPlaylist = playlists.find((p) => p.id === 'this-is-bts');
  const topHitsPlaylist = playlists.find((p) => p.id === 'todays-top-hits') || playlists[0];
  const hipHopPlaylist = playlists.find((p) => p.id === 'hip-hop-central');
  const popPlaylist = playlists.find((p) => p.id === 'pop-superstars');
  const worldPlaylist = playlists.find((p) => p.id === 'world-music-atlas');
  const indianTracks = tracks.filter((track) => ['artist-arijit-singh', 'artist-jasleen-royal', 'artist-shreya-ghoshal', 'artist-rahul-sipligunj', 'artist-karan-aujla'].includes(track.artistId));

  // Quick 6 Pinned Cards (Spotify home screen)
  const quickItems = [
    {
      id: 'liked-songs',
      title: 'Liked Songs',
      type: 'playlist',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
      isLikedCard: true,
      trackList: tracks.filter((t) => likedTrackIds.includes(t.id)),
    },
    {
      id: 'todays-top-hits',
      title: "Today's Top Hits",
      type: 'playlist',
      image: topHitsPlaylist.cover,
      trackList: tracks.filter((t) => topHitsPlaylist.trackIds.includes(t.id)),
    },
    {
      id: 'this-is-bts',
      title: 'This Is BTS',
      type: 'playlist',
      image: btsPlaylist ? btsPlaylist.cover : 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&auto=format&fit=crop&q=80',
      trackList: tracks.filter((t) => btsPlaylist?.trackIds.includes(t.id)),
    },
    {
      id: 'hip-hop-central',
      title: 'Hip-Hop Central',
      type: 'playlist',
      image: hipHopPlaylist ? hipHopPlaylist.cover : playlists[1].cover,
      trackList: tracks.filter((t) => hipHopPlaylist?.trackIds.includes(t.id)),
    },
    {
      id: 'pop-superstars',
      title: 'Pop Superstars',
      type: 'playlist',
      image: popPlaylist ? popPlaylist.cover : playlists[2].cover,
      trackList: tracks.filter((t) => popPlaylist?.trackIds.includes(t.id)),
    },
    {
      id: 'world-music-atlas',
      title: 'World Music Atlas',
      type: 'playlist',
      image: worldPlaylist?.cover || playlists[3]?.cover,
      trackList: tracks.filter((t) => worldPlaylist?.trackIds.includes(t.id)),
    },
    {
      id: 'chill-vibes',
      title: 'Chill Vibes & Lofi',
      type: 'playlist',
      image: playlists[3]?.cover || playlists[0].cover,
      trackList: tracks.filter((t) => playlists[3]?.trackIds.includes(t.id)),
    },
  ];

  const handleQuickPlay = (e, item) => {
    e.stopPropagation();
    if (item.trackList && item.trackList.length > 0) {
      playTrack(item.trackList[0], item.trackList, 0);
    }
  };

  // Bruno Mars & Lady Gaga Spotlight
  const spotlightTrack = tracks.find((t) => t.id === 'track-bruno-1') || tracks[0];

  return (
    <div className="pb-36 md:pb-28 select-none animate-in fade-in duration-300">
      {/* Dynamic Ambient Gradient Banner */}
      <div className="bg-gradient-to-b from-emerald-950 via-zinc-950 to-black px-4 sm:px-8 pt-6 pb-6">
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d2117] px-5 py-7 sm:px-9 sm:py-10 mb-7 shadow-2xl shadow-black/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_45%,rgba(29,185,84,0.32),transparent_30%),linear-gradient(115deg,#0d2117_0%,#102c1d_52%,#193e2b_100%)]" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#9bf3b7] mb-4">
                <span className="w-2 h-2 rounded-full bg-[#1ed760] shadow-[0_0_14px_#1ed760]" />
                <span>Global listening, your way</span>
              </div>
              <h2 className="display-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[0.95] mb-4">
                Music that<br /><span className="text-[#8ff0ac]">moves with you.</span>
              </h2>
              <p className="text-sm sm:text-base text-emerald-50/75 max-w-md leading-relaxed mb-6">
                From BTS and Bollywood to Afrobeats and Latin pop, find your next favorite song in every corner of the world.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button onClick={() => playTrack(spotlightTrack, tracks, 0)} className="inline-flex items-center gap-2 rounded-full bg-[#1ed760] px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-[#1ed760]/20 hover:bg-white transition-colors"><Play className="w-4 h-4 fill-current" /> Play {spotlightTrack.title}</button>
                <button onClick={() => onSelectPlaylist('world-music-atlas')} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors">Explore world music <ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="hero-art relative w-44 sm:w-56 md:w-64 aspect-square shrink-0 self-center md:self-auto">
              <div className="absolute -inset-4 rounded-full border border-[#86e9a2]/20" />
              <img src={spotlightTrack.cover} alt={spotlightTrack.title} className="relative w-full h-full rounded-xl object-cover shadow-2xl shadow-black/40 rotate-3" />
              <div className="absolute -bottom-3 -left-3 rounded-lg border border-white/10 bg-black/75 px-3 py-2 backdrop-blur-md"><p className="text-[10px] uppercase tracking-widest text-emerald-200/70">Featured now</p><p className="max-w-[9rem] truncate text-xs font-bold text-white">{spotlightTrack.artist}</p></div>
            </div>
          </div>
        </section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {getGreeting()}
          </h1>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', label: 'All' },
              { id: 'music', label: 'Music' },
              { id: 'podcasts', label: 'Podcasts' },
              { id: 'artists', label: 'Artists' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  activeFilter === tab.id
                    ? 'bg-white text-black shadow-md scale-105'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 6 Quick Pinned Grid Items (shown on 'all' or 'music') */}
        {(activeFilter === 'all' || activeFilter === 'music') && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
            {quickItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectPlaylist(item.id)}
                className="group relative flex items-center bg-white/5 hover:bg-white/10 rounded overflow-hidden cursor-pointer transition-all duration-200 shadow-sm"
              >
                {item.isLikedCard ? (
                  <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 flex items-center justify-center shrink-0 shadow-md">
                    <Heart className="w-7 h-7 fill-current text-white" />
                  </div>
                ) : (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 sm:w-20 h-16 sm:h-20 object-cover shrink-0 shadow-md"
                  />
                )}

                <span className="font-bold text-sm text-white px-4 truncate flex-1">
                  {item.title}
                </span>

                {/* Quick Play Button */}
                <button
                  onClick={(e) => handleQuickPlay(e, item)}
                  className="mr-3 w-10 h-10 rounded-full bg-[#1db954] hover:bg-[#1ed760] text-black opacity-0 group-hover:opacity-100 flex items-center justify-center shadow-xl hover:scale-105 transition-all shrink-0"
                  aria-label={`Play ${item.title}`}
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Hero Featured Spotlight Banner */}
        {(activeFilter === 'all' || activeFilter === 'music') && (
          <section className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-950 via-zinc-900 to-zinc-900 p-6 sm:p-8 border border-white/5 shadow-2xl mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 z-10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1db954] mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Global Megahit Spotlight</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
                {spotlightTrack.title}
              </h2>
              <p className="text-zinc-300 text-sm sm:text-base mb-1 font-medium">
                {spotlightTrack.artist} • <span className="text-zinc-400">{spotlightTrack.album}</span>
              </p>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mb-6 leading-relaxed line-clamp-2">
                Authentic studio recording with over 1.7 billion streams worldwide. Click listen to stream the real track!
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => playTrack(spotlightTrack, tracks, 0)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1db954] hover:bg-[#1ed760] text-black font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-transform"
                >
                  {isPlaying && currentTrack?.id === spotlightTrack.id ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Listen Now</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleLike(spotlightTrack.id)}
                  className={`p-2.5 rounded-full border border-white/20 hover:border-white text-white hover:scale-105 transition-all ${
                    likedTrackIds.includes(spotlightTrack.id) ? 'text-[#1db954] border-[#1db954]' : ''
                  }`}
                  aria-label="Save song"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      likedTrackIds.includes(spotlightTrack.id) ? 'fill-current' : ''
                    }`}
                  />
                </button>

                <button
                  onClick={() => onSelectArtist(spotlightTrack.artistId)}
                  className="text-xs font-semibold text-zinc-300 hover:text-white underline ml-2 transition-colors"
                >
                  View Artist
                </button>
              </div>
            </div>

            <div className="relative w-48 sm:w-56 md:w-64 aspect-square rounded-lg overflow-hidden shadow-2xl shrink-0 group border border-white/10">
              <img
                src={spotlightTrack.cover}
                alt={spotlightTrack.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </section>
        )}
      </div>

      {/* Main Sections Body */}
      <div className="px-4 sm:px-8 space-y-10">
        {/* POPULAR ARTISTS (Prominent when 'all' or 'artists') */}
        {(activeFilter === 'all' || activeFilter === 'artists') && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1db954] mb-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>World Superstars</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Popular Artists
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Featuring 19 chart-topping global sensations with dedicated discographies
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
              {artists.map((artist) => (
                <SongCard
                  key={artist.id}
                  image={artist.avatar}
                  title={artist.name}
                  subtitle={artist.genre}
                  isCircle={true}
                  badge="Artist"
                  onClick={() => onSelectArtist(artist.id)}
                  onPlay={() => {
                    const artistTracks = tracks.filter((t) => artist.popularTrackIds.includes(t.id));
                    if (artistTracks.length > 0) {
                      playTrack(artistTracks[0], artistTracks, 0);
                    }
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* TODAY'S BIGGEST HITS */}
        {(activeFilter === 'all' || activeFilter === 'music') && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1db954] mb-1">
                  <Music2 className="w-3.5 h-3.5" />
                  <span>Real Studio Audio</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Today's Biggest Hits
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Stream the actual hit songs from your favorite artists
                </p>
              </div>
              <button
                onClick={() => onNavigate('search')}
                className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>See all songs</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {tracks.slice(0, 12).map((track, idx) => (
                <SongCard
                  key={track.id}
                  image={track.cover}
                  title={track.title}
                  subtitle={track.artist}
                  isPlayingThis={currentTrack?.id === track.id}
                  onClick={() => playTrack(track, tracks, idx)}
                  onPlay={() => playTrack(track, tracks, idx)}
                />
              ))}
            </div>
          </section>
        )}

        {/* BTS SPOTLIGHT & ESSENTIALS */}
        {(activeFilter === 'all' || activeFilter === 'music') && (
          <section className="relative p-5 sm:p-6 rounded-xl bg-gradient-to-r from-purple-950/60 via-zinc-900 to-zinc-900 border border-purple-900/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>21st Century Pop Icons</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  BTS Spotlight & Essentials
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Hear authentic vocals on Dynamite, Butter, Boy With Luv, Fake Love & Spring Day
                </p>
              </div>
              <button
                onClick={() => onSelectArtist('artist-bts')}
                className="text-xs font-bold uppercase tracking-wider text-purple-300 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>View BTS</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {tracks
                .filter((t) => t.artistId === 'artist-bts')
                .map((track, idx, arr) => (
                  <SongCard
                    key={track.id}
                    image={track.cover}
                    title={track.title}
                    subtitle={track.album}
                    isPlayingThis={currentTrack?.id === track.id}
                    onClick={() => playTrack(track, arr, idx)}
                    onPlay={() => playTrack(track, arr, idx)}
                  />
                ))}
            </div>
          </section>
        )}

        {(activeFilter === 'all' || activeFilter === 'music') && (
          <section className="music-section relative overflow-hidden rounded-2xl border border-amber-200/10 bg-gradient-to-br from-[#2a1b10] via-[#1a1714] to-[#111] p-5 sm:p-7">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="relative z-10 flex items-end justify-between gap-4 mb-5"><div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300/80 mb-2">Desi frequencies</p><h2 className="display-heading text-2xl sm:text-3xl font-bold text-white">Indian songs for every mood</h2><p className="text-sm text-zinc-400 mt-1">Bollywood romance, Punjabi energy, and South Indian anthems.</p></div><button onClick={() => onSelectPlaylist('desi-hits')} className="hidden sm:flex items-center gap-1 text-xs font-bold text-amber-200 hover:text-white transition-colors">See playlist <ChevronRight className="w-4 h-4" /></button></div>
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">{indianTracks.slice(0, 5).map((track, idx) => (<SongCard key={track.id} image={track.cover} title={track.title} subtitle={track.artist} isPlayingThis={currentTrack?.id === track.id} onClick={() => playTrack(track, indianTracks, idx)} onPlay={() => playTrack(track, indianTracks, idx)} />))}</div>
          </section>
        )}
        {/* TRENDING PLAYLISTS */}
        {(activeFilter === 'all' || activeFilter === 'music') && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Trending Playlists
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400">Curated by Spotify editors</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {playlists.map((playlist) => (
                <SongCard
                  key={playlist.id}
                  image={playlist.cover}
                  title={playlist.title}
                  subtitle={playlist.description}
                  onClick={() => onSelectPlaylist(playlist.id)}
                  onPlay={() => {
                    const playlistTracks = tracks.filter((t) => playlist.trackIds.includes(t.id));
                    if (playlistTracks.length > 0) {
                      playTrack(playlistTracks[0], playlistTracks, 0);
                    }
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* FEATURED ALBUMS */}
        {(activeFilter === 'all' || activeFilter === 'music') && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1db954] mb-1">
                  <Disc className="w-3.5 h-3.5" />
                  <span>Full Length Records</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Featured Albums
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400">Award-winning global records and landmark projects</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {albums.map((album) => {
                const albumTracks = tracks.filter((t) => album.trackIds.includes(t.id));
                const isPlayingThis = currentTrack && album.trackIds.includes(currentTrack.id);
                return (
                  <SongCard
                    key={album.id}
                    image={album.cover}
                    title={album.title}
                    subtitle={`${album.artist} • ${album.year}`}
                    isPlayingThis={isPlayingThis}
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
          </section>
        )}

        {/* FEATURED PODCASTS */}
        {(activeFilter === 'all' || activeFilter === 'podcasts') && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Top Podcasts & Shows
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400">Deep dives, stories, and conversations</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {podcasts.map((podcast) => (
                <div
                  key={podcast.id}
                  className="group p-4 bg-[#181818] hover:bg-[#282828] rounded-lg transition-colors cursor-pointer"
                  onClick={() => playTrack(tracks[0], tracks, 0)}
                >
                  <div className="aspect-square rounded-md overflow-hidden mb-3 shadow-md bg-zinc-900">
                    <img
                      src={podcast.cover}
                      alt={podcast.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-bold text-sm text-white truncate mb-1">
                    {podcast.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mb-2">{podcast.publisher}</p>
                  <div className="text-[11px] text-zinc-500 font-medium truncate">
                    Latest: {podcast.latestEpisode}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
