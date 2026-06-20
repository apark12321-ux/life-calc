import React, { useState } from 'react';
import { Landmark, TrendingUp, HelpCircle, RefreshCw, BookOpen, Receipt, AlignJustify } from 'lucide-react';

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
      {/* App Header */}
      <div className="border-b border-slate-100 pb-5 mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">금융 & 이자 계산기 (예금/적금/대출이자)</h1>
            <p className="text-xs text-slate-500 mt-0.5">자산을 불리기 위한 예적금 수령 액수부터 대출 상환 방식별 월 원리금 균등 비용 하락치를 정교하게 비교해 드립니다.</p>
          </div>
        </div>
      </div>

      {/* Internal Sub Navigation */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        <button
          onClick={() => setActiveTab('savings')}
          className={`py-3 px-2 text-center rounded-xl border text-xs font-bold transition-all ${activeTab === 'savings' ? 'bg-amber-500 text-white border-amber-500 shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
        >
          💰 예금 & 적금 이자수익
        </button>
        <button
          onClick={() => setActiveTab('loan')}
          className={`py-3 px-2 text-center rounded-xl border text-xs font-bold transition-all ${activeTab === 'loan' ? 'bg-amber-500 text-white border-amber-500 shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
        >
          💳 대출 이자 & 상환 스케줄
        </button>
      </div>

      {/* Content Savings Type */}
      {activeTab === 'savings' && (
        <div className="space-y-6">
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">세무 구분 분류</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSavingsType('deposit')}
                    className={`flex-1 py-2 px-3 border text-xs rounded-lg transition-colors font-bold ${savingsType === 'deposit' ? 'bg-white text-indigo-700 border-indigo-300 shadow-xs' : 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200'}`}
                  >
                    목돈 정기예금
                  </button>
                  <button
                    onClick={() => setSavingsType('savings')}
                    className={`flex-1 py-2 px-3 border text-xs rounded-lg transition-colors font-bold ${savingsType === 'savings' ? 'bg-white text-indigo-700 border-indigo-300 shadow-xs' : 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200'}`}
                  >
                    매달 정기적금
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {savingsType === 'deposit' ? '예치 원금 (원)' : '매달 적립금액 (원/월)'}
                </label>
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-3 text-sm font-bold focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">연 이율 (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-sans">예장 기간 (개월)</label>
                  <select
                    value={termMonths}
                    onChange={(e) => setTermMonths(parseInt(e.target.value) || 12)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-xs"
                  >
                    {[6, 12, 24, 36, 60].map((m) => (
                      <option key={m} value={m}>{m}개월</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">이자 산출 방식</label>
                  <select
                    value={compoundType}
                    onChange={(e) => setCompoundType(e.target.value as 'simple' | 'compound')}
                    className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-xs"
                  >
                    <option value="simple">단리 계산</option>
                    <option value="compound">연/월복리 계산</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">우대세 과세 방법</label>
                  <select
                    value={taxType}
                    onChange={(e) => setTaxType(e.target.value as 'normal' | 'favored' | 'free')}
                    className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-xs"
                  >
                    <option value="normal">일반과세 (15.4%)</option>
                    <option value="favored">세금우대 (9.5%)</option>
                    <option value="free">비과세 (0.0% 만 65세고려)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Savings Result Output */}
            <div className="bg-slate-900 text-white rounded-xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] bg-amber-500 text-white rounded px-2 py-0.5 font-bold uppercase">
                  이자 소득 결과 종합진단
                </span>
                
                <div className="space-y-2 mt-4 text-xs text-slate-400 border-b border-slate-800 pb-3">
                  <div className="flex justify-between">
                    <span>총 납입 누적원금</span>
                    <span className="text-slate-200 font-mono font-bold">{savingsRes.totalPrincipal.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>세전 총 약정이자</span>
                    <span className="text-slate-200 font-mono font-semibold">+{savingsRes.preTaxInterest.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-rose-400">
                    <span>원천징수 이자 소득세</span>
                    <span className="font-mono">-{savingsRes.taxAmount.toLocaleString()}원</span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-950 p-4 border border-emerald-900 rounded-lg text-center my-3">
                <p className="text-[11px] text-emerald-400 font-bold">만기 해지 시 내 통장에 꽂히는 세후 최종수령액</p>
                <p className="text-2xl font-extrabold text-emerald-300 font-mono mt-1">
                  {savingsRes.totalPayout.toLocaleString()}원
                </p>
                <p className="text-[9px] text-emerald-500 mt-1">순수 수령 세후 이자: {savingsRes.postTaxInterest.toLocaleString()}원</p>
              </div>

              <p className="text-[9px] text-slate-450 leading-relaxed text-right">
                ※ 위 계산은 연 시계산에 입각한 소정의 오차가 있을 수 있으며 실제 금융기관 만기 수령 통계 일자와 다를 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loan interest Repayment layout */}
      {activeTab === 'loan' && (
        <div className="space-y-6">
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 font-sans">대출 신청 원금액 (원)</label>
                <input
                  type="number"
                  value={loanPrincipal}
                  onChange={(e) => setLoanPrincipal(parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-3 text-sm font-bold focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">연 고정금리 (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={loanRate}
                    onChange={(e) => setLoanRate(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">상환 약정 기간 (개월)</label>
                  <select
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(parseInt(e.target.value) || 24)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-xs"
                  >
                    {[12, 24, 36, 60, 120, 240, 360].map((t) => (
                      <option key={t} value={t}>{t}개월</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">거치 상환 방식 종류</label>
                <select
                  value={repaymentType}
                  onChange={(e) => setRepaymentType(e.target.value as 'equal_both' | 'equal_principal' | 'maturity')}
                  className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-xs font-semibold text-slate-700"
                >
                  <option value="equal_both">원리금균등 분할상환 (원금+이자를 매달 동일비율)</option>
                  <option value="equal_principal">원금균등 분할상환 (원금 동일, 이자는 차감식)</option>
                  <option value="maturity">원금 만기일시 상환 (매달 이자만 내다가 만기에 원금폭탄)</option>
                </select>
              </div>
            </div>

            {/* Loan calculations overall side frame */}
            <div className="bg-slate-900 text-white rounded-xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] bg-red-500 text-white rounded px-2 py-0.5 font-bold uppercase">
                  금융 부채 이자 지출 결과
                </span>
                
                <div className="space-y-2 mt-4 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>빌린 원금 총액</span>
                    <span className="text-white font-mono">{loanPrincipal.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-yellow-300">
                    <span>중기 납입 총 이자 합산액</span>
                    <span className="font-mono">+{loanRes.totalInterest.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-1.5 text-white font-bold">
                    <span>만기까지 총 원금+이자 합산액</span>
                    <span className="font-mono">{loanRes.totalPayout.toLocaleString()}원</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-2">📊 월별 납입 스케줄 시뮬레이션 (최대 6회 예증)</span>
                <div className="space-y-1.5 font-mono text-[9px] max-h-[105px] overflow-y-auto pr-1">
                  {loanRes.schedule.map((item) => (
                    <div key={item.month} className="flex justify-between text-slate-300 border-b border-slate-900 pb-1">
                      <span>{item.month}회차</span>
                      <span>납입: {item.payment.toLocaleString()}원 (이자: {item.interestRepayment.toLocaleString()}원, 잔액: {item.remaining.toLocaleString()}원)</span>
                    </div>
                  ))}
                  {loanTerm > 7 && (
                    <p className="text-slate-500 text-center py-1 font-sans text-[8px]">...중간 회차 스케줄은 안정 상략되었습니다...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO Compliance Rich Text Information */}
      <div className="pt-8 border-t border-slate-100 mt-8 space-y-5 text-xs text-slate-600 leading-relaxed font-sans">
        <h2 className="text-sm font-bold text-slate-950 flex items-center mb-1">
          <BookOpen className="w-4 h-4 text-amber-600 mr-2" />
          예적금 과세제도 및 대출 상환 공학적 비법서
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
            <h3 className="font-bold text-slate-900">1. 대한민국의 금융소득 종합과세 및 이자 세율</h3>
            <p>
              일반 개인이 금융기관에 예·적금을 가입하고 만기 시 약정 이자를 수령할 때는 기본적으로 <strong>15.4%</strong>의 세율이 적용됩니다. 이는 국세인 소득세 14%와 지방세인 지방소득세 1.4% 취합 구조입니다. 
              최근에는 만 65세 이상 고령자를 대상으로 하는 비과세종합저축 한도로 예치하는 등의 다양한 합법 절세 조약이 활발히 기능하고 있습니다.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
            <h3 className="font-bold text-slate-900">2. 대출 상환 방식 비교의 치명적 차이</h3>
            <p>
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
