import React, { useEffect, useRef } from 'react';

interface AdSenseProps {
  slotId: string;
  type?: 'banner' | 'sidebar' | 'inline' | 'sticky';
  className?: string;
}

export default function AdSenseMock({ slotId, type = 'banner', className = '' }: AdSenseProps) {
  const pubId = import.meta.env.VITE_ADSENSE_PUBLISHER_ID || "ca-pub-9552509372228899";
  const formattedClient = pubId.startsWith('ca-') ? pubId : `ca-${pubId}`;
  const isPushed = useRef(false);

  useEffect(() => {
    if (isPushed.current) return;
    try {
      if (typeof window !== 'undefined') {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        isPushed.current = true;
      }
    } catch (e) {
      // Ad blocker or script loading
    }
  }, [slotId]);

  return (
    <div className={`w-full flex flex-col justify-center items-center overflow-hidden empty:hidden ${className}`}>
      {/* Official Google AdSense Tag */}
      <ins
        className="adsbygoogle block w-full text-center"
        style={{ display: 'block' }}
        data-ad-client={formattedClient}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
