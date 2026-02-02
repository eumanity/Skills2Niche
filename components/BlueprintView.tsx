
import React, { useState } from 'react';
import { Idea, Blueprint } from '../types';
import { generateN8NJson } from '../services/geminiService';

interface BlueprintViewProps {
  idea: Idea;
  blueprint: Blueprint;
  onClose: () => void;
  onSave: () => void;
}

export const BlueprintView: React.FC<BlueprintViewProps> = ({ idea, blueprint, onClose, onSave }) => {
  const [copied, setCopied] = useState(false);
  const [generatingJson, setGeneratingJson] = useState(false);
  const [workflowJson, setWorkflowJson] = useState<string | null>(idea.workflowJson || null);

  const handleShare = async () => {
    const shareText = `
🚀 Skill2Niche Automation Recipe: ${idea.title}
Target: ${idea.targetClient}
Goal: ${blueprint.goal}

Trigger: ${blueprint.trigger}
Inputs: ${blueprint.inputs.join(', ')}

Steps:
${blueprint.steps.map((s, i) => `${i + 1}. [${s.type}] ${s.name}: ${s.description}`).join('\n')}

Error Handling: ${blueprint.errorHandling}
    `.trim();

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Automation Recipe: ${idea.title}`,
          text: shareText,
          url: window.location.href
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const handleCopyJson = async () => {
    if (workflowJson) {
      navigator.clipboard.writeText(workflowJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }

    setGeneratingJson(true);
    try {
      const json = await generateN8NJson(idea);
      setWorkflowJson(json);
      idea.workflowJson = json; // Local update
      navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
      alert('Failed to generate JSON');
    } finally {
      setGeneratingJson(false);
    }
  };

  const getNodeColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('trigger')) return 'border-orange-500/50 text-orange-400 bg-orange-500/10';
    if (t.includes('logic') || t.includes('if') || t.includes('filter')) return 'border-purple-500/50 text-purple-400 bg-purple-500/10';
    if (t.includes('code') || t.includes('function') || t.includes('set')) return 'border-blue-500/50 text-blue-400 bg-blue-500/10';
    return 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div>
            <h2 className="text-2xl font-bold text-white">{idea.title}</h2>
            <p className="text-slate-400 text-sm mt-1">{idea.targetClient}</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors border border-slate-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {copied ? 'Copied!' : 'Share'}
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-10">
          <section>
            <h3 className="text-blue-400 font-semibold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              The Solution Strategy
            </h3>
            <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50 shadow-inner">
              <p className="text-slate-200 leading-relaxed">{idea.outcome}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <div className="px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-bold flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  MONETIZATION: {idea.monetizationModel}
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-indigo-400 font-semibold flex items-center gap-2 text-sm uppercase tracking-wider">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                n8n Automation Architecture
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={handleCopyJson}
                  disabled={generatingJson}
                  className="text-[10px] bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 px-3 py-1 rounded-full flex items-center gap-1.5 border border-indigo-500/30 transition-colors uppercase tracking-widest font-bold disabled:opacity-50"
                >
                  {generatingJson ? (
                    <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                  )}
                  {generatingJson ? 'Coding...' : (workflowJson ? 'Copy JSON Workflow' : 'Generate n8n JSON')}
                </button>
                <button 
                  onClick={() => {
                    const stepsText = blueprint.steps.map((s, i) => `${i + 1}. [${s.type}] ${s.name}: ${s.description}`).join('\n');
                    navigator.clipboard.writeText(stepsText);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-400 px-3 py-1 rounded-full flex items-center gap-1.5 border border-slate-700 transition-colors uppercase tracking-widest font-bold"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  Copy Steps
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 opacity-50"></div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-tighter">Workflow Entry</p>
                  <p className="text-white font-medium text-sm">{blueprint.trigger}</p>
                </div>
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-50"></div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-tighter">Connections Needed</p>
                  <p className="text-white font-medium text-sm">{blueprint.inputs.join(', ')}</p>
                </div>
              </div>

              <div className="relative pt-4">
                <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-slate-800 via-indigo-500/20 to-slate-800 hidden sm:block"></div>
                <div className="space-y-6">
                  {blueprint.steps.map((step, i) => (
                    <div key={i} className="relative flex flex-col sm:flex-row gap-4 group">
                      <div className="hidden sm:flex shrink-0 w-12 h-12 bg-slate-900 border-2 border-slate-800 rounded-2xl items-center justify-center text-sm font-bold text-slate-400 group-hover:border-indigo-500/50 group-hover:text-indigo-400 transition-all z-10 shadow-lg">
                        {i + 1}
                      </div>
                      <div className="flex-1 bg-slate-800/30 border border-slate-800 rounded-2xl p-5 hover:bg-slate-800/50 transition-all group-hover:border-slate-700 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <h4 className="font-bold text-white text-base">
                            <span className="sm:hidden text-indigo-500 mr-2">{i+1}.</span>
                            {step.name}
                          </h4>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${getNodeColor(step.type)}`}>
                            {step.type}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 p-5 bg-red-500/5 rounded-2xl border border-red-500/10 flex gap-4 items-start">
                <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <div>
                  <p className="text-[10px] text-red-400 uppercase font-black tracking-widest mb-1">Stability Recommendation</p>
                  <p className="text-slate-300 text-sm italic">"{blueprint.errorHandling}"</p>
                </div>
              </div>
            </div>
          </section>

          <section className="pb-4">
            <h3 className="text-emerald-400 font-semibold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              Outreach & Pitch Hooks
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {idea.outreachAngles.map((angle, i) => (
                <div key={i} className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-slate-300 text-sm italic leading-relaxed relative">
                  <div className="absolute top-3 left-3 opacity-20">
                    <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 8.89543 14.017 10V13H11.017V10C11.017 7.23858 13.2556 5 16.017 5H19.017C21.7784 5 24.017 7.23858 24.017 10V15C24.017 18.3137 21.3307 21 18.017 21H14.017ZM0 21L0 18C0 16.8954 0.89543 16 2.017 16H5.017C5.56928 16 6.017 15.5523 6.017 15V9C6.017 8.44772 5.56928 8 5.017 8H2.017C0.912431 8 0.017 8.89543 0.017 10V13H-2.983V10C-2.983 7.23858 -0.744415 5 2.017 5H5.017C7.77843 5 10.017 7.23858 10.017 10V15C10.017 18.3137 7.33072 21 4.017 21H0Z" /></svg>
                  </div>
                  <p className="pl-6">"{angle}"</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex gap-4">
          <button 
            onClick={onSave}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Add to My Playbook
          </button>
          <button 
            onClick={onClose}
            className="px-6 border border-slate-700 text-slate-300 font-medium py-3 rounded-xl hover:bg-slate-800 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
