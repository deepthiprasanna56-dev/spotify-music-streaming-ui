import { useState } from 'react';
import { X, Plus, Music, Sparkles } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

const colorThemes = [
  { name: 'Emerald', gradient: 'from-emerald-950 via-zinc-900 to-black', accent: '#10b981', bg: 'bg-emerald-600' },
  { name: 'Purple', gradient: 'from-purple-950 via-zinc-900 to-black', accent: '#a855f7', bg: 'bg-purple-600' },
  { name: 'Indigo', gradient: 'from-indigo-950 via-zinc-900 to-black', accent: '#6366f1', bg: 'bg-indigo-600' },
  { name: 'Rose', gradient: 'from-rose-950 via-zinc-900 to-black', accent: '#f43f5e', bg: 'bg-rose-600' },
  { name: 'Amber', gradient: 'from-amber-950 via-zinc-900 to-black', accent: '#f59e0b', bg: 'bg-amber-600' },
  { name: 'Cyan', gradient: 'from-cyan-950 via-zinc-900 to-black', accent: '#06b6d4', bg: 'bg-cyan-600' },
];

export default function CreatePlaylistModal({ isOpen, onClose, onPlaylistCreated }) {
  const { createPlaylist } = useAudio();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(colorThemes[0]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalTitle = title.trim() || 'My New Playlist';
    const newId = createPlaylist({
      title: finalTitle,
      description: description.trim() || 'Custom user created playlist.',
      gradient: selectedTheme.gradient,
      accentColor: selectedTheme.accent,
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=85',
      trackIds: ['track-bts-1', 'track-1', 'track-2', 'track-bts-2'],
    });

    setTitle('');
    setDescription('');
    onClose();
    if (onPlaylistCreated) {
      onPlaylistCreated(newId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md bg-[#242424] border border-white/10 rounded-2xl shadow-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 font-bold text-lg text-white">
            <Sparkles className="w-5 h-5 text-[#1db954]" />
            <span>Create New Playlist</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              Playlist Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Late Night Vibes or BTS Favorites"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#181818] border border-white/10 focus:border-[#1db954] outline-none text-sm text-white placeholder-zinc-500 transition-colors"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Give your playlist a memorable description"
              rows={2}
              className="w-full px-3.5 py-2 rounded-lg bg-[#181818] border border-white/10 focus:border-[#1db954] outline-none text-sm text-white placeholder-zinc-500 resize-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Color Theme
            </label>
            <div className="flex items-center gap-2">
              {colorThemes.map((theme) => (
                <button
                  type="button"
                  key={theme.name}
                  onClick={() => setSelectedTheme(theme)}
                  className={`w-8 h-8 rounded-full ${theme.bg} flex items-center justify-center transition-all ${
                    selectedTheme.name === theme.name
                      ? 'ring-2 ring-white scale-110 shadow-lg'
                      : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                  aria-label={theme.name}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-bold text-zinc-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#1db954] hover:bg-[#1ed760] text-black text-xs font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
            >
              Create Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
