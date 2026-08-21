import React, { useState, useEffect } from 'react';
import { List, ChevronDown, ChevronUp, ArrowUp, Compass, BookOpen, Check } from 'lucide-react';

export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
  index: number;
}

export function extractTocHeadings(content: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const lines = content.split('\n');
  let h2Count = 0;
  let h3Count = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) {
      const text = trimmed.replace(/^##\s+/, '').trim();
      headings.push({
        id: `toc-heading-h2-${h2Count}`,
        text,
        level: 2,
        index: headings.length
      });
      h2Count++;
    } else if (trimmed.startsWith('### ')) {
      const text = trimmed.replace(/^###\s+/, '').trim();
      headings.push({
        id: `toc-heading-h3-${h3Count}`,
        text,
        level: 3,
        index: headings.length
      });
      h3Count++;
    }
  }

  return headings;
}

interface TableOfContentsProps {
  content: string;
  variant?: 'sidebar' | 'inline' | 'floating';
  className?: string;
  title?: string;
}

export default function TableOfContents({
  content,
  variant = 'sidebar',
  className = '',
  title = '글 목차 (Contents)'
}: TableOfContentsProps) {
  const headings = extractTocHeadings(content);
  const [activeId, setActiveId] = useState<string>(headings[0]?.id || '');
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  // Scroll spy & reading progress tracker
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      // 1. Calculate reading progress percentage
      const totalScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (totalScroll > 0) {
        const currentProgress = Math.min(100, Math.max(0, Math.round((window.scrollY / totalScroll) * 100)));
        setReadingProgress(currentProgress);
      }

      // 2. Identify active heading
      const scrollPosition = window.scrollY + 120; // 120px offset for top header
      let currentActiveId = headings[0]?.id;

      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element) {
          const top = element.getBoundingClientRect().top + window.pageYOffset;
          if (scrollPosition >= top) {
            currentActiveId = heading.id;
          }
        }
      }

      if (currentActiveId) {
        setActiveId(currentActiveId);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [content, headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const yOffset = -90; // Header height buffer
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
    setActiveId(id);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (headings.length === 0) {
    return null;
  }

  // 1. Inline Mobile / Top Summary Variant
  if (variant === 'inline') {
    return (
      <div className={`bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 no-print transition-all ${className}`}>
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-xs border border-indigo-100">
              <List className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-heading text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                {title}
                <span className="text-[11px] font-normal text-indigo-600 bg-indigo-50 px-2 py-0.2 rounded-full border border-indigo-100">
                  {headings.length}개 항목
                </span>
              </span>
            </div>
          </div>
          <button 
            type="button" 
            className="text-slate-400 hover:text-slate-600 text-xs flex items-center gap-1 font-medium"
          >
            <span>{isOpen ? '접기' : '펼치기'}</span>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {isOpen && (
          <div className="mt-3.5 pt-3 border-t border-slate-200/60 space-y-1.5">
            {headings.map((heading) => {
              const isActive = activeId === heading.id;
              return (
                <button
                  key={heading.id}
                  type="button"
                  onClick={() => scrollToHeading(heading.id)}
                  className={`w-full text-left flex items-start gap-2 py-1.5 px-2.5 rounded-xl transition cursor-pointer text-xs leading-snug ${
                    heading.level === 3 ? 'ml-3 pl-3 border-l-2 border-slate-200' : ''
                  } ${
                    isActive
                      ? 'bg-indigo-100/70 text-indigo-900 font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
                  }`}
                >
                  <span className={`text-[10px] mt-0.5 shrink-0 ${isActive ? 'text-indigo-600 font-black' : 'text-slate-400'}`}>
                    {heading.level === 2 ? '▪' : '▫'}
                  </span>
                  <span className="line-clamp-1">{heading.text}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // 2. Default Right Sidebar Sticky Variant
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden sticky top-20 z-10 transition-all ${className}`}>
      {/* Header with Reading Progress */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs shadow-xs">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-heading text-xs sm:text-sm font-black text-slate-900">
                {title}
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">총 {headings.length}개 주요 섹션</p>
            </div>
          </div>
          
          <span className="text-[11px] font-num font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
            {readingProgress}% 진행
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-600 h-full transition-all duration-200 rounded-full"
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      </div>

      {/* Headings List */}
      <div className="p-3 max-h-[calc(100vh-280px)] overflow-y-auto space-y-1 scrollbar-thin">
        {headings.map((heading, idx) => {
          const isActive = activeId === heading.id;
          return (
            <button
              key={heading.id}
              type="button"
              onClick={() => scrollToHeading(heading.id)}
              className={`w-full text-left flex items-start gap-2 py-1.5 px-2.5 rounded-xl transition cursor-pointer text-xs leading-snug group ${
                heading.level === 3 
                  ? 'ml-2.5 pl-2.5 border-l border-slate-200 text-slate-500 hover:text-slate-900' 
                  : 'text-slate-700 hover:text-indigo-900 font-medium'
              } ${
                isActive
                  ? 'bg-indigo-50 text-indigo-900 font-bold border-l-2 border-indigo-600 shadow-2xs'
                  : 'hover:bg-slate-50'
              }`}
            >
              <span className={`text-[10px] mt-0.5 shrink-0 transition-colors ${
                isActive ? 'text-indigo-600 font-black' : 'text-slate-300 group-hover:text-indigo-500'
              }`}>
                {heading.level === 2 ? `${idx + 1}.` : '•'}
              </span>
              <span className="line-clamp-2">{heading.text}</span>
            </button>
          );
        })}
      </div>

      {/* Footer Navigation Bar */}
      <div className="p-2.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="text-[10px] text-slate-400 font-medium">클릭 시 해당 위치로 즉시 이동</span>
        <button
          type="button"
          onClick={scrollToTop}
          className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 p-1 rounded-lg hover:bg-indigo-50 transition cursor-pointer"
        >
          <ArrowUp className="w-3 h-3" />
          <span>맨 위로</span>
        </button>
      </div>
    </div>
  );
}
