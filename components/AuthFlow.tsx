
import React, { useState } from 'react';
import { User } from '../types';

interface AuthFlowProps {
  onLogin: (user: User) => void;
}

export const AuthFlow: React.FC<AuthFlowProps> = ({ onLogin }) => {
  const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (view === 'login') {
      // Mock login
      if (email && password) {
        onLogin({ id: 'user_1', email, name: email.split('@')[0] });
      }
    } else if (view === 'signup') {
      // Mock signup
      setMessage({ type: 'success', text: 'Account created! You can now log in.' });
      setView('login');
    } else if (view === 'forgot') {
      // Mock forgot password
      setMessage({ type: 'success', text: 'Password reset link sent to your email.' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 bg-blue-600 rounded-xl items-center justify-center font-bold text-white text-xl mb-4 shadow-lg shadow-blue-500/20">S2N</div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {view === 'login' && 'Welcome Back'}
            {view === 'signup' && 'Create Account'}
            {view === 'forgot' && 'Reset Password'}
          </h1>
          <p className="text-slate-400 mt-2">
            {view === 'login' && 'Log in to access your opportunity engine.'}
            {view === 'signup' && 'Start building your automation agency today.'}
            {view === 'forgot' && 'Enter your email to receive a recovery link.'}
          </p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium border ${
            message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {view === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {view !== 'forgot' && (
            <div>
              <div className="flex justify-between mb-1.5 ml-1">
                <label className="text-sm font-medium text-slate-400">Password</label>
                {view === 'login' && (
                  <button type="button" onClick={() => setView('forgot')} className="text-xs text-blue-500 hover:text-blue-400">Forgot?</button>
                )}
              </div>
              <input 
                type="password" 
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] mt-2"
          >
            {view === 'login' && 'Sign In'}
            {view === 'signup' && 'Create Account'}
            {view === 'forgot' && 'Send Recovery Link'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-slate-400 text-sm">
            {view === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => setView(view === 'login' ? 'signup' : 'login')}
              className="text-blue-500 font-bold hover:text-blue-400"
            >
              {view === 'login' ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
