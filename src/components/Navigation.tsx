import React from 'react';
import { CategoryType } from '../types';

interface NavigationProps {
  currentCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  onOpenPage: (page: 'about' | 'contact' | 'privacy' | 'terms') => void;
}

const categories: Array<{ id: Exclude<CategoryType, 'policy'>; label: string }> = [
  { id: 'insurance', label: '4대보험' },
  { id: 'wage', label: '급여·퇴직금' },
  { id: 'life', label: '생활·달력' },
  { id: 'finance', label: '금융·대출' },
  { id: 'property', label: '부동산·세금' },
  { id: 'health', label: '건강·운동' },
  { id: 'auto', label: '자동차·교통' },
  { id: 'education', label: '교육·학습' },
  { id: 'business', label: '사업·마케팅' },
  { id: 'shopping', label: '쇼핑·소비' },
  { id: 'unit', label: '단위변환' },
  { id: 'travel', label: '여행·해외' },
];

export default function Navigation({ currentCategory, onSelectCategory, onOpenPage }: NavigationProps) {
  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 h-14 sm:h-16">
          <button type="button" className="flex items-center gap-2 min-w-0" onClick={() => onSelectCategory('insurance')}>
            <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-xs shrink-0">C</span>
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 truncate">생활계산기 <span className="text-blue-600">천국</span></span>
          </button>
          <div className="hidden sm:flex items-center gap-3 text-xs font-bold text-slate-500">
            <button type="button" onClick={() => onOpenPage('about')} className="hover:text-slate-900 transition">소개</button>
            <button type="button" onClick={() => onOpenPage('contact')} className="hover:text-slate-900 transition">문의</button>
            <button type="button" onClick={() => onOpenPage('privacy')} className="hover:text-slate-900 transition">개인정보</button>
          </div>
        </div>
      </div>
      <div className="bg-slate-50 border-t border-slate-100 overflow-x-auto whitespace-nowrap scrollbar-none">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 flex gap-1 sm:gap-2 min-w-max">
          {categories.map((cat) => {
            const isActive = currentCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`min-h-11 px-3 sm:px-4 text-[12px] sm:text-sm font-bold border-b-2 transition-all inline-flex items-center ${isActive ? 'border-blue-600 text-blue-600 bg-white font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'}`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
