
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { BlueprintView } from './components/BlueprintView';
import { TemplatesLibrary } from './components/TemplatesLibrary';
import { AuthFlow } from './components/AuthFlow';
import { 
  SkillProfile, 
  Niche, 
  Idea, 
  ExperienceLevel, 
  PlaybookEntry, 
  PlaybookStatus,
  Blueprint,
  User
} from './types';
import { generateIdeasForNiches, generateBlueprint } from './services/geminiService';
import { PRESET_NICHES, POPULAR_TOOLS } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [profile, setProfile] = useState<SkillProfile>({
    skills: [],
    tools: [],
    experience: ExperienceLevel.INTERMEDIATE,
    preferredClients: []
  });
  const [selectedNiches, setSelectedNiches] = useState<Niche[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [playbook, setPlaybook] = useState<PlaybookEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewingIdea, setViewingIdea] = useState<Idea | null>(null);
  const [generatingBlueprint, setGeneratingBlueprint] = useState(false);

  // Persistence logic keyed by user
  useEffect(() => {
    const savedUser = localStorage.getItem('s2n_current_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      loadUserData(parsedUser.id);
    }
  }, []);

  const loadUserData = (userId: string) => {
    const savedPlaybook = localStorage.getItem(`s2n_playbook_${userId}`);
    if (savedPlaybook) setPlaybook(JSON.parse(savedPlaybook));
    
    const savedProfile = localStorage.getItem(`s2n_profile_${userId}`);
    if (savedProfile) setProfile(JSON.parse(savedProfile));
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem(`s2n_playbook_${user.id}`, JSON.stringify(playbook));
    }
  }, [playbook, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`s2n_profile_${user.id}`, JSON.stringify(profile));
    }
  }, [profile, user]);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('s2n_current_user', JSON.stringify(newUser));
    loadUserData(newUser.id);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('s2n_current_user');
    setPlaybook([]);
    setProfile({
      skills: [],
      tools: [],
      experience: ExperienceLevel.INTERMEDIATE,
      preferredClients: []
    });
    setActiveTab('home');
  };

  const handleStartEngine = async () => {
    if (selectedNiches.length === 0) return alert('Select at least one niche!');
    setLoading(true);
    try {
      const generated = await generateIdeasForNiches(profile, selectedNiches);
      setIdeas(generated);
      setActiveTab('engine');
    } catch (error) {
      console.error(error);
      alert('Failed to generate ideas. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewBlueprint = async (idea: Idea) => {
    if (idea.blueprint) {
      setViewingIdea(idea);
      return;
    }

    setGeneratingBlueprint(true);
    try {
      const bp = await generateBlueprint(idea, profile);
      const updatedIdea = { ...idea, blueprint: bp };
      setIdeas(prev => prev.map(i => i.id === idea.id ? updatedIdea : i));
      setViewingIdea(updatedIdea);
    } catch (error) {
      console.error(error);
      alert('Error generating blueprint.');
    } finally {
      setGeneratingBlueprint(false);
    }
  };

  const saveToPlaybook = (idea: Idea) => {
    const exists = playbook.find(p => p.idea.id === idea.id);
    if (exists) return alert('Already in playbook!');
    
    const entry: PlaybookEntry = {
      id: Math.random().toString(36).substr(2, 9),
      idea,
      status: PlaybookStatus.IDEA,
      notes: '',
      createdAt: Date.now()
    };
    setPlaybook([entry, ...playbook]);
    setViewingIdea(null);
    setActiveTab('playbook');
  };

  const updatePlaybookStatus = (id: string, status: PlaybookStatus) => {
    setPlaybook(playbook.map(p => p.id === id ? { ...p, status } : p));
  };

  const deletePlaybookEntry = (id: string) => {
    if (confirm('Are you sure?')) {
      setPlaybook(playbook.filter(p => p.id !== id));
    }
  };

  if (!user) {
    return <AuthFlow onLogin={handleLogin} />;
  }

  const renderHome = () => (
    <div className="max-w-4xl mx-auto space-y-12 py-8 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-extrabold tracking-tight text-white leading-tight">
          Welcome back, <span className="text-blue-500">{user.name}</span>
        </h2>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto">
          Your technical profile is saved. Ready to find your next niche opportunity?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
        <section className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-6 shadow-xl">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
            1. Update Profile
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Technical Skills (Comma separated)</label>
              <input 
                type="text" 
                placeholder="n8n, Python, API Integration, GPT-4..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={profile.skills.join(', ')}
                onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(',').map(s => s.trim()) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Preferred Tools</label>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TOOLS.map(tool => (
                  <button 
                    key={tool}
                    onClick={() => {
                      const tools = profile.tools.includes(tool) 
                        ? profile.tools.filter(t => t !== tool) 
                        : [...profile.tools, tool];
                      setProfile({ ...profile, tools });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                      profile.tools.includes(tool) 
                        ? 'bg-blue-600 border-blue-500 text-white' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-6 shadow-xl">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
            2. Choose Niches
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {PRESET_NICHES.map(niche => (
              <button 
                key={niche.id}
                onClick={() => {
                  if (selectedNiches.find(n => n.id === niche.id)) {
                    setSelectedNiches(selectedNiches.filter(n => n.id !== niche.id));
                  } else if (selectedNiches.length < 5) {
                    setSelectedNiches([...selectedNiches, niche]);
                  }
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedNiches.find(n => n.id === niche.id)
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <p className="font-bold text-sm">{niche.name}</p>
                <p className="text-[10px] opacity-70 line-clamp-1">{niche.description}</p>
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 text-center">Selected {selectedNiches.length}/5 niches</p>
        </section>
      </div>

      <div className="flex justify-center pt-8">
        <button 
          onClick={handleStartEngine}
          disabled={loading || selectedNiches.length === 0}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-bold px-12 py-4 rounded-2xl shadow-2xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Thinking...
            </>
          ) : 'Relaunch Engine'}
        </button>
      </div>
    </div>
  );

  const renderEngine = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-3xl font-bold">Opportunity Engine</h2>
          <p className="text-slate-400">Validated business problems for your selected niches.</p>
        </div>
        <button 
          onClick={() => setActiveTab('home')}
          className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Modify Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.map((idea) => {
          const niche = PRESET_NICHES.find(n => n.id === idea.nicheId);
          return (
            <div 
              key={idea.id} 
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col hover:border-blue-500/50 transition-all hover:shadow-xl hover:shadow-blue-500/5 group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-[10px] font-bold uppercase tracking-wider">
                  {niche?.name}
                </span>
                <span className="text-blue-500 font-bold text-sm">{idea.monetizationModel}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 leading-snug">{idea.title}</h3>
              <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-1 italic">
                "{idea.problemStatement}"
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                   <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Target Client</p>
                   <p className="text-xs text-slate-200">{idea.targetClient}</p>
                </div>
                <button 
                  onClick={() => handleViewBlueprint(idea)}
                  className="w-full bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-600/20 hover:border-blue-600 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  {generatingBlueprint && viewingIdea?.id === idea.id ? 'Generating...' : 'Unlock Blueprint'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderPlaybook = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-3xl font-bold">Business Playbook</h2>
          <p className="text-slate-400">Manage your active offers and client pipeline.</p>
        </div>
      </div>

      {playbook.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-3xl">
          <p className="text-slate-500 text-lg">Your playbook is empty. Save some ideas from the engine!</p>
          <button 
            onClick={() => setActiveTab('home')}
            className="mt-4 text-blue-500 hover:underline font-medium"
          >
            Go to Engine
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.values(PlaybookStatus).map(status => (
            <div key={status} className="space-y-4">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-2">{status}</h3>
              <div className="space-y-4">
                {playbook.filter(p => p.status === status).map(entry => (
                  <div key={entry.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-600 transition-colors group">
                    <h4 className="font-bold text-white text-sm mb-1">{entry.idea.title}</h4>
                    <p className="text-xs text-slate-500 mb-4">{new Date(entry.createdAt).toLocaleDateString()}</p>
                    
                    <div className="flex items-center justify-between">
                      <select 
                        value={entry.status}
                        onChange={(e) => updatePlaybookStatus(entry.id, e.target.value as PlaybookStatus)}
                        className="bg-slate-800 text-[10px] font-bold text-slate-300 border-none rounded px-2 py-1 outline-none cursor-pointer"
                      >
                        {Object.values(PlaybookStatus).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setViewingIdea(entry.idea)}
                          className="p-1.5 hover:bg-slate-800 rounded text-slate-500 hover:text-blue-400"
                          title="View Blueprint"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        <button 
                          onClick={() => deletePlaybookEntry(entry.id)}
                          className="p-1.5 hover:bg-slate-800 rounded text-slate-500 hover:text-red-400"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} user={user} onLogout={handleLogout}>
      {activeTab === 'home' && renderHome()}
      {activeTab === 'engine' && renderEngine()}
      {activeTab === 'templates' && <TemplatesLibrary />}
      {activeTab === 'playbook' && renderPlaybook()}
      
      {viewingIdea && viewingIdea.blueprint && (
        <BlueprintView 
          idea={viewingIdea} 
          blueprint={viewingIdea.blueprint} 
          onClose={() => setViewingIdea(null)}
          onSave={() => saveToPlaybook(viewingIdea)}
        />
      )}

      {generatingBlueprint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md">
          <div className="text-center space-y-4">
             <div className="relative inline-block">
               <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
               </div>
             </div>
             <p className="text-white font-bold text-lg">Architecting Automation Blueprint...</p>
             <p className="text-slate-400 text-sm">Building node sequences and logic flows</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
