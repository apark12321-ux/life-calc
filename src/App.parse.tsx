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
  return 'insurance';
};

export default function App() {
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
  };
  return <div><Navigation currentCategory={currentCategory} onSelectCategory={setCurrentCategory} onNavigateToCalculator={go} /><UniversalCalculatorHub category={currentCategory} subCalculatorId={subCalculatorId} /></div>;
}
