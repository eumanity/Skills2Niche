
import React from 'react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: User | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, user, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onTabChange('home')}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">S2N</div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Skill2Niche</h1>
          </div>
          
          <nav className="hidden md:flex gap-6">
            <button 
              onClick={() => onTabChange('engine')}
              className={`text-sm font-medium transition-colors ${activeTab === 'engine' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-100'}`}
            >
              Engine
            </button>
            <button 
              onClick={() => onTabChange('templates')}
              className={`text-sm font-medium transition-colors ${activeTab === 'templates' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-100'}`}
            >
              Templates
            </button>
            <button 
              onClick={() => onTabChange('playbook')}
              className={`text-sm font-medium transition-colors ${activeTab === 'playbook' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-100'}`}
            >
              Playbook
            </button>
          </nav>

          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-white leading-none">{user.name}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{user.email}</p>
                </div>
                <button 
                  onClick={onLogout}
                  className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                  title="Logout"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V4" /></svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        Skill2Niche &copy; {new Date().getFullYear()} - Professional Automation Opportunity Engine
      </footer>
    </div>
  );
};
