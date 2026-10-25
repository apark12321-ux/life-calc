import React, { useState } from 'react';
import { Calculator, ArrowRight, ShieldCheck, CheckCircle2, FileText, Info } from 'lucide-react';

export default function YearEndTaxCalculator() {
  const [activeTab, setActiveTab] = useState<'card' | 'rent'>('card');

  // 1. Card Golden Ratio State
  const [salary, setSalary] = useState<number>(42000000); // 4,200만원
  const [creditSpend, setCreditSpend] = useState<number>(10500000); // 1,050만원
  const [debitSpend, setDebitSpend] = useState<number>(6000000); // 600만원
  const [marketSpend, setMarketSpend] = useState<number>(500000); // 전통시장 50만원
  const [transitSpend, setTransitSpend] = useState<number>(800000); // 대중교통 80만원

  // 2. Rent Tax Credit State
  const [rentSalary, setRentSalary] = useState<number>(42000000);
  const [monthlyRent, setMonthlyRent] = useState<number>(650000); // 월 65만원
  const [rentMonths, setRentMonths] = useState<number>(12); // 12개월
  const [housingType, setHousingType] = useState<'officetel' | 'oneroom' | 'apartment'>('officetel');
  const [hasRegistration, setHasRegistration] = useState<boolean>(true); // 전입신고 여부

  // Format currency helpers
  const formatKrw = (num: number): string => Math.round(num).toLocaleString('ko-KR') + '원';
  const formatManwon = (num: number): string => {
    if (num === 0) return '0원';
    const man = Math.floor(num / 10000);
    const rem = num % 10000;
    if (rem === 0) return `${man.toLocaleString()}만원`;
    return `${man.toLocaleString()}만 ${rem.toLocaleString()}원`;
  };

  // Card Calculation Logic (조세특례제한법 제122조의3)
  const threshold = Math.round(salary * 0.25); // 25% minimum threshold
  const totalSpend = creditSpend + debitSpend + marketSpend + transitSpend;
  const isThresholdMet = totalSpend >= threshold;
  const thresholdRemaining = Math.max(0, threshold - totalSpend);

  // Deduction calculation:
  // Threshold is first absorbed by credit card (15% rate), then other means
  let creditForThreshold = Math.min(creditSpend, threshold);
  let remainingThreshold = threshold - creditForThreshold;

  let debitForThreshold = Math.min(debitSpend, remainingThreshold);
  remainingThreshold -= debitForThreshold;

  let marketForThreshold = Math.min(marketSpend, remainingThreshold);
  remainingThreshold -= marketForThreshold;

  let transitForThreshold = Math.min(transitSpend, remainingThreshold);
  remainingThreshold -= transitForThreshold;

  // Deductible portions
  const creditExcess = Math.max(0, creditSpend - creditForThreshold);
  const debitExcess = Math.max(0, debitSpend - debitForThreshold);
  const marketExcess = Math.max(0, marketSpend - marketForThreshold);
  const transitExcess = Math.max(0, transitSpend - transitForThreshold);

  // Standard deduction limits (총급여 7천만원 이하 300만원 한도)
  const baseLimit = salary <= 70000000 ? 3000000 : 2500000;
  const standardDeductionRaw = (creditExcess * 0.15) + (debitExcess * 0.30);
  const standardDeduction = Math.min(baseLimit, standardDeductionRaw);

  // Additional limits for traditional market & transit (각 100만원 한도)
  const marketDeduction = Math.min(1000000, marketExcess * 0.40);
  const transitDeduction = Math.min(1000000, transitExcess * 0.80);

  const totalCardDeduction = standardDeduction + marketDeduction + transitDeduction;

  // Approximate marginal income tax rate based on taxable bracket
  // 과표 1,400만 이하 6%, 1,400만~5,000만 15%, 5,000만~8,800만 24%
  const getMarginalTaxRate = (grossSalary: number) => {
    if (grossSalary <= 30000000) return 0.06; // 과표 약 1,400만 이하 (지방세 포함 6.6%)
    if (grossSalary <= 75000000) return 0.15; // 과표 약 1,400만~5,000만 (지방세 포함 16.5%)
    return 0.24; // (지방세 포함 26.4%)
  };

  const marginalRate = getMarginalTaxRate(salary);
  const effectiveMarginalRate = marginalRate * 1.1; // 지방소득세 10% 가산
  const estimatedCardTaxRefund = Math.round(totalCardDeduction * effectiveMarginalRate);

  // Rent Tax Credit Logic (조세특례제한법 제95조의2)
  // 총급여 5,500만원 이하: 17% 세액공제
  // 총급여 5,500만원 초과 ~ 8,000만원 이하: 15% 세액공제
  const annualRentTotal = monthlyRent * rentMonths;
  const rentCap = 10000000; // 2026 연 1,000만원 한도
  const eligibleRentAmount = Math.min(rentCap, annualRentTotal);

  let rentCreditRate = 0;
  let rentCreditEligible = true;

  if (rentSalary <= 55000000) {
    rentCreditRate = 0.17;
  } else if (rentSalary <= 80000000) {
    rentCreditRate = 0.15;
  } else {
    rentCreditEligible = false;
    rentCreditRate = 0;
  }

  const estimatedRentTaxRefund = rentCreditEligible ? Math.round(eligibleRentAmount * rentCreditRate) : 0;

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('card')}
          className={`py-3 px-5 font-heading text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'card'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          1. 카드 소비 황금비율(25%) & 공제액 계산기
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('rent')}
          className={`py-3 px-5 font-heading text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'rent'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          2. 월세 세액공제(최대 170만원) 모의계산기
        </button>
      </div>

      {/* Tab 1: Card Golden Ratio */}
      {activeTab === 'card' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">박과장의 카드 소득공제 핵심 룰:</p>
              <p className="mt-0.5 leading-relaxed">
                총급여의 25%까지는 어떤 결제수단을 써도 공제율이 0%입니다. 따라서 25% 문턱까지는 할인/적립 혜택이 좋은 신용카드를 쓰고, 25% 초과 지출분부터 공제율이 2배 높은 체크카드·현금영수증(30%)으로 집중 전환하는 것이 환급액을 극대화하는 황금 공식입니다.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Controls */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  나의 세전 총급여액 (연봉)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="1000000"
                    value={salary}
                    onChange={(e) => setSalary(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="absolute right-4 top-2.5 text-xs text-slate-400 font-medium">
                    {formatManwon(salary)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  * 비과세 소득(식대 등)을 제외한 근로소득원천징수영수증 상의 총급여액입니다.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-medium">필수 최저 사용 문턱 (총급여의 25%)</span>
                  <span className="font-bold text-indigo-700 text-sm">{formatKrw(threshold)}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${isThresholdMet ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${Math.min(100, (totalSpend / Math.max(1, threshold)) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1.5">
                  <span>총 카드 소비액: {formatKrw(totalSpend)}</span>
                  <span>{isThresholdMet ? '문턱 달성 (공제 개시)' : `문턱까지 ${formatKrw(thresholdRemaining)} 부족`}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  1) 신용카드 연간 지출액 (공제율 15%)
                </label>
                <input
                  type="number"
                  step="500000"
                  value={creditSpend}
                  onChange={(e) => setCreditSpend(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-500">{formatManwon(creditSpend)}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2) 체크카드 / 현금영수증 연간 지출액 (공제율 30%)
                </label>
                <input
                  type="number"
                  step="500000"
                  value={debitSpend}
                  onChange={(e) => setDebitSpend(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-500">{formatManwon(debitSpend)}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    3) 전통시장 (공제율 40%)
                  </label>
                  <input
                    type="number"
                    step="100000"
                    value={marketSpend}
                    onChange={(e) => setMarketSpend(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500">{formatManwon(marketSpend)}</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    4) 대중교통 (한시 공제율 80%)
                  </label>
                  <input
                    type="number"
                    step="100000"
                    value={transitSpend}
                    onChange={(e) => setTransitSpend(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500">{formatManwon(transitSpend)}</span>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-6 bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <span className="text-xs text-indigo-300 font-bold">2026 연말정산 시뮬레이션 결과</span>
                  <span className="text-[11px] bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-400/30">
                    한계세율 약 {(effectiveMarginalRate * 100).toFixed(1)}% 적용
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex justify-between items-center text-xs text-slate-300">
                    <span>총 카드 지출액</span>
                    <span className="font-semibold text-white">{formatKrw(totalSpend)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-300">
                    <span>공제 제외 문턱 금액 (25%)</span>
                    <span className="text-amber-400 font-semibold">-{formatKrw(threshold)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-300">
                    <span>공제 인정 대상 초과액</span>
                    <span className="font-semibold text-white">{formatKrw(Math.max(0, totalSpend - threshold))}</span>
                  </div>

                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs text-slate-300">
                      <span>일반 소득공제 금액 (한도 {formatManwon(baseLimit)})</span>
                      <span className="font-bold text-white">{formatKrw(standardDeduction)}</span>
                    </div>
                    {marketDeduction > 0 && (
                      <div className="flex justify-between items-center text-xs text-slate-300">
                        <span>전통시장 추가 공제</span>
                        <span className="font-bold text-indigo-300">+{formatKrw(marketDeduction)}</span>
                      </div>
                    )}
                    {transitDeduction > 0 && (
                      <div className="flex justify-between items-center text-xs text-slate-300">
                        <span>대중교통 추가 공제</span>
                        <span className="font-bold text-indigo-300">+{formatKrw(transitDeduction)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm font-bold text-indigo-300 pt-2 border-t border-slate-800">
                      <span>최종 카드 소득공제 합계</span>
                      <span>{formatKrw(totalCardDeduction)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-indigo-950/60 rounded-xl border border-indigo-500/30">
                  <p className="text-xs text-indigo-200 font-medium">예상 실제 세금 환급액 (13월의 월급)</p>
                  <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
                    약 {formatKrw(estimatedCardTaxRefund)}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    * 소득공제액 {formatKrw(totalCardDeduction)} × 실효세율 약 {(effectiveMarginalRate * 100).toFixed(1)}% 기준
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl text-xs space-y-1">
                <p className="font-bold text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  박과장의 실전 조언
                </p>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  {isThresholdMet
                    ? '현재 25% 문턱을 넘으셨습니다! 지금부터는 신용카드 사용을 멈추고 체크카드와 현금영수증(공제율 30%)만 쓰셔야 환급액이 2배 속도로 늘어납니다.'
                    : `아직 25% 문턱까지 ${formatManwon(thresholdRemaining)}이 남았습니다. 문턱까지는 혜택 좋은 신용카드를 집중 사용하세요.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Monthly Rent Tax Credit */}
      {activeTab === 'rent' && (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">월세는 소득공제가 아닌 '세액공제'입니다 (직접 세금 차감):</p>
              <p className="mt-0.5 leading-relaxed">
                총급여 5,500만원 이하는 지출한 월세의 17%, 8,000만원 이하는 15%를 낸 세금에서 그대로 깎아줍니다. 집주인 동의나 계약서 특약과 전혀 무관하게 신청할 수 있으며, 혹시 이번에 신청하지 못했더라도 이사 후 5년 이내에 홈택스 경정청구로 100% 환급받을 수 있습니다.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Controls */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  근로자 연간 총급여액
                </label>
                <input
                  type="number"
                  step="1000000"
                  value={rentSalary}
                  onChange={(e) => setRentSalary(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-500">{formatManwon(rentSalary)}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  매월 납부하는 월세 금액
                </label>
                <input
                  type="number"
                  step="50000"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-500">{formatManwon(monthlyRent)} / 월</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    해당 연도 거주 개월수
                  </label>
                  <select
                    value={rentMonths}
                    onChange={(e) => setRentMonths(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {[12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((m) => (
                      <option key={m} value={m}>{m}개월 거주</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    주택 유형 (전용 85㎡ 또는 기준시가 4억 이하)
                  </label>
                  <select
                    value={housingType}
                    onChange={(e) => setHousingType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="officetel">주거용 오피스텔</option>
                    <option value="oneroom">원룸·다세대·빌라</option>
                    <option value="apartment">아파트 (85㎡ 이하)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={hasRegistration}
                    onChange={(e) => setHasRegistration(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span>임대차계약서 상 주소지로 전입신고(주민등록등본)를 마쳤습니다</span>
                </label>
                {!hasRegistration && (
                  <p className="text-[11px] text-rose-600 mt-1 pl-6">
                    * 전입신고가 되어 있지 않으면 월세 세액공제를 받을 수 없습니다. 즉시 정부24에서 전입신고를 진행하세요.
                  </p>
                )}
              </div>
            </div>

            {/* Rent Results Panel */}
            <div className="lg:col-span-6 bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <span className="text-xs text-emerald-300 font-bold">2026 월세 세액공제 결과</span>
                  <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                    {rentCreditEligible ? `공제율 ${(rentCreditRate * 100)}% 적용` : '총급여 8,000만원 초과 (공제 제외)'}
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex justify-between items-center text-xs text-slate-300">
                    <span>1년간 지출한 총 월세</span>
                    <span className="font-semibold text-white">{formatKrw(annualRentTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-300">
                    <span>법정 세액공제 인정 한도 (연 1,000만원)</span>
                    <span className="font-semibold text-slate-300">{formatKrw(eligibleRentAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-300">
                    <span>적용 세액공제율</span>
                    <span className="font-bold text-emerald-400">{(rentCreditRate * 100)}%</span>
                  </div>

                  <div className="mt-6 p-4 bg-emerald-950/60 rounded-xl border border-emerald-500/30">
                    <p className="text-xs text-emerald-200 font-medium">연말정산 통장 입금 환급액</p>
                    <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
                      {formatKrw(estimatedRentTaxRefund)}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      * 근로소득 산출세액 범위 내에서 세금 전액이 환급 계좌로 직접 입금됩니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* Checklist & 5-Year Claim */}
              <div className="p-3 bg-slate-800/80 rounded-xl text-xs space-y-2">
                <p className="font-bold text-slate-200 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  필요 서류 3가지 & 5년 경정청구 안내
                </p>
                <ul className="text-[11px] text-slate-400 space-y-1 list-disc pl-4">
                  <li><strong>주민등록표등본</strong> (전입신고 내역 확인)</li>
                  <li><strong>임대차계약서 사본</strong> (확정일자 없어도 무방)</li>
                  <li><strong>월세 계좌이체 영수증</strong> (은행 이체확인증 PDF)</li>
                </ul>
                <p className="text-[10px] text-indigo-300 border-t border-slate-700/80 pt-1.5">
                  집주인과의 관계가 부담스럽다면, 퇴거 후 5년 이내에 홈택스 [종합소득세 경정청구]를 통해 회사나 집주인 모르게 혼자 환급받으실 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
