import React, { useMemo, useState } from 'react';
import { PostItem, CategoryType } from '../types';
import { ALL_BLOG_POSTS, CATEGORY_META } from '../data/postsData';
import { ChevronRight, Calendar, User, Eye, MessageSquare, ChevronLeft } from 'lucide-react';
import AdSenseMock from './AdSenseMock';

interface BlogHomeProps {
  currentCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  onSelectPost: (post: PostItem) => void;
  searchQuery: string;
  onClearSearch: () => void;
  posts?: PostItem[];
  onNavigateToCalculator?: (calcId: string) => void;
}

const POSTS_PER_PAGE = 7;

export default function BlogHome({
  currentCategory,
  onSelectCategory,
  onSelectPost,
  searchQuery,
  onClearSearch,
  posts = ALL_BLOG_POSTS,
  onNavigateToCalculator,
}: BlogHomeProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'latest' | 'oldest'>('latest');

  // Filter posts
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

    // Sort
    if (sortBy === 'oldest') {
      return [...list].sort((a, b) => a.date.localeCompare(b.date));
    }
    return [...list].sort((a, b) => b.date.localeCompare(a.date));
  }, [currentCategory, searchQuery, posts, sortBy]);

  // Reset page to 1 when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [currentCategory, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE) || 1;
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const getCategoryTitle = () => {
    if (searchQuery) return `검색 결과: "${searchQuery}"`;
    switch (currentCategory) {
      case 'work': return '직장 · 급여 · 퇴직';
      case 'property': return '부동산 · 세금';
      case 'finance': return '연금 · 금융 · 절세';
      default: return '전체 글';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8">
      {/* Category List Header - Classic Tistory Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b-2 border-gray-900 gap-2">
        <div className="flex items-baseline gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-heading">
            {getCategoryTitle()}
          </h2>
          <span className="text-sm font-medium text-gray-500">
            ({filteredPosts.length})
          </span>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {searchQuery && (
            <button
              onClick={onClearSearch}
              className="text-blue-600 hover:underline font-medium"
            >
              전체글 보기
            </button>
          )}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSortBy('latest')}
              className={`hover:text-gray-900 transition-colors ${
                sortBy === 'latest' ? 'font-bold text-gray-900' : 'text-gray-400'
              }`}
            >
              최신순
            </button>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              onClick={() => setSortBy('oldest')}
              className={`hover:text-gray-900 transition-colors ${
                sortBy === 'oldest' ? 'font-bold text-gray-900' : 'text-gray-400'
              }`}
            >
              과거순
            </button>
          </div>
        </div>
      </div>

      {/* Post List Items - Classic Korean Blog Feed */}
      {paginatedPosts.length === 0 ? (
        <div className="py-16 text-center text-gray-500 space-y-3">
          <p className="text-base font-medium">검색 결과가 없습니다.</p>
          <p className="text-xs text-gray-400">다른 키워드로 검색하거나 전체글 목록을 확인해보세요.</p>
          {searchQuery && (
            <button
              onClick={onClearSearch}
              className="mt-2 inline-block px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded font-medium transition"
            >
              전체글로 돌아가기
            </button>
          )}
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {paginatedPosts.map((post, index) => {
            const meta = CATEGORY_META[post.category] || { name: '실전 칼럼' };
            return (
              <React.Fragment key={post.id}>
                <article
                  onClick={() => onSelectPost(post)}
                  className="py-6 first:pt-0 last:pb-0 group cursor-pointer flex flex-col sm:flex-row items-start justify-between gap-6"
                >
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Category Name */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-blue-600">
                        {meta.name}
                      </span>
                    </div>

                    {/* Post Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 group-hover:underline transition-colors font-heading leading-snug">
                      {post.title}
                    </h3>

                    {/* Excerpt / Summary */}
                    <p className="text-sm text-gray-600 line-clamp-2 sm:line-clamp-3 leading-relaxed font-body">
                      {post.summary}
                    </p>

                    {/* Meta Bar */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 pt-1">
                      <span className="text-gray-600 font-medium">{post.author || '박과장'}</span>
                      <span>·</span>
                      <span>{post.date.split(' ')[0]}</span>
                      <span>·</span>
                      <span>읽는 시간 약 {post.readTimeMinutes || 5}분</span>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {post.tags.slice(0, 3).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[11px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-200"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Thumbnail / Visual Box */}
                  <div className="w-full sm:w-36 h-24 bg-gray-50 border border-gray-200 rounded-md overflow-hidden shrink-0 flex items-center justify-center p-3 text-center group-hover:border-blue-200 transition-colors">
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-gray-700 font-heading">
                        {meta.name}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        2026 실무
                      </div>
                    </div>
                  </div>
                </article>

                {/* Ad Placement between 3rd and 4th post (standard in Korean blogs) */}
                {index === 2 && (
                  <div className="py-4 border-t border-b border-gray-100 my-2">
                    <AdSenseMock slotId="home-infeed-ad" type="inline" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Bottom Pagination - Classic Korean Blog Style */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-10 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-2.5 py-1.5 text-xs text-gray-600 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded transition ${
                currentPage === page
                  ? 'bg-gray-900 text-white font-bold'
                  : 'text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-2.5 py-1.5 text-xs text-gray-600 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
