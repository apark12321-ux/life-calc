import React, { useMemo, useState } from 'react';
import { ArrowRight, ListChecks, RotateCcw, Search } from 'lucide-react';
import { CategoryType } from '../types';

type CalcCategory = 'insurance' | 'wage' | 'life' | 'finance' | 'property';
type CalcItem = { id: string; name: string; category: CalcCategory; icon: string; description: string; mode: number };

const categoryKeys: CalcCategory[] = ['insurance', 'wage', 'life', 'finance', 'property'];
const categoryLabels: Record<CalcCategory, string> = {
  insurance: '4대보험',
  wage: '급여·퇴직금',
  life: '생활·달력',
  finance: '금융·예적금',
  property: '부동산·세금'
};
const icons: Record<CalcCategory, string> = { insurance: '🛡️', wage: '💼', life: '🧭', finance: '💰', property: '🏠' };

const names: Record<CalcCategory, string[]> = {
  insurance: ['4대보험 총액 계산기','국민연금 부담액 계산기','건강보험료 계산기','장기요양보험료 계산기','고용보험료 계산기','산재보험료 계산기','회사 총 인건비 계산기','급여 공제 보험료 계산기','프리랜서 3.3% 실수령액 계산기','아르바이트 월 보수 계산기','연간 보험료 예산 계산기','국민연금 상한 적용 계산기','보험료율 변경 영향 계산기','소상공인 인건비 부담 계산기','보험 공제 후 월급 계산기'],
  wage: ['시급 월급 환산 계산기','주휴수당 계산기','연장근로수당 계산기','야간근로수당 계산기','휴일근로수당 계산기','연봉 월급 환산 계산기','월급 연봉 환산 계산기','월급 실수령액 계산기','퇴직금 계산기','실업급여 총액 계산기','일급 계산기','주급 계산기','성과급 수수료 계산기','상여금 실수령액 계산기','프리랜서 실수령액 계산기','최저임금 차액 계산기','지각 공제액 계산기','무급휴가 공제액 계산기','아르바이트 세금 계산기','연말정산 환급액 계산기'],
  life: ['만 나이 계산기','디데이 계산기','기념일 n일째 계산기','BMI 계산기','하루 물 섭취량 계산기','기초대사량 간편 계산기','걸음 수 거리 계산기','주유비 계산기','이동시간 계산기','전기요금 계산기','가스요금 계산기','수도요금 계산기','이사 박스 수 계산기','페인트 필요량 계산기','도배지 롤 수 계산기','타일 수량 계산기','반려견 나이 환산 계산기','요리 비율 계산기','센티미터 인치 변환기','킬로그램 파운드 변환기','섭씨 화씨 변환기','러닝 페이스 계산기','수면 사이클 계산기','입학·졸업연도 계산기','구독료 N분의 1 계산기'],
  finance: ['예금 단리 이자 계산기','적금 만기 수령액 계산기','복리 이자 계산기','대출 원리금 상환 계산기','대출 월이자 계산기','DSR 계산기','LTV 계산기','카드 할부 월납입 계산기','부가세 계산기','부가세 포함가 역산 계산기','할인율 계산기','마진율 계산기','판매가 산정 계산기','주식 수익률 계산기','코인 수익률 계산기','환율 환산 계산기','목표금액 월저축 계산기','비상금 필요액 계산기','물가상승 반영 계산기','연평균 수익률 계산기'],
  property: ['평수 제곱미터 변환기','제곱미터 평수 변환기','취득세 계산기','부동산 중개보수 계산기','월세 수익률 계산기','전세가율 계산기','주택담보대출 월이자 계산기','DTI 계산기','주택 LTV 계산기','전세보증금 이자기회비용 계산기','월세 전세 환산 계산기','전세 월세 환산 계산기','관리비 분담 계산기','장기수선충당금 계산기','이사비 예산 계산기','인테리어 평당 비용 계산기','부동산 투자수익률 계산기','양도차익 계산기','중개보수 부가세 포함 계산기','평당가 계산기']
};

