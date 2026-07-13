import React from 'react';
import { AlignJustify, HelpCircle, AlertCircle, BookOpen, Clock } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-100 p-5 md:p-8 space-y-6 text-slate-700 leading-relaxed font-sans text-xs md:text-sm">
      {/* Page Header */}
      <div className="border-b border-slate-100 pb-5">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <AlignJustify className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">서비스 이용약관 (Terms of Service)</h1>
            <p className="text-xs text-slate-500 mt-0.5">사용자 안전과 가치 증진을 위한 이용 수칙 및 책임 한계 고지 약관입니다.</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 border border-slate-150 space-y-2 text-slate-600 text-xs">
        <div className="flex items-center space-x-1 font-bold text-slate-800">
          <Clock className="w-4 h-4 text-slate-500" />
          <span>시행일자: 2026년 6월 20일</span>
        </div>
        <p>본 약관은 본 계산포털 사이트에서 제공하는 가상 모의 산출 시스템 및 해설 지식 정보 정보들을 사용하는 방문 고객과의 권리 관계를 명시하기 위해 설립되었습니다.</p>
      </div>

      {/* Terms list */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 border-l-4 border-emerald-600 pl-2">제 1 조 (목적 및 정보 제공의 의의)</h2>
        <p>
          본 사이트의 산물들은 2026년 대한민국 보수 세목 가이드 및 정식 사법 지침들에 근거한 계산식을 제공하고 있습니다. 
          그러나 개별 기업 특화 비과세 항목이나 소속 지자체의 추가 할인, 감세 약관에 따라 최종 산수에는 유의미한 변동이 발생하며, 이는 단순 **가상 참모 계산** 목적에 국한되며 세무적 또는 법적 행정 증빙자료로 간주될 수 없습니다.
        </p>

        <h2 className="text-sm font-bold text-slate-900 border-l-4 border-emerald-600 pl-2">제 2 조 (이용자의 의무 및 면책 규정)</h2>
        <p>
          모든 사용자는 본인의 자유의지로 계산 유틸리티를 구동합니다. 본 서비스 소유자는 당해 시뮬레이터가 도출한 예측 값을 맹신하여 체결된 과도한 임금 계약, 부동산 대출 실행 등으로 발생한 결과에 따르는 행위의 법적 재정적 피해에 대해 일체의 간접/직접적 책임을 보전하지 않습니다.
        </p>

        <h2 className="text-sm font-bold text-slate-900 border-l-4 border-emerald-600 pl-2">제 3 조 (저작권 및 무단 이용 금지)</h2>
        <p>
          본 웹 서비스의 디자인, 독자적 개발 계산 논리, 그리고 생활 밀착형 연산 가치를 극대화하기 위하여 직접 저술한 상세 설명 가이드는 고유 자산입니다. 
          크롤러 봇을 악용한 무단 크롤링, 불법 전해 배포 및 타 사이트 도용 시 지식재산권 보호법에 의거한 법정 대응이 따를 수 있습니다.
        </p>
      </div>

      <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 flex items-start space-x-3 text-rose-900">
        <AlertCircle className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
        <div className="text-xs">
          <h3 className="font-bold text-rose-950">근무 보수 관련 최종 확인 권고</h3>
          <p className="mt-1 leading-relaxed">
            4대보험 및 각종 급여와 관련된 민감한 분쟁 요소는 반드시 국민연금공단(1355) 또는 고용노동부 삼각상담센터(1350) 등 유권 법적 해석을 담당하는 정부 유관 센터에 소장 문의하시어 검증하시기를 적극 당부드립니다.
          </p>
        </div>
      </div>
    </div>
  );
}
