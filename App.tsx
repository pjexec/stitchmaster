
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PromptFormData, DEFAULT_TEMPLATE } from './types';
import { generateBlueprint } from './services/geminiService';

// --- Subcomponents ---

const FormField: React.FC<{
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: 'text' | 'textarea';
}> = ({ id, label, placeholder, value, onChange, type = 'text' }) => (
  <div className="flex flex-col gap-1.5 mb-4">
    <label htmlFor={id} className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
      {label.replace('_', ' ')}
    </label>
    {type === 'text' ? (
      <input
        id={id}
        type="text"
        className="bg-zinc-900 border border-zinc-800 text-zinc-100 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    ) : (
      <textarea
        id={id}
        rows={3}
        className="bg-zinc-900 border border-zinc-800 text-zinc-100 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm resize-none"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    )}
  </div>
);

const SectionHeader: React.FC<{ title: string; icon?: React.ReactNode }> = ({ title, icon }) => (
  <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-2">
    {icon}
    <h2 className="text-lg font-bold text-zinc-100">{title}</h2>
  </div>
);

// --- Main App ---

export default function App() {
  const [formData, setFormData] = useState<PromptFormData>({
    APP_TYPE: '',
    MARKET_INDUSTRY: '',
    TARGET_AUDIENCE: '',
    VIBE_STYLE: '',
    AESTHETIC_PRIORITY: '',
    COLORS: '',
    ACCENT_COLORS: '',
    UX_EMOTION: '',
    KEY_FEATURES: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const interpolatedPrompt = useMemo(() => {
    let result = DEFAULT_TEMPLATE.prompt_template;
    (Object.keys(formData) as Array<keyof PromptFormData>).forEach((key) => {
      const value = formData[key] || `[${key}]`;
      // FIX: Use split().join() instead of replaceAll to avoid "Property 'replaceAll' does not exist" error
      result = result.split(`[${key}]`).join(value);
    });
    return result;
  }, [formData]);

  const handleInputChange = (key: keyof PromptFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await generateBlueprint(interpolatedPrompt);
      setOutput(response || "No content generated.");
    } catch (err: any) {
      setError(err.message || "An error occurred during generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(interpolatedPrompt);
    alert("Prompt copied to clipboard!");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black overflow-hidden">
      {/* Sidebar: Config Form */}
      <aside className="w-full md:w-[400px] border-r border-zinc-800 flex flex-col h-screen overflow-y-auto p-6 bg-zinc-950/50 backdrop-blur-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            STITCH MASTER
          </h1>
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-medium">
            AI-Driven UI Architecture
          </p>
        </div>

        <SectionHeader title="Configuration" />
        
        <div className="space-y-1">
          {Object.entries(DEFAULT_TEMPLATE.placeholders).map(([key, description]) => (
            <FormField
              key={key}
              id={key}
              label={key}
              placeholder={description}
              value={formData[key as keyof PromptFormData]}
              onChange={handleInputChange(key as keyof PromptFormData)}
              type={key === 'KEY_FEATURES' ? 'textarea' : 'text'}
            />
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-zinc-800">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              isGenerating
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 active:scale-95'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full"></div>
                Architecting...
              </>
            ) : (
              'Generate Blueprint'
            )}
          </button>
        </div>
      </aside>

      {/* Main Content: Preview and Output */}
      <main className="flex-1 h-screen overflow-y-auto bg-[#0a0a0a] relative">
        <div className="max-w-4xl mx-auto p-6 lg:p-12 space-y-10">
          
          {/* Prompt Preview Card */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <SectionHeader title="Prompt Blueprint" />
              <button 
                onClick={handleCopyPrompt}
                className="text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                Copy Prompt
              </button>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none text-6xl font-black select-none">
                STITCH
              </div>
              <p className="text-zinc-300 leading-relaxed mono text-sm whitespace-pre-wrap">
                {interpolatedPrompt}
              </p>
            </div>
          </section>

          {/* AI Output Section */}
          <section className="min-h-[500px]">
            <SectionHeader title="Blueprint Design" />
            
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-800/50 text-red-200 rounded-xl mb-6 flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {!output && !isGenerating && (
              <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-500">
                <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-medium">Ready to start the design engine.</p>
                <p className="text-xs mt-1 opacity-60">Fill the configuration and click "Generate Blueprint"</p>
              </div>
            )}

            {isGenerating && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-blue-400 font-medium animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>Gemini 3 is thinking about your architecture...</span>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-zinc-900 rounded-full w-full animate-pulse"></div>
                  <div className="h-4 bg-zinc-900 rounded-full w-[90%] animate-pulse"></div>
                  <div className="h-4 bg-zinc-900 rounded-full w-[70%] animate-pulse"></div>
                  <div className="h-4 bg-zinc-900 rounded-full w-full animate-pulse"></div>
                  <div className="h-4 bg-zinc-900 rounded-full w-[60%] animate-pulse"></div>
                </div>
              </div>
            )}

            {output && !isGenerating && (
              <div className="bg-zinc-900/30 rounded-2xl p-8 border border-zinc-800 text-zinc-100 prose prose-invert max-w-none shadow-2xl">
                <div className="markdown-content space-y-4">
                  {output.split('\n').map((line, i) => {
                    if (line.startsWith('###')) {
                      return <h3 key={i} className="text-xl font-bold text-blue-400 mt-6 mb-2">{line.replace('###', '')}</h3>;
                    }
                    if (line.startsWith('##')) {
                      return <h2 key={i} className="text-2xl font-black text-white border-b border-zinc-800 pb-2 mt-10 mb-4 tracking-tight">{line.replace('##', '')}</h2>;
                    }
                    if (line.startsWith('**')) {
                      return <p key={i} className="leading-relaxed mb-4"><span className="font-bold text-zinc-100">{line}</span></p>;
                    }
                    if (line.trim() === '') return <div key={i} className="h-4"></div>;
                    return <p key={i} className="text-zinc-400 leading-relaxed mb-4">{line}</p>;
                  })}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Floating Footer */}
        <footer className="sticky bottom-0 w-full p-4 border-t border-zinc-900 bg-black/80 backdrop-blur-md flex justify-between items-center px-8 z-10">
          <div className="text-[10px] text-zinc-600 font-mono tracking-widest uppercase">
            Framework: Google Stitch v1.0 • Engine: Gemini 3 Pro
          </div>
          <div className="flex gap-4">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-widest">Documentation</a>
            <span className="text-zinc-800">|</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Status: Ready</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
