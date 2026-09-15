import { useState } from 'react';
import { Play, Pause, BadgeCheck, MoreHorizontal, UserCheck, UserPlus, Share2, Radio, Flag } from 'lucide-react';
import { artists, tracks } from '../data/musicData';
import { useAudio } from '../context/AudioContext';
import TrackRow from '../components/TrackRow';
import SongCard from '../components/SongCard';

export default function ArtistPage({ artistId, onSelectArtist }) {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    playTrack,
    followedArtistIds,
    toggleFollow,
    showToast,
  } = useAudio();

  const artist = artists.find((a) => a.id === artistId) || artists[0];
  const isFollowing = followedArtistIds.includes(artist.id);

  // Artist's popular tracks
  const popularTracks = tracks.filter((t) => artist.popularTrackIds?.includes(t.id));

  const isArtistPlaying =
    isPlaying && popularTracks.some((t) => t.id === currentTrack?.id);

  const handlePlayArtist = () => {
    if (popularTracks.length === 0) return;
    if (isArtistPlaying) {
      togglePlay();
    } else {
      playTrack(popularTracks[0], popularTracks, 0);
    }
  };

  const otherArtists = artists.filter((a) => a.id !== artist.id);
  const [showArtistMenu, setShowArtistMenu] = useState(false);

  const handleAlbumClick = (album) => {
    const matchTracks = tracks.filter((t) =>
      t.artistId === artist.id && (
        t.album.toLowerCase().includes(album.title.toLowerCase()) ||
        album.title.toLowerCase().includes(t.album.toLowerCase())
      )
    );
    const toPlay = matchTracks.length > 0 ? matchTracks : popularTracks;
    if (toPlay.length > 0) {
      playTrack(toPlay[0], toPlay, 0);
      showToast(`Playing "${album.title}" by ${artist.name}`);
    }
  };

  const handleSingleClick = (single) => {
    const matchTrack = tracks.find((t) =>
      t.artistId === artist.id && (
        t.title.toLowerCase().includes(single.title.toLowerCase()) ||
        single.title.toLowerCase().includes(t.title.toLowerCase())
      )
    ) || popularTracks[0];
    if (matchTrack) {
      playTrack(matchTrack, [matchTrack], 0);
      showToast(`Playing single "${single.title}" by ${artist.name}`);
    }
  };

  return (
    <div className="pb-36 md:pb-28 select-none animate-in fade-in duration-300">
      {/* Grand Hero Artist Banner */}
      <div className="relative h-72 sm:h-96 w-full overflow-hidden flex flex-col justify-end p-6 sm:p-8 select-none">
        {/* Banner Background Image with Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src={artist.banner}
            alt={artist.name}
            className="w-full h-full object-cover object-center filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10">
          {artist.verified && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400 mb-2">
              <BadgeCheck className="w-4 h-4 fill-sky-400 text-black" />
              <span className="tracking-wide">Verified Artist</span>
            </div>
          )}

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-none mb-3">
            {artist.name}
          </h1>

          <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-zinc-300">
            <span>{artist.monthlyListeners} monthly listeners</span>
            {artist.worldRank && (
              <>
                <span>•</span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-white">
                  {artist.worldRank}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="px-4 sm:px-8 pt-6 space-y-10">
        {/* Actions Row */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={handlePlayArtist}
            className="w-14 h-14 rounded-full bg-[#1db954] hover:bg-[#1ed760] text-black flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all"
            aria-label={isArtistPlaying ? 'Pause artist' : 'Play artist'}
          >
            {isArtistPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={() => toggleFollow(artist.id)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
              isFollowing
                ? 'border-white/30 text-white bg-white/10 hover:border-white'
                : 'border-white text-white hover:scale-105'
            }`}
          >
            {isFollowing ? (
              <>
                <UserCheck className="w-4 h-4 text-[#1db954]" />
                <span>Following</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Follow</span>
              </>
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowArtistMenu((prev) => !prev)}
              className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              aria-label="More options"
            >
              <MoreHorizontal className="w-7 h-7" />
            </button>

            {showArtistMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowArtistMenu(false)}
                />
                <div className="absolute left-0 mt-2 w-52 bg-[#282828] rounded-md shadow-2xl border border-white/10 py-1.5 z-50 text-xs text-zinc-200">
                  <button
                    onClick={() => {
                      toggleFollow(artist.id);
                      setShowArtistMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                  <button
                    onClick={() => {
                      if (popularTracks.length > 0) {
                        playTrack(popularTracks[0], popularTracks, 0);
                        showToast(`Started ${artist.name} Radio`);
                      }
                      setShowArtistMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-white/10 hover:text-white flex items-center gap-2 transition-colors"
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>Go to artist radio</span>
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      showToast('Artist link copied to clipboard');
                      setShowArtistMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-white/10 hover:text-white flex items-center gap-2 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                  <div className="border-t border-white/10 my-1" />
                  <button
                    onClick={() => {
                      showToast('Report submitted. Thank you.');
                      setShowArtistMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-white/10 text-rose-400 hover:text-rose-300 flex items-center gap-2 transition-colors"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Report</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Popular Songs Section */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 tracking-tight">
            Popular
          </h2>
          <div className="space-y-1">
            {popularTracks.map((track, idx) => (
              <TrackRow
                key={track.id}
                track={track}
                index={idx}
                onPlay={() => playTrack(track, popularTracks, idx)}
                showAlbum={true}
                showPlays={true}
              />
            ))}
          </div>
        </section>

        {/* Discography (Albums & Singles) */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 tracking-tight">
            Discography
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {artist.albums?.map((album) => (
              <SongCard
                key={album.id}
                image={album.cover}
                title={album.title}
                subtitle={`${album.year} • ${album.type}`}
                onClick={() => handleAlbumClick(album)}
                onPlay={() => handleAlbumClick(album)}
              />
            ))}
            {artist.singles?.map((single) => (
              <SongCard
                key={single.id}
                image={single.cover}
                title={single.title}
                subtitle={`${single.year} • ${single.type}`}
                onClick={() => handleSingleClick(single)}
                onPlay={() => handleSingleClick(single)}
              />
            ))}
          </div>
        </section>

        {/* About Section */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 tracking-tight">
            About
          </h2>
          <div className="relative rounded-2xl overflow-hidden p-6 sm:p-10 bg-[#181818] border border-white/5 max-w-4xl group">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
              <img
                src={artist.avatar}
                alt={artist.name}
                className="w-24 h-24 rounded-full object-cover shadow-xl border-2 border-white/10"
              />
              <div>
                <div className="text-2xl font-extrabold text-white mb-1">
                  {artist.monthlyListeners} monthly listeners
                </div>
                <div className="text-xs font-semibold text-[#1db954]">
                  {artist.worldRank || 'Global Trending Artist'}
                </div>
              </div>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed max-w-3xl">
              {artist.bio}
            </p>
          </div>
        </section>

        {/* Fans Also Like */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 tracking-tight">
            Fans Also Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {otherArtists.slice(0, 5).map((a) => (
              <SongCard
                key={a.id}
                image={a.avatar}
                title={a.name}
                subtitle={a.genre}
                isCircle={true}
                badge="Artist"
                onClick={() => onSelectArtist(a.id)}
                onPlay={() => onSelectArtist(a.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
