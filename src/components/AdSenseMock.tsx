import React, { useEffect, useRef } from 'react';

interface AdSenseProps {
  slotId: string;
  type?: 'banner' | 'sidebar' | 'inline' | 'sticky';
  className?: string;
}

export default function AdSenseMock({ slotId, type = 'banner', className = '' }: AdSenseProps) {
  const pubId = import.meta.env.VITE_ADSENSE_PUBLISHER_ID || "pub-9552509372228899";
  const isPushed = useRef(false);

  useEffect(() => {
    // Only push once per component mount
    if (isPushed.current) return;
    try {
      if (typeof window !== 'undefined') {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        isPushed.current = true;
      }
    } catch (e) {
      console.warn("AdSense push execution skipped or ad blocker detected:", e);
    }
  }, [slotId]);

  const getSlotLayout = () => {
    switch (type) {
      case 'banner':
        return 'min-h-[90px] md:min-h-[120px] max-w-[970px]';
      case 'sidebar':
        return 'min-h-[250px] md:min-h-[600px] w-full';
      case 'inline':
        return 'min-h-[100px] md:min-h-[250px] w-full';
      case 'sticky':
        return 'h-[60px] w-full';
      default:
        return 'min-h-[90px] w-full';
    }
  };

  return (
    <div className={`w-full flex justify-center items-center my-3 overflow-hidden ${className}`}>
      {/* Standard Google AdSense Insertion Tag */}
      <ins
        className={`adsbygoogle block w-full ${getSlotLayout()}`}
        style={{ display: 'block' }}
        data-ad-client={`ca-${pubId}`}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
