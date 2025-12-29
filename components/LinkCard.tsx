import React from 'react';
import { ShieldCheck, ShieldAlert, Globe, ExternalLink, Loader2 } from 'lucide-react';
import { LinkAnalysis } from '../types';

interface LinkCardProps {
  url: string;
  analysis: LinkAnalysis | null;
  loading: boolean;
}

export const LinkCard: React.FC<LinkCardProps> = ({ url, analysis, loading }) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-pulse">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="h-16 bg-slate-200 rounded w-full mb-2"></div>
        <div className="flex items-center justify-center text-slate-500 text-sm mt-4 gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Analyzing link with Gemini...</span>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 transition-all duration-300 transform translate-y-0">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${analysis.isSafe ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
            {analysis.isSafe ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800">{analysis.title}</h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium uppercase tracking-wide">
              <Globe className="w-3 h-3" />
              {analysis.category}
            </div>
          </div>
        </div>
      </div>

      <p className="text-slate-600 text-sm leading-relaxed mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
        {analysis.summary}
      </p>
      
      <div className="text-xs text-slate-400 text-center">
        Powered by Google Gemini
      </div>
    </div>
  );
};
