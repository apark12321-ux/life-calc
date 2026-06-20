import React from 'react';
import { CategoryType } from '../types';

interface NavigationProps {
  currentCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  onNavigateToCalculator: (subId: string) => void;
}

const categories: Array<{ id: CategoryType; label: string }> = [
  { id: 'insurance', label: '4대보험' },
  { id: 'wage', label: '급여·퇴직금' },
  { id: 'life', label: '생활·달력' },
  { id: 'finance', label: '금융·예적금' },
  { id: 'property', label: '부동산·세금' },
  { id: 'health', label: '건강·운동' },
  { id: 'auto', label: '자동차·교통' },
  { id: 'education', label: '교육·학습' },
  { id: 'business', label: '사업·마케팅' },
  { id: 'shopping', label: '쇼핑·소비' },
  { id: 'unit', label: '단위변환' },
  { id: 'travel', label: '여행·해외' },
  { id: 'policy', label: '안내·약관' }
];

export default function Navigation({ currentCategory, onSelectCategory }: NavigationProps) {
  return (
    <nav className="bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onSelectCategory('insurance')}>
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-black text-sm shadow-xs">C</div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">생활계산기 <span className="text-blue-600">천국</span></span>
          </div>
        </div>
      </div>
      <div className="bg-slate-50 border-t border-slate-100 overflow-x-auto whitespace-nowrap scrollbar-none flex">
        <div className="max-w-7xl mx-auto px-4 flex space-x-1 sm:space-x-3">
          {categories.map((cat) => {
            const isActive = currentCategory === cat.id;
            return (
              <button key={cat.id} onClick={() => onSelectCategory(cat.id)} className={`py-3.5 px-3 md:px-4 text-sm font-bold border-b-2 transition-all inline-flex items-center space-x-1.5 ${isActive ? 'border-blue-600 text-blue-600 bg-white font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'}`}>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
