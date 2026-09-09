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

  const getSlotLayout = () => {
    switch (type) {
      case 'banner':
        return 'min-h-[90px] md:min-h-[100px] max-w-[970px]';
      case 'sidebar':
        return 'min-h-[250px] md:min-h-[300px] w-full';
      case 'inline':
        return 'min-h-[90px] md:min-h-[120px] w-full';
      case 'sticky':
        return 'h-[60px] w-full';
      default:
        return 'min-h-[90px] w-full';
    }
  };

  return (
    <div className={`w-full flex flex-col justify-center items-center my-4 overflow-hidden ${className}`}>
      {/* Official Google AdSense Tag */}
      <ins
        className={`adsbygoogle block w-full ${getSlotLayout()} text-center`}
        style={{ display: 'block' }}
        data-ad-client={formattedClient}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
