import React, { useState } from 'react';
import { CategoryType } from './types';
import Navigation from './components/Navigation';
import UniversalCalculatorHub from './components/UniversalCalculatorHub';

export default function App() {
  const [currentCategory, setCurrentCategory] = useState<CategoryType>('insurance');
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navigation currentCategory={currentCategory} onSelectCategory={setCurrentCategory} onNavigateToCalculator={() => undefined} />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <UniversalCalculatorHub category={currentCategory} />
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
