import React, { useState } from 'react';
import { PostItem, CategoryType } from '../types';
import { ALL_BLOG_POSTS } from '../data/postsData';
import { ChevronRight, Folder, Calculator, User, Bell, Tag, Check, Share2, HelpCircle } from 'lucide-react';
import TableOfContents from './TableOfContents';
import AdSenseMock from './AdSenseMock';

interface BlogSidebarProps {
  onSelectPost: (post: PostItem) => void;
  onSelectCategory: (cat: CategoryType) => void;
  onNavigateToCalculator: (calcId: string) => void;
  activePost?: PostItem | null;
  posts?: PostItem[];
  onOpenAutoPoster?: () => void;
}

export default function BlogSidebar({
  onSelectPost,
  onSelectCategory,
  onNavigateToCalculator,
  activePost = null,
  posts = ALL_BLOG_POSTS,
}: BlogSidebarProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  // 5 most recent posts
  const recentPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  // 5 recommended posts
  const recommendedPosts = posts.slice(0, 5);

  const categories: { id: CategoryType; name: string; count: number }[] = [
    { id: 'work', name: '직장 · 급여 · 퇴직', count: posts.filter(p => p.category === 'work').length },
    { id: 'property', name: '부동산 · 세금', count: posts.filter(p => p.category === 'property').length },
    { id: 'finance', name: '연금 · 금융 · 절세', count: posts.filter(p => p.category === 'finance').length },
  ];

  const popularTags = [
    '2026연봉', '실수령액', '퇴직금', '주휴수당', '취득세감면',
    '부동산복비', '주택담보대출', '국민연금', '건보료피부양자', 'ISA계좌'
  ];

  const handleCopyLink = () => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }
    } catch {
      // fallback
    }
  };

  return (
    <aside className="space-y-4">
      {/* 0. Sticky Table of Contents (Shown on desktop when reading an article) */}
      {activePost && (
        <div className="hidden lg:block sticky top-24 z-20">
          <TableOfContents content={activePost.content} variant="sidebar" title="글 목차" />
        </div>
      )}

      {/* 1. Blogger Profile Widget */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 rounded-full bg-[#1078b9] text-white flex items-center justify-center font-bold text-base font-heading shrink-0 shadow-xs">
            박
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 text-base font-heading">박과장</h3>
            <p className="text-xs text-gray-500 font-medium">11년차 데이터 기획자</p>
          </div>
        </div>

        <div className="pt-3 text-xs text-gray-600 leading-relaxed font-body">
          <p>
            11년 동안 회사 생활, 이직, 내 집 마련을 거치며 직접 겪고 엑셀로 검증한 월급, 퇴직금, 부동산 세금, 연금 정보를 알기 쉽게 기록합니다.
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => onSelectCategory('about')}
            className="text-gray-700 hover:text-[#1078b9] font-medium transition"
          >
            블로그 소개
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={handleCopyLink}
            className="text-gray-700 hover:text-[#1078b9] font-medium transition flex items-center gap-1"
          >
            {copiedLink ? (
              <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                <Check className="w-3 h-3" /> 복사됨!
              </span>
            ) : (
              <span>주소 공유</span>
            )}
          </button>
        </div>
      </div>

      {/* 2. Notice Widget (공지사항) */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
        <h4 className="text-xs font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3 flex items-center gap-1.5 font-heading">
          <Bell className="w-3.5 h-3.5 text-[#1078b9]" />
          <span>공지사항</span>
        </h4>
        <ul className="space-y-2 text-xs text-gray-700 font-body">
          <li className="line-clamp-2 hover:text-[#1078b9] cursor-pointer transition" onClick={() => onSelectCategory('about')}>
            • 2026년 최저임금(10,030원) 및 개정 법령이 전 칼럼에 반영되었습니다.
          </li>
          <li className="line-clamp-2 hover:text-[#1078b9] cursor-pointer transition" onClick={() => onSelectCategory('about')}>
            • 칼럼 내 모든 산식은 관계 법령과 공공기관 공식 고시를 준용합니다.
          </li>
        </ul>
      </div>

      {/* 3. Category Widget (카테고리) */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
        <h4 className="text-xs font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3 flex items-center gap-1.5 font-heading">
          <Folder className="w-3.5 h-3.5 text-[#1078b9]" />
          <span>주제별 질문 & 답변</span>
        </h4>

        <div className="space-y-1 text-xs font-body">
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className="w-full text-left py-1.5 px-2 hover:bg-blue-50/60 rounded-lg flex items-center justify-between text-gray-800 transition"
          >
            <span>전체 질문 목록</span>
            <span className="text-gray-400 font-num">({posts.length})</span>
          </button>

          <div className="pl-2 space-y-0.5 border-l-2 border-gray-100 ml-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className="w-full text-left py-1.5 px-2 hover:bg-blue-50/60 rounded-lg flex items-center justify-between text-gray-700 transition"
              >
                <span>├ {cat.name}</span>
                <span className="text-gray-400 font-num">({cat.count})</span>
              </button>
            ))}

            <button
              type="button"
              onClick={() => onNavigateToCalculator('wage_salary')}
              className="w-full text-left py-1.5 px-2 hover:bg-blue-50/60 rounded-lg flex items-center justify-between text-gray-700 transition"
            >
              <span>└ 실무 금융 계산기</span>
              <span className="text-[#1078b9] font-bold font-num">(8종)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Recent Posts (최근 질문 & 칼럼) */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
        <h4 className="text-xs font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3 font-heading flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-[#1078b9]" />
          <span>최근 등록된 질문</span>
        </h4>
        <ul className="space-y-2.5 text-xs">
          {recentPosts.map((p) => (
            <li
              key={p.id}
              onClick={() => onSelectPost(p)}
              className="group cursor-pointer"
            >
              <p className="text-gray-800 group-hover:text-[#1078b9] group-hover:underline line-clamp-1 font-medium transition leading-snug">
                {p.title}
              </p>
              <span className="text-[11px] text-gray-400 font-num">
                {p.date.split(' ')[0]}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* 5. Recommended Posts (인기 Q&A 칼럼) */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
        <h4 className="text-xs font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3 font-heading">
          인기 실무 Q&A
        </h4>
        <ul className="space-y-2.5 text-xs">
          {recommendedPosts.map((p) => (
            <li
              key={p.id}
              onClick={() => onSelectPost(p)}
              className="group cursor-pointer"
            >
              <p className="text-gray-800 group-hover:text-[#1078b9] group-hover:underline line-clamp-1 font-medium transition leading-snug">
                {p.title}
              </p>
              <span className="text-[11px] text-gray-400 font-num">
                {p.date.split(' ')[0]}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* 6. Sidebar Ad Placement */}
      <div className="border border-gray-200 rounded-xl p-2 bg-white shadow-xs">
        <AdSenseMock slotId="sidebar-display-ad" type="sidebar" />
      </div>

      {/* 7. Tags (태그 모음) */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
        <h4 className="text-xs font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3 flex items-center gap-1.5 font-heading">
          <Tag className="w-3.5 h-3.5 text-[#1078b9]" />
          <span>인기 태그</span>
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {popularTags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] text-gray-600 bg-gray-50 hover:bg-blue-50 hover:text-[#1078b9] px-2 py-1 rounded-md border border-gray-200 cursor-pointer transition"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
