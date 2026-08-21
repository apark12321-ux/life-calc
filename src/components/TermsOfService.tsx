import React from 'react';
import { FileText, Clock, AlertTriangle, ArrowLeft } from 'lucide-react';

interface TermsOfServiceProps {
  onBack?: () => void;
}

export default function TermsOfService({ onBack }: TermsOfServiceProps) {
  return (
    <div id="terms-of-service" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 md:p-10 space-y-6 text-slate-700 leading-relaxed font-body text-xs sm:text-sm shadow-xs">
      
      {/* Page Header */}
      <div className="border-b border-slate-100 pb-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading text-xl sm:text-2xl font-black text-slate-950">이용약관 및 면책조항 (Terms of Service)</h1>
            <p className="text-xs text-slate-500 mt-0.5">생활금융 실전 가이드 정보 열람 및 모의 계산기 도구 이용에 관한 기본 약관입니다.</p>
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
          <span>시행일자: 2026년 08월 01일</span>
        </div>
        <p>
          본 이용약관은 『생활금융 실전 가이드』(이하 &apos;서비스&apos;)가 제공하는 모든 칼럼 콘텐츠 및 계산 시뮬레이션 기능의 이용 조건과 권리·의무를 규정합니다.
        </p>
      </div>

      <div className="space-y-6 text-slate-700">
        <div>
          <h2 className="font-heading text-sm sm:text-base font-black text-slate-900 border-l-4 border-indigo-600 pl-2.5 mb-2">
            제 1 조 (목적 및 서비스의 성격)
          </h2>
          <p>
            본 웹사이트는 대한민국 4대사회보험, 급여·퇴직금, 부동산 세무 및 재테크에 관한 정보를 알기 쉽게 제공하는 공익성 생활금융 정보 포털입니다.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-sm sm:text-base font-black text-slate-900 border-l-4 border-indigo-600 pl-2.5 mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>제 2 조 (정보의 정확성 및 법적 면책)</span>
          </h2>
          <p>
            본 웹사이트에 게재된 모든 칼럼과 계산기 결과는 2026년 최신 법령 및 고시를 바탕으로 성실히 작성되었으나, 개별 사업장의 취업규칙, 근로계약서, 개인별 과세표준 차이에 따라 실제 행정기관의 부과액과 오차가 발생할 수 있습니다.
            따라서 본 웹사이트의 정보는 <strong>참고용 모의 데이터</strong>로 활용하시기 바라며, 법적 분쟁이나 구체적 세무 신고 시에는 반드시 공인노무사, 세무사, 또는 관할 행정기관의 공식 상담을 받으시기 바랍니다.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-sm sm:text-base font-black text-slate-900 border-l-4 border-indigo-600 pl-2.5 mb-2">
            제 3 조 (저작권 및 콘텐츠 이용)
          </h2>
          <p>
            본 웹사이트에 작성된 모든 칼럼 텍스트, 구조 및 분석 자료의 저작권은 서비스 운영진에게 있습니다. 비영리 목적의 단순 인용 및 출처 명시 공유는 자유롭게 허용되나, 상업적 무단 복제나 인공지능 학습용 대량 크롤링은 금지됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
