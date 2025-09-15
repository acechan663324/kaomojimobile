import React, { useEffect } from 'react';

interface AdsenseAdProps {
  client: string;
  slot: string;
  style?: React.CSSProperties;
  className?: string;
}

export const AdsenseAd: React.FC<AdsenseAdProps> = ({ client, slot, style, className }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={client}
        data-ad-slot={slot}
      ></ins>
    </div>
  );
};
