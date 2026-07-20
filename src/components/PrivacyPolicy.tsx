import React from 'react';
import { Shield, BookOpen, Clock, Globe } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div id="privacy-policy" className="bg-white rounded-2xl shadow-xs border border-slate-100 p-5 md:p-8 space-y-6 text-slate-700 leading-relaxed font-sans text-xs md:text-sm">
      {/* Page Header */}
      <div className="border-b border-slate-100 pb-5">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">개인정보처리방침 (Privacy Policy)</h1>
            <p className="text-xs text-slate-500 mt-0.5">이용자 정보 보호 지침 및 방문자 쿠키, 제3자 광고 게재 및 로그 데이터 관리에 관한 가이드 전문입니다.</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 border border-slate-150 space-y-2 text-slate-600 text-xs">
        <div className="flex items-center space-x-1 font-bold text-slate-800">
          <Clock className="w-4 h-4 text-slate-500" />
          <span>최종 갱신일자: 2026년 07월 20일</span>
        </div>
        <p>본 개인정보처리방침은 본 계산포털 서비스(이하 &apos;사이트&apos; 또는 &apos;생활계산기 천국&apos;)를 이용하시는 고객의 개인정보를 소중히 다루고, 구글 애드센스(Google AdSense) 광고 게재 기준 및 글로벌 프라이버시 법률(GDPR, CCPA)을 완벽하게 준수하기 위해 수립되었습니다.</p>
      </div>

      {/* Details Sections */}
      <div className="space-y-5">
        <h2 className="text-sm font-bold text-slate-900 border-l-4 border-indigo-600 pl-2">제 1 조 (수취하는 개인 정보 종류 및 보관 기한)</h2>
        <p>
          본 사이트는 기본 서비스 제공을 위해 회원 가입이나 소셜 로그인, 성명, 이메일 등의 개인 인적 사항을 **원칙적으로 요구하거나 서버에 수집 및 저장하지 않습니다.**
          이용자가 계산기 입력란에 기재하는 시급, 연봉, 대출금액, 부동산 평수 등의 연산 데이터는 **서버로 전혀 전송되지 않고 이용자의 브라우저 메모리 내에서 즉시 처리 및 소멸**됩니다. 따라서 유출 및 유출 위험성으로부터 완전히 안전합니다.
        </p>

        <h2 className="text-sm font-bold text-slate-900 border-l-4 border-indigo-600 pl-2">제 2 조 (로그 파일 수집 정보 및 시스템 데이터)</h2>
        <p>
          생활계산기 천국은 표준 웹로그 분석 절차를 따릅니다. 이 과정에서 수집되는 정보는 인터넷 프로토콜(IP) 주소, 브라우저 유형, 인터넷 서비스 제공업체(ISP), 날짜 및 시간 도장, 참조/종료 페이지, 사이트 내 클릭 수 등이 포함될 수 있습니다. 
          해당 데이터는 개인을 특정할 수 있는 정보와 연계되지 않으며, 오직 트렌드 분석, 사이트 관리, 사용자 흐름 추적 및 인구통계학적 통계 분석을 위해서만 사용됩니다.
        </p>

        <h2 className="text-sm font-bold text-slate-900 border-l-4 border-indigo-600 pl-2">제 3 조 (쿠키 수집 및 제3자 광고 게재 고지)</h2>
        <p>
          본 서비스는 이용자의 웹 브라우저 쿠키(Cookies)를 활용하며, 구글(Google)을 포함한 제3자 광고 대행업체가 사이트 방문 통계를 기반으로 맞춤형 맞춤형 광고를 노출하도록 연동하고 있습니다.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-650">
          <li>구글을 포함한 제3자 판매자는 귀하가 본 웹사이트 또는 기타 인터넷 사이트를 방문한 이전 기록을 기반으로 맞춤식 타겟형 광고를 게재합니다.</li>
          <li>구글의 광고 기술 쿠키(DART) 수집 사용을 통해 구글 및 제휴사는 본 사이트 및 인터넷 상의 다른 사이트 방문 데이터를 기반으로 이용자에게 특화된 최적의 광고를 송출할 수 있습니다.</li>
          <li>사용자는 언제든지 구글의 광고 설정 센터(<a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold hover:underline">https://adssettings.google.com</a>)를 방문해 개인 맞춤 광고 지침을 중단(Opt-out)하거나 차단 처리할 수 있습니다.</li>
          <li>제3자 공급업체의 쿠키 사용 비활성화에 대해 더 상세히 알고 싶거나 설정을 해제하고 싶다면, Network Advertising Initiative의 소비자 거부 페이지(<a href="https://optout.networkadvertising.org" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold hover:underline">https://optout.networkadvertising.org</a>)를 방문하시기 바랍니다.</li>
        </ul>

        <h2 className="text-sm font-bold text-slate-900 border-l-4 border-indigo-600 pl-2">제 4 조 (글로벌 데이터 권리 보호 - CCPA 및 GDPR 권리 고지)</h2>
        <p>
          글로벌 기준의 프라이버시 투명성 확보를 위해, 사이트 방문자는 다음과 같은 권리를 가집니다:
        </p>
        <ul className="list-style-decimal pl-5 space-y-1 text-xs text-slate-650">
          <li><strong>정보 주체의 열람 및 정보 공개 요구권 (CCPA/GDPR):</strong> 당 사이트는 가용 개인정보를 직접 수집하지 않으므로 전송할 정보가 없음을 재확인합니다.</li>
          <li><strong>삭제 요구 및 처리 제한권:</strong> 브라우저 내 쿠키 및 로컬 캐싱을 이용자가 브라우저 설정에서 삭제함으로써 본인의 저장 데이터를 완전히 원격 컨트롤하실 수 있습니다.</li>
          <li><strong>제3자 판매 금지 요구(Do Not Sell My Info):</strong> 본 사이트는 어떠한 개인정보 판매 행위도 유발하지 않습니다.</li>
        </ul>

        <h2 className="text-sm font-bold text-slate-900 border-l-4 border-indigo-600 pl-2">제 5 조 (아동 정보 보호 정책)</h2>
        <p>
          당사는 만 13세 미만 아동의 인터넷 활동에서 부모의 감독과 보호를 중요시하며, 아동으로부터 어떠한 개인 식별 정보도 의도적으로 수집하지 않습니다. 만약 부모나 보호자분이 아동이 당사 플랫폼에 개인 식별 정보를 전송했다고 판단되신다면 즉시 지원 이메일로 연락주시기 바라며, 신속히 삭제 조치하겠습니다.
        </p>

        <h2 className="text-sm font-bold text-slate-900 border-l-4 border-indigo-600 pl-2">제 6 조 (개인정보 관련 관리자 연락 방법)</h2>
        <p>
          본 개인정보처리방침 및 쿠키 이용 방식, 기타 애드센스 광고에 관련해 질의사항이 있거나 의견을 제시하고자 하시는 경우, 본 사이트 공식 지원 메일(<a href="mailto:apark12321@gmail.com" className="text-indigo-600 font-bold hover:underline">apark12321@gmail.com</a>)로 문의해 주시면 정밀 답변 및 조치를 약속드립니다.
        </p>
      </div>
    </div>
  );
}

