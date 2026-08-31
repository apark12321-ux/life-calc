import React from 'react';
import { PostItem, CategoryType } from '../types';
import { ALL_BLOG_POSTS, CATEGORY_META } from '../data/postsData';
import { Mail, ChevronRight, Folder, Calculator, Sparkles } from 'lucide-react';
import TableOfContents from './TableOfContents';

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
  // Top 5 recommended posts
  const recommendedPosts = posts.slice(0, 5);

  const categories: { id: CategoryType; name: string; icon: string; count: number; desc: string }[] = [
    { id: 'work', name: '직장·급여·퇴직', icon: '■', count: posts.filter(p => p.category === 'work').length, desc: '월급명세서, 퇴직금, 주휴수당, 실업급여' },
    { id: 'property', name: '부동산·세금', icon: '◆', count: posts.filter(p => p.category === 'property').length, desc: '취득세 감면, 전월세 복비, 주담대 상환' },
    { id: 'finance', name: '연금·금융·절세', icon: '●', count: posts.filter(p => p.category === 'finance').length, desc: '건보료 방어, 조기연금 계산, ISA 절세' }
  ];

  return (
    <aside className="space-y-6">
      {/* 0. Sticky Table of Contents (Shown on desktop when viewing an article) */}
      {activePost && (
        <div className="hidden lg:block">
          <TableOfContents content={activePost.content} variant="sidebar" title="글 목차" />
        </div>
      )}

      {/* 1. Author Profile & Mission Box */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white flex items-center justify-center font-bold shadow-xs shrink-0 text-xl">
            <span className="font-heading font-black text-indigo-200 text-sm">박과장</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-heading font-black text-slate-950 text-base">박과장</h3>
              <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200">
                11년차 직장인
              </span>
            </div>
            <p className="font-body text-xs text-slate-600 mt-0.5 font-medium">데이터 기획자 & 블로거</p>
          </div>
        </div>

        <p className="font-body text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
          "11년 동안 회사 생활과 내 집 마련을 거치며 직접 겪고 엑셀로 검증한 월급, 퇴직금, 세금, 연금 정보를 알기 쉽게 풀어드립니다."
        </p>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span className="text-[11px] text-slate-500 font-medium">
            실전 금융·노무 칼럼 연재
          </span>
          <button
            type="button"
            onClick={() => onSelectCategory('about')}
            className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5 text-[11px] cursor-pointer"
          >
            <span>운영자 소개</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 2. Top 5 Recommended Articles */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="font-heading text-sm font-black text-slate-950 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>■ 직장인들이 가장 많이 읽은 글</span>
          </h3>
        </div>

        <div className="space-y-2.5">
          {recommendedPosts.map((post, idx) => (
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
                  <span>{post.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Categories Breakdown */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <h3 className="font-heading text-sm font-black text-slate-950 flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
          <Folder className="w-4 h-4 text-emerald-600" />
          <span>■ 주제별 실전 칼럼</span>
        </h3>

        <div className="space-y-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className="w-full text-left p-2.5 rounded-xl text-xs hover:bg-slate-50 transition cursor-pointer text-slate-800 border border-slate-100 group"
            >
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
                  <span className="text-indigo-600 font-bold">{cat.icon}</span>
                  <span>{cat.name}</span>
                </span>
                <span className="font-num text-[11px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                  {cat.count}편
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-normal line-clamp-1">
                {cat.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Useful Calculators Box */}
      <div className="bg-gradient-to-br from-indigo-50/70 to-blue-50/70 rounded-2xl p-5 border border-indigo-100 shadow-xs space-y-3">
        <h3 className="font-heading text-sm font-black text-indigo-950 flex items-center gap-1.5">
          <Calculator className="w-4 h-4 text-indigo-600" />
          <span>▶ 박과장의 실무 계산기</span>
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          제가 직접 엑셀로 검증해 만든 공식으로 내 급여·수당·세금을 1초 만에 확인해보세요.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => onNavigateToCalculator('wage_salary')}
            className="p-2.5 bg-white hover:bg-indigo-600 hover:text-white text-slate-800 rounded-xl border border-indigo-100 text-xs font-bold transition flex items-center justify-between cursor-pointer shadow-2xs group"
          >
            <span>▶ 실수령액</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
          </button>
          <button
            type="button"
            onClick={() => onNavigateToCalculator('wage_hourly')}
            className="p-2.5 bg-white hover:bg-indigo-600 hover:text-white text-slate-800 rounded-xl border border-indigo-100 text-xs font-bold transition flex items-center justify-between cursor-pointer shadow-2xs group"
          >
            <span>▶ 퇴직금·수당</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
          </button>
          <button
            type="button"
            onClick={() => onNavigateToCalculator('property_tax')}
            className="p-2.5 bg-white hover:bg-indigo-600 hover:text-white text-slate-800 rounded-xl border border-indigo-100 text-xs font-bold transition flex items-center justify-between cursor-pointer shadow-2xs group"
          >
            <span>▶ 취득세·복비</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
          </button>
          <button
            type="button"
            onClick={() => onNavigateToCalculator('finance_loan')}
            className="p-2.5 bg-white hover:bg-indigo-600 hover:text-white text-slate-800 rounded-xl border border-indigo-100 text-xs font-bold transition flex items-center justify-between cursor-pointer shadow-2xs group"
          >
            <span>▶ 대출 이자</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
          </button>
        </div>
      </div>
    </aside>
  );
}
