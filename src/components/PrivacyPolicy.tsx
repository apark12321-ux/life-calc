import React from 'react';
import { Shield, BookOpen, Clock, Globe, ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack?: () => void;
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div id="privacy-policy" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 md:p-10 space-y-6 text-slate-700 leading-relaxed font-body text-xs sm:text-sm shadow-xs">
      
      {/* Page Header */}
      <div className="border-b border-slate-100 pb-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading text-xl sm:text-2xl font-black text-slate-950">개인정보처리방침 (Privacy Policy)</h1>
            <p className="text-xs text-slate-500 mt-0.5">생활금융 실전 가이드 방문자 개인정보 보호 및 쿠키 운용 규정입니다.</p>
          </div>
        </div>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>돌아가기</span>
          </button>
        )}
      </div>

      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-slate-600 text-xs">
        <div className="flex items-center space-x-1 font-bold text-slate-800">
          <Clock className="w-4 h-4 text-slate-500" />
          <span>최종 갱신일자: 2026년 08월 01일</span>
        </div>
        <p>
          본 방침은 『생활금융 실전 가이드』(이하 &apos;블로그&apos;)를 이용하시는 방문자 여러분의 개인정보 보호 및 원활한 이용 환경 제공을 위한 안내입니다.
        </p>
      </div>

      {/* Details Sections */}
      <div className="space-y-6 text-slate-700">
        <div>
          <h2 className="font-heading text-sm sm:text-base font-black text-slate-900 border-l-4 border-indigo-600 pl-2.5 mb-2">
            제 1 조 (개인정보 수집 및 보관 안내)
          </h2>
          <p>
            본 블로그는 별도의 회원가입이나 로그인을 요구하지 않으며, 성명, 주민등록번호, 연락처 등의 개인정보를 서버에 저장하지 않습니다.
            계산기에서 입력하는 시급, 연봉, 대출금액 등은 방문자의 웹 브라우저 내에서만 계산 처리됩니다.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-sm sm:text-base font-black text-slate-900 border-l-4 border-indigo-600 pl-2.5 mb-2">
            제 2 조 (쿠키 운용 안내)
          </h2>
          <p>
            본 블로그는 방문자의 이용 편의와 서비스 환경 개선을 위해 쿠키(Cookie)를 활용할 수 있습니다. 
            방문자는 브라우저 설정을 통해 언제든지 쿠키 저장을 거부하거나 삭제하실 수 있습니다.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-sm sm:text-base font-black text-slate-900 border-l-4 border-indigo-600 pl-2.5 mb-2">
            제 3 조 (개인정보 보호책임 및 문의처)
          </h2>
          <p>
            본 웹사이트의 개인정보 보호 및 운영과 관련하여 문의사항이나 의견이 있으신 경우 아래 연락처로 문의해 주시기 바랍니다.
          </p>
          <div className="bg-slate-50 p-3 rounded-xl mt-2 text-xs font-mono">
            - 운영: 생활금융 실전 가이드 운영팀<br />
            - 전자우편: contact@life-calc.kr
          </div>
        </div>
      </div>
    </div>
  );
}
