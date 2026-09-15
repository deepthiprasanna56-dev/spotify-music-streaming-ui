import { ChevronLeft, ChevronRight, Search, Bell, Download, User, Menu, X, ExternalLink } from 'lucide-react';
import { userProfile as defaultProfile } from '../data/musicData';
import { useState } from 'react';
import { useAudio } from '../context/AudioContext';

export default function Topbar({
  currentView,
  onNavigate,
  onSelectPlaylist,
  onSelectArtist,
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  searchQuery,
  setSearchQuery,
  session,
  onOpenAuth,
  onLogout,
  onToggleMobileMenu,
  isMobileMenuOpen,
}) {
  const { showToast, setShowPremiumModal } = useAudio();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const profile = session || defaultProfile;

  const notifications = [
    {
      id: 1,
      title: 'New Release from BTS',
      desc: 'BTS just dropped "Butter (Hotter Remix)". Tap to stream now!',
      time: '15m ago',
      unread: true,
      targetType: 'artist',
      targetId: 'artist-bts',
    },
    {
      id: 2,
      title: 'Weekly Discover Ready',
      desc: 'Your personalized mix featuring Sabrina Carpenter & Taylor Swift is waiting.',
      time: '2h ago',
      unread: true,
      targetType: 'playlist',
      targetId: 'todays-top-hits',
    },
    {
      id: 3,
      title: 'Live Event: The Weeknd',
      desc: 'After Hours stadium tour live session starts tonight at 8:00 PM.',
      time: '1d ago',
      unread: false,
      targetType: 'artist',
      targetId: 'artist-the-weeknd',
    },
  ];

  const handleUpgrade = () => {
    setShowPremiumModal(true);
  };

  const handleInstall = () => {
    showToast('Spotify Web App installed successfully!');
  };

  const handleMarkAllRead = () => {
    setHasUnreadNotifications(false);
    showToast('All notifications marked as read');
  };

  return (
    <header className="h-16 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 bg-[#121212]/85 backdrop-blur-md border-b border-white/5 transition-all">
      {/* Left: History & Search */}
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-full text-zinc-300 hover:text-white hover:bg-white/10"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* History navigation buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={onBack}
            disabled={!canGoBack}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              canGoBack
                ? 'bg-black/60 hover:bg-black text-white'
                : 'bg-black/30 text-zinc-600 cursor-not-allowed'
            }`}
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onForward}
            disabled={!canGoForward}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              canGoForward
                ? 'bg-black/60 hover:bg-black text-white'
                : 'bg-black/30 text-zinc-600 cursor-not-allowed'
            }`}
            aria-label="Go forward"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Integrated Search Bar */}
        {currentView === 'search' ? (
          <div className="relative flex items-center w-64 sm:w-80 md:w-96 transition-all">
            <Search className="absolute left-3 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What do you want to play?"
              className="w-full pl-10 pr-9 py-2 rounded-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2e2e2e] focus:ring-2 focus:ring-white text-white text-xs sm:text-sm placeholder-zinc-400 outline-none transition-all"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-zinc-400 hover:text-white"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => onNavigate('search')}
            className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#242424] hover:bg-[#2a2a2a] text-zinc-400 text-xs sm:text-sm transition-colors"
          >
            <Search className="w-4 h-4 text-zinc-400" />
            <span>Search artists, songs, or podcasts...</span>
          </button>
        )}
      </div>

      {/* Right: Actions & User Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={handleUpgrade}
          className="hidden lg:inline-flex items-center text-xs font-bold px-3.5 py-1.5 rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-transform"
        >
          Explore Premium
        </button>

        <button
          onClick={handleInstall}
          className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full bg-black/50 hover:bg-black text-white hover:scale-105 transition-transform border border-white/10"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>

        {/* Notifications Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {hasUnreadNotifications && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1db954]" />
            )}
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#242424] rounded-xl shadow-2xl border border-white/10 p-3 z-50 text-xs text-zinc-200 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                  <span className="font-bold text-sm text-white">What's New</span>
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-[#1db954] hover:underline font-semibold"
                  >
                    Mark all as read
                  </button>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-2.5 rounded-lg transition-colors cursor-pointer ${
                        notif.unread && hasUnreadNotifications
                          ? 'bg-white/10 hover:bg-white/15'
                          : 'bg-transparent hover:bg-white/5'
                      }`}
                      onClick={() => {
                        showToast(`Opened: ${notif.title}`);
                        setShowNotifications(false);
                        if (notif.targetType === 'artist' && onSelectArtist) {
                          onSelectArtist(notif.targetId);
                        } else if (notif.targetType === 'playlist' && onSelectPlaylist) {
                          onSelectPlaylist(notif.targetId);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between font-semibold text-white mb-0.5">
                        <span className="truncate">{notif.title}</span>
                        <span className="text-[10px] text-zinc-400 font-normal shrink-0 ml-2">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-300 leading-snug">
                        {notif.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Pill & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="flex items-center gap-2 p-1 pl-1 pr-2 rounded-full bg-black/60 hover:bg-[#282828] transition-colors border border-white/10"
            aria-label="User menu"
          >
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-7 h-7 rounded-full object-cover"
            />
            <span className="hidden sm:inline text-xs font-bold text-white max-w-20 truncate">
              {profile.name.split(' ')[0]}
            </span>
          </button>

          {showProfileMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-[#282828] rounded-md shadow-2xl border border-white/10 py-1.5 z-50 text-xs text-zinc-200">
                <div className="px-3 py-2 border-b border-white/10">
                  <div className="font-bold text-white">{profile.name}</div>
                  <div className="text-zinc-400 text-[11px]">{profile.plan || 'Free plan'}</div>
                </div>
                <button
                  onClick={() => {
                    onNavigate('profile');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-white/10 hover:text-white transition-colors"
                >
                  Your Profile
                </button>
                <button
                  onClick={() => {
                    onNavigate('profile');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-white/10 hover:text-white flex items-center justify-between transition-colors"
                >
                  <span>Account</span>
                  <ExternalLink className="w-3 h-3 text-zinc-400" />
                </button>
                <button
                  onClick={() => {
                    handleUpgrade();
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-white/10 hover:text-white transition-colors text-[#1db954] font-medium"
                >
                  Upgrade to Premium
                </button>
                <div className="border-t border-white/10 my-1" />
                {session ? (
                  <button onClick={() => { onLogout(); setShowProfileMenu(false); }} className="w-full text-left px-3 py-2 hover:bg-white/10 text-rose-400 hover:text-rose-300 transition-colors">Log out</button>
                ) : (
                  <>
                    <button onClick={() => { onOpenAuth('login'); setShowProfileMenu(false); }} className="w-full text-left px-3 py-2 hover:bg-white/10 hover:text-white transition-colors">Log in</button>
                    <button onClick={() => { onOpenAuth('signup'); setShowProfileMenu(false); }} className="w-full text-left px-3 py-2 hover:bg-white/10 hover:text-white transition-colors">Sign up</button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}



