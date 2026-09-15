import { X, Play, Music, ListPlus } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import EqualizerBars from './EqualizerBars';

export default function QueueDrawer() {
  const {
    showQueue,
    setShowQueue,
    queue,
    queueIndex,
    currentTrack,
    isPlaying,
    playTrack,
  } = useAudio();

  if (!showQueue) return null;

  const upcomingQueue = queue.slice(queueIndex + 1);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 transition-opacity"
        onClick={() => setShowQueue(false)}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-20 sm:bottom-[88px] w-80 sm:w-96 bg-[#181818] border-l border-white/10 shadow-2xl z-50 flex flex-col select-none animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListPlus className="w-5 h-5 text-[#1db954]" />
            <h2 className="font-bold text-base text-white">Play Queue</h2>
          </div>
          <button
            onClick={() => setShowQueue(false)}
            className="p-1 text-zinc-400 hover:text-white rounded-full hover:bg-white/10"
            aria-label="Close queue"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Now Playing */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-zinc-400 font-bold mb-3">
              Now Playing
            </h3>
            {currentTrack && (
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/5">
                <img
                  src={currentTrack.cover}
                  alt={currentTrack.title}
                  className="w-12 h-12 rounded object-cover shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#1db954] truncate">
                    {currentTrack.title}
                  </div>
                  <div className="text-xs text-zinc-400 truncate">
                    {currentTrack.artist}
                  </div>
                </div>
                <EqualizerBars isPlaying={isPlaying} />
              </div>
            )}
          </div>

          {/* Next Up in Queue */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs uppercase tracking-wider text-zinc-400 font-bold">
                Next In Queue ({upcomingQueue.length})
              </h3>
            </div>

            {upcomingQueue.length === 0 ? (
              <p className="text-xs text-zinc-500 py-4 text-center">
                End of queue. Turn on repeat or select another playlist!
              </p>
            ) : (
              <div className="space-y-1">
                {upcomingQueue.map((track, idx) => (
                  <div
                    key={`${track.id}-${idx}`}
                    onClick={() => playTrack(track, queue, queueIndex + 1 + idx)}
                    className="group flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <span className="w-5 text-center text-xs text-zinc-500 group-hover:hidden">
                      {idx + 1}
                    </span>
                    <Play className="w-4 h-4 text-white hidden group-hover:block ml-0.5 fill-current" />
                    <img
                      src={track.cover}
                      alt={track.title}
                      className="w-10 h-10 rounded object-cover shadow-xs shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-medium text-white truncate group-hover:text-[#1db954] transition-colors">
                        {track.title}
                      </div>
                      <div className="text-[11px] text-zinc-400 truncate">
                        {track.artist}
                      </div>
                    </div>
                    <span className="text-xs text-zinc-500 tabular-nums">
                      {track.duration}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