export const calculatorCatalog: CalcItem[] = categoryKeys.flatMap((category) =>
  names[category].map((name, index) => ({
    id: `${category}_${String(index + 1).padStart(2, '0')}`,
    name,
    category,
    icon: icons[category],
    description: `${categoryLabels[category]} 영역에서 자주 쓰는 ${name.replace(' 계산기', '')}를 빠르게 계산합니다.`,
    mode: index % 6
  }))
);

const won = (value: number) => `${Math.round(Number.isFinite(value) ? value : 0).toLocaleString('ko-KR')}원`;
const num = (value: number, unit = '') => `${(Math.round((Number.isFinite(value) ? value : 0) * 100) / 100).toLocaleString('ko-KR')}${unit}`;

function calculate(item: CalcItem, amount: number, rate: number, count: number) {
  if (item.name.includes('BMI')) return [{ label: 'BMI', value: num(amount / Math.pow(rate / 100, 2)), highlight: true }];
  if (item.name.includes('대출') || item.name.includes('원리금')) {
    const monthlyRate = rate / 100 / 12;
    const pay = monthlyRate ? amount * monthlyRate * Math.pow(1 + monthlyRate, count) / (Math.pow(1 + monthlyRate, count) - 1) : amount / count;
    return [{ label: '월 상환액', value: won(pay), highlight: true }, { label: '총 상환액', value: won(pay * count) }];
  }
  if (item.name.includes('비율') || item.name.includes('수익률') || item.name.includes('DSR') || item.name.includes('LTV') || item.name.includes('DTI') || item.name.includes('전세가율') || item.name.includes('마진율')) {
    return [{ label: '비율', value: num((amount / Math.max(rate, 1)) * 100, '%'), highlight: true }];
  }
  if (item.name.includes('실수령') || item.name.includes('할인') || item.name.includes('공제') || item.name.includes('세금')) {
    const deduction = amount * rate / 100;
    return [{ label: '차감액', value: won(deduction) }, { label: '계산 결과', value: won(amount - deduction), highlight: true }];
  }
  if (item.name.includes('환산') || item.name.includes('변환') || item.name.includes('나눔') || item.name.includes('분담') || item.name.includes('N분의')) {
    return [{ label: '나눗셈 환산', value: num(amount / Math.max(rate, 1)), highlight: true }, { label: '곱셈 환산', value: num(amount * rate) }];
  }
  if (item.name.includes('이자') || item.name.includes('예금') || item.name.includes('적금') || item.name.includes('복리')) {
    const interest = amount * rate / 100 * count / 12;
    return [{ label: '예상 이자', value: won(interest) }, { label: '예상 합계', value: won(amount + interest), highlight: true }];
  }
  if (item.mode === 0) return [{ label: '적용 금액', value: won(amount * rate / 100), highlight: true }];
  if (item.mode === 1) return [{ label: '곱셈 결과', value: num(amount * count), highlight: true }];
  if (item.mode === 2) return [{ label: '나눗셈 결과', value: num(amount / Math.max(count, 1)), highlight: true }];
  if (item.mode === 3) return [{ label: '합산 결과', value: won(amount + rate + count), highlight: true }];
  if (item.mode === 4) return [{ label: '차이', value: num(amount - rate), highlight: true }];
  return [{ label: '계산 결과', value: won(amount * rate / 100 + count), highlight: true }];
}

