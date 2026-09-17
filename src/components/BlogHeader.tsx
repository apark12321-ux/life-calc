import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { CategoryType } from '../types';

interface BlogHeaderProps {
  currentCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  onSelectPost?: (postId: string) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export default function BlogHeader({
  currentCategory,
  onSelectCategory,
  onSearch,
  searchQuery,
}: BlogHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems: { id: CategoryType; label: string; badge?: string }[] = [
    { id: 'all', label: '홈' },
    { id: 'work', label: '직장·급여' },
    { id: 'property', label: '부동산·세금' },
    { id: 'finance', label: '연금·금융' },
    { id: 'calculators', label: '실무 계산기', badge: '8종' },
    { id: 'about', label: '소개' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#1078b9] text-white shadow-sm">
      {/* Main Header Bar - Deep Blue (#1078b9) Phong Nha Explorer Style */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-4">
          
          {/* Logo & Site Identity */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                onSelectCategory('all');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-lg bg-white/15 border border-white/25 flex items-center justify-center font-bold text-white text-base shadow-xs group-hover:bg-white/25 transition">
                Q&A
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold tracking-tight text-white block font-heading leading-tight group-hover:text-blue-100 transition">
                  박과장의 생활경제 Q&A
                </span>
                <span className="text-[11px] text-white/70 font-normal hidden sm:block">
                  급여 · 퇴직금 · 부동산 세금 · 연금 실무 지식 베이스
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center h-full">
            <ul className="flex items-center h-full">
              {navItems.map((item) => {
                const isActive = currentCategory === item.id;
                return (
                  <li key={item.id} className="h-full border-r border-[#005f8d]/60 last:border-r-0">
                    <button
                      type="button"
                      onClick={() => onSelectCategory(item.id)}
                      className={`h-full px-3.5 lg:px-4 text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-[#0a5888] text-white font-bold shadow-inner'
                          : 'text-white/90 hover:bg-[#0e69a3] hover:text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] bg-white/20 text-white font-bold px-1.5 py-0.2 rounded border border-white/30">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right Action: Search Bar & Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            {/* Desktop Search Input */}
            <div className="relative hidden sm:block w-48 lg:w-56">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="지식 검색..."
                className="w-full bg-white/15 text-white placeholder-white/60 text-xs pl-8 pr-7 py-1.5 rounded-md border border-white/30 focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-white/70 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Mobile Search Toggle Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="sm:hidden p-2 rounded text-white hover:bg-white/15 transition"
              aria-label="검색"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded text-white hover:bg-white/15 transition"
              aria-label="메뉴 열기"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Dropdown */}
        {isSearchOpen && (
          <div className="sm:hidden pb-3 pt-1">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="궁금한 실무 지식 검색..."
                autoFocus
                className="w-full bg-white text-gray-900 placeholder-gray-400 text-sm pl-9 pr-8 py-2 rounded-md focus:outline-none shadow-sm"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs px-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0b5f94] border-t border-[#005f8d] px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const isActive = currentCategory === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectCategory(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded text-sm font-medium transition flex items-center justify-between ${
                  isActive ? 'bg-[#07466e] text-white font-bold' : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[11px] bg-white/20 text-white font-semibold px-2 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}

