import React, { useEffect } from 'react';
import { AdsenseAd } from './AdsenseAd';

interface InterstitialAdProps {
  onClose: () => void;
}

export const InterstitialAd: React.FC<InterstitialAdProps> = ({ onClose }) => {
  useEffect(() => {
    // Automatically close the ad overlay after a delay to proceed to the content
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // 4-second delay for the ad to be visible

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 animate-fade-in p-4">
        <div className="text-white text-lg mb-4 font-semibold">Advertisement</div>
        <div className="bg-white p-1 rounded-lg shadow-lg shadow-fuchsia-500/20">
             <AdsenseAd 
                client="ca-pub-3685000706717214"
                slot="2760671227" // Use valid ad slot
                style={{ width: '300px', height: '250px' }} // Common interstitial size
             />
        </div>
        <p className="text-slate-400 mt-4 text-sm">You will be redirected shortly...</p>
    </div>
  );
};