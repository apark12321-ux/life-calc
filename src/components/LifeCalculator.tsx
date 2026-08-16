import React, { useState } from 'react';
import { Calendar, RefreshCw, BookOpen, Clock, PartyPopper, Printer } from 'lucide-react';

export default function LifeCalculator() {
  const [activeTab, setActiveTab] = useState<'age' | 'dday' | 'school'>('age');

  // Input states
  const [birthDate, setBirthDate] = useState<string>('1998-05-15');
  const [baseDate, setBaseDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [targetDate, setTargetDate] = useState<string>('2026-12-25');
  const [dayOffset, setDayOffset] = useState<number>(100);

  const [schoolBirthYear, setSchoolBirthYear] = useState<number>(2005);

  // Zodiac Animals Korean standard (order: 자축인묘진사오미신유술해)
  const zodiacs = ['원숭이띠 (申)', '닭띠 (酉)', '개띠 (戌)', '돼지띠 (亥)', '쥐띠 (子)', '소띠 (丑)', '호랑이띠 (寅)', '토끼띠 (卯)', '용띠 (辰)', '뱀띠 (巳)', '말띠 (午)', '양띠 (未)'];
  const zodiacSigns = ['🐒', '🐔', '🐶', '🐷', '🐭', '🐮', '🐯', '🐰', '🐲', '🐍', '🐴', '🐑'];

  // Calculations:
  // 1. Age Calculation
  const calculateAge = () => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date(baseDate);

    if (isNaN(birth.getTime()) || isNaN(today.getTime())) return null;

    const birthYear = birth.getFullYear();
    const todayYear = today.getFullYear();

    // Korean Standard Age (세는 나이) = Current Year - Birth Year + 1
    const koreanAge = todayYear - birthYear + 1;

    // International Age (만 나이)
    let manAge = todayYear - birthYear;
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      manAge--;
    }

    // Year Age (연 나이) = Current Year - Birth Year
    const yeonAge = todayYear - birthYear;

    // Zodiac sign based on birth year
    const zodiacIndex = birthYear % 12;
    const zodiacName = zodiacs[zodiacIndex];
    const zodiacIcon = zodiacSigns[zodiacIndex];

    // Days until next birthday
    const nextBirth = new Date(todayYear, birth.getMonth(), birth.getDate());
    if (nextBirth.getTime() < today.getTime()) {
      nextBirth.setFullYear(todayYear + 1);
    }
    const diffTime = Math.abs(nextBirth.getTime() - today.getTime());
    const daysToBirthday = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      koreanAge,
      manAge: Math.max(0, manAge),
      yeonAge: Math.max(0, yeonAge),
      zodiacName,
      zodiacIcon,
      daysToBirthday
    };
  };

  const ageRes = calculateAge();

  // 2. D-day calculations
  const calculateDday = () => {
    const start = new Date(startDate);
    const target = new Date(targetDate);

    if (isNaN(start.getTime()) || isNaN(target.getTime())) return null;

    const diffTime = target.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Add/sub offset calculation
    const offsetCalcDate = new Date(start);
    offsetCalcDate.setDate(offsetCalcDate.getDate() + dayOffset - 1); // standard Korean anniversary is 100th day = start + 99 days
    
    return {
      diffDays,
      offsetDate: offsetCalcDate.toISOString().split('T')[0]
    };
  };

  const ddayRes = calculateDday();

  // 3. School Entry & Graduation
  const calculateSchoolYears = () => {
    // Elementary School: Starts age 8 (Korean system)
    const elementaryEntry = schoolBirthYear + 7;
    const elementaryGrad = elementaryEntry + 6;

    // Middle School: Entry right after elementary
    const middleEntry = elementaryGrad;
    const middleGrad = middleEntry + 3;

    // High School
    const highEntry = middleGrad;
    const highGrad = highEntry + 3;

    // Univ
    const univEntry = highGrad;
    const univGrad = univEntry + 4;

    return {
      elementaryEntry, elementaryGrad,
      middleEntry, middleGrad,
      highEntry, highGrad,
      univEntry, univGrad
    };
  };

  const schoolRes = calculateSchoolYears();

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-100 p-4 md:p-8">
      {/* Print Only Header */}
      <div className="print-only-header">
        <h2>생활 및 날짜 모의계산 결과 보고서</h2>
        <p>출력 일자: 2026년 07월 09일 | 생활계산기 천국 (https://www.life-calc.kr)</p>
      </div>

      {/* App Header */}
      <div className="border-b border-slate-100 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-heading text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">생활 & 날짜 계산기 (만나이/디데이/학번)</h1>
            <p className="font-body text-xs sm:text-sm text-slate-600 mt-1">애매한 만나이 계산부터 다가올 커플 100일 기념일 계산, 평생 기억할 학번 분석까지 간편하게 모의해 보세요.</p>
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
      <div className="grid grid-cols-3 gap-2.5 mb-6 no-print">
        <button
          onClick={() => setActiveTab('age')}
          className={`font-display py-3 px-2 text-center rounded-2xl border text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${activeTab === 'age' ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
        >
          🎂 만나이 & 띠
        </button>
        <button
          onClick={() => setActiveTab('dday')}
          className={`font-display py-3 px-2 text-center rounded-2xl border text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${activeTab === 'dday' ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
        >
          💖 날짜 & 디데이
        </button>
        <button
          onClick={() => setActiveTab('school')}
          className={`font-display py-3 px-2 text-center rounded-2xl border text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${activeTab === 'school' ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
        >
          🎓 학번 & 입학졸업
        </button>
      </div>

      {/* Tab Case 1: Age & Zodiac */}
      {activeTab === 'age' && (
        <div className="space-y-6">
          <div className="p-5 md:p-6 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 shadow-2xs">
            <div className="space-y-4">
              <div>
                <label className="font-display block text-xs sm:text-sm font-bold text-slate-700 mb-2">출생 연월일 입력</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="font-num w-full bg-white border border-slate-300 rounded-xl py-3 px-4 text-base sm:text-lg font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-display block text-xs sm:text-sm font-bold text-slate-700 mb-2">기준년월일 (기본: 오늘 날짜)</label>
                <input
                  type="date"
                  value={baseDate}
                  onChange={(e) => setBaseDate(e.target.value)}
                  className="font-num w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Results */}
            {ageRes && (
              <div className="bg-slate-900 text-white rounded-2xl p-5 md:p-6 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="font-display text-xs bg-indigo-500 text-white rounded-lg px-2.5 py-1 font-extrabold">만나이 산정법 결과</span>
                    <span className="text-2xl">{ageRes.zodiacIcon}</span>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                      <p className="font-display text-xs text-slate-400 font-medium">만 나이 (법적)</p>
                      <p className="font-num text-lg sm:text-xl font-black text-blue-300 mt-0.5">{ageRes.manAge}세</p>
                    </div>
                    <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                      <p className="font-display text-xs text-slate-400 font-medium">전통 세는나이</p>
                      <p className="font-num text-lg sm:text-xl font-bold text-slate-200 mt-0.5">{ageRes.koreanAge}세</p>
                    </div>
                    <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                      <p className="font-display text-xs text-slate-400 font-medium">회복 연 나이</p>
                      <p className="font-num text-lg sm:text-xl font-bold text-slate-200 mt-0.5">{ageRes.yeonAge}세</p>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-950/80 p-4 border border-indigo-900 rounded-2xl my-3 space-y-1.5 shadow-2xs">
                  <p className="font-heading text-xs sm:text-sm font-bold text-indigo-300">당신의 띠: <span className="text-white text-sm sm:text-base font-extrabold">{ageRes.zodiacName}</span></p>
                  <p className="font-body text-xs text-slate-300 leading-relaxed">
                    전통적으로 연도가 바뀌는 기준은 양력 1월 1일이 아닌, 동양 세시풍속 입춘(立春)이나 음력 설날을 기점으로 하므로, 1~2월생은 상황에 따라 이전 해의 띠를 따르게 될 수 있습니다.
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-xs sm:text-sm text-rose-300 font-bold">
                  <PartyPopper className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>익일 다음 생일까지 남은 기한: <strong className="font-num text-sm sm:text-base underline text-rose-200 font-black">{ageRes.daysToBirthday}일</strong> 남음</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Case 2: D-day anniversary */}
      {activeTab === 'dday' && (
        <div className="space-y-6">
          <div className="p-5 md:p-6 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 shadow-2xs">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-display block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">시작일 (기준일)</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="font-num w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-display block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">목표일 (D-Day)</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="font-num w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-display block text-xs sm:text-sm font-bold text-slate-700 mb-2">기준일로부터 며칠 뒤 날짜 계산 (예: 사귄 지 🤍00일)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={dayOffset}
                    onChange={(e) => setDayOffset(parseInt(e.target.value) || 0)}
                    className="font-num w-full bg-white border border-slate-300 rounded-xl py-3 px-4 text-base sm:text-lg font-extrabold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="font-display text-xs sm:text-sm text-slate-700 font-bold whitespace-nowrap">일 되는 날</span>
                </div>
              </div>
            </div>

            {/* Render Dday result */}
            {ddayRes && (
              <div className="bg-slate-900 text-white rounded-2xl p-5 md:p-6 flex flex-col justify-between shadow-xs">
                <div>
                  <span className="font-display text-xs bg-indigo-500 text-white rounded-lg px-2.5 py-1 font-extrabold">D-Day 핵심 간격보고</span>
                  <div className="my-5 text-center">
                    <p className="font-display text-xs text-slate-400">두 날짜 사이의 순수 간격</p>
                    <p className="font-num text-3xl sm:text-4xl font-black text-blue-300 mt-1 tracking-tight">
                      {ddayRes.diffDays === 0 ? '오늘 (D-Day)' : ddayRes.diffDays > 0 ? `D- ${ddayRes.diffDays}일` : `D+ ${Math.abs(ddayRes.diffDays)}일`}
                    </p>
                    <p className="font-num text-xs text-slate-400 mt-1">총 {Math.abs(ddayRes.diffDays).toLocaleString()}일 경과 상태</p>
                  </div>
                </div>

                <div className="bg-indigo-950/80 p-4 border border-indigo-900 rounded-2xl shadow-2xs">
                  <p className="font-heading text-xs text-indigo-300 font-bold">기념일 환산: 기준일 포함 {dayOffset}일째 날</p>
                  <p className="font-num text-lg sm:text-xl font-black text-white mt-1">
                    {ddayRes.offsetDate}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Case 3: Student School Entry & Graduation */}
      {activeTab === 'school' && (
        <div className="space-y-6">
          <div className="p-5 md:p-6 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 shadow-2xs">
            <div>
              <label className="font-display block text-xs sm:text-sm font-bold text-slate-700 mb-2">본인 출생년도 입력 (학제 역산)</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={schoolBirthYear}
                  onChange={(e) => setSchoolBirthYear(parseInt(e.target.value) || 0)}
                  className="font-num w-full bg-white border border-slate-300 rounded-xl py-3 px-4 text-base sm:text-lg font-extrabold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <span className="font-display text-xs sm:text-sm text-slate-700 font-bold whitespace-nowrap">년생</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {[1980, 1990, 1995, 2000, 2005, 2010].map((y) => (
                  <button
                    key={y}
                    onClick={() => setSchoolBirthYear(y)}
                    className="font-display bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300 text-xs py-1.5 px-3 rounded-lg font-bold transition-colors cursor-pointer shadow-2xs"
                  >
                    {y}년생
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-5 md:p-6 space-y-3.5 shadow-xs">
              <span className="font-display text-xs bg-emerald-500 text-white rounded-lg px-2.5 py-1 font-extrabold block w-fit">
                학력 입학/졸업 히스토리 (8세 초교 입학 기준)
              </span>
              
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="font-body text-slate-400">초등학교</span>
                  <span className="font-num text-slate-200 font-bold">{schoolRes.elementaryEntry}년 입학 ~ {schoolRes.elementaryGrad}년 졸업</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="font-body text-slate-400">중학교</span>
                  <span className="font-num text-slate-200 font-bold">{schoolRes.middleEntry}년 입학 ~ {schoolRes.middleGrad}년 졸업</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="font-body text-slate-400">고등학교</span>
                  <span className="font-num text-slate-200 font-bold">{schoolRes.highEntry}년 입학 ~ {schoolRes.highGrad}년 졸업</span>
                </div>
                <div className="flex justify-between text-indigo-300 pt-1">
                  <span className="font-heading font-extrabold">대학교 (학번 기준)</span>
                  <span className="font-num font-black text-white text-sm sm:text-base">{schoolRes.univEntry}년 입학 ({schoolRes.univEntry % 100}학번)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO Compliance Rich Text Information */}
      <div className="pt-8 border-t border-slate-200 mt-8 space-y-5 text-slate-700 leading-relaxed no-print">
        <h2 className="font-heading text-base sm:text-lg md:text-xl font-black text-slate-950 flex items-center mb-1">
          <BookOpen className="w-5 h-5 text-indigo-600 mr-2" />
          만 나이 통일법 및 띠 산출기준 학설 완벽 가이드
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-slate-50 p-5 rounded-2xl space-y-2.5 border border-slate-200 shadow-2xs">
            <h3 className="font-heading font-extrabold text-slate-900 text-sm sm:text-base">1. 개정된 소위 &apos;만 나이 통일법&apos; 총정리</h3>
            <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed">
              동양의 세는나이(태어나자마자 1세가 되고 해가 바뀌면 바로 나이를 먹는 방식) 문화를 타파하고, 법적 행정상의 연령 계산을 명문화하기 위해 대한민국은 2023년 정식적인 만나이를 전면화하였습니다. 
              이에 따라 출생 당시 0세로 시작해 매년 본인의 연도별 양력 생일이 지날 때마다 딱 1살씩 합산되도록 기준이 명확화되었습니다.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl space-y-2.5 border border-slate-200 shadow-2xs">
            <h3 className="font-heading font-extrabold text-slate-900 text-sm sm:text-base">2. 띠 계산에서 흔히 오인하는 기준점 요술</h3>
            <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed">
              많은 대중이 양력 또는 음력 1월 1일이 되면 띠가 바뀐다고 착각합니다. 하지만 정통 역학 및 사주 명리학 서적에 기술된 띠 체인징 포인트는 바로 24절기의 최초 시작인 <strong>입춘(立春, 보통 양력 2월 4일 전후)</strong>입니다. 
              입춘 이전인 대략 양력 1월이나 2월 초순에 출생한 아기들은 연도와 무관하게 전년도의 상징 띠 신수로 기재되어 해석하는 것이 철학적으로 정확합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
