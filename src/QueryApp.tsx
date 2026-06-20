import React, { useEffect, useState } from 'react';
import { CategoryType } from './types';
import Navigation from './components/Navigation';
import UniversalCalculatorHub, { calculatorCatalog } from './components/UniversalCalculatorHub';

const categoryFromId = (id: string): CategoryType => {
  const found = calculatorCatalog.find((item) => item.id === id);
  if (found) return found.category;
  if (id.startsWith('wage_')) return 'wage';
  if (id.startsWith('life_')) return 'life';
  if (id.startsWith('finance_')) return 'finance';
  if (id.startsWith('property_')) return 'property';
  if (id === 'wage' || id === 'life' || id === 'finance' || id === 'property' || id === 'policy') return id;
  return 'insurance';
};

export default function QueryApp() {
  const [currentCategory, setCurrentCategory] = useState<CategoryType>('insurance');
  const [subCalculatorId, setSubCalculatorId] = useState<string>('all');

  useEffect(() => {
    const calc = new URLSearchParams(window.location.search).get('calc');
    if (!calc) return;
    setCurrentCategory(categoryFromId(calc));
    setSubCalculatorId(calc.includes('_') ? calc : 'all');
  }, []);

  const go = (id: string) => {
    setCurrentCategory(categoryFromId(id));
    setSubCalculatorId(id.includes('_') ? id : 'all');
    const url = new URL(window.location.href);
    url.searchParams.set('calc', id);
    window.history.replaceState(null, '', url.toString());
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navigation currentCategory={currentCategory} onSelectCategory={go} onNavigateToCalculator={go} />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <UniversalCalculatorHub category={currentCategory} subCalculatorId={subCalculatorId} />
      </main>
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-white font-bold text-sm tracking-tight">생활계산기 천국</p>
          <p>계산기 100종 모음</p>
        </div>
      </footer>
    </div>
  );
}
