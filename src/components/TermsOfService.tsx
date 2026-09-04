import React from 'react';
import { FileText, Clock, AlertTriangle, ArrowLeft, ShieldCheck, HelpCircle } from 'lucide-react';

interface TermsOfServiceProps {
  onBack?: () => void;
}

export default function TermsOfService({ onBack }: TermsOfServiceProps) {
  return (
    <div id="terms-of-service" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 md:p-10 space-y-8 text-slate-700 leading-relaxed font-body text-xs sm:text-sm shadow-xs">
      
      {/* Page Header */}
      <div className="border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-xl sm:text-2xl font-black text-slate-950">이용약관 및 면책조항 (Terms of Service)</h1>
              <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2 py-0.5 rounded-md border border-slate-200">
                E-E-A-T 법적 고지
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">박과장의 생활경제 노트 칼럼 열람 및 생활금융 모의계산기 이용에 관한 규정입니다.</p>
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
            <span>시행일자: 2026년 08월 01일</span>
          </div>
          <span className="text-slate-500 font-normal">버전 2.0</span>
        </div>
        <p className="leading-relaxed">
          본 이용약관은 『박과장의 생활경제 노트』(이하 &apos;웹사이트&apos;)가 제공하는 모든 실전 칼럼 콘텐츠 및 생활금융 모의계산기 기능의 이용 조건과 권리·의무를 규정합니다.
        </p>
      </div>

      <div className="space-y-7 text-slate-700">
        
        {/* 제 1 조 */}
        <div className="space-y-2">
          <h2 className="font-heading text-sm sm:text-base font-black text-slate-900 border-l-4 border-indigo-600 pl-3">
            제 1 조 (목적 및 서비스의 성격)
          </h2>
          <p>
            1. 본 웹사이트는 대한민국 4대사회보험, 급여·퇴직금 산정, 부동산 세무·중개보수, 연금 및 생활 재테크에 관한 정보를 알기 쉽게 제공하는 비영리/공익성 생활경제 정보 플랫폼입니다.
          </p>
          <p>
            2. 본 웹사이트가 제공하는 모의계산기는 이용자의 자가 진단 및 이해를 돕기 위한 <strong>시뮬레이션 도구</strong>입니다.
          </p>
        </div>

        {/* 제 2 조 - 핵심 법적 면책 */}
        <div className="space-y-3 bg-amber-50/60 p-5 rounded-2xl border border-amber-200/80">
          <h2 className="font-heading text-sm sm:text-base font-black text-amber-950 border-l-4 border-amber-600 pl-3 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>제 2 조 (정보의 정확성 및 법적 면책 고지 — 필수 확인)</span>
          </h2>
          <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>
              1. 본 웹사이트에 게재된 모든 칼럼과 계산기 결과는 2026년 최신 법령(근로기준법, 세법, 지방세법, 공인중개사법 등) 및 정부 고시 기준을 바탕으로 성실히 검증되어 제작되었습니다.
            </p>
            <p>
              2. 그러나 <strong>개별 사업장의 취업규칙, 근로계약서, 개인별 과세표준 차이, 지자체별 조례 및 금융기관의 개별 심사 요건</strong>에 따라 실제 행정기관(국세청, 고용노동부, 건강보험공단)의 부과액이나 은행 대출 이자와 차이가 발생할 수 있습니다.
            </p>
            <p>
              3. 따라서 본 웹사이트의 모든 콘텐츠 및 계산 결과는 <strong>참고용 데이터(Reference Only)</strong>로 활용하시기 바라며, 법적 분쟁, 실제 퇴직금 청구, 세무 신고 및 부동산 계약 시에는 반드시 <strong>공인노무사, 세무사, 변호사, 공인중개사 또는 관할 행정기관의 공식 확인</strong>을 거치시기 바랍니다.
            </p>
            <p>
              4. 본 웹사이트는 이용자가 게재된 정보를 신뢰하여 행한 의사결정이나 행위로 인해 발생한 직·간접적 손해에 대해 법적 책임을 부담하지 않습니다.
            </p>
          </div>
        </div>

        {/* 제 3 조 */}
        <div className="space-y-2">
          <h2 className="font-heading text-sm sm:text-base font-black text-slate-900 border-l-4 border-indigo-600 pl-3">
            제 3 조 (저작권 및 콘텐츠 인용 규정)
          </h2>
          <p>
            1. 본 웹사이트에 작성된 모든 칼럼 텍스트, 인포그래픽 표, 자체 제작 계산기 로직 및 분석 자료의 저작권은 운영진에게 있습니다.
          </p>
          <p>
            2. 비영리 목적의 단순 인용, 출처를 명시한 SNS 공유 및 링크 삽입은 언제나 환영하며 자유롭게 허용됩니다.
          </p>
          <p>
            3. 단, 사전 서면 동의 없는 <strong>전문 무단 전재, 상업적 재배포, AI 학습을 위한 대량 크롤링 및 스크래핑</strong> 행위는 엄격히 금지됩니다.
          </p>
        </div>

        {/* 제 4 조 */}
        <div className="space-y-2">
          <h2 className="font-heading text-sm sm:text-base font-black text-slate-900 border-l-4 border-indigo-600 pl-3">
            제 4 조 (광고 게재 및 서비스 운영)
          </h2>
          <p>
            1. 본 웹사이트는 안정적인 서버 유지 및 고품질 칼럼 연재를 위해 제3자 광고(Google AdSense 등)를 게재할 수 있습니다.
          </p>
          <p>
            2. 광고 배너를 통한 제3자 사이트의 거래 및 상품 이용에 대한 책임은 해당 광고주와 이용자 간에 발생합니다.
          </p>
        </div>

        {/* 제 5 조 */}
        <div className="space-y-2">
          <h2 className="font-heading text-sm sm:text-base font-black text-slate-900 border-l-4 border-indigo-600 pl-3">
            제 5 조 (오류 제보 및 정정)
          </h2>
          <p>
            칼럼 내용 중 법령 개정으로 인한 수정 필요 사항이나 계산기 오류를 발견하신 경우 칼럼별 댓글란을 통해 알려주시면 즉시 검토 후 반영하겠습니다.
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2 text-xs space-y-1">
            <p><strong className="text-slate-900">오류 제보:</strong> 본 사이트 칼럼 댓글란을 통해 상시 접수</p>
            <p><strong className="text-slate-900">운영자:</strong> 박과장의 생활경제 노트</p>
          </div>
        </div>

      </div>
    </div>
  );
}
