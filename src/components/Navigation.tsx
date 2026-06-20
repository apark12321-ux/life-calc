import React, { useState } from 'react';
import { Search, Compass, Calculator, Menu, Shield, AlignJustify, HelpCircle, BookOpen } from 'lucide-react';
import { CategoryType } from '../types';

interface NavigationProps {
  currentCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  onNavigateToCalculator: (subId: string) => void;
}

export default function Navigation({ currentCategory, onSelectCategory, onNavigateToCalculator }: NavigationProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

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
    { id: 'property_tax', category: 'property' as CategoryType, keywords: ['취득세', '지방세', '취득세율', '생애첫주택', '교육세'] }
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
    <nav className="bg-white border-b border-slate-200 shadow-xs">
      {/* Upper Main Hub Rail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onSelectCategory('insurance')}>
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-black text-sm shadow-xs">
              C
            </div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              생활계산기 <span className="text-blue-600">천국</span>
            </span>
            <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100 ml-1.5 hidden sm:inline-block">
              최신 2026 규격
            </span>
          </div>

          {/* Interactive Search Field */}
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-72">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowSearchSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="원하시는 계산기 종류 검색 (예: 주휴수당)"
                className="w-full bg-slate-50 text-slate-805 placeholder-slate-400 text-xs rounded-full py-2 pl-9 pr-4 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium border border-slate-200"
              />
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Suggestions Overlay Popover */}
            {showSearchSuggestions && suggestions.length > 0 && (
              <div className="absolute top-11 left-0 right-0 bg-white text-slate-800 rounded-lg shadow-xl z-50 border border-slate-200 py-1.5 text-xs font-sans">
                <p className="text-[10px] text-slate-400 px-3 py-1 font-semibold uppercase tracking-wider">추천 검색결과</p>
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
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors font-medium flex justify-between items-center"
                    >
                      <span className="text-slate-800">🔍 {label}</span>
                      <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">바로가기</span>
                    </button>
                  );
                })}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Primary Category Selector Header */}
      <div className="bg-slate-50 border-t border-slate-100 overflow-x-auto whitespace-nowrap scrollbar-none flex">
        <div className="max-w-7xl mx-auto px-4 flex space-x-1 sm:space-x-4">
          {[
            { id: 'insurance', label: '🛡️ 4대보험', icon: Calculator },
            { id: 'wage', label: '⏱ 급여 & 퇴직금', icon: Compass },
            { id: 'life', label: '🎂 생활 & 달력', icon: Compass },
            { id: 'finance', label: '💰 금융 & 예적금', icon: Calculator },
            { id: 'property', label: '🏠 부동산 & 세금', icon: Calculator },
            { id: 'policy', label: 'ℹ️ 안내 & 약관', icon: Shield }
          ].map((cat) => {
            const isActive = currentCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id as CategoryType)}
                className={`py-3.5 px-3 md:px-5 text-sm font-bold border-b-2 transition-all transition-colors inline-flex items-center space-x-1.5 ${isActive ? 'border-blue-600 text-blue-600 bg-white font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-350'}`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
