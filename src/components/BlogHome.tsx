import React, { useMemo } from 'react';
import { PostItem, CategoryType, PostCategory } from '../types';
import { ALL_BLOG_POSTS, CATEGORY_META } from '../data/postsData';
import { ChevronRight, Search, User } from 'lucide-react';

interface BlogHomeProps {
  currentCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  onSelectPost: (post: PostItem) => void;
  searchQuery: string;
  onClearSearch: () => void;
  posts?: PostItem[];
  onOpenAutoPoster?: () => void;
}

export default function BlogHome({
  currentCategory,
  onSelectCategory,
  onSelectPost,
  searchQuery,
  onClearSearch,
  posts = ALL_BLOG_POSTS,
}: BlogHomeProps) {
  // Filter posts based on category and search query
  const filteredPosts = useMemo(() => {
    let list = posts;

    // Filter by category
    if (currentCategory !== 'all' && ['work', 'property', 'finance'].includes(currentCategory)) {
      list = list.filter(p => p.category === currentCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.content.toLowerCase().includes(q)
      );
    }

    // Sort by latest date descending
    return [...list].sort((a, b) => b.date.localeCompare(a.date));
  }, [currentCategory, searchQuery, posts]);

  return (
    <div className="space-y-6">
      
      {/* 1. Control Bar & Category Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        
        {/* Category Description or Search Indicator */}
        <div className="flex items-center space-x-2">
          <span className="font-heading text-sm font-black text-slate-900">
            {searchQuery.trim() ? (
              <span>&ldquo;{searchQuery}&rdquo; 검색 결과 ({filteredPosts.length}편)</span>
            ) : currentCategory === 'all' ? (
              <span>박과장의 전체 실전 칼럼 ({filteredPosts.length}편)</span>
            ) : (
              <span>{CATEGORY_META[currentCategory as PostCategory]?.name} 칼럼 ({filteredPosts.length}편)</span>
            )}
          </span>
          {searchQuery.trim() && (
            <button
              onClick={onClearSearch}
              className="text-xs text-indigo-600 hover:underline ml-2 cursor-pointer font-bold"
            >
              검색 초기화
            </button>
          )}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          최신 발행순
        </div>
      </div>

      {/* 2. Latest Featured / Lead Post (상위 최신 칼럼) */}
      {filteredPosts.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
              <h2 className="font-heading text-sm font-black text-slate-900">
                최신 실전 칼럼
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
              LATEST
            </span>
          </div>

          {(() => {
            const latest = filteredPosts[0];
            const meta = CATEGORY_META[latest.category] || { name: '일반', icon: '■', bg: 'bg-slate-100', color: 'text-slate-800', border: 'border-slate-200' };
            return (
              <article
                onClick={() => onSelectPost(latest)}
                className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-100/80 hover:border-indigo-400 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-4 relative overflow-hidden"
              >
                <div className="space-y-3">
                  {/* Category & Date Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className={`font-display text-xs font-extrabold px-3 py-1 rounded-full border ${meta.bg} ${meta.color} ${meta.border} flex items-center gap-1`}>
                        <span>{meta.icon}</span>
                        <span>{meta.name}</span>
                      </span>
                      <span className="bg-slate-900 text-white font-bold text-[11px] px-2.5 py-0.5 rounded-md">
                        NEW
                      </span>
                    </div>
                    <span className="text-slate-500 font-num font-medium text-xs">{latest.date}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-lg sm:text-2xl font-black text-slate-950 group-hover:text-indigo-600 transition-colors leading-snug">
                    {latest.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="font-body text-xs sm:text-sm text-slate-700 leading-relaxed max-w-4xl font-normal">
                    {latest.summary}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {latest.tags.map((tag, idx) => (
                      <span key={idx} className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Author & Footer Meta */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-xs border border-indigo-100">
                      <User className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    <span className="font-bold text-slate-800 text-xs sm:text-sm">{latest.author}</span>
                  </div>

                  <span className="text-indigo-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform text-xs sm:text-sm">
                    <span>최신 칼럼 본문 읽기</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </article>
            );
          })()}
        </section>
      )}

      {/* 3. Empty Search Feedback */}
      {filteredPosts.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <Search className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="font-heading text-lg font-black text-slate-800">
            검색 결과가 없습니다.
          </h3>
          <p className="font-body text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            다른 키워드로 검색하시거나 상단의 카테고리 탭을 통해 원하시는 주제의 글을 확인해보세요.
          </p>
          <button
            onClick={onClearSearch}
            className="mt-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition cursor-pointer"
          >
            전체 글 보기
          </button>
        </div>
      )}

      {/* 4. Remaining Blog Posts Feed */}
      {filteredPosts.length > 1 && (
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-heading text-sm font-black text-slate-900">
              {currentCategory === 'all' ? '전체 칼럼 목록' : `${CATEGORY_META[currentCategory as PostCategory]?.name} 칼럼 목록`}
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {filteredPosts.length - 1}편의 실전 기록
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredPosts.slice(1).map((post) => {
              const meta = CATEGORY_META[post.category] || { name: '일반', icon: '■', bg: 'bg-slate-100', color: 'text-slate-800', border: 'border-slate-200' };
              return (
                <article
                  key={post.id}
                  onClick={() => onSelectPost(post)}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-3">
                    {/* Category & Date Row */}
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-display text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${meta.bg} ${meta.color} ${meta.border} flex items-center gap-1`}>
                        <span>{meta.icon}</span>
                        <span>{meta.name}</span>
                      </span>
                      <span className="text-slate-500 font-num font-medium">{post.date}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-heading text-base sm:text-lg font-black text-slate-950 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="font-body text-xs sm:text-sm text-slate-700 line-clamp-3 leading-relaxed">
                      {post.summary}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {post.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Author & Footer Meta */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-[11px] border border-indigo-100">
                        <User className="w-3.5 h-3.5 text-indigo-600" />
                      </div>
                      <span className="font-bold text-slate-800">{post.author}</span>
                    </div>

                    <span className="text-indigo-600 font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                      <span>칼럼 읽기</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
}
