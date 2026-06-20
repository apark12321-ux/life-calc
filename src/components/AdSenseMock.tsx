import React, { useState, useEffect } from 'react';
import { HelpCircle, Code, Check } from 'lucide-react';

interface AdSenseMockProps {
  slotId: string;
  type: 'banner' | 'sidebar' | 'inline' | 'sticky';
  height?: string;
}

export default function AdSenseMock({ slotId, type, height = 'h-[100px]' }: AdSenseMockProps) {
  const [showGuide, setShowGuide] = useState(false);
  const [copied, setCopied] = useState(false);

  // Read configured publisher ID from Vite env
  const pubId = import.meta.env.VITE_ADSENSE_PUBLISHER_ID || "pub-8884323201509376";

  useEffect(() => {
    // If we have an active AdSense window object, try to push
    try {
      if (typeof window !== 'undefined') {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      }
    } catch (e) {
      console.warn("AdSense push failed or ad-blocker active:", e);
    }
  }, [slotId]);

  const getDimensions = () => {
    switch (type) {
      case 'banner':
        return 'w-full max-w-[970px] min-h-[90px] md:min-h-[120px]';
      case 'sidebar':
        return 'w-full min-h-[250px] md:min-h-[600px]';
      case 'inline':
        return 'w-full min-h-[150px]';
      case 'sticky':
        return 'w-full h-[60px]';
      default:
        return 'w-full min-h-[90px]';
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'banner':
        return '상단 반응형 광고 영역 (Leaderboard)';
      case 'sidebar':
        return '사이드 바 스카이스크래퍼 광고 영역 (Skyscraper)';
      case 'inline':
        return '본문 피드 내 인라이닝 광고 영역 (In-article)';
      case 'sticky':
        return '최하단 고정형 앵커 광고 영역 (Sticky Anchor)';
    }
  };

  const codeSnippet = `<!-- 구글 애드센스 실제 승인 후 코드 적용방법 -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-${pubId}"
     data-ad-slot="${slotId}"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`;

  const copyCode = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Real AdSense Element Container */}
      <div className="w-full overflow-hidden flex justify-center py-2">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client={`ca-${pubId}`}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>

      {/* Stylized placeholder for dev & guides */}
      <div className={`relative bg-slate-50 border border-dashed border-slate-300 rounded-lg overflow-hidden p-3 flex flex-col justify-between ${getDimensions()} transition-all duration-200 hover:shadow-xs hover:border-blue-400 group mt-1`}>
        {/* Background Badge */}
        <div className="absolute top-1 right-2 flex items-center space-x-1.5 text-[10px] font-semibold text-slate-400 tracking-wider">
          <span>SPONSORED BY GOOGLE ADSENSE</span>
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
        </div>

        <div className="flex flex-col justify-center items-center flex-grow py-4 text-center">
          <div className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[10px] font-bold text-slate-500 mb-1">
            실시간 애드센스 완벽 호환 {type.toUpperCase()}
          </div>
          <p className="text-xs font-semibold text-slate-600 font-sans">{getLabel()}</p>
          <p className="text-[10px] text-slate-400 mt-1">
            {pubId === "pub-8884323201509376" 
              ? "기본 데모 퍼블리셔 환경입니다. 사이트 설정에서 승인된 본인의 퍼블리셔 ID를 입력해 사용 가능합니다." 
              : `자신의 퍼블리셔 ID(${pubId})가 정상 적용되었습니다.`}
          </p>
        </div>

        <div className="border-t border-slate-200/60 pt-2 flex justify-between items-center text-[10px] text-slate-500 mt-1">
          <span className="font-mono text-[9px] text-slate-400">Slot ID: {slotId} / Client: {pubId}</span>
          
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <Code className="w-3.5 h-3.5" />
            <span>AdSense 수동 삽입 코드 ({showGuide ? '접기' : '보기'})</span>
          </button>
        </div>

        {showGuide && (
          <div className="mt-3 bg-slate-900 rounded-md p-2 text-[11px] font-mono text-slate-300 relative">
            <div className="absolute right-2 top-2 block">
              <button
                onClick={copyCode}
                className="bg-slate-800 hover:bg-slate-700 text-white rounded p-1 flex items-center space-x-1 border border-slate-700 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-blue-400" />
                    <span className="text-[9px] text-blue-400">복사됨!</span>
                  </>
                ) : (
                  <span className="text-[9px]">코드 복사</span>
                )}
              </button>
            </div>
            <p className="text-[10px] text-blue-400 font-bold mb-1.5">★ 애드센스 심사 통과를 위한 핵심 팁:</p>
            <p className="text-slate-400 mb-2 leading-relaxed font-sans text-[10px]">
              애드센스 크롤러가 방문 시 정보량이 풍부할수록 즉시 패스됩니다. 본 생활계산기 천국은 2026년 기준 
              **전문가 수동 검수 상세 해설 텍스트**가 풍부히 내장되어 승인에 압도적으로 유리합니다.
            </p>
            <pre className="overflow-x-auto text-[9px] text-slate-400 p-1.5 bg-slate-950 rounded border border-slate-800 max-h-[120px] select-all whitespace-pre-wrap">
              {codeSnippet}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
