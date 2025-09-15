
import React, { useState } from 'react';
import { generateKaomoji } from '../services/geminiService';
import { KaomojiCard } from './KaomojiCard';

const LoadingSpinner: React.FC = () => (
  <div className="w-8 h-8 border-4 border-slate-500 border-t-cyan-400 border-solid rounded-full animate-spin"></div>
);

export const Generator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedKaomoji, setGeneratedKaomoji] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const examplePrompts = [
    'wizard casting a spell',
    'surprised owl',
    'robot DJ',
    'person bowing respectfully',
  ];

  const handleGenerate = async (promptOverride?: string) => {
    const finalPrompt = promptOverride || prompt;
    if (!finalPrompt.trim() || isLoading) return;
    
    if(promptOverride) {
      setPrompt(finalPrompt);
    }

    setIsLoading(true);
    setError(null);
    setGeneratedKaomoji(null);
    setCopied(false);

    try {
      const result = await generateKaomoji(finalPrompt);
      setGeneratedKaomoji(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  }

  const handleCopy = () => {
    if (generatedKaomoji) {
      navigator.clipboard.writeText(generatedKaomoji);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-2 text-fuchsia-400">AI Kaomoji Generator</h2>
      <p className="text-center text-slate-400 mb-6 text-sm sm:text-base">Describe a kaomoji and let AI bring it to life!</p>
      
      <div className="space-y-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g., 'a cat hiding in a box'"
          className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition duration-300"
          disabled={isLoading}
        />
        <button
          onClick={() => handleGenerate()}
          disabled={isLoading || !prompt.trim()}
          className="w-full px-6 py-3 bg-fuchsia-600 text-white font-semibold rounded-lg hover:bg-fuchsia-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition duration-300 flex items-center justify-center gap-2"
        >
          {isLoading ? <LoadingSpinner /> : 'Generate'}
        </button>
      </div>

      <div className="mt-4 text-center">
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="text-slate-400 text-sm self-center">Try an example:</span>
          {examplePrompts.map((p) => (
            <button
              key={p}
              onClick={() => handleGenerate(p)}
              className="px-3 py-1 sm:px-4 sm:py-2 bg-slate-700 text-slate-300 rounded-full text-xs sm:text-sm hover:bg-slate-600 transition-colors duration-200"
              disabled={isLoading}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 min-h-[112px] flex items-center justify-center bg-slate-900/50 rounded-lg p-4">
        {isLoading && <LoadingSpinner />}
        {error && <p className="text-red-400 text-center">{error}</p>}
        {generatedKaomoji && (
           <KaomojiCard
            kaomoji={generatedKaomoji}
            onClick={handleCopy}
            title="Click to copy"
          >
            {copied && (
                <span className="text-cyan-400 font-bold transition-opacity duration-300 opacity-100">
                    Copied!
                </span>
            )}
          </KaomojiCard>
        )}
        {!isLoading && !error && !generatedKaomoji && (
          <p className="text-slate-500">Your generated kaomoji will appear here...</p>
        )}
      </div>
    </div>
  );
};