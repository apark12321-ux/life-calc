import React, { useState, useEffect } from 'react';
import { Search, Type, BookOpen, Calculator, User, Sparkles, HelpCircle, Shield } from 'lucide-react';
import { CategoryType } from '../types';

interface BlogHeaderProps {
  currentCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  onSelectPost?: (postId: string) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  onOpenAutoPoster?: () => void;
}

export default function BlogHeader({
  currentCategory,
  onSelectCategory,
  onSelectPost,
  onSearch,
  searchQuery,
}: BlogHeaderProps) {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('blog_font_size') as 'normal' | 'large' | 'xlarge' | null;
      if (saved && ['normal', 'large', 'xlarge'].includes(saved)) {
        setFontSize(saved);
        document.documentElement.setAttribute('data-font-size', saved);
      }
    } catch (e) {
      console.warn('Font size load failed:', e);
    }
  }, []);

  const handleFontSizeChange = (size: 'normal' | 'large' | 'xlarge') => {
    setFontSize(size);
    document.documentElement.setAttribute('data-font-size', size);
    try {
      localStorage.setItem('blog_font_size', size);
    } catch (e) {
      console.warn('Font size save failed:', e);
    }
  };

  const navItems: { id: CategoryType; label: string; icon?: string }[] = [
    { id: 'all', label: '전체 글' },
    { id: 'work', label: '직장·급여·퇴직', icon: '■' },
    { id: 'property', label: '부동산·세금', icon: '◆' },
    { id: 'finance', label: '연금·금융·절세', icon: '●' },
    { id: 'calculators', label: '금융 계산기', icon: '▶' },
    { id: 'about', label: '블로그 소개', icon: '※' }
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner Branding Rail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Blog Identity */}
          <div 
            onClick={() => onSelectCategory('all')}
            className="flex items-center space-x-3 cursor-pointer select-none shrink-0 group"
          >
            <div className="w-11 h-11 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm group-hover:bg-indigo-600 transition-colors">
              <BookOpen className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-heading text-xl sm:text-2xl font-black tracking-tight text-slate-950">
                  박과장의 <span className="text-indigo-600">생활경제 노트</span>
                </span>
                <span className="hidden sm:inline-block bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
                  직장인 생활경제 가이드
                </span>
              </div>
              <p className="font-body text-xs text-slate-500 hidden md:block">
                11년차 직장인이 정리하는 급여·부동산·연금 실전 정보
              </p>
            </div>
          </div>

          {/* Right Controls: Font Size & Search */}
          <div className="flex items-center space-x-2.5">
            {/* Font Size Accessibility */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <span className="hidden xl:inline-block px-2 text-slate-500 font-bold text-[11px]">
                글자크기
              </span>
              <button
                type="button"
                onClick={() => handleFontSizeChange('normal')}
                className={`px-2.5 py-1 font-bold rounded-lg transition ${
                  fontSize === 'normal'
                    ? 'bg-white text-indigo-600 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                보통
              </button>
              <button
                type="button"
                onClick={() => handleFontSizeChange('large')}
                className={`px-2.5 py-1 font-bold rounded-lg transition ${
                  fontSize === 'large'
                    ? 'bg-indigo-600 text-white shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                크게
              </button>
            </div>

            {/* Quick Search */}
            <div className="relative w-40 sm:w-52 md:w-60">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="검색 (예: 퇴직금, 복비, 건보료)"
                className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-xl py-2 pl-9 pr-3 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white border border-slate-200 font-medium transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearch('')}
                  className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-full w-4 h-4 flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-slate-50/90 border-t border-slate-200 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-1.5 overflow-x-auto py-2.5 scrollbar-none text-xs sm:text-sm font-semibold">
            {navItems.map((item) => {
              const isActive = currentCategory === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectCategory(item.id)}
                  className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all duration-150 flex items-center space-x-1.5 cursor-pointer font-heading ${
                    isActive
                      ? 'bg-slate-950 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/70 font-medium'
                  }`}
                >
                  {item.icon && <span>{item.icon}</span>}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
