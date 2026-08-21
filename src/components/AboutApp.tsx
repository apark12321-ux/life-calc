import React from 'react';
import { ShieldCheck, Mail, BookOpen, Calculator, Lock, RefreshCw, ArrowRight } from 'lucide-react';
import { CategoryType } from '../types';

interface AboutAppProps {
  onSelectCategory: (cat: CategoryType) => void;
  onNavigateToCalculator: (id: string) => void;
}

export default function AboutApp({ onSelectCategory, onNavigateToCalculator }: AboutAppProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 md:p-10 space-y-10 text-slate-700 leading-relaxed font-body shadow-xs">
      
      {/* 1. Page Header & Service Mission */}
      <div className="border-b border-slate-100 pb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-20 h-20 rounded-3xl bg-slate-900 text-white flex items-center justify-center font-black text-3xl shadow-md shrink-0">
          <BookOpen className="w-10 h-10 text-indigo-400" />
        </div>
        <div className="space-y-2 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-950">
              생활금융 실전 가이드
            </h1>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-black px-3 py-1 rounded-full border border-indigo-100">
              2026 대한민국 생활금융 & 세무 포털
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            &ldquo;복잡한 법령과 세법을 누구나 쉽게 이해하고 스스로 시뮬레이션할 수 있는 투명한 지식 플랫폼을 지향합니다.&rdquo;
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-indigo-600" />
              공식 문의: <span className="font-mono font-bold text-slate-700">contact@life-calc.kr</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Service Purpose & Background */}
      <section className="space-y-4">
        <h2 className="font-heading text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <span>블로그 소개</span>
        </h2>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            『생활금융 실전 가이드』는 매년 바뀌는 <strong>4대보험 요율, 주휴수당과 퇴직금, 연봉 실수령액, 부동산 세금</strong> 등 실생활에서 자주 찾아보게 되는 금융·행정 정보를 이해하기 쉽게 정리하고 모아둔 블로그입니다.
          </p>
          <p>
            복잡하고 흩어져 있는 자료들을 한눈에 파악할 수 있도록 표와 요약으로 정리하였으며, 글을 읽으며 바로 숫자를 넣어 계산해 볼 수 있는 간편 계산기도 함께 제공하고 있습니다.
          </p>
          <p className="font-bold text-slate-900">
            모든 계산기는 별도의 회원가입 없이 브라우저에서 바로 연산되므로 안심하고 편하게 이용하실 수 있습니다.
          </p>
        </div>
      </section>

      {/* 3. Key Features */}
      <section className="space-y-4">
        <h2 className="font-heading text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <span>이용 안내</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-sm">
              01
            </div>
            <h3 className="font-heading font-black text-slate-900 text-sm">최신 기준 반영</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              근로기준법, 세법, 4대보험 고시 등 매년 변경되는 기준을 주기적으로 확인하여 글과 계산기를 업데이트합니다.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-sm">
              02
            </div>
            <h3 className="font-heading font-black text-slate-900 text-sm">개인정보 미수집</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              로그인이나 개인정보 입력 없이 누구나 자유롭게 이용할 수 있으며, 입력한 금액은 서버에 저장되지 않습니다.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-sm">
              03
            </div>
            <h3 className="font-heading font-black text-slate-900 text-sm">쉬운 모의 계산기</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              어려운 수식을 외울 필요 없이, 시급이나 연봉을 입력하면 예상 실수령액과 세금을 바로 확인할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Contact & Correction Request */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-3">
        <h3 className="font-heading text-lg font-black text-white flex items-center gap-2">
          <Mail className="w-5 h-5 text-indigo-400" />
          <span>콘텐츠 문의 및 정정 요청 창구</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          게재된 칼럼 내용 중 오탈자나 수정이 필요한 행정 변경 사항이 있을 경우 공식 이메일로 제보해 주시면 확인 즉시 성실히 검토하여 반영하겠습니다.
        </p>
        <div className="pt-2 flex items-center gap-3">
          <span className="text-xs text-indigo-300 font-mono bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            contact@life-calc.kr
          </span>
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
          >
            칼럼 읽으러 가기
          </button>
        </div>
      </section>

    </div>
  );
}
