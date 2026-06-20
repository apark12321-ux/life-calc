import React, { useState } from 'react';
import { Home, Compass, HelpCircle, RefreshCw, BookOpen, Scaling, Landmark } from 'lucide-react';

export default function PropertyCalculator() {
  const [activeTab, setActiveTab] = useState<'size' | 'agent' | 'tax'>('size');

  // Pyung converter states
  const [m2Value, setM2Value] = useState<string>('84');
  const [pyungValue, setPyungValue] = useState<string>('25.4');

  // Brokerage states
  const [dealType, setDealType] = useState<'sale' | 'lease'>('sale');
  const [dealAmount, setDealAmount] = useState<number>(300000000); // 300 Million KRW

  // Tax states
  const [taxAmount, setTaxAmount] = useState<number>(500000000); // 500 Million KRW
  const [houseSize, setHouseSize] = useState<'under85' | 'over85'>('under85');
  const [isFirstHome, setIsFirstHome] = useState<boolean>(false);

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
    const P = dealAmount;
    let rate = 0.004; // default
    let limit = 0; // limit amount (0 means no limit max)

    if (dealType === 'sale') {
      // 2025/2026 Korean Statutory Brokerage Caps for Residential Homes:
      // - Under 50M KRW: 0.6%, max cap 250,000 KRW
      // - 50M to 200M KRW: 0.5%, max cap 800,000 KRW
      // - 200M to 900M KRW: 0.4%, no limit
      // - 900M to 1.2B KRW: 0.5%, no limit
      // - 1.2B to 1.5B KRW: 0.6%, no limit
      // - Over 1.5B KRW: 0.7%, no limit
      if (P < 50000000) {
        rate = 0.006;
        limit = 250000;
      } else if (P < 200000000) {
        rate = 0.005;
        limit = 800000;
      } else if (P < 900000000) {
        rate = 0.004;
        limit = 0;
      } else if (P < 1200000000) {
        rate = 0.005;
        limit = 0;
      } else if (P < 1500000000) {
        rate = 0.006;
        limit = 0;
      } else {
        rate = 0.007;
        limit = 0;
      }
    } else {
      // Lease (전월세) statutory caps:
      // - Under 50M KRW: 0.5%, max cap 200,000 KRW
      // - 50M to 100M KRW: 0.4%, max cap 300,000 KRW
      // - 100M to 600M KRW: 0.3%, no limit
      // - 600M to 1.2B KRW: 0.4%, no limit
      // - Over 1.2B KRW: 0.5%, no limit
      if (P < 50000000) {
        rate = 0.005;
        limit = 200000;
      } else if (P < 100000000) {
        rate = 0.004;
        limit = 300000;
      } else if (P < 600000000) {
        rate = 0.003;
        limit = 0;
      } else if (P < 1200000000) {
        rate = 0.004;
        limit = 0;
      } else {
        rate = 0.005;
        limit = 0;
      }
    }

    let calculatedFee = Math.floor(P * rate);
    if (limit > 0 && calculatedFee > limit) {
      calculatedFee = limit;
    }

    // Add VAT (value added tax - usually 10% on top of the fee if general taxable company)
    const vat = Math.floor(calculatedFee * 0.1);

    return {
      rate: (rate * 100).toFixed(1),
      calculatedFee,
      vat,
      totalWithVat: calculatedFee + vat,
      hasLimit: limit > 0,
      limitAmount: limit
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
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">거래 유해 구분</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setDealType('sale')}
                    className={`flex-1 py-2 px-3 border text-xs rounded-lg transition-colors font-bold ${dealType === 'sale' ? 'bg-white text-blue-700 border-blue-300 shadow-xs' : 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200'}`}
                  >
                    아파트/주택 매매 (Sales)
                  </button>
                  <button
                    onClick={() => setDealType('lease')}
                    className={`flex-1 py-2 px-3 border text-xs rounded-lg transition-colors font-bold ${dealType === 'lease' ? 'bg-white text-blue-700 border-blue-300 shadow-xs' : 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200'}`}
                  >
                    임대차 전세 & 월세 (Lease)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">거래 체결 보증금/금액 (원)</label>
                <input
                  type="number"
                  value={dealAmount}
                  onChange={(e) => setDealAmount(parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-3 text-sm font-bold focus:outline-hidden"
                />
                <div className="flex gap-1 mt-1.5">
                  {[50000000, 100000000, 300000000, 600000000, 1000000000].map((val) => (
                    <button
                      key={val}
                      onClick={() => setDealAmount(val)}
                      className="bg-white border text-[10px] text-slate-600 py-0.5 px-2 rounded hover:bg-slate-100"
                    >
                      {(val / 100000000).toFixed(1)}억원
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Brokerage Result */}
            <div className="bg-slate-900 text-white rounded-xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] bg-amber-500 text-white rounded px-2 py-0.5 font-bold uppercase">
                  공식 법정 상한 요율표 결과
                </span>
                
                <div className="space-y-2 mt-4 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>적용된 법정 상한요율</span>
                    <span className="text-white font-mono">{brokerageRes.rate}%</span>
                  </div>
                  {brokerageRes.hasLimit && (
                    <div className="flex justify-between text-yellow-300 text-[11px]">
                      <span>해당 구간 법정 수수료 리밋 한계</span>
                      <span>{brokerageRes.limitAmount.toLocaleString()}원 상한제한</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>순수 부과 중개수수료</span>
                    <span className="text-white font-mono">{brokerageRes.calculatedFee.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>서비스 부가세 (VAT 10%)</span>
                    <span className="font-mono text-slate-400">+{brokerageRes.vat.toLocaleString()}원</span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-950 p-3.5 border border-emerald-900 rounded-lg text-center my-3">
                <p className="text-[11px] text-emerald-400 font-bold">임대인/임차인 각각 지불할 복비 총합 (VAT포함)</p>
                <p className="text-xl md:text-2xl font-extrabold text-emerald-300 font-mono mt-0.5">
                  {brokerageRes.totalWithVat.toLocaleString()}원
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
                <label className="block text-xs font-bold text-slate-700 mb-1.5">취득 아파트 매매 가액 (원)</label>
                <input
                  type="number"
                  value={taxAmount}
                  onChange={(e) => setTaxAmount(parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-3 text-sm font-bold focus:outline-hidden"
                />
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