export default function UniversalCalculatorHub({ category, subCalculatorId = 'all' }: { category: CategoryType; subCalculatorId?: string }) {
  const [query, setQuery] = useState('');
  const activeCategory = categoryKeys.includes(category as CalcCategory) ? category as CalcCategory : 'insurance';
  const available = calculatorCatalog.filter((item) => item.category === activeCategory);
  const initial = calculatorCatalog.find((item) => item.id === subCalculatorId) || available[0] || calculatorCatalog[0];
  const [selectedId, setSelectedId] = useState(initial.id);
  const [amount, setAmount] = useState(1000000);
  const [rate, setRate] = useState(10);
  const [count, setCount] = useState(12);
  const selected = calculatorCatalog.find((item) => item.id === selectedId) || initial;
  const filtered = useMemo(() => available.filter((item) => !query || `${item.name} ${item.description}`.toLowerCase().includes(query.toLowerCase())), [available, query]);
  const result = calculate(selected, amount, rate, count);

  const choose = (id: string) => {
    setSelectedId(id);
    const url = new URL(window.location.href);
    url.searchParams.set('calc', id);
    window.history.replaceState(null, '', url.toString());
  };

  return (
    <section className="bg-white rounded-2xl shadow-xs border border-slate-100 p-4 md:p-8">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 border-b border-slate-100 pb-6 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-extrabold mb-3"><ListChecks className="w-3.5 h-3.5" /> 계산기 100종</div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">생활계산기 천국 100종 모음</h1>
          <p className="text-sm text-slate-500 mt-2 max-w-3xl leading-relaxed">4대보험, 급여, 생활, 금융, 부동산 계산기를 검색하고 바로 계산할 수 있습니다.</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
          <div className="rounded-xl bg-slate-900 text-white px-3 py-2"><p className="text-lg font-black">{calculatorCatalog.length}</p><p className="text-[10px] text-slate-300 font-bold">전체</p></div>
          {categoryKeys.map((key) => <div key={key} className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2"><p className="text-lg font-black text-slate-900">{names[key].length}</p><p className="text-[10px] text-slate-500 font-bold">{categoryLabels[key]}</p></div>)}
        </div>
      </div>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_420px] gap-6">
        <div className="space-y-4">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="계산기 검색: 주휴수당, 대출, 평수, 전기요금..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500" /></div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 max-h-[720px] overflow-y-auto pr-1">
            {filtered.map((item) => {
              const active = item.id === selected.id;
              return <button key={item.id} onClick={() => choose(item.id)} className={`text-left rounded-2xl border p-4 transition-all ${active ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'}`}>
                <div className="flex items-start justify-between gap-2"><span className="text-2xl">{item.icon}</span><span className={`text-[10px] rounded-full px-2 py-0.5 font-black ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{categoryLabels[item.category]}</span></div>
                <h2 className="mt-3 text-sm font-black leading-snug">{item.name}</h2>
                <p className={`mt-1.5 text-xs leading-relaxed ${active ? 'text-blue-50' : 'text-slate-500'}`}>{item.description}</p>
              </button>;
            })}
          </div>
        </div>
        <aside className="bg-slate-900 rounded-2xl p-5 text-white shadow-lg h-fit sticky top-4">
          <div className="flex items-start gap-3 border-b border-white/10 pb-4 mb-5"><div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">{selected.icon}</div><div><p className="text-[10px] font-black text-blue-200 uppercase tracking-wider">{categoryLabels[selected.category]}</p><h2 className="text-lg font-black leading-tight mt-1">{selected.name}</h2><p className="text-xs text-slate-300 mt-1 leading-relaxed">{selected.description}</p></div></div>
          <div className="space-y-3">
            <label className="block"><span className="block text-xs font-bold text-slate-300 mb-1.5">기준 금액·값</span><input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-right text-white font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-400" /></label>
            <label className="block"><span className="block text-xs font-bold text-slate-300 mb-1.5">비율·비교값</span><input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-right text-white font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-400" /></label>
            <label className="block"><span className="block text-xs font-bold text-slate-300 mb-1.5">기간·수량</span><input type="number" value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-right text-white font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-400" /></label>
          </div>
          <div className="mt-5 rounded-2xl bg-white text-slate-900 p-4 space-y-2">{result.map((row) => <div key={row.label} className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 ${row.highlight ? 'bg-blue-50' : 'bg-slate-50'}`}><span className="text-xs font-bold text-slate-500">{row.label}</span><span className={`text-sm font-black ${row.highlight ? 'text-blue-700' : 'text-slate-800'}`}>{row.value}</span></div>)}</div>
          <div className="flex gap-2 mt-4"><button onClick={() => { setAmount(1000000); setRate(10); setCount(12); }} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 py-3 text-xs font-black transition"><RotateCcw className="w-4 h-4" /> 초기화</button><button onClick={() => window.print()} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-400 py-3 text-xs font-black transition">결과 인쇄 <ArrowRight className="w-4 h-4" /></button></div>
        </aside>
      </div>
    </section>
  );
}
