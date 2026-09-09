import React from 'react';
import { PostItem, CategoryType } from '../types';
import { ALL_BLOG_POSTS } from '../data/postsData';
import { ChevronRight, Folder, Calculator, User, Bell, Tag } from 'lucide-react';
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
  // 5 most recent posts
  const recentPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  // 5 top popular posts
  const popularPosts = [...posts].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 5);

  const categories: { id: CategoryType; name: string; count: number }[] = [
    { id: 'work', name: '직장 · 급여 · 퇴직', count: posts.filter(p => p.category === 'work').length },
    { id: 'property', name: '부동산 · 세금', count: posts.filter(p => p.category === 'property').length },
    { id: 'finance', name: '연금 · 금융 · 절세', count: posts.filter(p => p.category === 'finance').length },
  ];

  const popularTags = [
    '2026연봉', '실수령액', '퇴직금', '주휴수당', '취득세감면',
    '부동산복비', '주택담보대출', '국민연금', '건보료피부양자', 'ISA계좌'
  ];

  return (
    <aside className="space-y-6">
      {/* 0. Sticky Table of Contents (Shown on desktop when reading an article) */}
      {activePost && (
        <div className="hidden lg:block sticky top-24 z-20">
          <TableOfContents content={activePost.content} variant="sidebar" title="글 목차" />
        </div>
      )}

      {/* 1. Blogger Profile Widget - Classic Tistory / Naver Style */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-base font-heading shrink-0">
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
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            소개글 보기
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert('블로그 주소가 복사되었습니다.');
              }
            }}
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            블로그 공유
          </button>
        </div>
      </div>

      {/* 2. Notice Widget (공지사항) */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h4 className="text-xs font-bold text-gray-900 border-b border-gray-900 pb-2 mb-3 flex items-center gap-1.5 font-heading">
          <Bell className="w-3.5 h-3.5 text-gray-700" />
          <span>공지사항</span>
        </h4>
        <ul className="space-y-2 text-xs text-gray-700 font-body">
          <li className="line-clamp-1 hover:text-blue-600 cursor-pointer" onClick={() => onSelectCategory('about')}>
            • 2026년 세법 개정안 및 최저임금(10,030원) 전면 적용 안내
          </li>
          <li className="line-clamp-1 hover:text-blue-600 cursor-pointer" onClick={() => onSelectCategory('about')}>
            • 퇴직금 누락 산정 및 연차수당 정산 검증 요청 접수 안내
          </li>
        </ul>
      </div>

      {/* 3. Category Widget (카테고리) */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h4 className="text-xs font-bold text-gray-900 border-b border-gray-900 pb-2 mb-3 flex items-center gap-1.5 font-heading">
          <Folder className="w-3.5 h-3.5 text-gray-700" />
          <span>카테고리</span>
        </h4>

        <div className="space-y-1 text-xs font-body">
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className="w-full text-left py-1.5 px-2 hover:bg-gray-50 rounded flex items-center justify-between text-gray-800 transition"
          >
            <span>분류 전체보기</span>
            <span className="text-gray-400 font-num">({posts.length})</span>
          </button>

          <div className="pl-2 space-y-0.5 border-l border-gray-100 ml-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className="w-full text-left py-1.5 px-2 hover:bg-gray-50 rounded flex items-center justify-between text-gray-700 transition"
              >
                <span>├ {cat.name}</span>
                <span className="text-gray-400 font-num">({cat.count})</span>
              </button>
            ))}

            <button
              type="button"
              onClick={() => onNavigateToCalculator('wage_salary')}
              className="w-full text-left py-1.5 px-2 hover:bg-gray-50 rounded flex items-center justify-between text-gray-700 transition"
            >
              <span>└ 실무 금융 계산기</span>
              <span className="text-blue-600 font-bold font-num">(8종)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Recent Posts (최근에 올라온 글) */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h4 className="text-xs font-bold text-gray-900 border-b border-gray-900 pb-2 mb-3 font-heading">
          최근에 올라온 글
        </h4>
        <ul className="space-y-2.5 text-xs">
          {recentPosts.map((p) => (
            <li
              key={p.id}
              onClick={() => onSelectPost(p)}
              className="group cursor-pointer"
            >
              <p className="text-gray-800 group-hover:text-blue-600 group-hover:underline line-clamp-1 font-medium transition leading-snug">
                {p.title}
              </p>
              <span className="text-[11px] text-gray-400 font-num">
                {p.date.split(' ')[0]}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* 5. Popular Posts (인기글 TOP 5) */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h4 className="text-xs font-bold text-gray-900 border-b border-gray-900 pb-2 mb-3 font-heading">
          인기글
        </h4>
        <ul className="space-y-2.5 text-xs">
          {popularPosts.map((p, idx) => (
            <li
              key={p.id}
              onClick={() => onSelectPost(p)}
              className="flex items-start gap-2 group cursor-pointer"
            >
              <span className={`text-xs font-bold px-1.5 py-0.2 rounded shrink-0 font-num ${
                idx === 0 ? 'bg-gray-900 text-white' : idx < 3 ? 'bg-gray-200 text-gray-800' : 'text-gray-400'
              }`}>
                {idx + 1}
              </span>
              <p className="text-gray-800 group-hover:text-blue-600 group-hover:underline line-clamp-1 font-medium transition leading-snug min-w-0">
                {p.title}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* 6. Sidebar Ad Placement */}
      <div className="border border-gray-200 rounded-lg p-2 bg-gray-50/50">
        <AdSenseMock slotId="sidebar-display-ad" type="sidebar" />
      </div>

      {/* 7. Tags (태그 모음) */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h4 className="text-xs font-bold text-gray-900 border-b border-gray-900 pb-2 mb-3 flex items-center gap-1.5 font-heading">
          <Tag className="w-3.5 h-3.5 text-gray-700" />
          <span>태그</span>
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {popularTags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-blue-600 px-2 py-1 rounded border border-gray-200 cursor-pointer transition"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* 8. Visitor Counter - Classic Tistory Style */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 text-center text-xs text-gray-500 font-num">
        <div className="grid grid-cols-3 divide-x divide-gray-100 py-1">
          <div>
            <div className="text-[11px] text-gray-400">TODAY</div>
            <div className="font-bold text-gray-800 text-sm mt-0.5">1,482</div>
          </div>
          <div>
            <div className="text-[11px] text-gray-400">YESTERDAY</div>
            <div className="font-bold text-gray-800 text-sm mt-0.5">3,210</div>
          </div>
          <div>
            <div className="text-[11px] text-gray-400">TOTAL</div>
            <div className="font-bold text-gray-800 text-sm mt-0.5">184,920</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
