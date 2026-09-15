import { useState, useEffect, useRef } from 'react';
import { AudioProvider, useAudio } from './context/AudioContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Player from './components/Player';
import FullscreenPlayer from './components/FullscreenPlayer';
import QueueDrawer from './components/QueueDrawer';
import MobileNav from './components/MobileNav';
import Toast from './components/Toast';
import PremiumModal from './components/PremiumModal';
import CreatePlaylistModal from './components/CreatePlaylistModal';
import LyricsView from './components/LyricsView';
import AuthModal from './components/AuthModal';

import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import PlaylistPage from './pages/PlaylistPage';
import ArtistPage from './pages/ArtistPage';
import LibraryPage from './pages/LibraryPage';
import ProfilePage from './pages/ProfilePage';

function SpotifyApp() {
  // In-memory View History Navigation
  const [history, setHistory] = useState([{ view: 'home', data: {} }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [authMode, setAuthMode] = useState('login');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem('spotify_session')) || null; } catch { return null; }
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollRef = useRef(null);

  const currentNav = history[historyIndex] || { view: 'home', data: {} };
  const currentView = currentNav.view;
  const selectedPlaylistId = currentNav.data?.playlistId || 'todays-top-hits';
  const selectedArtistId = currentNav.data?.artistId || 'artist-the-weeknd';

  // Push navigation onto history stack
  const navigateTo = (view, data = {}) => {
    const nextItem = { view, data };
    const newHistory = [...history.slice(0, historyIndex + 1), nextItem];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setIsMobileMenuOpen(false);

    // Scroll to top
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const handleBack = () => {
    if (canGoBack) {
      setHistoryIndex((prev) => prev - 1);
      if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleForward = () => {
    if (canGoForward) {
      setHistoryIndex((prev) => prev + 1);
      if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectPlaylist = (id) => {
    navigateTo('playlist', { playlistId: id });
  };

  const handleSelectArtist = (id) => {
    navigateTo('artist', { artistId: id });
  };

  // Keyboard Shortcuts (Space to play/pause, M to mute, Left/Right arrows to seek)
  const {
    togglePlay,
    toggleMute,
    seek,
    currentTime,
    isPlaying,
    showPremiumModal,
    setShowPremiumModal,
    showCreatePlaylistModal,
    setShowCreatePlaylistModal,
    showToast,
  } = useAudio();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is currently typing into an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'KeyM') {
        toggleMute();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        seek(currentTime + 5);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        seek(currentTime - 5);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, toggleMute, seek, currentTime]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black text-white font-sans antialiased">
      {/* Toast feedback alerts */}
      <Toast />

      <AuthModal
        isOpen={isAuthOpen}
        mode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onSwitchMode={() => setAuthMode((previous) => previous === 'login' ? 'signup' : 'login')}
        onAuthenticated={(nextSession) => {
          setSession(nextSession);
          setIsAuthOpen(false);
          showToast(`Welcome, ${nextSession.name}`);
        }}
      />

      {/* Premium Subscription Modal */}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />

      {/* Create Custom Playlist Modal */}
      <CreatePlaylistModal
        isOpen={showCreatePlaylistModal}
        onClose={() => setShowCreatePlaylistModal(false)}
        onPlaylistCreated={handleSelectPlaylist}
      />

      {/* Fullscreen Player Modal */}
      <FullscreenPlayer />

      {/* Synchronized Karaoke Lyrics View */}
      <LyricsView />

      {/* Play Queue Side Drawer */}
      <QueueDrawer />

      {/* Desktop Left Sidebar */}
      <div className="hidden md:flex h-full">
        <Sidebar
          currentView={currentView}
          onNavigate={(v) => navigateTo(v)}
          onSelectPlaylist={handleSelectPlaylist}
          selectedPlaylistId={selectedPlaylistId}
        />
      </div>

      {/* Mobile Slide-Over Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-72 h-full bg-black">
            <Sidebar
              currentView={currentView}
              onNavigate={(v) => navigateTo(v)}
              onSelectPlaylist={handleSelectPlaylist}
              selectedPlaylistId={selectedPlaylistId}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-[#121212] overflow-hidden">
        {/* Topbar */}
        <Topbar
          currentView={currentView}
          onNavigate={(v, data) => navigateTo(v, data)}
          onSelectPlaylist={handleSelectPlaylist}
          onSelectArtist={handleSelectArtist}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          onBack={handleBack}
          onForward={handleForward}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          session={session}
          onOpenAuth={(mode) => { setAuthMode(mode); setIsAuthOpen(true); }}
          onLogout={() => { localStorage.removeItem('spotify_session'); setSession(null); showToast('You have been logged out'); }}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
          isMobileMenuOpen={isMobileMenuOpen}
        />

        {/* Scrollable View Container */}
        <main
          ref={scrollRef}
          className="flex-1 overflow-y-auto overflow-x-hidden relative"
        >
          {currentView === 'home' && (
            <HomePage
              onSelectPlaylist={handleSelectPlaylist}
              onSelectArtist={handleSelectArtist}
              onNavigate={(v) => navigateTo(v)}
            />
          )}

          {currentView === 'search' && (
            <SearchPage
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSelectPlaylist={handleSelectPlaylist}
              onSelectArtist={handleSelectArtist}
            />
          )}

          {currentView === 'playlist' && (
            <PlaylistPage
              playlistId={selectedPlaylistId}
              onSelectArtist={handleSelectArtist}
            />
          )}

          {currentView === 'artist' && (
            <ArtistPage
              artistId={selectedArtistId}
              onSelectArtist={handleSelectArtist}
            />
          )}

          {currentView === 'profile' && (
            <ProfilePage
              session={session}
              onOpenAuth={(mode) => { setAuthMode(mode); setIsAuthOpen(true); }}
              onLogout={() => { localStorage.removeItem('spotify_session'); setSession(null); showToast('You have been logged out'); }}
              onSelectPlaylist={handleSelectPlaylist}
            />
          )}

          {currentView === 'library' && (
            <LibraryPage
              onSelectPlaylist={handleSelectPlaylist}
              onSelectArtist={handleSelectArtist}
            />
          )}
        </main>

        {/* Desktop Fixed Bottom Player */}
        <div className="hidden md:block">
          <Player onSelectArtist={handleSelectArtist} />
        </div>

        {/* Mobile Navigation & Mini-Player */}
        <MobileNav
          currentView={currentView}
          onNavigate={(v) => navigateTo(v)}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <SpotifyApp />
    </AudioProvider>
  );
}

