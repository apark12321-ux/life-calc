import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, RotateCcw, Search } from 'lucide-react';
import { CategoryType } from '../types';
import { calculate, calculatorCatalog, categoryKeys, categoryLabels, defaultValues, Values } from './qualityCalculators';

export default function QualityCalculatorHub({ category, subCalculatorId = 'all' }: { category: CategoryType; subCalculatorId?: string }) {
  const [query, setQuery] = useState('');
  const activeCategory = categoryKeys.includes(category as any) ? category : 'insurance';
  const available = useMemo(() => calculatorCatalog.filter((item) => item.category === activeCategory), [activeCategory]);
  const initial = calculatorCatalog.find((item) => item.id === subCalculatorId) || available[0] || calculatorCatalog[0];
  const [selectedId, setSelectedId] = useState(initial.id);
  const selected = calculatorCatalog.find((item) => item.id === selectedId) || initial;
  const [values, setValues] = useState<Values>({});

  useEffect(() => {
    if (!available.some((item) => item.id === selectedId)) setSelectedId((available[0] || calculatorCatalog[0]).id);
  }, [available, selectedId]);

  useEffect(() => {
    setValues(defaultValues(selected));
  }, [selected.id]);

  const filtered = useMemo(
    () => available.filter((item) => !query || `${item.name} ${item.description} ${item.formula}`.toLowerCase().includes(query.toLowerCase())),
    [available, query]
  );
  const result = calculate(selected, values);

  const choose = (id: string) => {
    setSelectedId(id);
    const url = new URL(window.location.href);
    url.searchParams.set('calc', id);
    window.history.replaceState(null, '', url.toString());
    if (window.innerWidth < 1024) window.setTimeout(() => document.getElementById('calc-result-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
  };

  return (
    <section className="bg-white border border-slate-100 shadow-xs rounded-none sm:rounded-2xl px-3 py-4 sm:p-6 lg:p-8 overflow-hidden">
      <div className="border-b border-slate-100 pb-4 sm:pb-6 mb-4 sm:mb-6">
        <div className="max-w-3xl">
          <p className="text-[12px] sm:text-sm font-black text-blue-600 mb-2">{categoryLabels[activeCategory]}</p>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-slate-900 leading-tight">생활계산기 천국</h1>
          <p className="text-[13px] sm:text-sm text-slate-500 mt-2 leading-relaxed break-keep">필요한 계산기를 선택하고 값을 입력하면 바로 결과를 확인할 수 있습니다.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(360px,430px)] gap-4 sm:gap-6 items-start">
        <aside id="calc-result-panel" className="order-1 lg:order-2 bg-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-lg h-fit lg:sticky lg:top-4 print-result scroll-mt-20">
          <div className="flex items-start gap-3 border-b border-white/10 pb-4 mb-4 sm:mb-5"><div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl shrink-0">{selected.icon}</div><div className="min-w-0"><p className="text-[10px] sm:text-[11px] font-black text-blue-200 uppercase tracking-wider">{categoryLabels[selected.category]}</p><h2 className="text-base sm:text-lg font-black leading-tight mt-1 break-keep">{selected.name}</h2><p className="text-[12px] sm:text-xs text-slate-300 mt-1 leading-relaxed break-keep">{selected.description}</p></div></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 print-hide">{selected.fields.map((field) => <label key={field.key} className="block min-w-0"><span className="block text-[13px] sm:text-xs font-bold text-slate-300 mb-1.5">{field.label}{field.unit ? ` (${field.unit})` : ''}</span><input type={field.type || 'number'} inputMode={(field.type || 'number') === 'number' ? 'decimal' : undefined} value={String(values[field.key] ?? field.defaultValue)} onChange={(event: any) => setValues((prev) => ({ ...prev, [field.key]: (field.type || 'number') === 'number' ? Number(event.target.value) : event.target.value }))} className="w-full min-h-11 rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-right text-base sm:text-sm text-white font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-400" /></label>)}</div>
          <div className="mt-4 sm:mt-5 rounded-2xl bg-white text-slate-900 p-3 sm:p-4 space-y-2 print-result-box">{result.map((item) => <div key={item.label} className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 ${item.highlight ? 'bg-blue-50' : 'bg-slate-50'}`}><span className="text-[13px] sm:text-xs font-bold text-slate-500">{item.label}</span><span className={`text-base sm:text-sm font-black text-right break-keep ${item.highlight ? 'text-blue-700' : 'text-slate-800'}`}>{item.value}</span></div>)}</div>
          <div className="mt-3 rounded-2xl bg-white/10 border border-white/10 p-3 text-[12px] leading-relaxed text-slate-200"><p className="font-black text-white mb-1">계산 기준</p><p className="break-keep">{selected.formula}</p><p className="mt-2 text-slate-300 break-keep">{selected.note}</p></div>
          <div className="grid grid-cols-2 gap-2 mt-4 print-hide"><button onClick={() => setValues(defaultValues(selected))} className="min-h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 px-3 py-3 text-[13px] sm:text-xs font-black transition"><RotateCcw className="w-4 h-4" /> 초기화</button><button onClick={() => window.print()} className="min-h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-400 px-3 py-3 text-[13px] sm:text-xs font-black transition">결과 인쇄 <ArrowRight className="w-4 h-4" /></button></div>
        </aside>
        <div className="order-2 lg:order-1 min-w-0 space-y-4"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input value={query} onChange={(event: any) => setQuery(event.target.value)} placeholder="계산기 검색: 주휴수당, 대출, 취득세..." className="w-full min-h-11 rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-base sm:text-sm font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500" /></div><div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 max-h-[520px] lg:max-h-[760px] overflow-y-auto pr-0 sm:pr-1">{filtered.map((item) => { const active = item.id === selected.id; return <button key={item.id} onClick={() => choose(item.id)} className={`text-left rounded-2xl border p-4 min-h-[136px] transition-all touch-manipulation ${active ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'}`}><div className="flex items-start justify-between gap-2"><span className="text-2xl leading-none">{item.icon}</span><span className={`text-[10px] rounded-full px-2 py-0.5 font-black whitespace-nowrap ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{categoryLabels[item.category]}</span></div><h2 className="mt-3 text-[15px] sm:text-sm font-black leading-snug break-keep">{item.name}</h2><p className={`mt-1.5 text-[12px] leading-relaxed break-keep ${active ? 'text-blue-50' : 'text-slate-500'}`}>{item.description}</p></button>; })}</div></div>
      </div>
    </section>
  );
}
