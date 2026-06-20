import React, { useState, useEffect } from 'react';
import { HelpCircle, RefreshCw, Calculator as CalcIcon, Printer, CheckCircle2, Info, BookOpen } from 'lucide-react';

export default function InsuranceCalculator() {
  const [tab, setTab] = useState<'all' | 'pension' | 'health' | 'employment' | 'accident'>('all');
  const [salaryStr, setSalaryStr] = useState<string>('2,500,000');
  const [salary, setSalary] = useState<number>(2500000);
  const [employeeCount, setEmployeeCount] = useState<string>('under150');
  const [accidentRate, setAccidentRate] = useState<number>(1.0); // Common default rate inside Korea e.g. 1.0%

  // Handlers for number formatting
  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (/^\d*$/.test(value)) {
      const numVal = value ? parseInt(value, 10) : 0;
      setSalary(numVal);
      setSalaryStr(numVal.toLocaleString());
    }
  };

  // Convert inputs
  const calculateFees = () => {
    // 2026 Korean social insurance standard parameters
    const minPensionSalary = 390000; // minimum contribution base
    const maxPensionSalary = 6170000; // maximum national pension contribution base (2025/2026 adjusted limit cap)
    
    const minHealthSalary = 300000;
    const maxHealthSalary = 119853333; // health insurance upper ceiling is very high

    // Apply limits for calculations specifically
    const pensionBase = Math.max(minPensionSalary, Math.min(maxPensionSalary, salary));
    const healthBase = Math.max(minHealthSalary, Math.min(maxHealthSalary, salary));

    // 1. National Pension: Rate 9% (Employee 4.5%, Employer 4.5%)
    const pensionTotal = Math.floor((pensionBase * 0.09) / 10) * 10;
    const pensionEmployee = Math.floor((pensionBase * 0.045) / 10) * 10;
    const pensionEmployer = pensionTotal - pensionEmployee; // Aligning sums

    // 2. Health Insurance: Rate 7.09% (Employee 3.545%, Employer 3.545%)
    const healthTotal = Math.floor((healthBase * 0.0709) / 10) * 10;
    const healthEmployee = Math.floor((healthBase * 0.03545) / 10) * 10;
    const healthEmployer = healthTotal - healthEmployee;

    // 3. Long Term Care: 12.95% of HEALTH INSURANCE premium
    const longTermTotal = Math.floor((healthTotal * 0.1295) / 10) * 10;
    const longTermEmployee = Math.floor((healthEmployee * 0.1295) / 10) * 10;
    const longTermEmployer = longTermTotal - longTermEmployee;

    // 4. Employment Insurance: Employee 0.9%
    // Employer rate changes based on company size:
    // - Under 150 employees: 0.9% + 0.25% = 1.15% (total 2.05%)
    // - Preferential support: 0.9% + 0.45% = 1.35% (total 2.25%)
    // - 150 to 1000 employees: 0.9% + 0.65% = 1.55% (total 2.45%)
    // - Massive / Government: 0.9% + 0.85% = 1.75% (total 2.65%)
    let employerEmpRate = 0.0115;
    if (employeeCount === 'pref') employerEmpRate = 0.0135;
    else if (employeeCount === 'medium') employerEmpRate = 0.0155;
    else if (employeeCount === 'large') employerEmpRate = 0.0175;

    const employmentEmployee = Math.floor((salary * 0.009) / 10) * 10;
    const employmentEmployer = Math.floor((salary * employerEmpRate) / 10) * 10;
    const employmentTotal = employmentEmployee + employmentEmployer;

    // 5. Industrial Accident Insurance (산재보험): 100% Employer sponsored. Average rate inputted manually or defaulted (e.g. 1.0%)
    const accidentTotal = Math.floor((salary * (accidentRate / 100)) / 10) * 10;
    const accidentEmployee = 0;
    const accidentEmployer = accidentTotal;

    return {
      pension: { total: pensionTotal, employee: pensionEmployee, employer: pensionEmployer },
      health: { total: healthTotal, employee: healthEmployee, employer: healthEmployer },
      longTerm: { total: longTermTotal, employee: longTermEmployee, employer: longTermEmployer },
      employment: { total: employmentTotal, employee: employmentEmployee, employer: employmentEmployer },
      accident: { total: accidentTotal, employee: accidentEmployee, employer: accidentEmployer },
      sum: {
        total: pensionTotal + healthTotal + longTermTotal + employmentTotal + accidentTotal,
        employee: pensionEmployee + healthEmployee + longTermEmployee + employmentEmployee + accidentEmployee,
        employer: pensionEmployer + healthEmployer + longTermEmployer + employmentEmployer + accidentEmployer
      }
    };
  };

  const fees = calculateFees();

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setSalaryStr('2,500,000');
    setSalary(2500000);
    setEmployeeCount('under150');
    setAccidentRate(1.0);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-100 p-4 md:p-8">
      {/* App Header style header */}
      <div className="border-b border-slate-100 pb-5 mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <CalcIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">4대사회보험료 모의계산기</h1>
            <p className="text-xs text-slate-500 mt-0.5">내 월급에서 빠져나가는 4대보험료와 회사 부담금을 한눈에 쉽고 투명하게 계산해 보세요.</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl mb-6 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button
          onClick={() => setTab('all')}
          className={`flex-1 min-w-[70px] text-center py-2.5 px-3 rounded-lg text-xs font-semibold transition-all duration-150 ${tab === 'all' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-950'}`}
        >
          전체 보기
        </button>
        <button
          onClick={() => setTab('pension')}
          className={`flex-1 min-w-[70px] text-center py-2.5 px-3 rounded-lg text-xs font-semibold transition-all duration-150 ${tab === 'pension' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-950'}`}
        >
          국민연금
        </button>
        <button
          onClick={() => setTab('health')}
          className={`flex-1 min-w-[70px] text-center py-2.5 px-3 rounded-lg text-xs font-semibold transition-all duration-150 ${tab === 'health' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-950'}`}
        >
          건강보험
        </button>
        <button
          onClick={() => setTab('employment')}
          className={`flex-1 min-w-[70px] text-center py-2.5 px-3 rounded-lg text-xs font-semibold transition-all duration-150 ${tab === 'employment' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-950'}`}
        >
          고용보험
        </button>
        <button
          onClick={() => setTab('accident')}
          className={`flex-1 min-w-[70px] text-center py-2.5 px-3 rounded-lg text-xs font-semibold transition-all duration-150 ${tab === 'accident' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-950'}`}
        >
          산재보험
        </button>
      </div>

      {/* Warning/Info base notice box */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 mb-6 flex items-start space-x-3 text-amber-900">
        <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="text-xs space-y-1">
          <p className="font-semibold text-amber-950">2026년 최신 보험료율 완벽 반영</p>
          <p className="text-amber-800 leading-relaxed">
            본 계산은 2026년 귀속 기준 법정 요율을 적용한 모의 계산 결과이며, 비과세 급여(식대, 자가운전보조금 등) 포함 여부 및 개별 회사 규정에 따라 실제 고지 금액과 다소 차이가 있을 수 있습니다.
          </p>
        </div>
      </div>

      {/* Main Input Form */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 mb-8 space-y-4">
        {/* Salary Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">월 급여 수령액 (비과세 제외 세전금액)</label>
          <div className="relative rounded-lg shadow-xs">
            <input
              type="text"
              value={salaryStr}
              onChange={handleSalaryChange}
              className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pl-4 pr-12 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold text-right"
              placeholder="예: 2,500,000"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className="text-xs text-slate-500 font-bold">원</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {[1000000, 2000000, 2500000, 3000000, 4000000, 5000000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => {
                  setSalary(val);
                  setSalaryStr(val.toLocaleString());
                }}
                className="bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 hover:border-slate-300 rounded-md py-1 px-2.5 text-[11px] font-medium transition-all"
              >
                +{ (val/10000).toLocaleString() }만원
              </button>
            ))}
          </div>
        </div>

        {/* Corporate Employee Scale Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">회사 소속 근로자 수 (고용보험 안안 적용 기준)</label>
            <select
              value={employeeCount}
              onChange={(e) => setEmployeeCount(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg py-2 pl-3 pr-8 text-xs text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="under150">150인 미만 기업 (기본 고용안정 우대)</option>
              <option value="pref">150인 이상 우선지원 대상기업</option>
              <option value="medium">150인 이상 ~ 1,000인 미만 일반 대기업</option>
              <option value="large">1,000인 이상 기업 및 국가·지방자치단체</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">산재보험 요율 설정 (업종별 요율 상이)</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="0.01"
                min="0.5"
                max="20.0"
                value={accidentRate}
                onChange={(e) => setAccidentRate(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-xs text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-semibold"
              />
              <span className="text-xs text-slate-600 font-bold">%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200/60">
          <button
            onClick={handleReset}
            className="flex items-center space-x-1 px-3 py-2 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-xs font-medium transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>초기화</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-medium transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>상담 출력 (PDF)</span>
          </button>
        </div>
      </div>

      {/* Numerical Results Table */}
      <div className="overflow-x-auto border border-slate-150 rounded-xl mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-150 text-[11px] md:text-xs text-slate-500 font-semibold">
              <th className="py-3 px-4 font-bold text-slate-700">구분 (보험 명칭)</th>
              <th className="py-3 px-4 text-right font-bold text-slate-700">총 보험료액 (A+B)</th>
              <th className="py-3 px-4 text-right font-bold text-blue-600 bg-blue-50/50">근로자 부담금 (A - 떼이는 돈)</th>
              <th className="py-3 px-4 text-right font-bold text-emerald-700 bg-emerald-50/30">사업주 부담금 (B - 회사 지원)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs md:text-sm text-slate-700">
            {/* National Pension */}
            {(tab === 'all' || tab === 'pension') && (
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-800">
                  국민연금 <span className="text-[10px] text-slate-400 block sm:inline font-normal sm:ml-1.5">(적정 요율 9.0%)</span>
                </td>
                <td className="py-3.5 px-4 text-right font-semibold text-slate-800">
                  {fees.pension.total.toLocaleString()}원
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-blue-700 bg-blue-50/30">
                  {fees.pension.employee.toLocaleString()}원
                </td>
                <td className="py-3.5 px-4 text-right font-semibold text-emerald-700 bg-emerald-50/10">
                  {fees.pension.employer.toLocaleString()}원
                </td>
              </tr>
            )}

            {/* Health Insurance */}
            {(tab === 'all' || tab === 'health') && (
              <>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    건강보험 <span className="text-[10px] text-slate-400 block sm:inline font-normal sm:ml-1.5">(율 7.09%)</span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-slate-800">
                    {fees.health.total.toLocaleString()}원
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-blue-700 bg-blue-50/30">
                    {fees.health.employee.toLocaleString()}원
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-emerald-700 bg-emerald-50/10">
                    {fees.health.employer.toLocaleString()}원
                  </td>
                </tr>
                {/* Long Term Care */}
                <tr className="hover:bg-slate-50/50 transition-colors bg-amber-50/10">
                  <td className="py-3.5 px-4 font-semibold text-slate-800 pl-6 border-l-2 border-slate-300">
                    ┗ 건보료 내 장기요양보험 <span className="text-[10px] text-amber-600 block sm:inline font-normal sm:ml-1.5">(건보료의 12.95%)</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {fees.longTerm.total.toLocaleString()}원
                  </td>
                  <td className="py-3.5 px-4 text-right text-blue-600 bg-blue-50/20">
                    {fees.longTerm.employee.toLocaleString()}원
                  </td>
                  <td className="py-3.5 px-4 text-right text-emerald-600 bg-emerald-50/5">
                    {fees.longTerm.employer.toLocaleString()}원
                  </td>
                </tr>
              </>
            )}

            {/* Employment Insurance */}
            {(tab === 'all' || tab === 'employment') && (
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-800">
                  고용보험 <span className="text-[10px] text-slate-400 block sm:inline font-normal sm:ml-1.5">(실직대비 근로자 0.9%)</span>
                </td>
                <td className="py-3.5 px-4 text-right font-semibold text-slate-800">
                  {fees.employment.total.toLocaleString()}원
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-blue-700 bg-blue-50/30">
                  {fees.employment.employee.toLocaleString()}원
                </td>
                <td className="py-3.5 px-4 text-right font-semibold text-emerald-700 bg-emerald-50/10">
                  {fees.employment.employer.toLocaleString()}원
                </td>
              </tr>
            )}

            {/* Industrial Accident Insurance */}
            {(tab === 'all' || tab === 'accident') && (
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-800">
                  산재보험 <span className="text-[10px] text-slate-400 block sm:inline font-normal sm:ml-1.5">(율 {accidentRate}% 전액 사업주)</span>
                </td>
                <td className="py-3.5 px-4 text-right font-semibold text-slate-800">
                  {fees.accident.total.toLocaleString()}원
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-slate-400 bg-slate-50">
                  0원 (근로자 0%)
                </td>
                <td className="py-3.5 px-4 text-right font-semibold text-emerald-700 bg-emerald-50/10">
                  {fees.accident.employer.toLocaleString()}원
                </td>
              </tr>
            )}

            {/* Total Row */}
            <tr className="bg-slate-800 text-white font-bold text-xs md:text-sm">
              <td className="py-4 px-4 text-left">종합 합계액 (원-화)</td>
              <td className="py-4 px-4 text-right bg-slate-900 border-r border-slate-700">
                {fees.sum.total.toLocaleString()}원
              </td>
              <td className="py-4 px-4 text-right bg-blue-900 text-blue-200">
                {fees.sum.employee.toLocaleString()}원
              </td>
              <td className="py-4 px-4 text-right bg-emerald-950 text-emerald-200">
                {fees.sum.employer.toLocaleString()}원
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SEO rich-text block for Google AdSense Crawler Approval - Absolute Requirement */}
      <div className="mt-8 border-t border-slate-100 pt-8 space-y-6">
        <h2 className="text-sm font-bold text-slate-900 flex items-center mb-4">
          <BookOpen className="w-4 h-4 text-indigo-600 mr-1.5" />
          4대보험 및 급여 수령액 관련 심층 가이드 (SEO용 상세 가이드)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h3 className="font-bold text-slate-800 flex items-center text-xs">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></span>
              1. 국민연금(National Pension) 납부 규정
            </h3>
            <p>
              국민연금은 근로자와 사업주가 각각 4.5%씩 부담하여 총 9%를 납부하게 됩니다. 2026년에도 기준소득월액 상한액과 하한액 제도가 동일하게 유지됩니다. 
              월 등급 한정 규정 상한선(예: 월 617만원) 이상의 급여를 수령하더라도, 상한액 세액을 한도로 정해 그 금액의 4.5%만 징수하도록 특별 설계되어 고임금 수령자의 연금 남발 비율을 방지합니다.
            </p>
          </div>

          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h3 className="font-bold text-slate-800 flex items-center text-xs">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></span>
              2. 건강보험 및 노인장기요양보험 요율
            </h3>
            <p>
              직장가입자의 건강보험요율은 법정 기준 7.09%에 입각하여 근로자와 회사가 각각 3.545%씩 납부합니다. 
              여기서 중요 체크사항은 바로 노인장기요양보험료입니다. 이는 월 급여 총액 기준이 아닌, 내가 산정받아 납부하게 되는 <strong>건강보험료 총액의 12.95%</strong>를 추가 환산하여 원천징수하는 구조로 되어 있습니다.
            </p>
          </div>

          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h3 className="font-bold text-slate-800 flex items-center text-xs">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></span>
              3. 고용보험 기업규모별 차등 요율
            </h3>
            <p>
              고용보험은 실직 시 수급하는 실업급여 계정과 직업능력개발사업 계정으로 나뉩니다. 실업급여 혜택분(1.8%)은 근로자와 사업주가 각각 0.9%씩 함께 부담하지만, 고용안정 직업개발에 소요되는 수수료 계정은 회사의 대규모 상태(근로자수 150인 미만, 이상 등)에 따라 회사에서 별도로 차등 납부하여 지원합니다.
            </p>
          </div>

          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h3 className="font-bold text-slate-800 flex items-center text-xs">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></span>
              4. 산재보험료 산출법 및 사업주 부담 원칙
            </h3>
            <p>
              산업재해보상보험은 출퇴근 및 근무지 내 근로 안전 수칙 준수 속에서 사고 시 국가지원을 받을 수 있는 사회안전망제도입니다. 이는 법정 의무 가입 항목이며, 근로자의 월급에서 빠져나가는 금액은 <strong>0원</strong>입니다. 오직 고용주(사업주)가 100% 부담하며 요율은 광업, 건설업, 사무 서비스업 등 업계 위험도에 따라 다르게 책정됩니다.
            </p>
          </div>
        </div>

        {/* Dynamic SEO Accordion FAQ */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 mb-2">💡 4대보험 자주 묻는 질문 FAQ</h3>
          <ul className="space-y-3 text-xs text-slate-600">
            <li>
              <strong>Q. 비과세 급여는 왜 4대보험 계산에서 빠지나요?</strong>
              <p className="mt-1 text-[11px] text-slate-500">
                식대(월 최대 20만원), 자가운전보조금(월 최대 20만원), 육아수당 등은 법규상 과세 대상에서 제외되는 항목입니다. 이러한 비과세 수당은 국민건강보험 및 국가 소득세뿐 아니라 4대사회보험 징수 기초금액인 &apos;보수월액&apos; 산정에서도 산입되지 않습니다.
              </p>
            </li>
            <li className="pt-2 border-t border-slate-200">
              <strong>Q. 아르바이트생(단기 근로자)도 반드시 4대보험에 가입해야 하나요?</strong>
              <p className="mt-1 text-[11px] text-slate-500">
                1개월 이상 근무하고 본인의 소정근로시간이 월 60시간(주 15시간) 이상인 모든 노동자는 고용 형태(알바, 일용, 계약직)와 상관없이 4대사회보험 법정 필수 가입 대상자에 속합니다.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
