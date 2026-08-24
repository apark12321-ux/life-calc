import React, { useState, useEffect } from 'react';
import { Search, Type, BookOpen, Calculator, User, Sparkles, HelpCircle, Shield, Bot } from 'lucide-react';
import { CategoryType, PostCategory } from '../types';
import { CATEGORY_META } from '../data/postsData';

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
  onOpenAutoPoster
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
    { id: 'all', label: '전체 칼럼' },
    { id: 'insurance', label: '4대사회보험', icon: '🛡️' },
    { id: 'wage', label: '급여·노무', icon: '⏱' },
    { id: 'finance', label: '금융·재테크', icon: '💰' },
    { id: 'property', label: '부동산·세금', icon: '🏠' },
    { id: 'life', label: '생활·행정', icon: '🎂' },
    { id: 'calculators', label: '실생활 계산기', icon: '🧮' },
    { id: 'about', label: '서비스 소개', icon: 'ℹ️' }
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
              <BookOpen className="w-5 h-5 text-indigo-400 group-hover:text-white transition-colors" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-heading text-xl sm:text-2xl font-black tracking-tight text-slate-950">
                  생활금융 <span className="text-indigo-600">실전 가이드</span>
                </span>
                <span className="hidden sm:inline-block bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
                  2026 최신 법령 기준
                </span>
              </div>
              <p className="font-body text-xs text-slate-500 hidden md:block">
                4대사회보험·급여·퇴직금·부동산 세무 및 실생활 모의 계산기
              </p>
            </div>
          </div>

          {/* Right Controls: Auto-Poster, Font Size & Search */}
          <div className="flex items-center space-x-2.5">
            {/* Auto Poster Button */}
            {onOpenAutoPoster && (
              <button
                type="button"
                onClick={onOpenAutoPoster}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 text-indigo-700 rounded-xl border border-indigo-200/80 text-xs font-bold transition shadow-2xs cursor-pointer group"
                title="매일 카테고리별 1회 4시간 텀 자동 포스팅 시스템 현황"
              >
                <Bot className="w-4 h-4 text-indigo-600 group-hover:rotate-12 transition-transform" />
                <span className="hidden lg:inline">자동 포스팅 엔진</span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </button>
            )}

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
                placeholder="칼럼 검색 (예: 4대보험, 퇴직금)"
                className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-xl py-2 pl-9 pr-3 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white border border-slate-200 font-medium transition-all"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Menu Bar */}
      <div className="bg-slate-50/80 border-t border-slate-200/80 overflow-x-auto whitespace-nowrap scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <nav className="flex space-x-1 sm:space-x-2 py-1.5">
            {navItems.map((item) => {
              const isActive = currentCategory === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectCategory(item.id)}
                  className={`font-display py-2 px-3.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : item.id === 'calculators'
                      ? 'text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
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
