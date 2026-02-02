
import React, { useState } from 'react';
import { PRESET_TEMPLATES } from '../constants';

export const TemplatesLibrary: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, json: string) => {
    navigator.clipboard.writeText(json);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-3xl font-bold">n8n Template Library</h2>
          <p className="text-slate-400">Ready-made JSON workflows to kickstart your automation service.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRESET_TEMPLATES.map((template) => (
          <div 
            key={template.id} 
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col hover:border-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/5 group"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="px-2 py-1 bg-slate-800 text-indigo-400 rounded text-[10px] font-bold uppercase tracking-wider">
                {template.niche}
              </span>
              <div className="flex gap-1">
                {template.tools.slice(0, 2).map(tool => (
                  <span key={tool} className="text-[10px] text-slate-500">{tool}</span>
                ))}
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 leading-snug">{template.title}</h3>
            <p className="text-slate-400 text-sm mb-6 flex-1 italic">
              {template.description}
            </p>
            
            <button 
              onClick={() => handleCopy(template.id, template.workflowJson)}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border ${
                copiedId === template.id 
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' 
                : 'bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border-indigo-600/20 hover:border-indigo-600'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {copiedId === template.id ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                )}
              </svg>
              {copiedId === template.id ? 'Copied to Clipboard' : 'Copy n8n JSON'}
            </button>
          </div>
        ))}
      </div>

      <div className="p-10 text-center bg-slate-900/30 border border-slate-800 rounded-3xl">
        <h4 className="text-white font-bold mb-2">Want custom templates?</h4>
        <p className="text-slate-400 text-sm mb-6">Use the Opportunity Engine to generate blueprints and click "Export n8n JSON" on any specific idea.</p>
        <button 
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          className="text-blue-400 hover:text-blue-300 font-bold text-sm"
        >
          Explore Engine Opportunities →
        </button>
      </div>
    </div>
  );
};
