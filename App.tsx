import React, { useEffect, useState } from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';

const LINKS = [
  "https://onlyfans.com/tasty_marie/c8",
  "https://onlyfans.com/yoourpriincess/c7",
  "https://onlyfans.com/natsunya/c10",
  "https://onlyfans.com/medixkate/c59",
  "https://onlyfans.com/eva_millerr/c6",
  "https://onlyfans.com/tori_hayes/c104",
  "https://onlyfans.com/mollylo/c8",
  "https://onlyfans.com/sofaaaaaaaaaa/c5",
  "https://onlyfans.com/hillary_sweets/c110",
  "https://onlyfans.com/paula_flores/c16",
  "https://onlyfans.com/nicole_angel/c57",
  "https://onlyfans.com/sofiaaamillerrr/c54"
];

const App = () => {
  const [targetUrl, setTargetUrl] = useState<string>('');
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    // Select a random link on mount
    const randomIndex = Math.floor(Math.random() * LINKS.length);
    const selectedUrl = LINKS[randomIndex];
    setTargetUrl(selectedUrl);

    // Attempt automatic redirect
    performRedirect(selectedUrl);
  }, []);

  const performRedirect = (url: string) => {
    // 1. Standard redirect attempt
    window.location.href = url;

    // 2. Android specific: Try to force Chrome via Intent (breaks out of in-app browsers)
    if (/Android/i.test(navigator.userAgent)) {
      const cleanUrl = url.replace(/^https?:\/\//, '');
      // This intent specifically asks for the package com.android.chrome
      const intentUrl = `intent://${cleanUrl}#Intent;scheme=https;package=com.android.chrome;end`;
      
      setTimeout(() => {
        window.location.href = intentUrl;
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl text-center space-y-6">
        
        <div className="flex justify-center">
          <div className="p-4 bg-blue-600/20 rounded-full text-blue-400 animate-pulse">
            <ExternalLink className="w-10 h-10" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Redirecting...</h1>
          <p className="text-slate-400 text-sm">
            Opening content in your browser.
          </p>
        </div>

        <div className="flex justify-center py-4">
           <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>

        <button
          onClick={() => performRedirect(targetUrl)}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-900/20"
        >
          Click if not redirected
        </button>

        <p className="text-xs text-slate-500 pt-4">
          ID: {targetUrl ? targetUrl.split('/').pop() : '...'}
        </p>
      </div>
    </div>
  );
};

export default App;