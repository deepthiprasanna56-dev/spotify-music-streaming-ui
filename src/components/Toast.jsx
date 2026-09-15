import { useEffect } from 'react';
import { useAudio } from '../context/AudioContext';
import { CheckCircle2, X } from 'lucide-react';

export default function Toast() {
  const { toastMessage, hideToast } = useAudio();

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        hideToast();
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, hideToast]);

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 transform animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-3 bg-[#242424] text-white px-5 py-3 rounded-lg shadow-2xl border border-white/10 text-sm font-medium">
        <CheckCircle2 className="w-4 h-4 text-[#1db954] shrink-0" />
        <span>{toastMessage}</span>
        <button
          onClick={hideToast}
          className="ml-2 text-zinc-400 hover:text-white transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
