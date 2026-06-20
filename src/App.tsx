import React, { useState } from 'react';
import { CategoryType } from './types';
import Navigation from './components/Navigation';
import UniversalCalculatorHub from './components/UniversalCalculatorHub';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import AboutApp from './components/AboutApp';

const categoryPrefixes: Array<[string, CategoryType]> = [
  ['wage_', 'wage'],
  ['life_', 'life'],
  ['finance_', 'finance'],
  ['property_', 'property'],
  ['health_', 'health'],
  ['auto_', 'auto'],
  ['education_', 'education'],
  ['business_', 'business'],
  ['shopping_', 'shopping'],
  ['unit_', 'unit'],
  ['travel_', 'travel']
];

export default function App() {
  const [currentCategory, setCurrentCategory] = useState<CategoryType>('insurance');

  const handleSelectCategory = (cat: CategoryType) => {
    setCurrentCategory(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToCalculator = (id: string) => {
    const match = categoryPrefixes.find(([prefix]) => id.startsWith(prefix));
    setCurrentCategory(match ? match[1] : id === 'policy' ? 'policy' : 'insurance');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navigation currentCategory={currentCategory} onSelectCategory={handleSelectCategory} onNavigateToCalculator={handleNavigateToCalculator} />
      <main className="flex-grow max-w-7xl w-full mx-auto px-0 sm:px-6 lg:px-8 py-0 sm:py-6">
        {currentCategory === 'policy' ? (
          <div className="space-y-6 px-3 py-4 sm:px-0 sm:py-0">
            <AboutApp onNavigateToCalculator={handleNavigateToCalculator} />
            <PrivacyPolicy />
            <TermsOfService />
          </div>
        ) : (
          <UniversalCalculatorHub category={currentCategory} />
        )}
      </main>
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-8 sm:mt-12 font-sans">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-white font-bold text-sm tracking-tight">생활계산기 천국</p>
            <p className="text-[10px] text-slate-500 mt-1">모바일에서도 계산기 선택, 입력, 결과 확인이 편하도록 다시 정리했습니다.</p>
          </div>
          <button onClick={() => handleSelectCategory('policy')} className="text-slate-300 hover:text-white font-bold transition">이용안내 · 개인정보처리방침</button>
        </div>
      </footer>
    </div>
  );
}
