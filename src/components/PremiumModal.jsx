import { X, Check, Sparkles, ShieldCheck, Zap, Music2 } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export default function PremiumModal({ isOpen, onClose }) {
  const { showToast } = useAudio();

  if (!isOpen) return null;

  const plans = [
    {
      id: 'individual',
      name: 'Individual',
      badge: 'Free for 1 month',
      price: '$10.99 / month after',
      accounts: '1 Premium account',
      color: 'from-pink-600 to-rose-600',
      features: [
        'Ad-free music listening',
        'Download to listen offline',
        'Play songs in any order',
        'High audio quality (320kbps)',
        'Cancel anytime',
      ],
      recommended: true,
    },
    {
      id: 'duo',
      name: 'Duo',
      badge: 'Free for 1 month',
      price: '$14.99 / month after',
      accounts: '2 Premium accounts',
      color: 'from-amber-600 to-orange-600',
      features: [
        '2 Premium accounts for a couple',
        'Duo Mix playlist updated regularly',
        'Ad-free music listening',
        'Download 10,000 songs per device',
        'Cancel anytime',
      ],
      recommended: false,
    },
    {
      id: 'family',
      name: 'Family',
      badge: 'Free for 1 month',
      price: '$16.99 / month after',
      accounts: 'Up to 6 accounts',
      color: 'from-purple-600 to-indigo-600',
      features: [
        '6 Premium accounts for family members',
        'Block explicit music for children',
        'Spotify Kids app access',
        'Family Mix playlist',
        'Cancel anytime',
      ],
      recommended: false,
    },
    {
      id: 'student',
      name: 'Student',
      badge: 'Free for 1 month',
      price: '$5.99 / month after',
      accounts: '1 verified student account',
      color: 'from-teal-600 to-emerald-600',
      features: [
        'Special discount for eligible students',
        'Hulu (With Ads) subscription included',
        'Ad-free music listening',
        'Download for offline study',
        'Cancel anytime',
      ],
      recommended: false,
    },
  ];

  const handleSelectPlan = (plan) => {
    showToast(`Subscribed to Spotify Premium ${plan.name}! Enjoy unlimited music.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#181818] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1db954]/20 text-[#1db954] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spotify Premium</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            Get 1 Month Free of Premium
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Enjoy ad-free music, offline listening, and unlimited skips. Cancel anytime online.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col justify-between p-5 rounded-xl border transition-all duration-200 ${
                plan.recommended
                  ? 'bg-gradient-to-b from-white/10 to-[#1e1e1e] border-[#1db954] shadow-lg shadow-[#1db954]/10 scale-[1.02]'
                  : 'bg-[#202020] border-white/10 hover:border-white/30'
              }`}
            >
              {plan.recommended && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#1db954] text-black text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                  Most Popular
                </span>
              )}

              <div>
                <span className="inline-block text-[11px] font-bold text-zinc-400 mb-1">
                  {plan.badge}
                </span>
                <h3 className="text-xl font-black text-white tracking-tight mb-1">
                  {plan.name}
                </h3>
                <div className="text-xs font-semibold text-[#1db954] mb-1">
                  {plan.price}
                </div>
                <div className="text-[11px] text-zinc-400 mb-4 pb-3 border-b border-white/10">
                  {plan.accounts}
                </div>

                <ul className="space-y-2.5 mb-6 text-xs text-zinc-300">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#1db954] shrink-0 mt-0.5" />
                      <span className="leading-tight">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSelectPlan(plan)}
                className={`w-full py-2.5 rounded-full text-xs font-bold transition-transform hover:scale-105 active:scale-95 shadow-md ${
                  plan.recommended
                    ? 'bg-[#1db954] hover:bg-[#1ed760] text-black'
                    : 'bg-white hover:bg-zinc-100 text-black'
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        {/* Footer Guarantee */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 pt-4 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#1db954]" />
            <span>Secure payment checkout</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#1db954]" />
            <span>Instant activation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Music2 className="w-4 h-4 text-[#1db954]" />
            <span>Cancel anytime with 1-click</span>
          </div>
        </div>
      </div>
    </div>
  );
}
