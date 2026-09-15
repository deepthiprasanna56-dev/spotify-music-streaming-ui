import { useState } from 'react';
import { Eye, EyeOff, LockKeyhole, Mail, UserRound, X } from 'lucide-react';

export default function AuthModal({ isOpen, mode, onClose, onAuthenticated, onSwitchMode }) {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  if (!isOpen) return null;

  const isSignup = mode === 'signup';
  const handleSubmit = (event) => {
    event.preventDefault();
    const name = isSignup ? form.name.trim() || form.email.split('@')[0] : 'Alex Rivera';
    const session = { name, email: form.email.trim(), avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' };
    localStorage.setItem('spotify_session', JSON.stringify(session));
    onAuthenticated(session);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#151515] p-6 sm:p-8 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white" aria-label="Close authentication dialog"><X className="h-5 w-5" /></button>
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#1ed760] text-black"><LockKeyhole className="h-5 w-5" /></div>
          <h2 className="display-heading text-3xl font-bold text-white">{isSignup ? 'Join the sound' : 'Welcome back'}</h2>
          <p className="mt-2 text-sm text-zinc-400">{isSignup ? 'Create your free account and keep your music close.' : 'Sign in to pick up where you left off.'}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && <label className="block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-400">Display name</span><div className="relative"><UserRound className="absolute left-3 top-3 h-4 w-4 text-zinc-500" /><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white outline-none focus:border-[#1ed760]" placeholder="Your name" /></div></label>}
          <label className="block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-400">Email</span><div className="relative"><Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" /><input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white outline-none focus:border-[#1ed760]" placeholder="you@example.com" /></div></label>
          <label className="block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-400">Password</span><div className="relative"><LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-zinc-500" /><input required minLength={6} type={showPassword ? 'text' : 'password'} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-white outline-none focus:border-[#1ed760]" placeholder="At least 6 characters" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-zinc-500 hover:text-white" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></label>
          <button type="submit" className="w-full rounded-full bg-[#1ed760] py-3 text-sm font-bold text-black transition-colors hover:bg-white">{isSignup ? 'Create account' : 'Log in'}</button>
        </form>
        <p className="mt-6 text-center text-xs text-zinc-400">{isSignup ? 'Already have an account?' : 'New to Spotify?'} <button onClick={onSwitchMode} className="font-bold text-white hover:text-[#1ed760]">{isSignup ? 'Log in' : 'Sign up'}</button></p>
        <p className="mt-5 text-center text-[10px] leading-relaxed text-zinc-500">Demo authentication only. Your session stays on this device.</p>
      </div>
    </div>
  );
}