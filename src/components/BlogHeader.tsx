import React, { useState, useEffect } from 'react';
import { Search, ChevronRight } from 'lucide-react';
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
  onSearch,
  searchQuery,
}: BlogHeaderProps) {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

  const navItems: { id: CategoryType; label: string; badge?: string }[] = [
    { id: 'all', label: '전체글' },
    { id: 'work', label: '직장·급여·퇴직' },
    { id: 'property', label: '부동산·세금' },
    { id: 'finance', label: '연금·금융·절세' },
    { id: 'calculators', label: '실무 계산기', badge: '8종' },
    { id: 'about', label: '블로그 소개' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      {/* Top Utility Bar - Classic Tistory / Naver Style */}
      <div className="border-b border-gray-100 bg-gray-50/70 text-xs text-gray-500 py-1.5 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-medium text-gray-600">2026년 최신 세법 및 고시 기준 검증 완료</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-gray-500">
            {/* Font Size Adjuster */}
            <div className="flex items-center gap-1">
              <span className="text-gray-400">글자크기:</span>
              <button
                type="button"
                onClick={() => handleFontSizeChange('normal')}
                className={`px-1.5 py-0.5 rounded text-[11px] transition-colors ${
                  fontSize === 'normal' ? 'bg-gray-200 font-bold text-gray-800' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                보통
              </button>
              <button
                type="button"
                onClick={() => handleFontSizeChange('large')}
                className={`px-1.5 py-0.5 rounded text-[11px] transition-colors ${
                  fontSize === 'large' ? 'bg-gray-200 font-bold text-gray-800' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                크게
              </button>
            </div>
            <span className="hidden sm:inline text-gray-300">|</span>
            <button
              type="button"
              onClick={() => onSelectCategory('about')}
              className="hover:text-gray-800 transition-colors hidden sm:inline"
            >
              운영자 프로필
            </button>
          </div>
        </div>
      </div>

      {/* Main Blog Title & Header Banner */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            onClick={() => onSelectCategory('all')}
            className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 cursor-pointer hover:text-blue-700 transition-colors font-heading inline-block"
          >
            박과장의 생활경제 노트
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-body">
            11년차 직장인의 급여 · 퇴직금 · 부동산 세금 · 연금 실전 기록
          </p>
        </div>

        {/* Quick Search Box (Tistory/Naver Style) */}
        <div className="relative w-full sm:w-64 md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="블로그 내 글 검색..."
            className="w-full bg-gray-50 text-gray-800 text-xs sm:text-sm pl-9 pr-8 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-500 focus:bg-white transition-colors"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => onSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs px-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Global Navigation Bar (GNB) - Clean Korean Blog Tabs */}
      <nav className="border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = currentCategory === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectCategory(item.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'border-gray-900 text-gray-950 font-bold'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-1.5 py-0.2 rounded border border-blue-200">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
