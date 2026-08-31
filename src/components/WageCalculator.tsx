import React, { useState } from 'react';
import { HelpCircle, Calculator as CalcIcon, RefreshCw, AlertCircle, TrendingUp, DollarSign, Calendar, Landmark, BookOpen, Printer } from 'lucide-react';

export default function WageCalculator() {
  const [activeSubTab, setActiveSubTab] = useState<'hourly' | 'salary' | 'retirement' | 'unemployment'>('hourly');

  // Multi-state inputs
  // 1. Hourly State
  const [hourlyWage, setHourlyWage] = useState<number>(10320); // 2026 Minimum hourly wage is 10,320 KRW
  const [dailyHours, setDailyHours] = useState<number>(8);
  const [weeklyDays, setWeeklyDays] = useState<number>(5);
  const [includeWeeklyHoliday, setIncludeWeeklyHoliday] = useState<boolean>(true);

  // 2. Salary State
  const [annualSalary, setAnnualSalary] = useState<number>(42000000); // e.g. 42 Million KRW
  const [nonTaxable, setNonTaxable] = useState<number>(200000); // 200k standard meal allowance
  const [dependents, setDependents] = useState<number>(1); // e.g. 1 (Single)

  // 3. Retirement State
  const [prevThreeMonthsSalary, setPrevThreeMonthsSalary] = useState<number>(3000000); // 월평균급여액
  const [workedDays, setWorkedDays] = useState<number>(365); // Worked duration in days

  // 4. Unemployment State
  const [unemploymentAge, setUnemploymentAge] = useState<number>(35);
  const [unemploymentPeriod, setUnemploymentPeriod] = useState<number>(18); // months of work
  const [prevAvgWage, setPrevAvgWage] = useState<number>(2800000); // previous avg salary

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
  // 1. Hourly Calculation
  const calculateHourly = () => {
    const weeklyHours = dailyHours * weeklyDays;
    
    // 주휴시간 계산: 주 15시간 이상 근무 시 만근하는 주에 대해 주휴수당 지급
    // 주 40시간 한도로 비례 계산: (주소정근로시간 / 40) * 8시간
    let weeklyHolidayHours = 0;
    if (includeWeeklyHoliday && weeklyHours >= 15) {
      if (weeklyHours >= 40) {
        weeklyHolidayHours = 8;
      } else {
        weeklyHolidayHours = (weeklyHours / 40) * 8;
      }
    }

    const basicWeeklyWage = weeklyHours * hourlyWage;
    const weeklyHolidayAllowance = Math.floor(weeklyHolidayHours * hourlyWage);
    const totalWeeklyWage = basicWeeklyWage + weeklyHolidayAllowance;

    // 한달 평균 주는 4.345주 적용
    const expectedMonthlyTotal = Math.floor(totalWeeklyWage * 4.345);
    
    return {
      weeklyHours,
      weeklyHolidayHours: parseFloat(weeklyHolidayHours.toFixed(2)),
      basicWeeklyWage,
      weeklyHolidayAllowance,
      totalWeeklyWage,
      expectedMonthlyTotal
    };
  };

  const hourlyRes = calculateHourly();

  // 2. Yearly Salary 실수령액 Calculation
  const calculateSalary = () => {
    const preTaxMonthly = Math.floor(annualSalary / 12);
    const taxableAmount = Math.max(0, preTaxMonthly - nonTaxable);

    // Standard simplified 4대보험 rates
    const pension = Math.floor((Math.min(6170000, taxableAmount) * 0.045) / 10) * 10;
    const health = Math.floor((taxableAmount * 0.03545) / 10) * 10;
    const longTerm = Math.floor((health * 0.1295) / 10) * 10;
    const employment = Math.floor((preTaxMonthly * 0.009) / 10) * 10;

    // Simplified income tax based on Korea IRS 간이세액 (rough estimate for 1 dependent)
    let incomeTax = 0;
    const annualTaxable = taxableAmount * 12;
    if (annualTaxable <= 14000000) {
      incomeTax = Math.max(0, (annualTaxable * 0.06 - 0) / 12);
    } else if (annualTaxable <= 50000000) {
      incomeTax = Math.max(0, (annualTaxable * 0.15 - 1260000) / 12);
    } else if (annualTaxable <= 88000000) {
      incomeTax = Math.max(0, (annualTaxable * 0.24 - 5760000) / 12);
    } else {
      incomeTax = Math.max(0, (annualTaxable * 0.35 - 15440000) / 12);
    }

    // Apply corporate dependent discounts
    if (dependents > 1) {
      incomeTax = incomeTax * (0.9 - (dependents - 2) * 0.05);
    }
    incomeTax = Math.max(0, Math.floor(incomeTax / 10) * 10);
    const localIncomeTax = Math.floor((incomeTax * 0.1) / 10) * 10;

    const totalDeductions = pension + health + longTerm + employment + incomeTax + localIncomeTax;
    const netTakeHome = preTaxMonthly - totalDeductions;

    return {
      preTaxMonthly,
      pension,
      health,
      longTerm,
      employment,
      incomeTax,
      localIncomeTax,
      totalDeductions,
      netTakeHome
    };
  };

  const salaryRes = calculateSalary();

  // 3. Retirement Pay Calculation
  const calculateRetirement = () => {
    // 3개월 총 임금 / 3개월 총 일수 = 1일 평균임금
    // 30일분 평균임금 = 1일 평균임금 * 30
    // 퇴직금 = 30일분 평균임금 * (재직일수 / 365)
    // 3개월 일수를 평균 90일로 단순 계산
    const dailyAvg = (prevThreeMonthsSalary * 3) / 90;
    const totalRetirement = Math.floor(dailyAvg * 30 * (workedDays / 365));
    return {
      dailyAvg: Math.floor(dailyAvg),
      totalRetirement
    };
  };

  const retirementRes = calculateRetirement();

  // 4. Unemployment Benefit Calculation
  const calculateUnemployment = () => {
    // 실업급여 일액 = 이직 전 평균임금의 60%
    // 상한액: 2026년 기준 상한액 66,000원
    // 하한액: 최저임금의 80% (1일 8시간 기준 최저임금 10,320 * 8 * 0.8 = 66,048원, 법률상 최저 구직급여액은 60,120원을 하한선으로 지정)
    const prevDailyWage = prevAvgWage / 30;
    let dailyBenefit = prevDailyWage * 0.6;
    
    if (dailyBenefit > 66000) {
      dailyBenefit = 66000;
    }
    const minBenefit = 60120; // 2026 Korean statutory floor
    if (dailyBenefit < minBenefit) {
      dailyBenefit = minBenefit;
    }

    // 지급기간: 가입기간 및 연령에 따라 다름 (120일 ~ 270일)
    let payoutDays = 120;
    if (unemploymentPeriod <= 12) {
      payoutDays = 120;
    } else if (unemploymentPeriod <= 36) {
      payoutDays = unemploymentAge >= 50 ? 180 : 150;
    } else if (unemploymentPeriod <= 60) {
      payoutDays = unemploymentAge >= 50 ? 210 : 180;
    } else if (unemploymentPeriod <= 120) {
      payoutDays = unemploymentAge >= 50 ? 240 : 210;
    } else {
      payoutDays = unemploymentAge >= 50 ? 270 : 240;
    }

    const totalPayout = dailyBenefit * payoutDays;

    return {
      dailyBenefit: Math.floor(dailyBenefit),
      payoutDays,
      totalPayout: Math.floor(totalPayout)
    };
  };

  const unemploymentRes = calculateUnemployment();

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-100 p-4 md:p-8">
      {/* Print Only Header */}
      <div className="print-only-header">
        <h2>종합 임금 계산 결과 보고서 ({activeSubTab === 'hourly' ? '시급 & 주휴수당' : activeSubTab === 'salary' ? '연봉 실수령액' : activeSubTab === 'retirement' ? '퇴직금 예산' : '실업급여 모의'})</h2>
        <p>출력 일자: 2026년 07월 09일 | 생활계산기 천국 (https://www.life-calc.kr)</p>
      </div>

      {/* App Header */}
      <div className="border-b border-slate-100 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <DollarSign className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-heading text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              종합 임금 계산기 (급여/퇴직금/실업급여)
            </h1>
            <p className="font-body text-xs sm:text-sm text-slate-600 mt-1">
              시급 환산부터 연봉 실수령액, 퇴직금 예측, 실업급여까지 근로생활에 꼭 필요한 보수 계산을 원스톱으로 제공합니다.
            </p>
          </div>
        </div>
        <button
          onClick={() => window.print()}
          className="font-display flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-xs transition-all self-end sm:self-center cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>결과 인쇄 (PDF)</span>
        </button>
      </div>

      {/* Internal Sub Navigation with Display Typography */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-6 no-print">
        <button
          onClick={() => setActiveSubTab('hourly')}
          className={`font-display py-3.5 px-3 text-center rounded-xl border text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            activeSubTab === 'hourly'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          ■ 시급 & 주휴수당
        </button>
        <button
          onClick={() => setActiveSubTab('salary')}
          className={`font-display py-3.5 px-3 text-center rounded-xl border text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            activeSubTab === 'salary'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          ◆ 연봉 실수령액
        </button>
        <button
          onClick={() => setActiveSubTab('retirement')}
          className={`font-display py-3.5 px-3 text-center rounded-xl border text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            activeSubTab === 'retirement'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          ● 퇴직금 예산
        </button>
        <button
          onClick={() => setActiveSubTab('unemployment')}
          className={`font-display py-3.5 px-3 text-center rounded-xl border text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            activeSubTab === 'unemployment'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          ▲ 실업급여 모의
        </button>
      </div>

      {/* Sub Tab: Hourly Wage Calculator */}
      {activeSubTab === 'hourly' && (
        <div className="space-y-6">
          <div className="bg-emerald-50/70 rounded-2xl p-4 sm:p-5 border border-emerald-200 flex items-start space-x-3.5 shadow-2xs">
            <span className="text-emerald-700 font-bold text-base">※</span>
            <p className="font-body text-xs sm:text-sm text-emerald-950 leading-relaxed font-semibold">
              2026년 대한민국 공식 최저시급은 <span className="font-num text-rose-600 font-extrabold underline text-sm sm:text-base">10,320원</span>입니다. 
              주 소정근로시간이 15시간 이상이고 약정 근무일을 만근하면, 고용주는 무조건 주 1회의 유급 주휴수당을 추가 지급해야 합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-50 p-5 md:p-6 rounded-2xl border border-slate-200 shadow-2xs">
            {/* Left Inputs */}
            <div className="space-y-4">
              <div>
                <label className="font-display block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">선택 시급 (원)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={hourlyWage}
                    onChange={(e) => setHourlyWage(parseInt(e.target.value) || 0)}
                    className="font-num w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3.5 text-sm sm:text-base focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                  <div className="absolute right-2.5 top-2">
                    <button
                      onClick={() => setHourlyWage(10320)}
                      className="font-display text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold py-1 px-2 rounded-lg border border-indigo-200 transition cursor-pointer"
                    >
                      최저시급 적용
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-display block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">하루 근무 (시간)</label>
                  <select
                    value={dailyHours}
                    onChange={(e) => setDailyHours(parseInt(e.target.value) || 0)}
                    className="font-num w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm font-semibold"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => (
                      <option key={h} value={h}>{h}시간</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-display block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">일주일 근무 (일)</label>
                  <select
                    value={weeklyDays}
                    onChange={(e) => setWeeklyDays(parseInt(e.target.value) || 0)}
                    className="font-num w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm font-semibold"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                      <option key={d} value={d}>{d}일</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 bg-white p-3.5 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="holidayAllowance"
                  checked={includeWeeklyHoliday}
                  onChange={(e) => setIncludeWeeklyHoliday(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="holidayAllowance" className="font-display text-xs sm:text-sm font-bold text-slate-700 select-none cursor-pointer">
                  주휴수당 포함하여 급여 환산하기
                </label>
              </div>
            </div>

            {/* Right Results Frame */}
            <div className="bg-slate-900 rounded-2xl p-5 md:p-6 text-white flex flex-col justify-between shadow-xs">
              <div>
                <span className="font-display text-xs bg-emerald-500 text-white rounded-lg px-2.5 py-1 font-extrabold uppercase tracking-wider">
                  ⏱ 환산 결과 리포트
                </span>
                <p className="font-body text-xs sm:text-sm text-slate-300 mt-2.5">일주일 총 근무시간: <span className="font-num text-white font-bold">{hourlyRes.weeklyHours}시간</span></p>
                {includeWeeklyHoliday && hourlyRes.weeklyHolidayHours > 0 && (
                  <p className="font-body text-xs text-emerald-400 mt-0.5">주휴수당 환급 적용: <span className="font-num font-bold">+{hourlyRes.weeklyHolidayHours}시간 보정 추가</span></p>
                )}
              </div>

              <div className="space-y-2.5 my-4">
                <div className="flex justify-between text-xs sm:text-sm text-slate-400 border-b border-slate-800 pb-2">
                  <span className="font-body">기본 주급 (일반적 시급 합산)</span>
                  <span className="font-num text-slate-200 font-bold">{hourlyRes.basicWeeklyWage.toLocaleString()}원</span>
                </div>
                {includeWeeklyHoliday && (
                  <div className="flex justify-between text-xs sm:text-sm text-slate-400 border-b border-slate-800 pb-2">
                    <span className="font-body">주휴수당 예상액</span>
                    <span className="font-num text-emerald-300 font-bold">+{hourlyRes.weeklyHolidayAllowance.toLocaleString()}원</span>
                  </div>
                )}
                <div className="flex justify-between text-sm sm:text-base font-bold border-b border-slate-700 pb-2">
                  <span className="font-display">총 예상 주급 (A)</span>
                  <span className="font-num text-white font-extrabold">{hourlyRes.totalWeeklyWage.toLocaleString()}원</span>
                </div>
              </div>

              <div className="bg-emerald-950/60 p-4 rounded-xl border border-emerald-900/80">
                <p className="font-display text-xs text-emerald-400 font-bold">주휴수당 포함 예상 월급여 (4.345주 환산)</p>
                <p className="font-num text-2xl sm:text-3xl font-black text-emerald-300 mt-1">
                  {hourlyRes.expectedMonthlyTotal.toLocaleString()}원
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab: Annual Salary Take-Home Calculator */}
      {activeSubTab === 'salary' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-50 p-5 md:p-6 rounded-2xl border border-slate-200 shadow-2xs">
            {/* Left inputs */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="font-display block text-xs sm:text-sm font-bold text-slate-700">근로자 본인 계약 연봉 (원/연)</label>
                  <span className="font-num text-xs sm:text-sm text-emerald-600 font-extrabold bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                    ➡ {formatKoreanPrice(annualSalary)}
                  </span>
                </div>
                <input
                  type="number"
                  value={annualSalary === 0 ? '' : annualSalary}
                  onChange={(e) => setAnnualSalary(parseInt(e.target.value) || 0)}
                  className="font-num w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3.5 text-sm sm:text-base focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-bold"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <button
                    type="button"
                    onClick={() => setAnnualSalary(0)}
                    className="font-display bg-slate-200 text-slate-700 text-xs py-1.5 px-3 rounded-lg hover:bg-slate-300 transition font-bold shrink-0 cursor-pointer"
                  >
                    초기화
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnnualSalary(prev => prev + 5000000)}
                    className="font-display bg-emerald-50 text-emerald-700 text-xs py-1.5 px-3 rounded-lg hover:bg-emerald-100 border border-emerald-200 transition font-extrabold shrink-0 cursor-pointer"
                  >
                    +500만
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnnualSalary(prev => prev + 10000000)}
                    className="font-display bg-emerald-50 text-emerald-700 text-xs py-1.5 px-3 rounded-lg hover:bg-emerald-100 border border-emerald-200 transition font-extrabold shrink-0 cursor-pointer"
                  >
                    +1천만
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnnualSalary(prev => prev + 50000000)}
                    className="font-display bg-emerald-50 text-emerald-700 text-xs py-1.5 px-3 rounded-lg hover:bg-emerald-100 border border-emerald-200 transition font-extrabold shrink-0 cursor-pointer"
                  >
                    +5천만
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnnualSalary(prev => prev + 100000000)}
                    className="font-display bg-emerald-50 text-emerald-700 text-xs py-1.5 px-3 rounded-lg hover:bg-emerald-100 border border-emerald-200 transition font-extrabold shrink-0 cursor-pointer"
                  >
                    +1억
                  </button>
                </div>
              </div>

              <div>
                <label className="font-display block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">월간 비과세 식대 수당 (일반 200,000원 한도)</label>
                <input
                  type="number"
                  value={nonTaxable}
                  onChange={(e) => setNonTaxable(parseInt(e.target.value) || 0)}
                  className="font-num w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm font-semibold"
                />
              </div>

              <div>
                <label className="font-display block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">세무 부양가족 수 (본인포함 최소 1명)</label>
                <select
                  value={dependents}
                  onChange={(e) => setDependents(parseInt(e.target.value) || 1)}
                  className="font-display w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm font-semibold"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>{num}명</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right outputs */}
            <div className="bg-slate-900 rounded-2xl p-5 md:p-6 text-white space-y-4 shadow-xs">
              <div>
                <span className="font-display text-xs bg-emerald-500 text-white rounded-lg px-2.5 py-1 font-extrabold">
                  실수령액 모의 시뮬레이션
                </span>
                <div className="flex justify-between items-center mt-3 border-b border-slate-800 pb-2">
                  <span className="font-body text-xs sm:text-sm text-slate-400">월급 세전 세금 기초액</span>
                  <span className="font-num text-sm sm:text-base font-bold text-slate-200">{salaryRes.preTaxMonthly.toLocaleString()}원</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs sm:text-sm text-slate-400">
                <div className="flex justify-between">
                  <span className="font-body">- 국민연금 (4.5%)</span>
                  <span className="font-num text-slate-200 font-semibold">{salaryRes.pension.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body">- 건강보험 (3.545%)</span>
                  <span className="font-num text-slate-200 font-semibold">{salaryRes.health.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between pl-3 border-l border-slate-800">
                  <span className="font-body">┗ 노인장기요양</span>
                  <span className="font-num text-slate-400">{salaryRes.longTerm.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body">- 고용보험 (0.9%)</span>
                  <span className="font-num text-slate-200 font-semibold">{salaryRes.employment.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body">- 근로소득세 (간이세액)</span>
                  <span className="font-num text-slate-200 font-semibold">{salaryRes.incomeTax.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body">- 지방소득세 (소득세의 10%)</span>
                  <span className="font-num text-slate-200 font-semibold">{salaryRes.localIncomeTax.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-rose-400 pt-2 border-t border-slate-800 font-bold">
                  <span className="font-display">총 전액 공제 합산액</span>
                  <span className="font-num">-{salaryRes.totalDeductions.toLocaleString()}원</span>
                </div>
              </div>

              <div className="bg-emerald-950 p-4 rounded-xl border border-emerald-900 shadow-2xs">
                <p className="font-display text-xs text-emerald-400 font-extrabold">내 통장에 찍히는 최종 월 실수령액 (NET)</p>
                <p className="font-num text-2xl sm:text-3xl font-black text-emerald-300 mt-1">
                  {salaryRes.netTakeHome.toLocaleString()}원
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab: Retirement Pay Calculator */}
      {activeSubTab === 'retirement' && (
        <div className="space-y-6">
          <div className="bg-slate-50 p-5 md:p-6 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="font-display block text-xs sm:text-sm font-bold text-slate-700">퇴직 전 마지막 3개월간 평균 세전 기본급여 (원)</label>
                  <span className="font-num text-xs sm:text-sm text-indigo-600 font-extrabold bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
                    ➡ {formatKoreanPrice(prevThreeMonthsSalary)}
                  </span>
                </div>
                <input
                  type="number"
                  value={prevThreeMonthsSalary === 0 ? '' : prevThreeMonthsSalary}
                  onChange={(e) => setPrevThreeMonthsSalary(parseInt(e.target.value) || 0)}
                  className="font-num w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3.5 text-sm sm:text-base font-bold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <button
                    type="button"
                    onClick={() => setPrevThreeMonthsSalary(0)}
                    className="font-display bg-slate-200 text-slate-700 text-xs py-1.5 px-3 rounded-lg hover:bg-slate-300 transition font-bold shrink-0 cursor-pointer"
                  >
                    초기화
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrevThreeMonthsSalary(prev => prev + 500000)}
                    className="font-display bg-indigo-50 text-indigo-700 text-xs py-1.5 px-3 rounded-lg hover:bg-indigo-100 border border-indigo-200 transition font-extrabold shrink-0 cursor-pointer"
                  >
                    +50만
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrevThreeMonthsSalary(prev => prev + 1000000)}
                    className="font-display bg-indigo-50 text-indigo-700 text-xs py-1.5 px-3 rounded-lg hover:bg-indigo-100 border border-indigo-200 transition font-extrabold shrink-0 cursor-pointer"
                  >
                    +100만
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrevThreeMonthsSalary(prev => prev + 3000000)}
                    className="font-display bg-indigo-50 text-indigo-700 text-xs py-1.5 px-3 rounded-lg hover:bg-indigo-100 border border-indigo-200 transition font-extrabold shrink-0 cursor-pointer"
                  >
                    +300만
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrevThreeMonthsSalary(prev => prev + 5000000)}
                    className="font-display bg-indigo-50 text-indigo-700 text-xs py-1.5 px-3 rounded-lg hover:bg-indigo-100 border border-indigo-200 transition font-extrabold shrink-0 cursor-pointer"
                  >
                    +500만
                  </button>
                </div>
              </div>

              <div>
                <label className="font-display block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">총 재직 일수 (일합산)</label>
                <input
                  type="number"
                  value={workedDays}
                  onChange={(e) => setWorkedDays(parseInt(e.target.value) || 0)}
                  className="font-num w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[365, 730, 1095, 1825].map((d) => (
                    <button
                      key={d}
                      onClick={() => setWorkedDays(d)}
                      className="font-display bg-white border border-slate-200 hover:bg-slate-50 text-xs text-slate-700 font-bold px-2.5 py-1 rounded-lg transition cursor-pointer"
                    >
                      {(d / 365).toFixed(0)}년 재직 ({d}일)
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-5 md:p-6 flex flex-col justify-between shadow-xs">
              <div>
                <span className="font-display text-xs bg-indigo-500 text-white rounded-lg px-2.5 py-1 font-extrabold">
                  근로기준법상 퇴직금 추정액
                </span>
                <p className="font-body text-xs sm:text-sm text-indigo-200 mt-2.5">일 평균 임금 산출 결과: <span className="font-num font-bold text-white">{retirementRes.dailyAvg.toLocaleString()}원</span></p>
              </div>

              <div className="bg-emerald-950 p-4 rounded-xl my-4 border border-emerald-900 text-center shadow-2xs">
                <p className="font-display text-xs text-emerald-400 font-extrabold">예상 법정 퇴직금 세전 수령액</p>
                <p className="font-num text-2xl sm:text-3xl font-black text-emerald-300 mt-1">
                  {retirementRes.totalRetirement.toLocaleString()}원
                </p>
              </div>

              <p className="font-body text-xs text-slate-400 leading-relaxed">
                ※ 위 결과는 연차수당 및 경영 성과급 일부가 포함되지 않은 표준 일 평균임금 베이스 가상 모의수치로, 이탈 및 추가 약정 등 실무 산출 방식에 따라 상이할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab: Unemployment Benefit Calculator */}
      {activeSubTab === 'unemployment' && (
        <div className="space-y-6">
          <div className="bg-slate-50 p-5 md:p-6 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-display block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">근로자 퇴사 연령 (만 나이)</label>
                  <input
                    type="number"
                    value={unemploymentAge}
                    onChange={(e) => setUnemploymentAge(parseInt(e.target.value) || 0)}
                    className="font-num w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-display block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">고용보험 가입기간 (개월수)</label>
                  <input
                    type="number"
                    value={unemploymentPeriod}
                    onChange={(e) => setUnemploymentPeriod(parseInt(e.target.value) || 0)}
                    className="font-num w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="font-display block text-xs sm:text-sm font-bold text-slate-700">이직전 3개월 월 평균 급여액 (원)</label>
                  <span className="font-num text-xs sm:text-sm text-indigo-600 font-extrabold bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
                    ➡ {formatKoreanPrice(prevAvgWage)}
                  </span>
                </div>
                <input
                  type="number"
                  value={prevAvgWage === 0 ? '' : prevAvgWage}
                  onChange={(e) => setPrevAvgWage(parseInt(e.target.value) || 0)}
                  className="font-num w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3.5 text-sm sm:text-base font-bold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <button
                    type="button"
                    onClick={() => setPrevAvgWage(0)}
                    className="font-display bg-slate-200 text-slate-700 text-xs py-1.5 px-3 rounded-lg hover:bg-slate-300 transition font-bold shrink-0 cursor-pointer"
                  >
                    초기화
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrevAvgWage(prev => prev + 500000)}
                    className="font-display bg-indigo-50 text-indigo-700 text-xs py-1.5 px-3 rounded-lg hover:bg-indigo-100 border border-indigo-200 transition font-extrabold shrink-0 cursor-pointer"
                  >
                    +50만
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrevAvgWage(prev => prev + 1000000)}
                    className="font-display bg-indigo-50 text-indigo-700 text-xs py-1.5 px-3 rounded-lg hover:bg-indigo-100 border border-indigo-200 transition font-extrabold shrink-0 cursor-pointer"
                  >
                    +100만
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrevAvgWage(prev => prev + 3000000)}
                    className="font-display bg-indigo-50 text-indigo-700 text-xs py-1.5 px-3 rounded-lg hover:bg-indigo-100 border border-indigo-200 transition font-extrabold shrink-0 cursor-pointer"
                  >
                    +300만
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrevAvgWage(prev => prev + 5000000)}
                    className="font-display bg-indigo-50 text-indigo-700 text-xs py-1.5 px-3 rounded-lg hover:bg-indigo-100 border border-indigo-200 transition font-extrabold shrink-0 cursor-pointer"
                  >
                    +500만
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-5 md:p-6 flex flex-col justify-between shadow-xs">
              <div>
                <span className="font-display text-xs bg-rose-500 text-white rounded-lg px-2.5 py-1 font-extrabold">
                  고용노동부 가상 구직급여 리포트
                </span>
                <div className="space-y-2 mt-3 text-xs sm:text-sm text-slate-400">
                  <div className="flex justify-between">
                    <span className="font-body">1일 예상 구직급여액</span>
                    <span className="font-num text-emerald-400 font-bold">{unemploymentRes.dailyBenefit.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-body">법정 인정 지급 가능 기한</span>
                    <span className="font-num text-white font-bold">{unemploymentRes.payoutDays}일 공급</span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-950 p-4 rounded-xl border border-emerald-900 my-3 shadow-2xs">
                <p className="font-display text-xs text-emerald-400 font-bold">지급 기한 내 최장 총 예상 구직급여 수급액</p>
                <p className="font-num text-2xl sm:text-3xl font-black text-emerald-300 mt-1 text-right">
                  {unemploymentRes.totalPayout.toLocaleString()}원
                </p>
              </div>

              <p className="font-body text-xs text-slate-400 leading-relaxed">
                ※ 구직급여는 본인의 귀책 사유가 없는 권고사직, 정년퇴직 등의 비자발적 이직 조건이어야 가능합니다. 또한 퇴직 전 18개월간 피보험 단위 기간 통산 180일 이상이어야 온전한 신청 자격요건이 충족됩니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Rich Text Guide Information */}
      <div className="pt-8 border-t border-slate-200 mt-8 space-y-6 text-slate-700 leading-relaxed no-print">
        <h2 className="font-heading text-base sm:text-lg md:text-xl font-black text-slate-950 flex items-center mb-1">
          <BookOpen className="w-5 h-5 text-emerald-600 mr-2" />
          임금(급여) 산출공식 및 주휴수당 세무 가이드
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-5 rounded-2xl space-y-2.5 border border-slate-200 shadow-2xs">
            <h3 className="font-heading text-sm sm:text-base font-extrabold text-slate-900">주휴수당이란 무엇인가요?</h3>
            <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed">
              대한민국 근로기준법 제55조에 따라, 1주일간 규정된 소정 근로일수를 만근할 경우, 일주일 평균 하루 이상의 유급 주휴일을 부여받아야 합니다. 이 유급휴일에 대해 지급되는 수당이 주휴수당입니다. 
              즉 일 계산으로 환산 시 주 15시간 이상 근무만 채우면, 사업주는 가용 근로시간 외 유급으로 일당에 준하는 수당을 보장해 지급할 절대적 의무가 발생합니다.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl space-y-2.5 border border-slate-200 shadow-2xs">
            <h3 className="font-heading text-sm sm:text-base font-extrabold text-slate-900">퇴직금 과세 및 평균 임금 구하는 노하우</h3>
            <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed">
              퇴직금 제도의 핵심은 &apos;평균 근무 일당&apos;과 &apos;재직누계일수&apos;입니다. 마지막 퇴직 전 3개월간 수령한 전액 세전 임금을 그 3개월간의 정확한 날짜 총수로 나눔으로써 하루 치 평균 임금을 확산 산출합니다. 
              이후 1년(365일) 근무 기준에 대해 30일분의 일평균급여가 누계 일당 비례로 쌓이게 되어 퇴직금 법정 총 수령 예산이 확보되는 산술 공식을 따르고 있습니다.
            </p>
          </div>
        </div>

        <div className="bg-amber-50/80 p-5 rounded-2xl text-amber-950 border border-amber-200 shadow-2xs">
          <h4 className="font-heading text-sm sm:text-base font-extrabold text-amber-950 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            세무 상식: 실수령액과 계약서 연봉이 다소 달라지는 근본 이유
          </h4>
          <p className="font-body text-xs sm:text-sm text-amber-900/90 leading-relaxed mt-2">
            근로 계약서상의 기본금 이외에 회사별 식비 수급안, 자기차량 보조수당 등 비과세 수당 지급 기준이나 개인별 상황에 맞춰지는 부양가족의 숫자에 따른 공제세 율표(종합근로소득 간이세액) 공제 비율 때문에, 동등한 연봉 일지라도 개인별 급여 명세서 통장에 찍히는 순수 취득 NET 금액에는 매월 미세한 오차 및 변동이 지속해서 생성됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
