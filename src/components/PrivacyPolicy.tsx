import React from 'react';
import { Shield, BookOpen, Clock, Globe, ArrowLeft, ExternalLink, Cookie, AlertCircle, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack?: () => void;
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div id="privacy-policy" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 md:p-10 space-y-8 text-slate-700 leading-relaxed font-body text-xs sm:text-sm shadow-xs">
      
      {/* Page Header */}
      <div className="border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-xl sm:text-2xl font-black text-slate-950">개인정보처리방침 (Privacy Policy)</h1>
              <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                구글 애드센스 규정 준수
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">박과장의 생활경제 노트 방문자의 개인정보 보호, 쿠키 운용 및 제3자 광고 사업자 규정입니다.</p>
          </div>
        </div>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>메인으로 돌아가기</span>
          </button>
        )}
      </div>

      <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-2 text-slate-600 text-xs">
        <div className="flex items-center justify-between flex-wrap gap-2 font-bold text-slate-800">
          <div className="flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>최종 개정 및 시행일자: 2026년 08월 01일</span>
          </div>
          <span className="text-slate-500 font-normal">버전 2.1</span>
        </div>
        <p className="leading-relaxed">
          『박과장의 생활경제 노트』(이하 &apos;블로그&apos;)는 「개인정보 보호법」 및 「구글 애드센스(Google AdSense) 프로그램 정책」을 준수하며, 
          이용자의 개인정보 보호 및 권익을 보호하고 고충을 신속하게 처리할 수 있도록 다음과 같은 처리방침을 수립·공개합니다.
        </p>
      </div>

      {/* Details Sections */}
      <div className="space-y-7 text-slate-700">
        
        {/* 제 1 조 */}
        <div className="space-y-2">
          <h2 className="font-heading text-sm sm:text-base font-black text-slate-900 border-l-4 border-indigo-600 pl-3 flex items-center gap-2">
            <span>제 1 조 (개인정보의 수집 항목 및 수집 방법)</span>
          </h2>
          <p>
            1. 본 블로그는 별도의 회원가입 절차 없이 모든 칼럼과 계산기 콘텐츠를 자유롭게 이용하실 수 있습니다. 성명, 주민등록번호, 연락처, 주소 등의 고유식별정보를 일체 수집하거나 서버에 저장하지 않습니다.
          </p>
          <p>
            2. 블로그 내 제공되는 각종 생활금융 모의계산기(연봉 실수령액, 퇴직금, 부동산 취득세, 주담대 상환 등)에 입력되는 모든 수치는 <strong>이용자의 웹 브라우저(Client-side) 메모리 내에서만 즉시 계산</strong>되며, 외부 서버나 데이터베이스로 전송·저장되지 않습니다.
          </p>
          <p>
            3. 칼럼 하단 댓글 작성 시 입력되는 닉네임과 의견은 독자 간 원활한 소통을 위해 해당 페이지에만 표기됩니다.
          </p>
        </div>

        {/* 제 2 조 - Google AdSense 필수 조항 */}
        <div className="space-y-3 bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100">
          <h2 className="font-heading text-sm sm:text-base font-black text-indigo-950 border-l-4 border-indigo-600 pl-3 flex items-center gap-2">
            <Cookie className="w-4 h-4 text-indigo-600" />
            <span>제 2 조 (구글 애드센스 및 제3자 광고 사업자의 쿠키 운용 고지)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            본 블로그는 사이트 운영 및 고품질 콘텐츠 유지를 위해 <strong>Google Inc.의 광고 서비스인 Google AdSense</strong> 및 제3자 광고 네트워크를 게재할 수 있습니다.
          </p>
          
          <div className="space-y-2 text-xs text-slate-700 bg-white p-4 rounded-xl border border-indigo-100">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <p>
                <strong>쿠키(Cookie) 및 DART 쿠키 사용:</strong> Google을 포함한 타사 공급업체는 쿠키를 사용하여 이용자의 본 사이트 및 인터넷상의 다른 웹사이트 이전 방문 기록을 바탕으로 관련성 높은 광고를 게재합니다.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <p>
                <strong>관심 기반 맞춤 광고:</strong> Google의 광고 쿠키 사용으로 Google 및 파트너 네트워크는 이용자의 방문 기록을 기반으로 유용한 맞춤형 광고를 제공할 수 있습니다.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <p>
                <strong>맞춤 광고 수신 거부(Opt-Out) 권리:</strong> 이용자는 언제든지 맞춤설정 광고를 사용 중지할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="space-y-1.5 pt-1 text-xs">
            <p className="font-bold text-slate-900">🔗 쿠키 및 광고 맞춤설정 해제 안내 링크:</p>
            <ul className="space-y-1 pl-1">
              <li>
                <a
                  href="https://adssettings.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1 hover:underline"
                >
                  <span>• Google 광고 설정 페이지 (Google Ads Settings) 바로가기</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1 hover:underline"
                >
                  <span>• www.aboutads.info 제3자 광고 사업자 쿠키 사용 차단 페이지</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 제 3 조 */}
        <div className="space-y-2">
          <h2 className="font-heading text-sm sm:text-base font-black text-slate-900 border-l-4 border-indigo-600 pl-3">
            제 3 조 (웹 브라우저 쿠키 설정 및 거부 방법)
          </h2>
          <p>
            이용자는 웹 브라우저의 옵션을 선택함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 모든 쿠키의 저장을 거부할 수 있는 선택권을 가집니다.
          </p>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1 font-mono text-slate-600">
            <p>• Chrome: 설정 &gt; 개인정보 보호 및 보안 &gt; 인터넷 사용 기록 삭제 또는 서드 파티 쿠키 차단</p>
            <p>• Safari: 환경설정 &gt; 개인정보 보호 &gt; 모든 쿠키 차단</p>
            <p>• Edge: 설정 &gt; 쿠키 및 사이트 권한 &gt; 쿠키 및 사이트 데이터 관리 및 삭제</p>
          </div>
        </div>

        {/* 제 4 조 */}
        <div className="space-y-2">
          <h2 className="font-heading text-sm sm:text-base font-black text-slate-900 border-l-4 border-indigo-600 pl-3">
            제 4 조 (링크 사이트에 대한 책임)
          </h2>
          <p>
            본 블로그는 이용자에게 법령 원문 확인이나 행정기관 상담 편의를 위해 대한민국 법제처 국가법령정보센터, 고용노동부, 국세청 홈택스, 대법원 등 외부 사이트로의 링크를 제공할 수 있습니다. 
            외부 사이트로 이동하신 경우 해당 사이트의 개인정보처리방침이 적용되므로 본 블로그의 방침과는 무관함을 알려드립니다.
          </p>
        </div>

        {/* 제 5 조 */}
        <div className="space-y-2">
          <h2 className="font-heading text-sm sm:text-base font-black text-slate-900 border-l-4 border-indigo-600 pl-3">
            제 5 조 (개인정보 보호책임자 및 고충처리 연락처)
          </h2>
          <p>
            본 블로그의 개인정보 처리 및 프라이버시 정책과 관련하여 문의사항, 의견 또는 불만 제기가 있으신 경우 아래 운영자에게 연락해 주시면 신속하고 성실하게 답변해 드리겠습니다.
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2 text-xs space-y-1">
            <p><strong className="text-slate-900">운영 주체:</strong> 박과장의 생활경제 노트 운영팀</p>
            <p><strong className="text-slate-900">대표 운영자:</strong> 박과장 (데이터 기획자)</p>
            <p><strong className="text-slate-900">전자우편(이메일):</strong> <span className="font-mono text-indigo-700 font-bold">contact@park-money.kr</span></p>
            <p><strong className="text-slate-900">블로그 공식 URL:</strong> <span className="font-mono text-slate-600">https://www.life-calc.kr/</span></p>
          </div>
        </div>

      </div>
    </div>
  );
}
