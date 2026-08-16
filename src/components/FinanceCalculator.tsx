import React, { useState } from 'react';
import { Landmark, TrendingUp, HelpCircle, RefreshCw, BookOpen, Receipt, AlignJustify, Printer } from 'lucide-react';

export default function FinanceCalculator() {
  const [activeTab, setActiveTab] = useState<'savings' | 'loan'>('savings');

  // Savings inputs
  const [savingsType, setSavingsType] = useState<'deposit' | 'savings'>('deposit');
  const [principal, setPrincipal] = useState<number>(10000000); // 10 million KRW
  const [termMonths, setTermMonths] = useState<number>(12);
  const [interestRate, setInterestRate] = useState<number>(3.5);
  const [compoundType, setCompoundType] = useState<'simple' | 'compound'>('simple');
  const [taxType, setTaxType] = useState<'normal' | 'favored' | 'free'>('normal');

  // Loan inputs
  const [loanPrincipal, setLoanPrincipal] = useState<number>(50000000); // 50 million KRW
  const [loanTerm, setLoanTerm] = useState<number>(24);
  const [loanRate, setLoanRate] = useState<number>(5.2);
  const [repaymentType, setRepaymentType] = useState<'equal_both' | 'equal_principal' | 'maturity'>('equal_both');

  // Helper to format currency into Korean units for realtime accessibility
  const formatKoreanPrice = (num: number): string => {
    if (num === 0) return '0원';
    const hundredMillion = Math.floor(num / 100000000);
    const tenThousand = Math.floor((num % 100000000) / 10000);
    const remainder = num % 10000;
    
    let parts: string[] = [];
    if (hundredMillion > 0) parts.push(`${hundredMillion}억`);
    if (tenThousand > 0) parts.push(`${tenThousand.toLocaleString()}만`);
    if (remainder > 0) parts.push(`${remainder.toLocaleString()}`);
    return parts.join(' ') + ' 원';
  };

  // Calculations:
  // 1. Savings Interest Calculation
  const calculateSavings = () => {
    let preTaxInterest = 0;
    
    // Deposit / Savings math
    if (savingsType === 'deposit') {
      if (compoundType === 'simple') {
        preTaxInterest = principal * (interestRate / 100) * (termMonths / 12);
      } else {
        // Compound: S = P * (1 + r/12)^n - P
        preTaxInterest = principal * Math.pow(1 + (interestRate / 100) / 12, termMonths) - principal;
      }
    } else {
      // Monthly savings installment
      const monthlyP = principal; // treated as monthly input
      const r = (interestRate / 100) / 12;
      
      if (compoundType === 'simple') {
        // Simple savings interest: sum of (installment amount * month-to-maturity/12 * annual rate)
        // Interest = P * r/12 * [ n*(n+1)/2 ] or simply:
        let totalInterest = 0;
        for (let i = 1; i <= termMonths; i++) {
          totalInterest += monthlyP * (interestRate / 100) * (i / 12);
        }
        preTaxInterest = totalInterest;
      } else {
        // Compound savings installment math
        let totalCompoundSum = 0;
        for (let i = 1; i <= termMonths; i++) {
          totalCompoundSum += monthlyP * Math.pow(1 + r, i);
        }
        preTaxInterest = totalCompoundSum - (monthlyP * termMonths);
      }
    }

    // Taxes
    // Normal: 15.4% (14% income tax + 1.4% local)
    // Favored: 9.5% (9% income + 0.5% 농특세)
    // Free: 0%
    let taxRate = 0.154;
    if (taxType === 'favored') taxRate = 0.095;
    else if (taxType === 'free') taxRate = 0;

    const totalPrincipal = savingsType === 'deposit' ? principal : principal * termMonths;
    const taxAmount = Math.floor(preTaxInterest * taxRate);
    const postTaxInterest = Math.floor(preTaxInterest - taxAmount);
    const totalPayout = totalPrincipal + postTaxInterest;

    return {
      totalPrincipal,
      preTaxInterest: Math.floor(preTaxInterest),
      taxAmount,
      postTaxInterest,
      totalPayout
    };
  };

  const savingsRes = calculateSavings();

  // 2. Loan Interest Calculation
  const calculateLoan = () => {
    const P = loanPrincipal;
    const r = (loanRate / 100) / 12;
    const n = loanTerm;

    let schedule: Array<{ month: number; payment: number; principalRepayment: number; interestRepayment: number; remaining: number }> = [];
    let totalInterest = 0;

    if (repaymentType === 'equal_both') {
      // 원리금균등 분할상환
      // Monthly payment = P * r * (1+r)^n / ((1+r)^n - 1)
      const monthlyPayment = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      let balance = P;

      for (let i = 1; i <= n; i++) {
        const interest = balance * r;
        const principalRepayment = monthlyPayment - interest;
        balance -= principalRepayment;
        totalInterest += interest;

        if (i <= 6 || i === n) {
          schedule.push({
            month: i,
            payment: Math.floor(monthlyPayment),
            principalRepayment: Math.floor(principalRepayment),
            interestRepayment: Math.floor(interest),
            remaining: Math.max(0, Math.floor(balance))
          });
        }
      }
    } else if (repaymentType === 'equal_principal') {
      // 원금균등 분할상환
      const fixedPrincipalRepayment = P / n;
      let balance = P;

      for (let i = 1; i <= n; i++) {
        const interest = balance * r;
        const payment = fixedPrincipalRepayment + interest;
        balance -= fixedPrincipalRepayment;
        totalInterest += interest;

        if (i <= 6 || i === n) {
          schedule.push({
            month: i,
            payment: Math.floor(payment),
            principalRepayment: Math.floor(fixedPrincipalRepayment),
            interestRepayment: Math.floor(interest),
            remaining: Math.max(0, Math.floor(balance))
          });
        }
      }
    } else {
      // 만기일시 상환
      const interestOnly = P * r;
      let balance = P;

      for (let i = 1; i <= n; i++) {
        const isLastMonth = (i === n);
        const payment = isLastMonth ? P + interestOnly : interestOnly;
        const principalRepay = isLastMonth ? P : 0;
        if (isLastMonth) balance = 0;
        totalInterest += interestOnly;

        if (i <= 6 || i === n) {
          schedule.push({
            month: i,
            payment: Math.floor(payment),
            principalRepayment: Math.floor(principalRepay),
            interestRepayment: Math.floor(interestOnly),
            remaining: Math.max(0, Math.floor(balance))
          });
        }
      }
    }

    return {
      totalInterest: Math.floor(totalInterest),
      totalPayout: Math.floor(P + totalInterest),
      schedule
    };
  };

  const loanRes = calculateLoan();

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-100 p-4 md:p-8">
      {/* Print Only Header */}
      <div className="print-only-header">
        <h2>금융 및 예적금·대출 이자 모의계산 결과 보고서 ({activeTab === 'savings' ? '예금 & 적금 이자수익' : '대출 상환이자'})</h2>
        <p>출력 일자: 2026년 07월 09일 | 생활계산기 천국 (https://www.life-calc.kr)</p>
      </div>

      {/* App Header */}
      <div className="border-b border-slate-100 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
            <Landmark className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-heading text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">금융 & 이자 계산기 (예금/적금/대출이자)</h1>
            <p className="font-body text-xs sm:text-sm text-slate-600 mt-1">자산을 불리기 위한 예적금 수령 액수부터 대출 상환 방식별 월 원리금 균등 비용 하락치를 정교하게 비교해 드립니다.</p>
          </div>
        </div>
        <button
          onClick={() => window.print()}
          className="font-display flex items-center justify-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all self-end sm:self-center cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>결과 인쇄 (PDF)</span>
        </button>
      </div>

      {/* Internal Sub Navigation */}
      <div className="grid grid-cols-2 gap-2.5 mb-6 no-print">
        <button
          onClick={() => setActiveTab('savings')}
          className={`font-display py-3 px-3 text-center rounded-2xl border text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${activeTab === 'savings' ? 'bg-amber-500 text-white border-amber-500 shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
        >
          💰 예금 & 적금 이자수익
        </button>
        <button
          onClick={() => setActiveTab('loan')}
          className={`font-display py-3 px-3 text-center rounded-2xl border text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${activeTab === 'loan' ? 'bg-amber-500 text-white border-amber-500 shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
        >
          💳 대출 이자 & 상환 스케줄
        </button>
      </div>

      {/* Content Savings Type */}
      {activeTab === 'savings' && (
        <div className="space-y-6">
          <div className="bg-slate-50 p-5 md:p-6 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 shadow-2xs">
            <div className="space-y-4">
              <div>
                <label className="font-display block text-xs sm:text-sm font-bold text-slate-700 mb-2">세무 구분 분류</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSavingsType('deposit')}
                    className={`font-display flex-1 py-2.5 px-3 border text-xs sm:text-sm rounded-xl transition-colors font-extrabold cursor-pointer ${savingsType === 'deposit' ? 'bg-white text-indigo-700 border-indigo-300 shadow-xs' : 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200'}`}
                  >
                    목돈 정기예금
                  </button>
                  <button
                    onClick={() => setSavingsType('savings')}
                    className={`font-display flex-1 py-2.5 px-3 border text-xs sm:text-sm rounded-xl transition-colors font-extrabold cursor-pointer ${savingsType === 'savings' ? 'bg-white text-indigo-700 border-indigo-300 shadow-xs' : 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200'}`}
                  >
                    매달 정기적금
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-display block text-xs sm:text-sm font-bold text-slate-700">
                    {savingsType === 'deposit' ? '예치 원금 (원)' : '매달 적립금액 (원/월)'}
                  </label>
                  <span className="font-num text-xs sm:text-sm text-indigo-700 font-extrabold bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
                    ➡ {formatKoreanPrice(principal)}
                  </span>
                </div>
                <input
                  type="number"
                  value={principal === 0 ? '' : principal}
                  onChange={(e) => setPrincipal(parseInt(e.target.value) || 0)}
                  className="font-num w-full bg-white border border-slate-300 rounded-xl py-3 px-4 text-base sm:text-lg font-extrabold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
                
                {savingsType === 'deposit' ? (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    <button
                      type="button"
                      onClick={() => setPrincipal(0)}
                      className="font-display bg-slate-100 text-slate-600 text-xs py-1.5 px-3 rounded-lg hover:bg-slate-200 transition-colors font-bold shrink-0 cursor-pointer"
                    >
                      초기화
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrincipal(prev => prev + 1000000)}
                      className="font-display bg-indigo-50 text-indigo-700 text-xs py-1.5 px-3 rounded-lg hover:bg-indigo-100 border border-indigo-100 transition-colors font-bold shrink-0 cursor-pointer"
                    >
                      +100만
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrincipal(prev => prev + 5000000)}
                      className="font-display bg-indigo-50 text-indigo-700 text-xs py-1.5 px-3 rounded-lg hover:bg-indigo-100 border border-indigo-100 transition-colors font-bold shrink-0 cursor-pointer"
                    >
                      +500만
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrincipal(prev => prev + 10000000)}
                      className="font-display bg-indigo-50 text-indigo-700 text-xs py-1.5 px-3 rounded-lg hover:bg-indigo-100 border border-indigo-100 transition-colors font-bold shrink-0 cursor-pointer"
                    >
                      +1천만
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrincipal(prev => prev + 50000000)}
                      className="font-display bg-indigo-50 text-indigo-700 text-xs py-1.5 px-3 rounded-lg hover:bg-indigo-100 border border-indigo-100 transition-colors font-bold shrink-0 cursor-pointer"
                    >
                      +5천만
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    <button
                      type="button"
                      onClick={() => setPrincipal(0)}
                      className="font-display bg-slate-100 text-slate-600 text-xs py-1.5 px-3 rounded-lg hover:bg-slate-200 transition-colors font-bold shrink-0 cursor-pointer"
                    >
                      초기화
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrincipal(prev => prev + 100000)}
                      className="font-display bg-indigo-50 text-indigo-700 text-xs py-1.5 px-3 rounded-lg hover:bg-indigo-100 border border-indigo-100 transition-colors font-bold shrink-0 cursor-pointer"
                    >
                      +10만
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrincipal(prev => prev + 300000)}
                      className="font-display bg-indigo-50 text-indigo-700 text-xs py-1.5 px-3 rounded-lg hover:bg-indigo-100 border border-indigo-100 transition-colors font-bold shrink-0 cursor-pointer"
                    >
                      +30만
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrincipal(prev => prev + 500000)}
                      className="font-display bg-indigo-50 text-indigo-700 text-xs py-1.5 px-3 rounded-lg hover:bg-indigo-100 border border-indigo-100 transition-colors font-bold shrink-0 cursor-pointer"
                    >
                      +50만
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrincipal(prev => prev + 1000000)}
                      className="font-display bg-indigo-50 text-indigo-700 text-xs py-1.5 px-3 rounded-lg hover:bg-indigo-100 border border-indigo-100 transition-colors font-bold shrink-0 cursor-pointer"
                    >
                      +100만
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-display block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">연 이율 (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                    className="font-num w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="font-display block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">약정 기간 (개월)</label>
                  <select
                    value={termMonths}
                    onChange={(e) => setTermMonths(parseInt(e.target.value) || 12)}
                    className="font-display w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    {[6, 12, 24, 36, 60].map((m) => (
                      <option key={m} value={m}>{m}개월</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-display block text-xs sm:text-sm font-bold text-slate-700 mb-1">이자 산출 방식</label>
                  <select
                    value={compoundType}
                    onChange={(e) => setCompoundType(e.target.value as 'simple' | 'compound')}
                    className="font-display w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="simple">단리 계산</option>
                    <option value="compound">연/월복리 계산</option>
                  </select>
                </div>
                <div>
                  <label className="font-display block text-xs sm:text-sm font-bold text-slate-700 mb-1">우대세 과세 방법</label>
                  <select
                    value={taxType}
                    onChange={(e) => setTaxType(e.target.value as 'normal' | 'favored' | 'free')}
                    className="font-display w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="normal">일반과세 (15.4%)</option>
                    <option value="favored">세금우대 (9.5%)</option>
                    <option value="free">비과세 (0.0% 만 65세고려)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Savings Result Output */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 md:p-6 flex flex-col justify-between shadow-xs">
              <div>
                <span className="font-display text-xs bg-amber-500 text-white rounded-lg px-2.5 py-1 font-extrabold uppercase tracking-wide inline-block">
                  이자 소득 결과 종합진단
                </span>
                
                <div className="space-y-2.5 mt-5 text-xs sm:text-sm text-slate-300 border-b border-slate-800 pb-4">
                  <div className="flex justify-between">
                    <span className="font-body">총 납입 누적원금</span>
                    <span className="font-num text-white font-bold">{savingsRes.totalPrincipal.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-body">세전 총 약정이자</span>
                    <span className="font-num text-amber-300 font-bold">+{savingsRes.preTaxInterest.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-rose-400">
                    <span className="font-body">원천징수 이자 소득세</span>
                    <span className="font-num font-bold">-{savingsRes.taxAmount.toLocaleString()}원</span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-950/80 p-5 border border-emerald-800 rounded-2xl text-center my-4 shadow-2xs">
                <p className="font-heading text-xs sm:text-sm text-emerald-300 font-extrabold">만기 해지 시 내 통장에 꽂히는 세후 최종수령액</p>
                <p className="font-num text-2xl sm:text-3xl font-black text-emerald-200 mt-1.5 tracking-tight">
                  {savingsRes.totalPayout.toLocaleString()}원
                </p>
                <p className="font-num text-xs text-emerald-400 mt-1 font-bold">순수 수령 세후 이자: {savingsRes.postTaxInterest.toLocaleString()}원</p>
              </div>

              <p className="font-body text-xs text-slate-400 leading-relaxed text-right">
                ※ 위 계산은 연 시계산에 입각한 소정의 오차가 있을 수 있으며 실제 금융기관 만기 수령 통계 일자와 다를 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loan interest Repayment layout */}
      {activeTab === 'loan' && (
        <div className="space-y-6">
          <div className="bg-slate-50 p-5 md:p-6 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 shadow-2xs">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-display block text-xs sm:text-sm font-bold text-slate-700">대출 신청 원금액 (원)</label>
                  <span className="font-num text-xs sm:text-sm text-indigo-700 font-extrabold bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
                    ➡ {formatKoreanPrice(loanPrincipal)}
                  </span>
                </div>
                <input
                  type="number"
                  value={loanPrincipal === 0 ? '' : loanPrincipal}
                  onChange={(e) => setLoanPrincipal(parseInt(e.target.value) || 0)}
                  className="font-num w-full bg-white border border-slate-300 rounded-xl py-3 px-4 text-base sm:text-lg font-extrabold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  <button
                    type="button"
                    onClick={() => setLoanPrincipal(0)}
                    className="font-display bg-slate-100 text-slate-600 text-xs py-1.5 px-3 rounded-lg hover:bg-slate-200 transition-colors font-bold shrink-0 cursor-pointer"
                  >
                    초기화
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoanPrincipal(prev => prev + 5000000)}
                    className="font-display bg-indigo-50 text-indigo-700 text-xs py-1.5 px-3 rounded-lg hover:bg-indigo-100 border border-indigo-100 transition-colors font-bold shrink-0 cursor-pointer"
                  >
                    +500만
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoanPrincipal(prev => prev + 10000000)}
                    className="font-display bg-indigo-50 text-indigo-700 text-xs py-1.5 px-3 rounded-lg hover:bg-indigo-100 border border-indigo-100 transition-colors font-bold shrink-0 cursor-pointer"
                  >
                    +1천만
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoanPrincipal(prev => prev + 50000000)}
                    className="font-display bg-indigo-50 text-indigo-700 text-xs py-1.5 px-3 rounded-lg hover:bg-indigo-100 border border-indigo-100 transition-colors font-bold shrink-0 cursor-pointer"
                  >
                    +5천만
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoanPrincipal(prev => prev + 100000000)}
                    className="font-display bg-indigo-50 text-indigo-700 text-xs py-1.5 px-3 rounded-lg hover:bg-indigo-100 border border-indigo-100 transition-colors font-bold shrink-0 cursor-pointer"
                  >
                    +1억
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-display block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">연 고정금리 (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={loanRate}
                    onChange={(e) => setLoanRate(parseFloat(e.target.value) || 0)}
                    className="font-num w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="font-display block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">상환 약정 기간 (개월)</label>
                  <select
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(parseInt(e.target.value) || 24)}
                    className="font-display w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    {[12, 24, 36, 60, 120, 240, 360].map((t) => (
                      <option key={t} value={t}>{t}개월</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-display block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">거치 상환 방식 종류</label>
                <select
                  value={repaymentType}
                  onChange={(e) => setRepaymentType(e.target.value as 'equal_both' | 'equal_principal' | 'maturity')}
                  className="font-display w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  <option value="equal_both">원리금균등 분할상환 (원금+이자를 매달 동일비율)</option>
                  <option value="equal_principal">원금균등 분할상환 (원금 동일, 이자는 차감식)</option>
                  <option value="maturity">원금 만기일시 상환 (매달 이자만 내다가 만기에 원금폭탄)</option>
                </select>
              </div>
            </div>

            {/* Loan calculations overall side frame */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 md:p-6 flex flex-col justify-between shadow-xs">
              <div>
                <span className="font-display text-xs bg-rose-600 text-white rounded-lg px-2.5 py-1 font-extrabold uppercase tracking-wide inline-block">
                  금융 부채 이자 지출 결과
                </span>
                
                <div className="space-y-2.5 mt-5 text-xs sm:text-sm text-slate-300">
                  <div className="flex justify-between">
                    <span className="font-body">빌린 원금 총액</span>
                    <span className="font-num text-white font-bold">{loanPrincipal.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-amber-300">
                    <span className="font-body">약정 총 이자 합산액</span>
                    <span className="font-num font-bold">+{loanRes.totalInterest.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-2.5 text-white font-extrabold text-sm sm:text-base">
                    <span className="font-heading">만기까지 총 상환액</span>
                    <span className="font-num font-black text-amber-400">{loanRes.totalPayout.toLocaleString()}원</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="font-display text-xs text-slate-400 font-bold block mb-2">📊 월별 납입 스케줄 시뮬레이션 (최대 6회 예증)</span>
                <div className="space-y-2 font-num text-xs max-h-[120px] overflow-y-auto pr-1">
                  {loanRes.schedule.map((item) => (
                    <div key={item.month} className="flex justify-between text-slate-300 border-b border-slate-900 pb-1.5">
                      <span className="font-bold text-amber-300">{item.month}회차</span>
                      <span>납입: {item.payment.toLocaleString()}원 (이자: {item.interestRepayment.toLocaleString()}원)</span>
                    </div>
                  ))}
                  {loanTerm > 7 && (
                    <p className="font-body text-slate-500 text-center py-1 text-xs">...중간 회차 스케줄은 안정 상략되었습니다...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO Compliance Rich Text Information */}
      <div className="pt-8 border-t border-slate-200 mt-8 space-y-5 text-slate-700 leading-relaxed no-print">
        <h2 className="font-heading text-base sm:text-lg md:text-xl font-black text-slate-950 flex items-center mb-1">
          <BookOpen className="w-5 h-5 text-amber-600 mr-2" />
          예적금 과세제도 및 대출 상환 공학적 비법서
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-slate-50 p-5 rounded-2xl space-y-2.5 border border-slate-200 shadow-2xs">
            <h3 className="font-heading font-extrabold text-slate-900 text-sm sm:text-base">1. 대한민국의 금융소득 종합과세 및 이자 세율</h3>
            <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed">
              일반 개인이 금융기관에 예·적금을 가입하고 만기 시 약정 이자를 수령할 때는 기본적으로 <strong>15.4%</strong>의 세율이 적용됩니다. 이는 국세인 소득세 14%와 지방세인 지방소득세 1.4% 취합 구조입니다. 
              최근에는 만 65세 이상 고령자를 대상으로 하는 비과세종합저축 한도로 예치하는 등의 다양한 합법 절세 조약이 활발히 기능하고 있습니다.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl space-y-2.5 border border-slate-200 shadow-2xs">
            <h3 className="font-heading font-extrabold text-slate-900 text-sm sm:text-base">2. 대출 상환 방식 비교의 치명적 차이</h3>
            <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed">
              원리금균등은 매월 내는 페이량이 고정되어 계획소비가 수월하지만 원금 감소 속도가 상대적으로 느립니다. 
              반면, 원금균등은 원금을 항상 균등 비율로 까 내려가므로 뒤로 갈수록 이자가 정량 하락하여 궁극적인 <strong>총 이자 지출액을 가장 아낄 수 있는 실속 방식</strong>입니다. 
              만기일시는 부채 상환 동안 이자만 가볍게 내지만 원금을 통째로 갚아야 하는 신용 리스크가 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
