export default function EqualizerBars({ isPlaying = true, size = 'sm' }) {
  const heightClass = size === 'lg' ? 'h-5 w-1' : size === 'md' ? 'h-4 w-1' : 'h-3.5 w-0.5';

  return (
    <div className="flex items-end gap-[2px] h-4 px-1" aria-label="Audio Equalizer">
      <span
        className={`${heightClass} rounded-full bg-[#1db954] ${
          isPlaying ? 'animate-eq-1' : 'h-1.5'
        }`}
      />
      <span
        className={`${heightClass} rounded-full bg-[#1db954] ${
          isPlaying ? 'animate-eq-2' : 'h-3'
        }`}
      />
      <span
        className={`${heightClass} rounded-full bg-[#1db954] ${
          isPlaying ? 'animate-eq-3' : 'h-2'
        }`}
      />
      <span
        className={`${heightClass} rounded-full bg-[#1db954] ${
          isPlaying ? 'animate-eq-4' : 'h-2.5'
        }`}
      />
    </div>
  );
}
