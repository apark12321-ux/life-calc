import React from 'react';
import { PostItem, CategoryType } from '../types';
import { ALL_BLOG_POSTS, CATEGORY_META } from '../data/postsData';
import { User, Mail, ChevronRight, TrendingUp, Folder, Calculator, ShieldCheck, Heart, Sparkles, BookOpen } from 'lucide-react';
import TableOfContents from './TableOfContents';

interface BlogSidebarProps {
  onSelectPost: (post: PostItem) => void;
  onSelectCategory: (cat: CategoryType) => void;
  onNavigateToCalculator: (calcId: string) => void;
  activePost?: PostItem | null;
}

export default function BlogSidebar({
  onSelectPost,
  onSelectCategory,
  onNavigateToCalculator,
  activePost = null
}: BlogSidebarProps) {
  // Top 5 popular posts sorted by view count
  const popularPosts = [...ALL_BLOG_POSTS]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5);

  const categories: { id: CategoryType; name: string; icon: string; count: number }[] = [
    { id: 'insurance', name: '4대사회보험', icon: '🛡️', count: ALL_BLOG_POSTS.filter(p => p.category === 'insurance').length },
    { id: 'wage', name: '급여·노무', icon: '⏱', count: ALL_BLOG_POSTS.filter(p => p.category === 'wage').length },
    { id: 'finance', name: '금융·재테크', icon: '💰', count: ALL_BLOG_POSTS.filter(p => p.category === 'finance').length },
    { id: 'property', name: '부동산·세금', icon: '🏠', count: ALL_BLOG_POSTS.filter(p => p.category === 'property').length },
    { id: 'life', name: '생활·행정', icon: '🎂', count: ALL_BLOG_POSTS.filter(p => p.category === 'life').length },
  ];

  return (
    <aside className="space-y-6">
      {/* 0. Sticky Table of Contents (Shown on desktop when viewing an article) */}
      {activePost && (
        <div className="hidden lg:block">
          <TableOfContents content={activePost.content} variant="sidebar" title="글 목차 (Table of Contents)" />
        </div>
      )}

      {/* 1. Service Introduction & Mission Box */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
            <BookOpen className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-heading font-black text-slate-950 text-base">생활금융 실전 가이드</h3>
            </div>
            <p className="font-body text-xs text-slate-600 mt-0.5 font-medium">2026 생활금융 & 세무 정보 블로그</p>
          </div>
        </div>

        <p className="font-body text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
          국민연금, 건강보험, 최저임금, 연봉 실수령액, 취득세 등 대한민국 공식 법령과 고시를 기반으로 검증된 실무 정보를 알기 쉽게 제공합니다.
        </p>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span className="flex items-center gap-1 font-mono text-[11px] font-semibold text-slate-700">
            <Mail className="w-3.5 h-3.5 text-slate-500" />
            contact@life-calc.kr
          </span>
          <button
            type="button"
            onClick={() => onSelectCategory('about')}
            className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5 text-[11px] cursor-pointer"
          >
            <span>블로그 소개</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 2. Top 5 Popular Articles */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="font-heading text-sm font-black text-slate-950 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            인기 추천 칼럼 TOP 5
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">조회수 기준</span>
        </div>

        <div className="space-y-2.5">
          {popularPosts.map((post, idx) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="flex items-start gap-2.5 group cursor-pointer p-1.5 rounded-xl hover:bg-slate-50 transition"
            >
              <span className={`font-num font-black text-xs px-2 py-0.5 rounded-md shrink-0 ${
                idx === 0 ? 'bg-indigo-600 text-white' : idx === 1 ? 'bg-indigo-100 text-indigo-900 font-bold' : 'bg-slate-100 text-slate-800 font-bold'
              }`}>
                {idx + 1}
              </span>
              <div className="min-w-0">
                <p className="font-heading text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 font-body font-medium">
                  <span>{post.categoryName}</span>
                  <span>·</span>
                  <span>조회 {post.viewCount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Category Archive Breakdown */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <h3 className="font-heading text-sm font-black text-slate-950 flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
          <Folder className="w-4 h-4 text-emerald-600" />
          카테고리 분류
        </h3>

        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className="w-full flex items-center justify-between p-2 rounded-xl text-xs hover:bg-slate-50 transition cursor-pointer text-slate-800 font-semibold"
            >
              <span className="flex items-center gap-2">
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </span>
              <span className="font-num text-[11px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                {cat.count}편
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Quick Useful Calculators Tool Box */}
      <div className="bg-gradient-to-br from-indigo-50/70 to-blue-50/70 rounded-2xl p-5 border border-indigo-100 shadow-xs space-y-3">
        <h3 className="font-heading text-sm font-black text-indigo-950 flex items-center gap-1.5">
          <Calculator className="w-4 h-4 text-indigo-600" />
          실생활 모의 계산기 바로가기
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          칼럼에서 다룬 법정 기준을 직접 모의 계산해 볼 수 있는 간편 도구입니다.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => onNavigateToCalculator('insurance')}
            className="p-2.5 bg-white hover:bg-indigo-600 hover:text-white text-slate-800 rounded-xl border border-indigo-100 text-xs font-bold transition flex items-center justify-between cursor-pointer shadow-2xs group"
          >
            <span>🛡️ 4대보험</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
          </button>
          <button
            type="button"
            onClick={() => onNavigateToCalculator('wage_salary')}
            className="p-2.5 bg-white hover:bg-indigo-600 hover:text-white text-slate-800 rounded-xl border border-indigo-100 text-xs font-bold transition flex items-center justify-between cursor-pointer shadow-2xs group"
          >
            <span>💵 연봉 실수령</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
          </button>
          <button
            type="button"
            onClick={() => onNavigateToCalculator('wage_hourly')}
            className="p-2.5 bg-white hover:bg-indigo-600 hover:text-white text-slate-800 rounded-xl border border-indigo-100 text-xs font-bold transition flex items-center justify-between cursor-pointer shadow-2xs group"
          >
            <span>⏱ 주휴수당</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
          </button>
          <button
            type="button"
            onClick={() => onNavigateToCalculator('finance_loan')}
            className="p-2.5 bg-white hover:bg-indigo-600 hover:text-white text-slate-800 rounded-xl border border-indigo-100 text-xs font-bold transition flex items-center justify-between cursor-pointer shadow-2xs group"
          >
            <span>🏦 대출 이자</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
          </button>
          <button
            type="button"
            onClick={() => onNavigateToCalculator('property_tax')}
            className="p-2.5 bg-white hover:bg-indigo-600 hover:text-white text-slate-800 rounded-xl border border-indigo-100 text-xs font-bold transition flex items-center justify-between cursor-pointer shadow-2xs group"
          >
            <span>🏠 취득세</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
          </button>
          <button
            type="button"
            onClick={() => onNavigateToCalculator('property_size')}
            className="p-2.5 bg-white hover:bg-indigo-600 hover:text-white text-slate-800 rounded-xl border border-indigo-100 text-xs font-bold transition flex items-center justify-between cursor-pointer shadow-2xs group"
          >
            <span>📐 평수 변환</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
          </button>
        </div>
      </div>

      {/* 5. Simple Blog Notice */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          <span>블로그 안내</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500">
          4대보험, 급여 실수령액, 부동산 세금 등 실생활에 유용한 정보를 알기 쉽게 정리해 드립니다.
        </p>
      </div>
    </aside>
  );
}
