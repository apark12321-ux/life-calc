import React from 'react';
import { Calculator, CheckCircle2, Map, ShieldCheck } from 'lucide-react';
import { calculatorCatalog, categoryLabels } from './qualityCalculators';

interface AboutAppProps {
  onNavigateToCalculator: (id: string) => void;
}

export default function AboutApp({ onNavigateToCalculator }: AboutAppProps) {
  const featured = calculatorCatalog.filter((item) => ['wage_weekly_holiday_pay', 'wage_severance_pay', 'finance_loan_payment', 'finance_dsr', 'property_acquisition_tax', 'health_bmi'].includes(item.id));
  const categories = Array.from(new Set(calculatorCatalog.map((item) => item.category)));

  return (
    <article className="bg-white rounded-2xl shadow-xs border border-slate-100 p-5 md:p-8 space-y-8 text-slate-700 leading-relaxed font-sans">
      <header className="border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Calculator className="w-6 h-6" /></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">서비스 소개</h1>
            <p className="text-sm text-slate-500 mt-1">생활계산기 천국은 일상에서 자주 필요한 계산을 쉽게 확인할 수 있도록 정리한 계산기 서비스입니다.</p>
          </div>
        </div>
      </header>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5"><h2 className="font-black text-slate-900 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-600" /> 빠른 계산</h2><p className="mt-2 text-sm">필요한 값을 입력하면 결과를 바로 확인할 수 있습니다.</p></div>
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5"><h2 className="font-black text-slate-900 flex items-center gap-2"><Map className="w-5 h-5 text-blue-600" /> 쉬운 탐색</h2><p className="mt-2 text-sm">급여, 금융, 부동산, 생활비 등 주제별로 계산기를 찾을 수 있습니다.</p></div>
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5"><h2 className="font-black text-slate-900 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-blue-600" /> 개인정보 보호</h2><p className="mt-2 text-sm">입력값은 계산을 위해 브라우저 화면에서만 사용됩니다.</p></div>
      </section>

      <section>
        <h2 className="text-xl font-black text-slate-900 mb-3">계산기 카테고리</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((category) => (
            <div key={category} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">{categoryLabels[category]}</div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-black text-slate-900 mb-3">자주 찾는 계산기</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {featured.map((item) => (
            <button key={item.id} onClick={() => onNavigateToCalculator(item.id)} className="text-left rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm p-4 transition">
              <span className="text-2xl">{item.icon}</span>
              <h3 className="mt-3 text-sm font-black text-slate-900 break-keep">{item.name}</h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed break-keep">{item.description}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-amber-50 border border-amber-200 p-5 text-sm text-amber-950">
        <h2 className="font-black mb-2">계산 결과 이용 안내</h2>
        <p>모든 계산 결과는 사용자가 입력한 값을 기준으로 산출됩니다. 실제 신고, 납부, 계약, 대출 실행 전에는 관련 기관 고시나 전문가 확인이 필요합니다.</p>
      </section>
    </article>
  );
}
