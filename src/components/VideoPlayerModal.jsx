import { useAudio } from '../context/AudioContext';

export default function VideoPlayerModal({ isOpen, onClose, youtubeId, title, artist }) {
  const { isPlaying, togglePlay } = useAudio();

  if (!isOpen || !youtubeId) return null;

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Video Container */}
      <div className="relative w-full max-w-4xl bg-[#181818] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 animate-scale-up flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/30">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-sm text-white truncate">{title}</h3>
              <p className="text-xs text-neutral-400 truncate">{artist} • Official Music Video</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* 16:9 YouTube Embed */}
        <div className="relative w-full aspect-video bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title={`${title} - ${artist}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-[#121212] border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
          <span>Streaming high definition music video via YouTube</span>
          <button
            onClick={handleClose}
            className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold transition"
          >
            Back to Audio
          </button>
        </div>
      </div>
    </div>
  );
}
