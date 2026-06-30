import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, RotateCcw, Search } from 'lucide-react';
import { CategoryType } from '../types';
import { calculate, calculatorCatalog, categoryKeys, categoryLabels, defaultValues, Values } from './qualityCalculators';
import { calculatorPath } from './qualityCalculators/slug';

type Props = { category: CategoryType; subCalculatorId?: string; onNavigateToCalculator?: (id: string) => void };

const ensureMeta = (selector: string, attr: string, value: string) => {
  let el = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (!el) {
    el = selector.startsWith('link') ? document.createElement('link') : document.createElement('meta');
    if (selector.includes('description')) el.setAttribute('name', 'description');
    if (selector.includes('og:title')) el.setAttribute('property', 'og:title');
    if (selector.includes('og:description')) el.setAttribute('property', 'og:description');
    if (selector.includes('og:url')) el.setAttribute('property', 'og:url');
    if (selector.startsWith('link')) el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

const formatDefault = (value: string | number, unit?: string) => {
  const suffix = unit ? ` ${unit}` : '';
  if (typeof value === 'number') return `${value.toLocaleString('ko-KR')}${suffix}`;
  return `${value}${suffix}`;
};

export default function QualityCalculatorHub({ category, subCalculatorId, onNavigateToCalculator }: Props) {
  const [query, setQuery] = useState('');
  const activeCategory = categoryKeys.includes(category as any) ? category : 'insurance';
  const available = useMemo(() => calculatorCatalog.filter((item) => item.category === activeCategory), [activeCategory]);
  const requested = useMemo(() => calculatorCatalog.find((item) => item.id === subCalculatorId), [subCalculatorId]);
  const [selectedId, setSelectedId] = useState((requested || available[0] || calculatorCatalog[0]).id);
  const selected = calculatorCatalog.find((item) => item.id === selectedId) || requested || available[0] || calculatorCatalog[0];
  const [values, setValues] = useState<Values>(() => defaultValues(selected));

  useEffect(() => {
    const next = requested || available[0] || calculatorCatalog[0];
    setSelectedId(next.id);
    setValues(defaultValues(next));
  }, [requested, activeCategory, available]);

  useEffect(() => {
    const title = `${selected.name} | 생활계산기 천국`;
    const description = `${selected.description} 입력 항목, 계산 공식, 예시 결과와 주의사항을 함께 확인할 수 있습니다.`;
    const canonicalPath = calculatorPath(selected);
    const url = `https://life-calc.kr${canonicalPath}`;
    document.title = title;
    ensureMeta('meta[name="description"]', 'content', description);
    ensureMeta('meta[property="og:title"]', 'content', title);
    ensureMeta('meta[property="og:description"]', 'content', description);
    ensureMeta('meta[property="og:url"]', 'content', url);
    ensureMeta('link[rel="canonical"]', 'href', subCalculatorId ? url : `https://life-calc.kr/category/${activeCategory}`);
  }, [selected, activeCategory, subCalculatorId]);

  const filtered = useMemo(() => available.filter((item) => !query || `${item.name} ${item.description} ${item.formula}`.toLowerCase().includes(query.toLowerCase())), [available, query]);
  const result = calculate(selected, values);
  const selectedDefaults = defaultValues(selected);
  const defaultResult = calculate(selected, selectedDefaults);
  const mainResult = result.find((item) => item.highlight) || result[0];
  const exampleResult = defaultResult.find((item) => item.highlight) || defaultResult[0];
  const related = calculatorCatalog.filter((item) => item.category === selected.category && item.id !== selected.id).slice(0, 6);
  const pageTitle = subCalculatorId ? selected.name : `${categoryLabels[activeCategory]} 계산기`;
  const pageDescription = subCalculatorId ? selected.description : `${categoryLabels[activeCategory]}에서 자주 쓰는 계산기를 선택해 바로 계산할 수 있습니다.`;

  const choose = (id: string) => {
    setSelectedId(id);
    const next = calculatorCatalog.find((item) => item.id === id);
    if (next) setValues(defaultValues(next));
    if (onNavigateToCalculator) onNavigateToCalculator(id);
    if (window.innerWidth < 1024) window.setTimeout(() => document.getElementById('calc-result-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
  };

  return (
    <section className="bg-white border border-slate-100 shadow-xs rounded-none sm:rounded-2xl px-3 py-4 sm:p-6 lg:p-8 overflow-hidden">
      <header className="border-b border-slate-100 pb-5 mb-5">
        <p className="text-xs font-black text-blue-600 mb-2">{categoryLabels[activeCategory]}</p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 leading-tight break-keep">{pageTitle}</h1>
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 break-keep max-w-3xl">{pageDescription}</p>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(360px,430px)] gap-4 sm:gap-6 items-start">
        <aside id="calc-result-panel" className="order-1 lg:order-2 bg-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-lg h-fit lg:sticky lg:top-4 print-result scroll-mt-20">
          <div className="flex items-start gap-3 border-b border-white/10 pb-4 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-2xl shrink-0">{selected.icon}</div>
            <div className="min-w-0">
              <p className="text-[11px] font-black text-blue-200">{categoryLabels[selected.category]}</p>
              <h2 className="text-lg font-black leading-tight mt-1 break-keep">{selected.name}</h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed break-keep">{selected.description}</p>
            </div>
          </div>

          <section className="print-hide">
            <h2 className="text-sm font-black text-white mb-3">입력 항목</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {selected.fields.map((field) => (
                <label key={field.key} className="block">
                  <span className="block text-[13px] font-bold text-slate-300 mb-1.5">{field.label}{field.unit ? ` (${field.unit})` : ''}</span>
                  <input
                    type={field.type || 'number'}
                    inputMode={(field.type || 'number') === 'number' ? 'decimal' : undefined}
                    value={String(values[field.key] ?? field.defaultValue)}
                    onChange={(event: any) => setValues((prev) => ({ ...prev, [field.key]: (field.type || 'number') === 'number' ? Number(event.target.value) : event.target.value }))}
                    className="w-full min-h-11 rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-right text-base sm:text-sm text-white font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-400"
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="mt-5">
            <h2 className="text-sm font-black text-white mb-3">계산 결과</h2>
            <div className="rounded-2xl bg-white text-slate-900 p-3 sm:p-4 space-y-2 print-result-box">
              {result.map((item) => (
                <div key={item.label} className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 ${item.highlight ? 'bg-blue-50' : 'bg-slate-50'}`}>
                  <span className="text-[13px] font-bold text-slate-500">{item.label}</span>
                  <span className={`text-base sm:text-sm font-black text-right break-keep ${item.highlight ? 'text-blue-700' : 'text-slate-800'}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-3 rounded-2xl bg-white/10 border border-white/10 p-3 text-[12px] leading-relaxed text-slate-200">
            <h2 className="font-black text-white mb-1">계산 공식</h2>
            <p className="break-keep">{selected.formula}</p>
            <h2 className="font-black text-white mt-3 mb-1">주의사항</h2>
            <p className="text-slate-300 break-keep">{selected.note}</p>
          </section>

          <div className="grid grid-cols-2 gap-2 mt-4 print-hide">
            <button onClick={() => setValues(defaultValues(selected))} className="min-h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 px-3 py-3 text-[13px] font-black transition"><RotateCcw className="w-4 h-4" /> 초기화</button>
            <button onClick={() => window.print()} className="min-h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-400 px-3 py-3 text-[13px] font-black transition">결과 인쇄 <ArrowRight className="w-4 h-4" /></button>
          </div>
        </aside>

        <div className="order-2 lg:order-1 min-w-0 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={query} onChange={(event: any) => setQuery(event.target.value)} placeholder="계산기 검색: 주휴수당, 대출, 취득세..." className="w-full min-h-11 rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-base sm:text-sm font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 max-h-[520px] lg:max-h-[760px] overflow-y-auto pr-0 sm:pr-1">
            {filtered.map((item) => {
              const active = item.id === selected.id;
              return (
                <a key={item.id} href={calculatorPath(item)} onClick={(event) => { event.preventDefault(); choose(item.id); }} className={`text-left rounded-2xl border p-4 min-h-[136px] transition-all touch-manipulation ${active ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'}`}>
                  <div className="flex items-start justify-between gap-2"><span className="text-2xl leading-none">{item.icon}</span><span className={`text-[10px] rounded-full px-2 py-0.5 font-black whitespace-nowrap ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{categoryLabels[item.category]}</span></div>
                  <h2 className="mt-3 text-[15px] sm:text-sm font-black leading-snug break-keep">{item.name}</h2>
                  <p className={`mt-1.5 text-[12px] leading-relaxed break-keep ${active ? 'text-blue-50' : 'text-slate-500'}`}>{item.description}</p>
                </a>
              );
            })}
          </div>

          <article className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-5 text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-lg font-black text-slate-900">{selected.name} 사용 방법</h2>
              <p className="mt-2 text-sm break-keep">{selected.description} 아래 입력칸에 값을 넣으면 {mainResult?.label || '계산 결과'}을 바로 확인할 수 있습니다. 결과는 입력값을 기준으로 산출되므로 실제 신고, 계약, 납부, 구매 전에는 적용 기준을 한 번 더 확인하는 것이 좋습니다.</p>
            </section>

            <section>
              <h2 className="text-base font-black text-slate-900 mb-2">입력 항목 안내</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {selected.fields.map((field) => (
                  <div key={field.key} className="bg-white border border-slate-200 rounded-xl p-3">
                    <h3 className="text-sm font-black text-slate-900 break-keep">{field.label}</h3>
                    <p className="mt-1 text-xs text-slate-500 break-keep">예시값: {formatDefault(field.defaultValue, field.unit)}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid md:grid-cols-2 gap-3">
              <div className="bg-white border border-slate-200 rounded-2xl p-4">
                <h2 className="text-base font-black text-slate-900 mb-2">계산 공식</h2>
                <p className="text-sm break-keep">{selected.formula}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4">
                <h2 className="text-base font-black text-slate-900 mb-2">기본값 계산 예시</h2>
                {exampleResult ? <p className="text-sm break-keep">기본 예시값으로 계산하면 <strong>{exampleResult.label}</strong>은 <strong>{exampleResult.value}</strong>입니다.</p> : <p className="text-sm break-keep">값을 입력하면 계산 결과를 확인할 수 있습니다.</p>}
              </div>
            </section>

            <section>
              <h2 className="text-base font-black text-slate-900 mb-2">결과 해석과 주의사항</h2>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
                <p className="text-sm break-keep">현재 입력값 기준으로 가장 중요한 결과는 <strong>{mainResult?.label || '계산 결과'}</strong>입니다.</p>
                <p className="text-sm break-keep text-slate-600">{selected.note}</p>
              </div>
            </section>

            <section>
              <h2 className="text-base font-black text-slate-900 mb-2">관련 계산기</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {related.map((item) => (
                  <a key={item.id} href={calculatorPath(item)} onClick={(event) => { event.preventDefault(); choose(item.id); }} className="bg-white border border-slate-200 hover:border-blue-300 rounded-xl px-3 py-3 text-sm font-bold text-slate-700 hover:text-blue-700 transition break-keep">
                    {item.name}
                  </a>
                ))}
              </div>
            </section>
          </article>
        </div>
      </div>
    </section>
  );
}
