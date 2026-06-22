import React from 'react';
import { AlertTriangle, Clock, FileText } from 'lucide-react';

export default function TermsOfService() {
  return (
    <article className="bg-white rounded-2xl shadow-xs border border-slate-100 p-5 md:p-8 space-y-6 text-slate-700 leading-relaxed font-sans">
      <header className="border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><FileText className="w-6 h-6" /></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">이용약관</h1>
            <p className="text-sm text-slate-500 mt-1">생활계산기 천국 이용 시 확인해야 할 기본 사항입니다.</p>
          </div>
        </div>
      </header>

      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-sm">
        <div className="flex items-center gap-2 font-black text-slate-900"><Clock className="w-4 h-4 text-slate-500" /> 시행일: 2026년 6월 22일</div>
        <p className="mt-2">본 약관은 생활계산기 천국에서 제공하는 계산기와 안내 정보를 이용할 때 적용됩니다.</p>
      </div>

      <section className="space-y-3"><h2 className="text-lg font-black text-slate-900">서비스의 성격</h2><p>생활계산기 천국은 급여, 금융, 부동산, 생활비 등 일상에서 필요한 값을 빠르게 계산할 수 있도록 돕는 참고용 도구입니다.</p></section>
      <section className="space-y-3"><h2 className="text-lg font-black text-slate-900">계산 결과 이용</h2><p>계산 결과는 사용자가 입력한 값과 사이트에 표시된 계산식을 기준으로 산출됩니다. 실제 금액이나 적용 조건은 기관 기준과 개인 상황에 따라 달라질 수 있습니다.</p></section>
      <section className="space-y-3"><h2 className="text-lg font-black text-slate-900">저작권</h2><p>사이트의 화면 구성, 계산기 설명, 계산식 정리, 문구 등은 무단 복제하거나 그대로 재배포할 수 없습니다.</p></section>

      <section className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-start gap-3 text-amber-950">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
        <div className="text-sm"><h2 className="font-black">중요 안내</h2><p className="mt-1">법적·금전적 책임이 따르는 결정 전에는 공식 기관 또는 전문가에게 최종 확인을 받으세요.</p></div>
      </section>
    </article>
  );
}
