import React from 'react';
import { ShieldCheck, Mail, BookOpen, Calculator, Lock, RefreshCw, ArrowRight, UserCheck } from 'lucide-react';
import { CategoryType } from '../types';

interface AboutAppProps {
  onSelectCategory: (cat: CategoryType) => void;
  onNavigateToCalculator: (id: string) => void;
}

export default function AboutApp({ onSelectCategory, onNavigateToCalculator }: AboutAppProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 md:p-10 space-y-10 text-slate-700 leading-relaxed font-body shadow-xs">
      
      {/* 1. Page Header & Author Persona */}
      <div className="border-b border-slate-100 pb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-950 to-slate-900 text-white flex items-center justify-center font-black text-4xl shadow-md shrink-0">
          👨‍💼
        </div>
        <div className="space-y-2 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-950">
              박과장의 생활경제 노트
            </h1>
            <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full border border-slate-200">
              11년차 직장인의 경제 이야기
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            회사 생활과 일상에서 마주치는 급여, 세금, 부동산, 금융 정보를 알기 쉽게 정리합니다.
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-indigo-600" />
              이메일 문의: <span className="font-mono font-bold text-slate-700">contact@park-money.kr</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Story Behind the Blog */}
      <section className="space-y-4">
        <h2 className="font-heading text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-indigo-600" />
          <span>블로그 소개</span>
        </h2>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
          <p>
            안녕하세요, 11년차 직장인 <strong>박과장</strong>입니다.
          </p>
          <p>
            회사 생활을 하고 내 집 마련과 금융 관리를 해오면서, 급여명세서의 공제 항목이나 퇴직금 산정, 부동산 취득세 감면 등 복잡한 제도들을 직접 겪으며 공부하게 되었습니다.
          </p>
          <p className="bg-white p-3.5 rounded-xl border border-indigo-100 text-slate-900 font-medium">
            관련 법령과 행정 기준을 꼼꼼히 확인하고 정리해두면, 손해를 보지 않고 정당한 혜택을 챙길 수 있습니다.
          </p>
          <p>
            이 블로그는 직장인과 사회초년생분들이 실생활에서 바로 활용할 수 있도록, <strong>실무 기준과 계산 공식</strong>을 바탕으로 유익한 정보를 공유하는 공간입니다.
          </p>
        </div>
      </section>

      {/* 3. 3 Core Focus Areas */}
      <section className="space-y-4">
        <h2 className="font-heading text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <span>주요 주제 안내</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-sm">
              💼
            </div>
            <h3 className="font-heading font-black text-slate-900 text-sm">1. 직장·급여·퇴직</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              월급명세서 4대보험 공제 분석, 주휴 및 야간수당, 퇴직금 산정 공식, 실업급여 수급 기준.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-black text-sm">
              🏠
            </div>
            <h3 className="font-heading font-black text-slate-900 text-sm">2. 부동산·세금</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              생애최초 주택 취득세 감면, 전월세 중개보수 요율 협의, 대출 상환 방식 비교 분석.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-sm">
              🛡️
            </div>
            <h3 className="font-heading font-black text-slate-900 text-sm">3. 연금·금융·절세</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              건강보험 피부양자 자격 요건, 국민연금 조기수령 분석, ISA 계좌 절세 혜택.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Contact Box */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-3">
        <h3 className="font-heading text-lg font-black text-white flex items-center gap-2">
          <Mail className="w-5 h-5 text-indigo-400" />
          <span>문의 및 의견 보내기</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          글에 대한 질문이나 계산 검증 관련 의견이 있으시면 언제든 편하게 이메일로 남겨주세요.
        </p>
        <div className="pt-2">
          <a
            href="mailto:contact@park-money.kr"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <span>이메일 문의 (contact@park-money.kr)</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

    </div>
  );
}
