import React, { useState } from 'react';
import { CategoryType } from './types';
import Navigation from './components/Navigation';
import InsuranceCalculator from './components/InsuranceCalculator';
import WageCalculator from './components/WageCalculator';
import LifeCalculator from './components/LifeCalculator';
import FinanceCalculator from './components/FinanceCalculator';
import PropertyCalculator from './components/PropertyCalculator';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import AboutApp from './components/AboutApp';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentCategory, setCurrentCategory] = useState<CategoryType>('insurance');
  const [subCalculatorId, setSubCalculatorId] = useState<string>('all');

  const handleNavigateToCalculator = (id: string) => {
    if (id.startsWith('wage_')) {
      setCurrentCategory('wage');
      setSubCalculatorId(id);
      return;
    }
    if (id.startsWith('life_')) {
      setCurrentCategory('life');
      setSubCalculatorId(id);
      return;
    }
    if (id.startsWith('finance_')) {
      setCurrentCategory('finance');
      setSubCalculatorId(id);
      return;
    }
    if (id.startsWith('property_')) {
      setCurrentCategory('property');
      setSubCalculatorId(id);
      return;
    }
    if (['insurance', 'wage', 'life', 'finance', 'property', 'policy'].includes(id)) {
      setCurrentCategory(id as CategoryType);
      setSubCalculatorId('all');
    }
  };

  const handleSelectCategory = (cat: CategoryType) => {
    setCurrentCategory(cat);
    setSubCalculatorId('all');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navigation
        currentCategory={currentCategory}
        onSelectCategory={handleSelectCategory}
        onNavigateToCalculator={handleNavigateToCalculator}
      />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span>스마트 계산 허브</span>
            <span>➔</span>
            <span className="font-semibold text-blue-600">{currentCategory}</span>
            {subCalculatorId !== 'all' && (
              <>
                <span>➔</span>
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase">
                  {subCalculatorId}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-blue-600 font-semibold bg-blue-50/70 border border-blue-100 py-1 px-2.5 rounded-lg w-fit">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span>입력값 기준 계산</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          <div className="lg:col-span-3 space-y-6">
            {currentCategory === 'insurance' && <InsuranceCalculator />}
            {currentCategory === 'wage' && <WageCalculator />}
            {currentCategory === 'life' && <LifeCalculator />}
            {currentCategory === 'finance' && <FinanceCalculator />}
            {currentCategory === 'property' && <PropertyCalculator />}
            {currentCategory === 'policy' && (
              <div className="space-y-6">
                <AboutApp onNavigateToCalculator={handleNavigateToCalculator} />
                <PrivacyPolicy />
                <TermsOfService />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 space-y-3 text-xs text-slate-600">
              <p className="font-extrabold text-slate-850 border-b pb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                계산 기준 안내
              </p>
              <p className="text-[11px] leading-relaxed">
                이 화면은 사용자가 입력한 값과 서비스 내부 기준값만 사용합니다. 외부 시세성 정보는 표시하지 않습니다.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-white font-bold text-sm tracking-tight">생활계산기 천국</p>
          <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
            <button onClick={() => handleNavigateToCalculator('policy')} className="hover:text-amber-400 transition">개인정보처리방침</button>
            <button onClick={() => handleNavigateToCalculator('policy')} className="hover:text-amber-400 transition">서비스 이용약관</button>
            <button onClick={() => handleNavigateToCalculator('policy')} className="hover:text-amber-400 transition">사이트 소개</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
