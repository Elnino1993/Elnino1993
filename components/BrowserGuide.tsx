import React from 'react';
import { MoreHorizontal, Compass, Share } from 'lucide-react';

interface BrowserGuideProps {
  userAgent: string;
}

export const BrowserGuide: React.FC<BrowserGuideProps> = ({ userAgent }) => {
  const isIOS = /iPhone|iPad|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);

  if (!isIOS && !isAndroid) return null;

  return (
    <div className="mt-8 p-4 bg-slate-100 rounded-lg text-sm text-slate-600 border border-slate-200">
      <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
        In-App Browser Detected?
      </h4>
      <p className="mb-3">
        If the redirect doesn't work automatically, try forcing it open:
      </p>
      
      <ol className="list-decimal list-inside space-y-2 ml-1">
        {isIOS && (
          <li>
            Tap the <Compass className="w-4 h-4 inline mx-1" /> Safari icon or <MoreHorizontal className="w-4 h-4 inline mx-1" /> menu.
          </li>
        )}
        {isAndroid && (
          <li>
            Tap the <MoreHorizontal className="w-4 h-4 inline mx-1" /> menu icon (usually top right).
          </li>
        )}
        <li>Select <strong>"Open in {isIOS ? 'Safari' : 'Chrome/Browser'}"</strong></li>
      </ol>
    </div>
  );
};
