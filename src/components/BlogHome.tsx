import React, { useState, useMemo } from 'react';
import { PostItem, CategoryType, PostCategory } from '../types';
import { ALL_BLOG_POSTS, CATEGORY_META } from '../data/postsData';
import { Calendar, Clock, ChevronRight, Sparkles, Filter, TrendingUp, Search, BookOpen, ArrowRight, User } from 'lucide-react';

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
  onOpenAutoPoster
}: BlogHomeProps) {
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'readTime'>('latest');

  // Filter posts based on category and search query
  const filteredPosts = useMemo(() => {
    let list = posts;

    // Filter by category
    if (currentCategory !== 'all' && ['insurance', 'wage', 'finance', 'property', 'life'].includes(currentCategory)) {
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

    // Sort
    return [...list].sort((a, b) => {
      if (sortBy === 'popular') {
        return b.viewCount - a.viewCount;
      }
      if (sortBy === 'readTime') {
        return b.readTimeMinutes - a.readTimeMinutes;
      }
      // Latest default (by date descending, then id)
      return b.date.localeCompare(a.date);
    });
  }, [currentCategory, searchQuery, sortBy]);

  // Featured Post (first post of all, or highest viewed)
  const featuredPost = useMemo(() => {
    if (searchQuery.trim() || currentCategory !== 'all') return null;
    return posts[0] || ALL_BLOG_POSTS[0]; // Top latest post
  }, [searchQuery, currentCategory, posts]);

  return (
    <div className="space-y-8">
      
      {/* 1. Featured Editor's Pick Banner (Shown on 'All' view without search) */}
      {featuredPost && (
        <div 
          onClick={() => onSelectPost(featuredPost)}
          className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 md:p-10 cursor-pointer shadow-lg hover:shadow-xl transition-all group border border-slate-700/50"
        >
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="bg-indigo-500/30 text-indigo-200 text-xs font-black px-3 py-1 rounded-full border border-indigo-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                에디터 추천 칼럼
              </span>
              <span className="text-xs text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                {featuredPost.categoryName}
              </span>
              <span className="text-xs text-slate-400 font-num">{featuredPost.date}</span>
            </div>

            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-black text-white leading-snug group-hover:text-indigo-200 transition-colors">
              {featuredPost.title}
            </h2>

            <p className="font-body text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
              {featuredPost.summary}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-700/60">
              <div className="flex items-center space-x-2 text-xs text-slate-300">
                <div className="w-5 h-5 rounded-md bg-indigo-600/60 text-white font-bold flex items-center justify-center text-[10px]">
                  <BookOpen className="w-3 h-3" />
                </div>
                <span>{featuredPost.author}</span>
                <span>·</span>
                <span>{featuredPost.readTimeMinutes}분 읽기</span>
                <span>·</span>
                <span>조회 {featuredPost.viewCount.toLocaleString()}</span>
              </div>

              <span className="font-display text-xs sm:text-sm font-bold text-indigo-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>전문 읽기</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Control Bar: Filter Pills & Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        
        {/* Category Description or Search Indicator */}
        <div className="flex items-center space-x-2">
          <span className="font-heading text-sm font-black text-slate-900">
            {searchQuery.trim() ? (
              <span>&ldquo;{searchQuery}&rdquo; 검색 결과 ({filteredPosts.length}건)</span>
            ) : currentCategory === 'all' ? (
              <span>전체 칼럼 모아보기 ({filteredPosts.length}편)</span>
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

        {/* Sorting Buttons */}
        <div className="flex items-center space-x-1.5 text-xs">
          <button
            type="button"
            onClick={() => setSortBy('latest')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              sortBy === 'latest'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            최신순
          </button>
          <button
            type="button"
            onClick={() => setSortBy('popular')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              sortBy === 'popular'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            조회순
          </button>
          <button
            type="button"
            onClick={() => setSortBy('readTime')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              sortBy === 'readTime'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            소요시간순
          </button>
        </div>
      </div>

      {/* 3. Empty Search Feedback */}
      {filteredPosts.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <p className="text-3xl">🔍</p>
          <h3 className="font-heading text-lg font-black text-slate-800">
            검색 결과가 없습니다.
          </h3>
          <p className="font-body text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            다른 키워드로 검색하시거나 상단의 카테고리 탭을 통해 칼럼을 확인해보세요.
          </p>
          <button
            onClick={onClearSearch}
            className="mt-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition cursor-pointer"
          >
            전체 칼럼 목록 보기
          </button>
        </div>
      )}

      {/* 4. Blog Posts Feed (Clean Cards Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPosts.map((post) => {
          const meta = CATEGORY_META[post.category];
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
                  <div className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-[9px] border border-indigo-100">
                    <BookOpen className="w-2.5 h-2.5" />
                  </div>
                  <span className="font-bold text-slate-800">{post.author}</span>
                  <span>·</span>
                  <span className="text-slate-600 font-medium">{post.readTimeMinutes}분</span>
                </div>

                <span className="text-indigo-600 font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                  <span>자세히 보기</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          );
        })}
      </div>

    </div>
  );
}
