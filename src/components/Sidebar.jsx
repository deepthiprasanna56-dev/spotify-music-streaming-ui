import { Home, Search, Library, PlusSquare, Heart, ArrowDownCircle, Radio, Music } from 'lucide-react';
import { userProfile } from '../data/musicData';
import { useAudio } from '../context/AudioContext';

export default function Sidebar({ currentView, onNavigate, onSelectPlaylist, selectedPlaylistId }) {
  const { likedTrackIds, allPlaylists, setShowCreatePlaylistModal, setShowPremiumModal, showToast } = useAudio();

  const handleCreatePlaylist = () => {
    setShowCreatePlaylistModal(true);
  };

  return (
    <aside className="w-64 bg-black text-zinc-300 flex flex-col h-full shrink-0 select-none border-r border-white/5">
      {/* Spotify Brand Header */}
      <div className="p-6 pb-4">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-white hover:opacity-90 transition-opacity"
        >
          <div className="w-9 h-9 rounded-full bg-[#1db954] flex items-center justify-center text-black shadow-lg shadow-[#1db954]/20">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.307c-.216.354-.678.468-1.032.252-2.825-1.727-6.38-2.118-10.569-1.162-.405.093-.812-.16-.905-.565-.092-.405.161-.812.566-.905 4.588-1.047 8.528-.604 11.687 1.332.355.216.469.678.253 1.048zm1.469-3.266c-.272.441-.853.582-1.294.31-3.233-1.986-8.161-2.56-11.984-1.4-1.498.152-.988-.198-1.14-.696-.151-.498.199-.988.697-1.14 4.372-1.327 9.805-.688 13.411 1.532.44.272.582.853.31 1.294zm.126-3.412C15.228 8.35 8.847 8.14 5.155 9.26c-.604.184-1.246-.16-1.43-.764-.183-.604.161-1.246.765-1.43 4.249-1.29 11.296-1.049 15.753 1.597.545.324.726 1.031.402 1.576-.323.544-1.03.725-1.575.402z"/>
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-white">Spotify</span>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="px-3 space-y-1">
        <button
          onClick={() => onNavigate('home')}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-md text-sm font-semibold transition-all ${
            currentView === 'home'
              ? 'bg-[#282828] text-white shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-[#181818]'
          }`}
        >
          <Home className={`w-5 h-5 ${currentView === 'home' ? 'text-white' : 'text-zinc-400'}`} />
          <span>Home</span>
        </button>

        <button
          onClick={() => onNavigate('search')}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-md text-sm font-semibold transition-all ${
            currentView === 'search'
              ? 'bg-[#282828] text-white shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-[#181818]'
          }`}
        >
          <Search className={`w-5 h-5 ${currentView === 'search' ? 'text-white' : 'text-zinc-400'}`} />
          <span>Search</span>
        </button>

        <button
          onClick={() => onNavigate('library')}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-md text-sm font-semibold transition-all ${
            currentView === 'library'
              ? 'bg-[#282828] text-white shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-[#181818]'
          }`}
        >
          <Library className={`w-5 h-5 ${currentView === 'library' ? 'text-white' : 'text-zinc-400'}`} />
          <span>Your Library</span>
        </button>
      </nav>

      {/* Collection Actions */}
      <div className="px-3 pt-6 space-y-1">
        <button
          onClick={handleCreatePlaylist}
          className="w-full flex items-center gap-4 px-4 py-2 rounded-md text-sm font-semibold text-zinc-400 hover:text-white hover:bg-[#181818] transition-colors group"
        >
          <div className="w-6 h-6 rounded bg-zinc-300 text-black flex items-center justify-center group-hover:bg-white transition-colors">
            <PlusSquare className="w-4 h-4 fill-current text-black" />
          </div>
          <span>Create Playlist</span>
        </button>

        <button
          onClick={() => onSelectPlaylist('liked-songs')}
          className={`w-full flex items-center gap-4 px-4 py-2 rounded-md text-sm font-semibold transition-colors group ${
            selectedPlaylistId === 'liked-songs' && currentView === 'playlist'
              ? 'text-white bg-[#282828]'
              : 'text-zinc-400 hover:text-white hover:bg-[#181818]'
          }`}
        >
          <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-md">
            <Heart className="w-3.5 h-3.5 fill-current" />
          </div>
          <div className="flex items-center justify-between flex-1">
            <span>Liked Songs</span>
            <span className="text-xs text-zinc-500 font-normal">{likedTrackIds.length}</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('library')}
          className="w-full flex items-center gap-4 px-4 py-2 rounded-md text-sm font-semibold text-zinc-400 hover:text-white hover:bg-[#181818] transition-colors group"
        >
          <div className="w-6 h-6 rounded bg-emerald-800 text-[#1db954] flex items-center justify-center">
            <Radio className="w-3.5 h-3.5" />
          </div>
          <span>Your Podcasts</span>
        </button>
      </div>

      <div className="mx-6 my-3 border-t border-zinc-800" />

      {/* Saved Playlists List */}
      <div className="flex-1 px-4 overflow-y-auto space-y-0.5 text-xs text-zinc-400">
        <div className="px-3 py-1.5 font-medium uppercase tracking-wider text-[11px] text-zinc-500">
          Playlists
        </div>
        {allPlaylists.map((playlist) => {
          const isActive = currentView === 'playlist' && selectedPlaylistId === playlist.id;
          return (
            <button
              key={playlist.id}
              onClick={() => onSelectPlaylist(playlist.id)}
              className={`w-full text-left px-3 py-2 rounded truncate transition-colors text-[13px] ${
                isActive
                  ? 'text-[#1db954] font-medium bg-white/5'
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              {playlist.title}
            </button>
          );
        })}
      </div>

      {/* Footer / User Profile */}
      <div className="p-3 border-t border-white/5 bg-[#121212]/50">
        <button
          onClick={() => {
            setShowPremiumModal(true);
            showToast(`Account: ${userProfile.name} • ${userProfile.plan}`);
          }}
          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#282828] transition-colors cursor-pointer group text-left"
          aria-label="User account settings"
        >
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="w-8 h-8 rounded-full object-cover border border-white/10"
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate group-hover:text-[#1db954] transition-colors">
              {userProfile.name}
            </div>
            <div className="text-[11px] text-zinc-400 truncate">{userProfile.plan}</div>
          </div>
          <ArrowDownCircle className="w-4 h-4 text-zinc-400 group-hover:text-white shrink-0" />
        </button>
      </div>
    </aside>
  );
}
