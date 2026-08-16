import React, { useState, useEffect } from 'react';
import { Search, Compass, Calculator, Menu, Shield, AlignJustify, HelpCircle, BookOpen, Type } from 'lucide-react';
import { CategoryType } from '../types';

interface NavigationProps {
  currentCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  onNavigateToCalculator: (subId: string) => void;
}

export default function Navigation({ currentCategory, onSelectCategory, onNavigateToCalculator }: NavigationProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  // Load saved font size on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('life_calc_font_size') as 'normal' | 'large' | 'xlarge' | null;
      if (saved && (saved === 'normal' || saved === 'large' || saved === 'xlarge')) {
        setFontSize(saved);
        document.documentElement.setAttribute('data-font-size', saved);
      } else {
        document.documentElement.setAttribute('data-font-size', 'normal');
      }
    } catch (e) {
      console.warn('Failed to load font size:', e);
    }
  }, []);

  const handleFontSizeChange = (size: 'normal' | 'large' | 'xlarge') => {
    setFontSize(size);
    document.documentElement.setAttribute('data-font-size', size);
    try {
      localStorage.setItem('life_calc_font_size', size);
    } catch (e) {
      console.warn('Failed to save font size:', e);
    }
  };

  // All searchable sub-calc options
  const searchIndex = [
    { id: 'insurance', category: 'insurance' as CategoryType, keywords: ['4대보험', '국민연금', '건강보험', '고용보험', '산재보험', '보수월액', '회사부담금'] },
    { id: 'wage_hourly', category: 'wage' as CategoryType, keywords: ['최저임금', '최저시급', '주휴수당', '시급환산', '주급', '만근', '알바', '아르바이트'] },
    { id: 'wage_salary', category: 'wage' as CategoryType, keywords: ['연봉', '실수령액', '소득세', '공제', '월급', '세전', '세후', '넷', 'NET'] },
    { id: 'wage_retirement', category: 'wage' as CategoryType, keywords: ['퇴직금', '퇴사', '근무년수', '평균임금', '재직일수'] },
    { id: 'wage_unemployment', category: 'wage' as CategoryType, keywords: ['실업급여', '구직급여', '고용노동부', '이직확인서', '권고사직'] },
    { id: 'life_age', category: 'life' as CategoryType, keywords: ['만나이', '나이', '띠', '입춘', '생일', '세는나이', '연나이'] },
    { id: 'life_dday', category: 'life' as CategoryType, keywords: ['디데이', '기념일', '100일', '날짜', '간격', '음력', 'D-day'] },
    { id: 'life_school', category: 'life' as CategoryType, keywords: ['학번', '초등학교', '중학교', '고등학교', '대학교', '졸업연도', '입학'] },
    { id: 'finance_savings', category: 'finance' as CategoryType, keywords: ['적금', '예금', '이자', '복리', '단리', '일반과세', '비과세', '수령액'] },
    { id: 'finance_loan', category: 'finance' as CategoryType, keywords: ['대출', '원리금균등', '원금균등', '만기일시', '이자계산', '상환'] },
    { id: 'property_size', category: 'property' as CategoryType, keywords: ['평수', '제곱미터', 'm2', '평', '면적', '변환', '국민평형'] },
    { id: 'property_agent', category: 'property' as CategoryType, keywords: ['중개수수료', '복비', '부동산', '매매', '임대차', '전세', '월세'] },
    { id: 'property_tax', category: 'property' as CategoryType, keywords: ['취득세', '지방세', '취득세율', '생애첫주택', '교육세'] },
    { id: 'magazine', category: 'magazine' as CategoryType, keywords: ['포스팅', '칼럼', '매거진', '블로그', '자동발행', '가이드', '게시글', '지식'] }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    const query = searchQuery.toLowerCase().trim();
    const found = searchIndex.find(item => 
      item.keywords.some(k => k.includes(query) || query.includes(k))
    );
    if (found) {
      onNavigateToCalculator(found.id);
      setSearchQuery('');
      setShowSearchSuggestions(false);
    }
  };

  const getFilteredSuggestions = () => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase().trim();
    return searchIndex.filter(item => 
      item.keywords.some(k => k.includes(query))
    ).slice(0, 5);
  };

  const suggestions = getFilteredSuggestions();

  return (
    <header className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-40">
      {/* Upper Main Hub Rail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18 gap-3">
          
          {/* Brand Logo & Title with Heading Typography */}
          <div className="flex items-center space-x-2.5 cursor-pointer select-none shrink-0" onClick={() => onSelectCategory('insurance')}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-black text-base shadow-sm">
              C
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                  생활계산기 <span className="text-blue-600">천국</span>
                </span>
                <span className="font-display bg-blue-50 text-blue-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-blue-200 hidden sm:inline-block shadow-2xs">
                  2026 최신개정
                </span>
              </div>
              <span className="font-body text-[11px] sm:text-xs text-slate-500 hidden md:block">
                대한민국 1등 법정 요율 & 생활 모의 연산 포털
              </span>
            </div>
          </div>

          {/* Right Area: Font Size Controller + Search Bar */}
          <div className="flex items-center space-x-3">
            
            {/* Font Size Readability Controls (폰트 크기 확대/가독성 선택기) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="hidden xl:flex items-center gap-1 px-2 text-slate-500 font-display text-xs font-bold">
                <Type className="w-3.5 h-3.5 text-blue-600" />
                <span>글자크기</span>
              </div>
              <button
                type="button"
                onClick={() => handleFontSizeChange('normal')}
                title="기본 글자 크기 (100%)"
                className={`px-2.5 py-1 text-xs font-display font-extrabold rounded-lg transition cursor-pointer ${
                  fontSize === 'normal'
                    ? 'bg-white text-blue-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                보통
              </button>
              <button
                type="button"
                onClick={() => handleFontSizeChange('large')}
                title="크게 확대 (110%) - 시인성 강화"
                className={`px-2.5 py-1 text-xs font-display font-extrabold rounded-lg transition cursor-pointer ${
                  fontSize === 'large'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                크게 A+
              </button>
              <button
                type="button"
                onClick={() => handleFontSizeChange('xlarge')}
                title="아주 크게 확대 (120%) - 어르신/고령자 가독성 모드"
                className={`px-2.5 py-1 text-xs font-display font-extrabold rounded-lg transition cursor-pointer ${
                  fontSize === 'xlarge'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                아주크게 A++
              </button>
            </div>

            {/* Interactive Search Field */}
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-64 lg:w-72">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setShowSearchSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="계산기 검색 (예: 주휴수당, 평수)"
                  className="font-body w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-xl py-2 pl-9 pr-4 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium border border-slate-200 shadow-2xs"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              {/* Suggestions Overlay Popover */}
              {showSearchSuggestions && suggestions.length > 0 && (
                <div className="absolute top-12 left-0 right-0 bg-white text-slate-800 rounded-xl shadow-xl z-50 border border-slate-200 py-2 font-body text-xs sm:text-sm animate-fade-in">
                  <p className="font-display text-xs text-slate-400 px-3.5 py-1 font-bold uppercase tracking-wider">추천 계산기 바로가기</p>
                  {suggestions.map((item) => {
                    const label = searchIndex.find(s => s.id === item.id)?.keywords[0] || '';
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onMouseDown={() => {
                          onNavigateToCalculator(item.id);
                          setSearchQuery('');
                          setShowSearchSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50/60 transition-colors font-medium flex justify-between items-center cursor-pointer"
                      >
                        <span className="text-slate-800 font-semibold">🔍 {label}</span>
                        <span className="font-display text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">계산하기</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Primary Category Selector Header with Display Typography & Enlarged Click Target */}
      <div className="bg-slate-50 border-t border-slate-200/80 overflow-x-auto whitespace-nowrap scrollbar-none flex">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between w-full">
          <div className="flex space-x-1 sm:space-x-3">
            {[
              { id: 'insurance', label: '🛡️ 4대사회보험', sub: '국민·건강·고용·산재' },
              { id: 'wage', label: '⏱ 급여 & 퇴직금', sub: '주휴·실수령·실업' },
              { id: 'life', label: '🎂 생활 & 달력', sub: '만나이·D-Day' },
              { id: 'finance', label: '💰 금융 & 예적금', sub: '이자·대출상환' },
              { id: 'property', label: '🏠 부동산 & 세금', sub: '평수·복비·취득세' },
              { id: 'magazine', label: '📢 자동발행 칼럼', sub: '1일1포스팅' },
              { id: 'policy', label: 'ℹ️ 안내 & 약관', sub: '개인정보·소개' }
            ].map((cat) => {
              const isActive = currentCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id as CategoryType)}
                  className={`font-display py-3.5 px-3.5 md:px-5 text-sm md:text-base font-bold border-b-2 transition-all inline-flex items-center space-x-1.5 cursor-pointer ${
                    isActive
                      ? 'border-blue-600 text-blue-600 bg-white font-black shadow-2xs'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 hover:border-slate-300'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('aeo-knowledge-hub');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="font-display hidden lg:inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 text-indigo-700 font-extrabold text-xs md:text-sm rounded-xl border border-indigo-200 transition my-auto cursor-pointer shadow-2xs"
          >
            <span>✨ 2026 AI 지식 가이드 (AEO)</span>
          </button>
        </div>
      </div>
    </header>
  );
}
