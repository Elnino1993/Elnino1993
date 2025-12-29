import React, { useState, useEffect, useCallback } from 'react';
import { ExternalLink, Link2, ArrowRight, Search, Copy, Check } from 'lucide-react';
import { analyzeLink } from './services/geminiService';
import { LinkAnalysis } from './types';
import { LinkCard } from './components/LinkCard';
import { BrowserGuide } from './components/BrowserGuide';

const App = () => {
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState<LinkAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Parse URL from query param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get('url') || params.get('q');
    if (urlParam) {
      let decodedUrl = decodeURIComponent(urlParam);
      // Ensure protocol exists
      if (!decodedUrl.startsWith('http://') && !decodedUrl.startsWith('https://')) {
        decodedUrl = 'https://' + decodedUrl;
      }
      setUrl(decodedUrl);
      handleAnalyze(decodedUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnalyze = async (targetUrl: string) => {
    if (!targetUrl) return;
    setLoading(true);
    setAnalysis(null);
    setError(null);

    try {
      const result = await analyzeLink(targetUrl);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError("Unable to analyze link. You can still open it below.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    if (!url) return;
    
    let target = url;
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = 'https://' + target;
    }

    // Attempt to open in new window/tab
    window.open(target, '_blank', 'noopener,noreferrer');

    // Android specific Intent fallback (Chrome)
    if (/Android/.test(navigator.userAgent)) {
      const cleanUrl = target.replace(/^https?:\/\//, '');
      const intentUrl = `intent://${cleanUrl}#Intent;scheme=https;package=com.android.chrome;end`;
      // We create a hidden iframe or just try location assign for intent
      try {
          window.location.href = intentUrl;
      } catch (e) {
          console.log("Intent fallback failed", e);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    // Clear analysis if user changes URL significantly
    if (analysis) setAnalysis(null);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (analysis) {
        handleOpen();
      } else {
        let target = url;
        if (!target.startsWith('http://') && !target.startsWith('https://')) {
            target = 'https://' + target;
        }
        handleAnalyze(target);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 md:p-8">
      <main className="w-full max-w-md space-y-6 mt-8 md:mt-16">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-xl mb-4 rotate-3 hover:rotate-6 transition-transform">
            <ExternalLink className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            LinkOut <span className="text-blue-600">AI</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Smart redirect & link analyzer
          </p>
        </div>

        {/* URL Input */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Link2 className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-12 py-4 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            placeholder="Paste a link to open..."
            value={url}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            autoFocus
          />
          {url && (
             <button 
                onClick={handleCopy}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                title="Copy Link"
             >
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
             </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-3">
          {!analysis && url && (
             <button
                onClick={() => handleAnalyze(url.startsWith('http') ? url : `https://${url}`)}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-all active:scale-[0.98] shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Scanning...' : (
                  <>
                    <Search className="w-5 h-5" />
                    Analyze with Gemini
                  </>
                )}
              </button>
          )}
          
          {(analysis || !url) && (
            <button
                onClick={handleOpen}
                disabled={!url}
                className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold transition-all active:scale-[0.98] shadow-lg
                    ${!url ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'}
                `}
            >
                <span>Open in Browser</span>
                <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Gemini Results Card */}
        <LinkCard url={url} analysis={analysis} loading={loading} />

        {/* Error Message */}
        {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 text-center animate-fade-in">
                {error}
            </div>
        )}

        {/* Helper for In-App Browsers */}
        <BrowserGuide userAgent={navigator.userAgent} />

        {/* Footer */}
        <div className="text-center text-xs text-slate-300 mt-12">
            LinkOut AI uses Gemini Flash for link safety checks.
        </div>

      </main>
    </div>
  );
};

export default App;
