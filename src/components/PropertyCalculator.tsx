import React, { useState } from 'react';
import { Home, Compass, HelpCircle, RefreshCw, BookOpen, Scaling, Landmark } from 'lucide-react';

export default function PropertyCalculator() {
  const [activeTab, setActiveTab] = useState<'size' | 'agent' | 'tax'>('size');

  // Pyung converter states
  const [m2Value, setM2Value] = useState<string>('84');
  const [pyungValue, setPyungValue] = useState<string>('25.4');

  // Brokerage states
  const [propertyType, setPropertyType] = useState<'house' | 'officetel_living' | 'officetel_business' | 'commercial' | 'land'>('house');
  const [dealType, setDealType] = useState<'sale' | 'lease'>('sale');
  const [leaseType, setLeaseType] = useState<'jeonse' | 'monthly'>('jeonse');
  const [deposit, setDeposit] = useState<number>(300000000); // represents sales price OR jeonse deposit OR monthly lease deposit
  const [monthlyRent, setMonthlyRent] = useState<number>(0); 
  const [negotiatedRate, setNegotiatedRate] = useState<string>(''); // negotiated rate by user (e.g. "0.3")

  // Tax states
  const [taxAmount, setTaxAmount] = useState<number>(500000000); // 500 Million KRW
  const [houseSize, setHouseSize] = useState<'under85' | 'over85'>('under85');
  const [isFirstHome, setIsFirstHome] = useState<boolean>(false);

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

  // Math equations and converters:
  // 1. Pyung Converter Handlers
  const handleM2Change = (val: string) => {
    setM2Value(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setPyungValue((num * 0.3025).toFixed(1));
    } else {
      setPyungValue('');
    }
  };

  const handlePyungChange = (val: string) => {
    setPyungValue(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setM2Value((num / 0.3025).toFixed(1));
    } else {
      setM2Value('');
    }
  };

  // 2. Korean statutory brokerage fee calculation
  const calculateBrokerage = () => {
    // 1) Calculate final transaction amount (거래가액) based on monthly lease calculations
    let transactionAmount = deposit;
    if (dealType === 'lease') {
      if (leaseType === 'monthly') {
        const standardAmount = deposit + (monthlyRent * 100);
        if (standardAmount < 50000000) {
          transactionAmount = deposit + (monthlyRent * 70);
        } else {
          transactionAmount = standardAmount;
        }
      } else {
        transactionAmount = deposit;
      }
    }

    let maxRate = 0.009; // default general maximum rate (e.g. commercial, general land/offices)
    let limit = 0; // limit cap for house
    let isResidential = false;

    if (propertyType === 'house') {
      isResidential = true;
      if (dealType === 'sale') {
        // 2025/2026 Korean Statutory Brokerage Caps for Residential Homes:
        // - Under 50M KRW: 0.6%, max cap 250,000 KRW
        // - 50M to 200M KRW: 0.5%, max cap 800,000 KRW
        // - 200M to 900M KRW: 0.4%, no limit
        // - 900M to 1.2B KRW: 0.5%, no limit
        // - 1.2B to 1.5B KRW: 0.6%, no limit
        // - Over 1.5B KRW: 0.7%, no limit
        if (transactionAmount < 50000000) {
          maxRate = 0.006;
          limit = 250000;
        } else if (transactionAmount < 200000000) {
          maxRate = 0.005;
          limit = 800000;
        } else if (transactionAmount < 900000000) {
          maxRate = 0.004;
          limit = 0;
        } else if (transactionAmount < 1200000000) {
          maxRate = 0.005;
          limit = 0;
        } else if (transactionAmount < 1500000000) {
          maxRate = 0.006;
          limit = 0;
        } else {
          maxRate = 0.007;
          limit = 0;
        }
      } else {
        // Lease (전월세) statutory caps:
        // - Under 50M KRW: 0.5%, max cap 200,000 KRW
        // - 50M to 100M KRW: 0.4%, max cap 300,000 KRW
        // - 100M to 600M KRW: 0.3%, no limit
        // - 600M to 1.2B KRW: 0.4%, no limit
        // - Over 1.2B KRW: 0.5%, no limit
        if (transactionAmount < 50000000) {
          maxRate = 0.005;
          limit = 200000;
        } else if (transactionAmount < 100000000) {
          maxRate = 0.004;
          limit = 300000;
        } else if (transactionAmount < 600000000) {
          maxRate = 0.003;
          limit = 0;
        } else if (transactionAmount < 1200000000) {
          maxRate = 0.004;
          limit = 0;
        } else {
          maxRate = 0.005;
          limit = 0;
        }
      }
    } else if (propertyType === 'officetel_living') {
      // 주거용 오피스텔 (전용 85㎡ 이하, 상하수도 시설 완비 등)
      if (dealType === 'sale') {
        maxRate = 0.005;
      } else {
        maxRate = 0.004;
      }
      limit = 0;
    } else if (propertyType === 'officetel_business') {
      // 일반/업무용 오피스텔
      maxRate = 0.009;
      limit = 0;
    } else {
      // 상가, 사무실, 토지 등
      maxRate = 0.009;
      limit = 0;
    }

    // Determine custom/negotiated rate
    const parsedCustom = parseFloat(negotiatedRate);
    const hasCustom = !isNaN(parsedCustom) && parsedCustom > 0;
    // Applied rate cannot legally exceed the statutory maximum rate!
    const appliedRate = hasCustom ? Math.min(parsedCustom / 100, maxRate) : maxRate;

    // Calculate maximum legal fee
    let maxLegalFee = Math.floor(transactionAmount * maxRate);
    if (limit > 0 && maxLegalFee > limit) {
      maxLegalFee = limit;
    }

    // Fee calculations
    let calculatedFee = Math.floor(transactionAmount * appliedRate);
    if (limit > 0 && calculatedFee > limit) {
      calculatedFee = limit;
    }
    
    // Safety check: Negotiated or applied fee should never overshoot maximum legally permissible fee
    if (calculatedFee > maxLegalFee) {
      calculatedFee = maxLegalFee;
    }

    // Add VAT (value added tax - usually 10% on top of the fee if general taxable company)
    const vat = Math.floor(calculatedFee * 0.1);

    return {
      maxRate: (maxRate * 100).toFixed(2),
      appliedRate: (appliedRate * 100).toFixed(3),
      transactionAmount,
      calculatedFee,
      vat,
      totalWithVat: calculatedFee + vat,
      hasLimit: limit > 0,
      limitAmount: limit,
      isCustom: hasCustom,
      maxLegalFee
    };
  };

  const brokerageRes = calculateBrokerage();

  // 3. Korean property acquisition tax (취득세) calculation
  const calculateTax = () => {
    const P = taxAmount;
    
    // Core acquisition tax multiplier:
    // - Under 600 Million: 1.0%
    // - 600 Million to 900 Million: Linear scale ((P * 2 / 3억) - 3) % -> let's simplified with tiers
    //   e.g. 700 Million is around 1.67%, 800M is around 2.33%
    // - Over 900 Million: 3.0%
    let acquiRate = 0.01;
    if (P <= 600000000) {
      acquiRate = 0.01;
    } else if (P <= 900000000) {
      acquiRate = ((P * 2) / 300000000 - 3) / 100;
    } else {
      acquiRate = 0.03;
    }

    // First home buyer tax discount (up to 2 Million KRW discount off acquisition tax)
    let acquisitionTax = P * acquiRate;
    if (isFirstHome) {
      acquisitionTax = Math.max(0, acquisitionTax - 2000000);
    }
    acquisitionTax = Math.floor(acquisitionTax);

    // Education Tax (지방교육세):
    // Standard acquisition tax * 10%
    let eduRate = acquiRate * 0.1;
    let educationTax = Math.floor(P * eduRate);

    // Farm specialized Tax (농어촌특별세):
    // 0.2% applied only if housing size is over 85 M2. Under 85 M2 is exempted!
    let farmTax = 0;
    if (houseSize === 'over85') {
      farmTax = Math.floor(P * 0.002);
    }

    return {
      acquiRatePercent: (acquiRate * 100).toFixed(2),
      acquisitionTax,
      educationTax,
      farmTax,
      totalTax: acquisitionTax + educationTax + farmTax
    };
  };

  const taxRes = calculateTax();

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-100 p-4 md:p-8">
      {/* App Header */}
      <div className="border-b border-slate-100 pb-5 mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Home className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">부동산 공간 & 수수료 & 취득세 계산기</h1>
            <p className="text-xs text-slate-500 mt-0.5">내집 마련 계약 시 필수적인 ㎡ 평수 단환, 법정 중개 수수료 수치, 그리고 복잡한 지방세 취득세율을 단번에 요점 분석합니다.</p>
          </div>
        </div>
      </div>

      {/* Internal Sub Navigation */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <button
          onClick={() => setActiveTab('size')}
          className={`py-3 px-2 text-center rounded-xl border text-xs font-bold transition-all ${activeTab === 'size' ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
        >
          📏 평수 상호 변환 (㎡ ↔ 평)
        </button>
        <button
          onClick={() => setActiveTab('agent')}
          className={`py-3 px-2 text-center rounded-xl border text-xs font-bold transition-all ${activeTab === 'agent' ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
        >
          📂 법정 중개 수수료 (복비)
        </button>
        <button
          onClick={() => setActiveTab('tax')}
          className={`py-3 px-2 text-center rounded-xl border text-xs font-bold transition-all ${activeTab === 'tax' ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
        >
          🏛 취득세 모의 산정
        </button>
      </div>

      {/* Tab 1: Pyung Space Converter */}
      {activeTab === 'size' && (
        <div className="space-y-6">
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-105 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center">
                  <span className="w-2 h-2 bg-indigo-505 bg-blue-500 rounded-full mr-1.5"></span>
                  제곱미터값 입력 (㎡)
                </label>
                <input
                  type="text"
                  value={m2Value}
                  onChange={(e) => handleM2Change(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-3 text-sm font-bold text-slate-850"
                  placeholder="예: 84"
                />
              </div>

              <div className="flex items-center justify-center p-2 bg-slate-200/50 rounded-lg text-slate-500 text-xs font-semibold">
                ↔ 상호 자동 실시간 트래킹 환산 ↔
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5"></span>
                  평수 단위 입력 (평)
                </label>
                <input
                  type="text"
                  value={pyungValue}
                  onChange={(e) => handlePyungChange(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-3 text-sm font-bold text-slate-850"
                  placeholder="예: 25.4"
                />
              </div>
            </div>

            {/* Quick Reference Grid */}
            <div className="bg-slate-900 text-white rounded-xl p-5 space-y-4">
              <span className="text-[10px] bg-blue-500 text-white rounded px-2 py-0.5 font-bold block w-fit">
                아파트 면적별 평형 빠른 조견목록
              </span>
              
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">소형 원룸 (59㎡ 미만)</span>
                  <span className="font-bold text-slate-250">약 14 ~ 18평형</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">국민평형 아파트 (84~85㎡)</span>
                  <span className="font-bold text-blue-300">약 25.4 ~ 25.7평형</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">중형 패밀리 타입 (112㎡)</span>
                  <span className="font-bold text-slate-250">약 33.8평형</span>
                </div>
                <div className="flex justify-between text-yellow-300">
                  <span>대형 럭셔리 라인 (150㎡)</span>
                  <span>약 45.3평형</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Brokerage Fee Calculator */}
      {activeTab === 'agent' && (
        <div className="space-y-6">
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-5">
              {/* Property types list selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  부동산 매물 종류 선택
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setPropertyType('house'); setNegotiatedRate(''); }}
                    className={`p-2.5 text-left border text-xs rounded-xl transition-all font-bold flex flex-col justify-between ${propertyType === 'house' ? 'bg-white text-blue-700 border-blue-400 shadow-xs' : 'bg-slate-100 text-slate-600 border-slate-200/60 hover:bg-slate-200'}`}
                  >
                    <span className="text-sm">🏠 주택 / 아파트</span>
                    <span className="text-[10px] font-medium text-slate-400 mt-1">상한요율 0.3% ~ 0.7%</span>
                  </button>
                  <button
                    onClick={() => { setPropertyType('officetel_living'); setNegotiatedRate(''); }}
                    className={`p-2.5 text-left border text-xs rounded-xl transition-all font-bold flex flex-col justify-between ${propertyType === 'officetel_living' ? 'bg-white text-blue-700 border-blue-400 shadow-xs' : 'bg-slate-100 text-slate-600 border-slate-200/60 hover:bg-slate-200'}`}
                  >
                    <span className="text-sm">🏢 주거용 오피스텔</span>
                    <span className="text-[10px] font-medium text-slate-400 mt-1">전용 85㎡이하 (매매0.5%/임대0.4%)</span>
                  </button>
                  <button
                    onClick={() => { setPropertyType('officetel_business'); setNegotiatedRate(''); }}
                    className={`p-2.5 text-left border text-xs rounded-xl transition-all font-bold flex flex-col justify-between ${propertyType === 'officetel_business' ? 'bg-white text-blue-700 border-blue-400 shadow-xs' : 'bg-slate-100 text-slate-600 border-slate-200/60 hover:bg-slate-200'}`}
                  >
                    <span className="text-sm">💼 일반 오피스텔</span>
                    <span className="text-[10px] font-medium text-slate-400 mt-1">업무용 / 전용 85㎡ 초과 (상한 0.9%)</span>
                  </button>
                  <button
                    onClick={() => { setPropertyType('commercial'); setNegotiatedRate(''); }}
                    className={`p-2.5 text-left border text-xs rounded-xl transition-all font-bold flex flex-col justify-between ${propertyType === 'commercial' ? 'bg-white text-blue-700 border-blue-400 shadow-xs' : 'bg-slate-100 text-slate-600 border-slate-200/60 hover:bg-slate-200'}`}
                  >
                    <span className="text-sm">🏪 상가 / 오피스</span>
                    <span className="text-[10px] font-medium text-slate-400 mt-1">점포, 상업 매장, 사무실 (상한 0.9%)</span>
                  </button>
                  <button
                    onClick={() => { setPropertyType('land'); setNegotiatedRate(''); }}
                    className={`p-2.5 text-left border text-xs rounded-xl transition-all font-bold col-span-2 flex flex-col justify-between ${propertyType === 'land' ? 'bg-white text-blue-700 border-blue-400 shadow-xs' : 'bg-slate-100 text-slate-600 border-slate-200/60 hover:bg-slate-200'}`}
                  >
                    <span className="text-sm">🏔 토지 / 임야 / 기타주택외</span>
                    <span className="text-[10px] font-medium text-slate-400 mt-1">농지, 임야, 잡종지, 주택 외 기타 자산 (상한 0.9%)</span>
                  </button>
                </div>
              </div>

              {/* Transaction category (sales vs lease) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">거래 구분</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setDealType('sale')}
                    className={`flex-1 py-2.5 px-3 border text-xs rounded-lg transition-all font-bold ${dealType === 'sale' ? 'bg-white text-blue-700 border-blue-300 shadow-xs' : 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200'}`}
                  >
                    매매 / 교환
                  </button>
                  <button
                    onClick={() => setDealType('lease')}
                    className={`flex-1 py-2.5 px-3 border text-xs rounded-lg transition-all font-bold ${dealType === 'lease' ? 'bg-white text-blue-700 border-blue-300 shadow-xs' : 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200'}`}
                  >
                    임대차 (전세 또는 월세)
                  </button>
                </div>
              </div>

              {/* Lease category (Jeonse vs Monthly) */}
              {dealType === 'lease' && (
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">보증금 임차 방식</label>
                  <div className="flex space-x-2 bg-slate-200/60 p-1 rounded-lg">
                    <button
                      onClick={() => setLeaseType('jeonse')}
                      className={`flex-1 py-1.5 px-3 text-xs rounded-md transition-all font-bold ${leaseType === 'jeonse' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      전세 (보증금만 납부)
                    </button>
                    <button
                      onClick={() => setLeaseType('monthly')}
                      className={`flex-1 py-1.5 px-3 text-xs rounded-md transition-all font-bold ${leaseType === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      월세 (보증금 + 월 임대료)
                    </button>
                  </div>
                </div>
              )}

              {/* Transaction Amount Inputs */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-850">
                      {dealType === 'sale' ? '매매 가액 (원)' : leaseType === 'jeonse' ? '전세 보증금 (원)' : '월세 보증금 (원)'}
                    </label>
                    <span className="text-xs text-blue-600 font-extrabold font-mono bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      ➡ {formatKoreanPrice(deposit)}
                    </span>
                  </div>
                  <input
                    type="number"
                    value={deposit === 0 ? '' : deposit}
                    onChange={(e) => setDeposit(parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-3 text-sm font-bold text-slate-850 focus:border-blue-500 focus:outline-hidden"
                    placeholder="예: 300000000"
                  />
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    <button
                      type="button"
                      onClick={() => setDeposit(0)}
                      className="bg-slate-100 text-slate-600 text-[10px] md:text-xs py-1.5 px-2.5 rounded-lg hover:bg-slate-200 transition-colors font-bold shrink-0"
                    >
                      초기화
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeposit(prev => prev + 10000000)}
                      className="bg-blue-50 text-blue-700 text-[10px] md:text-xs py-1.5 px-2.5 rounded-lg hover:bg-blue-100 border border-blue-100 transition-colors font-bold shrink-0"
                    >
                      +1천만
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeposit(prev => prev + 50000000)}
                      className="bg-blue-50 text-blue-700 text-[10px] md:text-xs py-1.5 px-2.5 rounded-lg hover:bg-blue-100 border border-blue-100 transition-colors font-bold shrink-0"
                    >
                      +5천만
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeposit(prev => prev + 100000000)}
                      className="bg-indigo-50 text-indigo-700 text-[10px] md:text-xs py-1.5 px-2.5 rounded-lg hover:bg-indigo-100 border border-indigo-100 transition-colors font-bold shrink-0"
                    >
                      +1억
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeposit(prev => prev + 500000000)}
                      className="bg-indigo-50 text-indigo-700 text-[10px] md:text-xs py-1.5 px-2.5 rounded-lg hover:bg-indigo-100 border border-indigo-100 transition-colors font-bold shrink-0"
                    >
                      +5억
                    </button>
                  </div>
                </div>

                {dealType === 'lease' && leaseType === 'monthly' && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-emerald-800 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        월세액 / 월 차임 (Monthly Rent 원)
                      </label>
                      <span className="text-xs text-emerald-700 font-extrabold font-mono bg-emerald-55/70 px-2 py-0.5 rounded border border-emerald-100">
                        ➡ {formatKoreanPrice(monthlyRent)}
                      </span>
                    </div>
                    <input
                      type="number"
                      value={monthlyRent === 0 ? '' : monthlyRent}
                      onChange={(e) => setMonthlyRent(parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-3 text-sm font-bold text-emerald-950 focus:border-emerald-500 focus:outline-hidden"
                      placeholder="예: 500000"
                    />
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      <button
                        type="button"
                        onClick={() => setMonthlyRent(0)}
                        className="bg-slate-100 text-slate-600 text-[10px] md:text-xs py-1.5 px-2.5 rounded-lg hover:bg-slate-200 transition-colors font-bold shrink-0"
                      >
                        초기화
                      </button>
                      <button
                        type="button"
                        onClick={() => setMonthlyRent(prev => prev + 100000)}
                        className="bg-emerald-50 text-emerald-700 text-[10px] md:text-xs py-1.5 px-2.5 rounded-lg hover:bg-emerald-100 border border-emerald-100 transition-colors font-bold shrink-0"
                      >
                        +10만
                      </button>
                      <button
                        type="button"
                        onClick={() => setMonthlyRent(prev => prev + 300000)}
                        className="bg-emerald-50 text-emerald-700 text-[10px] md:text-xs py-1.5 px-2.5 rounded-lg hover:bg-emerald-100 border border-emerald-100 transition-colors font-bold shrink-0"
                      >
                        +30만
                      </button>
                      <button
                        type="button"
                        onClick={() => setMonthlyRent(prev => prev + 500000)}
                        className="bg-emerald-50 text-emerald-700 text-[10px] md:text-xs py-1.5 px-2.5 rounded-lg hover:bg-emerald-100 border border-emerald-100 transition-colors font-bold shrink-0"
                      >
                        +50만
                      </button>
                      <button
                        type="button"
                        onClick={() => setMonthlyRent(prev => prev + 1000000)}
                        className="bg-teal-50 text-teal-700 text-[10px] md:text-xs py-1.5 px-2.5 rounded-lg hover:bg-teal-100 border border-teal-105 transition-colors font-bold shrink-0"
                      >
                        +100만
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Negotiated Rate Input */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-800">협의 중개수수료율 직접 대입 (%):</label>
                  <span className="text-[10px] text-slate-400 font-medium">※ 미기재 시 법정상한 최고치 자동 적용</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={negotiatedRate}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d*\.?\d*$/.test(val)) {
                        setNegotiatedRate(val);
                      }
                    }}
                    className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-3 text-sm font-bold text-slate-850 focus:border-amber-500 focus:outline-hidden pr-8"
                    placeholder={`지방공시 법리상한: ${brokerageRes.maxRate}% 이내`}
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">%</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  중개수수료는 협의 요율이 법정 한도요율보다 낮을 경우 낮은 요율이 최우선 적용됩니다. (높게 부과해도 상한선에서 자동차단됩니다)
                </p>
              </div>
            </div>

            {/* Brokerage Result */}
            <div className="bg-slate-900 text-white rounded-xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] bg-amber-500 text-white rounded px-2.5 py-0.5 font-bold uppercase tracking-wider">
                  지능형법정 상한 수수료 정판
                </span>
                
                <div className="space-y-2 mt-4 text-xs text-slate-400 border-b border-slate-800 pb-4">
                  <div className="flex justify-between">
                    <span>선택 부동산 대분류</span>
                    <span className="text-slate-100 font-bold">
                      {propertyType === 'house' ? '🏠 주택 / 아파트' :
                       propertyType === 'officetel_living' ? '🏢 주거형 오피스텔 (≤ 85㎡)' :
                       propertyType === 'officetel_business' ? '💼 일반 오피스텔 (> 85㎡)' :
                       propertyType === 'commercial' ? '🏪 상가 (상업 점포)' : '🏔 토지 / 임야 / 기타'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>거래 유형</span>
                    <span className="text-slate-100 font-semibold">
                      {dealType === 'sale' ? '매매 / 교환 계약' : `임대차 (${leaseType === 'jeonse' ? '전세' : '월세'}) 계약`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>최종 산출 거래 가액 (환산임차액)</span>
                    <span className="text-yellow-400 font-extrabold font-mono text-[13px]">
                      {brokerageRes.transactionAmount.toLocaleString()}원
                    </span>
                  </div>

                  {dealType === 'lease' && leaseType === 'monthly' && (
                    <div className="text-[10px] bg-slate-800/80 p-2.5 rounded-lg text-slate-300 leading-relaxed border border-slate-700/50 space-y-1">
                      <strong className="text-yellow-300">💡 법정 월세 환산보증금 적용정보:</strong>
                      <div className="font-mono">
                        {deposit.toLocaleString()}원 + ({monthlyRent.toLocaleString()}원 × {brokerageRes.transactionAmount < 50000000 ? '70' : '100'})
                      </div>
                      {brokerageRes.transactionAmount < 50000000 ? (
                        <span className="text-amber-400 block mt-0.5">※ 환산 결과가 5천만 원 미만 기준에 해당하여 법적 70배율 산식이 의무 적용되었습니다!</span>
                      ) : (
                        <span className="text-blue-300 block mt-0.5">※ 환산 결과가 5천만 원 이상이므로 표준 100배율 공식이 적용되었습니다.</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2 mt-4 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>지자체 공시 최고 상한요율</span>
                    <span className="text-slate-205 text-white font-semibold">{brokerageRes.maxRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>정밀 약정 적용요율</span>
                    <span className={`font-mono font-bold ${brokerageRes.isCustom ? 'text-amber-450 text-amber-400' : 'text-white'}`}>
                      {brokerageRes.appliedRate}% {brokerageRes.isCustom ? '(직접 협의요율)' : '(법리 최고한도)'}
                    </span>
                  </div>
                  {brokerageRes.hasLimit && (
                    <div className="flex justify-between text-yellow-300 text-[11px] bg-slate-800/50 p-2 rounded-lg border border-slate-700/20">
                      <span>해당 구간 법정 수수료 제한 한도</span>
                      <span className="font-bold">{brokerageRes.limitAmount.toLocaleString()}원 (상한제 차단)</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1.5 border-t border-slate-800/40">
                    <span>순수 법정공식 중개료</span>
                    <span className="text-white font-mono font-extrabold text-sm">{brokerageRes.calculatedFee.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>중개업 부가세 (법정 VAT 10%)</span>
                    <span className="font-mono text-slate-400">+{brokerageRes.vat.toLocaleString()}원</span>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="bg-gradient-to-br from-emerald-950/80 to-slate-900 p-4 border border-emerald-900 rounded-lg text-center shadow-inner">
                  <p className="text-[11px] text-emerald-400 font-bold">임대인/임차인 당사자 각각 지불할 복비 총액 (VAT 포함)</p>
                  <p className="text-xl md:text-2xl font-extrabold text-emerald-300 font-mono mt-0.5">
                    {brokerageRes.totalWithVat.toLocaleString()}원
                  </p>
                </div>
                <p className="text-[9px] text-slate-500 mt-2 text-center leading-relaxed">
                  ※ 일반과세사업 중개업소 기준 요금입니다. 간이과세중개업자인 경우 부가세 청구 비율이 상이하거나 생략(면세)될 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Acquisition Tax */}
      {activeTab === 'tax' && (
        <div className="space-y-6">
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">취득 아파트 매매 가액 (원)</label>
                  <span className="text-xs text-red-600 font-extrabold font-mono bg-red-50 px-2 py-0.5 rounded border border-red-100">
                    ➡ {formatKoreanPrice(taxAmount)}
                  </span>
                </div>
                <input
                  type="number"
                  value={taxAmount}
                  onChange={(e) => setTaxAmount(parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-3 text-sm font-bold focus:outline-hidden"
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setTaxAmount(0)}
                    className="bg-slate-100 text-slate-600 text-[10px] md:text-xs py-1.5 px-2.5 rounded-lg hover:bg-slate-200 transition-colors font-bold shrink-0"
                  >
                    초기화
                  </button>
                  <button
                    type="button"
                    onClick={() => setTaxAmount(prev => prev + 10000000)}
                    className="bg-red-50/50 text-red-700 text-[10px] md:text-xs py-1.5 px-2.5 rounded-lg hover:bg-red-100 border border-red-100 transition-colors font-bold shrink-0"
                  >
                    +1천만
                  </button>
                  <button
                    type="button"
                    onClick={() => setTaxAmount(prev => prev + 50000000)}
                    className="bg-red-50/50 text-red-700 text-[10px] md:text-xs py-1.5 px-2.5 rounded-lg hover:bg-red-100 border border-red-100 transition-colors font-bold shrink-0"
                  >
                    +5천만
                  </button>
                  <button
                    type="button"
                    onClick={() => setTaxAmount(prev => prev + 100000000)}
                    className="bg-indigo-50 text-indigo-700 text-[10px] md:text-xs py-1.5 px-2.5 rounded-lg hover:bg-indigo-100 border border-indigo-100 transition-colors font-bold shrink-0"
                  >
                    +1억
                  </button>
                  <button
                    type="button"
                    onClick={() => setTaxAmount(prev => prev + 500000000)}
                    className="bg-indigo-50 text-indigo-700 text-[10px] md:text-xs py-1.5 px-2.5 rounded-lg hover:bg-indigo-100 border border-indigo-100 transition-colors font-bold shrink-0"
                  >
                    +5억
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">전용 면적 규격</label>
                  <select
                    value={houseSize}
                    onChange={(e) => setHouseSize(e.target.value as 'under85' | 'over85')}
                    className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-xs"
                  >
                    <option value="under85">국민평형 이하 (85㎡ 이하)</option>
                    <option value="over85">대형 평형 초과 (85㎡ 초과)</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <div className="flex items-center space-x-2 bg-white p-2.5 rounded-lg border border-slate-200 w-full">
                    <input
                      type="checkbox"
                      id="firstHomeCheck"
                      checked={isFirstHome}
                      onChange={(e) => setIsFirstHome(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded"
                    />
                    <label htmlFor="firstHomeCheck" className="text-[10px] font-bold text-slate-700 cursor-pointer">
                      생애 첫 주택 구매 (200만 감세)
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Tax Result Frame */}
            <div className="bg-slate-900 text-white rounded-xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] bg-red-500 text-white rounded px-2 py-0.5 font-bold uppercase">
                  법정 이주 지방세금 견적
                </span>
                
                <div className="space-y-1.5 mt-3 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>기준 합산 취득세율</span>
                    <span className="text-white font-mono">{taxRes.acquiRatePercent}% 적용</span>
                  </div>
                  <div className="flex justify-between">
                    <span>- 정규 주택 취득세</span>
                    <span className="text-slate-200 font-mono">{taxRes.acquisitionTax.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>- 지방교육세</span>
                    <span className="text-slate-200 font-mono">{taxRes.educationTax.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>- 농어촌특별세 (85㎡ 초과만 부과)</span>
                    <span className="text-slate-200 font-mono">{taxRes.farmTax.toLocaleString()}원</span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-950 p-3.5 border border-emerald-900 rounded-lg text-center my-3">
                <p className="text-[11px] text-emerald-400 font-bold">국토부/행안부 가이드 기준 최종 총 세금계</p>
                <p className="text-xl md:text-2xl font-extrabold text-emerald-300 font-mono mt-0.5">
                  {taxRes.totalTax.toLocaleString()}원
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO Compliance Rich Text Information */}
      <div className="pt-8 border-t border-slate-100 mt-8 space-y-5 text-xs text-slate-600 leading-relaxed font-sans">
        <h2 className="text-sm font-bold text-slate-950 flex items-center mb-1">
          <BookOpen className="w-4 h-4 text-blue-600 mr-2" />
          부동산 면적 계산 정석 및 합법 거래 부동산 지식 가이드
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
            <h3 className="font-bold text-slate-900">1. 계량법 개정과 평(坪) 단위를 사용하지 않는 이유</h3>
            <p>
              과거 한반도에서 오랫동안 쓰이던 &apos;평&apos;은 일제 강점기의 척관법 잔재를 지우고 서구 규격 미터법을 표준 정착시키고자 2007년부터 의무 계약 표기법에서 법정 단속 대상이 되었습니다. 
              이에 법적 행정서류에는 평형 대신 제곱미터(㎡) 표기가 전면 부합화되었습니다. 통상 <strong>1평은 3.305785㎡</strong>이며, 역형 산출로 대중이 이해하기 쉽게 보조해 주는 계산 변환 장치는 부동산 중개 매수자 간 소통에 있어 가치를 지닙니다.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
            <h3 className="font-bold text-slate-900">2. 주택 취득세율과 지방세 보증금별 차별</h3>
            <p>
              주택 취득세는 거래 금액에 따라 1%에서 3%까지 기본 설계되어 상향됩니다. 부가세인 지방교육세와 농어촌특별세가 별도로 가산 합산되는 것이 현실입니다. 
              특히 전용 면적 <strong>85제곱미터(통상 아파트 34평형, 전용 25.7평)</strong>를 기준으로, 이 세대의 경계를 넘느냐 마느냐에 따라 농어촌특별세(0.2%) 면제 혜택 여부가 가려지므로 촘촘한 세법 관리를 해야 절세가 실현됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
