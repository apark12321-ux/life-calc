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
    </div>
  );
}
