import React from 'react';
import { Shield, BookOpen, Clock, Globe } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-100 p-5 md:p-8 space-y-6 text-slate-700 leading-relaxed font-sans text-xs md:text-sm">
      {/* Page Header */}
      <div className="border-b border-slate-100 pb-5">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">개인정보처리방침 (Privacy Policy)</h1>
            <p className="text-xs text-slate-500 mt-0.5">이용자 정보 보호 지침 및 방문자 쿠키에 관한 정책 안내 전문입니다.</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 border border-slate-150 space-y-2 text-slate-600 text-xs">
        <div className="flex items-center space-x-1 font-bold text-slate-800">
          <Clock className="w-4 h-4 text-slate-500" />
          <span>최종 갱신일자: 2026년 6월 20일</span>
        </div>
        <p>본 개인정보처리방침은 본 계산포털 서비스(이하 &apos;사이트&apos;)를 방문해 유틸리티를 활용하시는 이용자들의 전반적인 개인 정보 및 브라우저 캐싱 기록을 투명하게 보호하고, 구글 광고 게재 기준을 공정하게 준수함을 목적으로 제정되었습니다.</p>
      </div>

      {/* Details Sections */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 border-l-4 border-indigo-600 pl-2">제 1 조 (수취하는 개인 정보 종류 및 보관 기한)</h2>
        <p>
          본 사이트는 기본 서비스로 회원 가입이나 사용자의 소셜 로그인, 이메일 수수 등의 민감 데이터를 **일체 요구하거나 서버에 보존하지 않습니다.** 
          계산기에 기재되는 원금, 급여, 생일 등의 정보 역시 이용자의 웹 브라우저 내 로컬 데이터 영역에서만 일시 작동하며, 어떠한 클라우드 데이터베이스로도 전송되지 않으므로 개인정보 탈취 리스크로부터 원천적으로 보호됩니다.
        </p>

        <h2 className="text-sm font-bold text-slate-900 border-l-4 border-indigo-600 pl-2">제 2 조 (쿠키 수집 및 제3자 광고 게재 고지)</h2>
        <p>
          본 서비스는 이용자의 서비스 이용 편의 증대 및 맞춤형 서비스 제공을 도모하기 위해 브라우저 내 웹 쿠키(Cookies) 기술을 이용하며, 구글 등 서비스 제휴 파트너와의 광고 및 트래픽 연합 기술이 연동될 수 있습니다.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
          <li>구글을 포함한 제3자 판매자는 이용자가 본 웹사이트나 다른 웹사이트를 이전 방문한 기록을 바탕으로 맞춤 광고를 게재합니다.</li>
          <li>구글의 광고 쿠키 사용을 통해 구글 및 파트너사는 웹사이트 방문 행위에 기반한 최적화 타겟팅 광고를 전송할 권한을 가집니다.</li>
          <li>사용자는 구글의 웹 광고 설정 페이지(<a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold underline">https://adssettings.google.com</a>)를 방문하여 브라우저의 전용 관심사 기반 타겟 광고 쿠키(DART) 수집 사용을 완전히 중단하거나 비활성화 조정하실 수 있습니다.</li>
        </ul>

        <h2 className="text-sm font-bold text-slate-900 border-l-4 border-indigo-600 pl-2">제 3 조 (고지 의무 및 책임 한계)</h2>
        <p>
          본 사이트는 관련 법령상의 안전 지침을 성실히 준수하고 있으며, 주기적인 개인정보 정책 갱신 및 보안 유지를 약조합니다.
        </p>
      </div>
    </div>
  );
}
