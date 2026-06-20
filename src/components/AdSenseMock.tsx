import React, { useState } from 'react';
import { HelpCircle, Code, Check } from 'lucide-react';

interface AdSenseMockProps {
  slotId: string;
  type: 'banner' | 'sidebar' | 'inline' | 'sticky';
  height?: string;
}

export default function AdSenseMock({ slotId, type, height = 'h-[100px]' }: AdSenseMockProps) {
  const [showGuide, setShowGuide] = useState(false);
  const [copied, setCopied] = useState(false);

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
        return '상단 광고 영역 (Responsive Leaderboard - 970x90)';
      case 'sidebar':
        return '측면 광고 영역 (Skyscraper - 160x600)';
      case 'inline':
        return '본문 인피드 광고 영역 (In-article Ad)';
      case 'sticky':
        return '하단 플로팅 광고 영역 (Sticky Bottom Anchor - 320x50)';
    }
  };

  const codeSnippet = `<!-- 구글 애드센스 실제 승인 후 코드 적용방법 -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
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
    <div className={`relative bg-slate-50 border border-dashed border-slate-300 rounded-lg overflow-hidden p-3 flex flex-col justify-between ${getDimensions()} transition-all duration-200 hover:shadow-xs hover:border-blue-400 group`}>
      {/* Background Badge */}
      <div className="absolute top-1 right-2 flex items-center space-x-1.5 text-[10px] font-semibold text-slate-400 tracking-wider">
        <span>SPONSORED BY GOOGLE ADSENSE</span>
        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
      </div>

      <div className="flex flex-col justify-center items-center flex-grow py-4 text-center">
        <div className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[10px] font-bold text-slate-500 mb-1">
          광고 대기중 {type.toUpperCase()}
        </div>
        <p className="text-xs font-semibold text-slate-600 font-sans">{getLabel()}</p>
        <p className="text-[10px] text-slate-400 mt-1">
          애드센스 승인 완료 시, 실제 광고가 게재되는 고효율 위치입니다.
        </p>
      </div>

      <div className="border-t border-slate-200/60 pt-2 flex justify-between items-center text-[10px] text-slate-500 mt-1">
        <span className="font-mono text-[9px] text-slate-400">Slot ID: {slotId}</span>
        
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          <Code className="w-3.5 h-3.5" />
          <span>코드 삽입 안내 ({showGuide ? '접기' : '보기'})</span>
        </button>
      </div>

      {showGuide && (
        <div className="mt-3 bg-slate-900 rounded-md p-2 text-[11px] font-mono text-slate-300 relative">
          <div className="absolute right-2 top-2">
            <button
              onClick={copyCode}
              className="bg-slate-800 hover:bg-slate-700 text-white rounded p-1 flex items-center space-x-1 border border-slate-700"
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
            애드센스 봇이 크롤링할 때, 유의미한 정보 텍스트 양이 많을수록 패스 확률이 올라갑니다. 
            본 사이트는 계산기 양식 하단에 **전문적이고 정교하게 구성된 2026년 최신 기준 해설 텍스트**가
            구축되어 있어 애드센스의 단골 탈락 원인인 &apos;가치 없는 콘텐츠&apos; 필터링을 극복할 수 있습니다.
          </p>
          <pre className="overflow-x-auto text-[9px] text-slate-400 p-1.5 bg-slate-950 rounded border border-slate-800 max-h-[120px] select-all whitespace-pre-wrap">
            {codeSnippet}
          </pre>
        </div>
      )}
    </div>
  );
}
