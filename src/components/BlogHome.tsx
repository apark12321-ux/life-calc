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
    <div className="space-y-3">
      {/* Category / Filter Header Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span>홈</span>
            <span>&gt;</span>
            <span className="text-[#1078b9] font-medium">{getCategoryTitle()}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 font-heading">
              {getCategoryTitle()}
            </h2>
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              총 {filteredPosts.length}건
            </span>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-3 text-xs text-gray-500 self-end sm:self-center">
          {searchQuery && (
            <button
              onClick={onClearSearch}
              className="text-[#1078b9] hover:underline font-semibold mr-1"
            >
              전체글 보기
            </button>
          )}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setSortBy('latest')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                sortBy === 'latest' ? 'bg-white font-bold text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              최신순
            </button>
            <button
              type="button"
              onClick={() => setSortBy('oldest')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                sortBy === 'oldest' ? 'bg-white font-bold text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              과거순
            </button>
          </div>
        </div>
      </div>

      {/* Post List Items - DWQA Benchmarked Card Style from ko.phongnhaexplorer.com */}
      {paginatedPosts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl py-16 text-center text-gray-500 space-y-3">
          <p className="text-base font-medium text-gray-800">검색 결과가 없습니다.</p>
          <p className="text-xs text-gray-500">다른 실무 키워드로 검색하거나 전체 카테고리 목록을 확인해보세요.</p>
          {searchQuery && (
            <button
              onClick={onClearSearch}
              className="mt-2 inline-block px-4 py-2 bg-[#1078b9] hover:bg-[#0e69a3] text-white text-xs rounded-lg font-semibold transition"
            >
              전체글로 돌아가기
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedPosts.map((post, index) => {
            const meta = CATEGORY_META[post.category] || { name: '실전 칼럼' };
            const readTime = post.readTimeMinutes || 5;

            return (
              <React.Fragment key={post.id}>
                <article
                  onClick={() => onSelectPost(post)}
                  className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 hover:border-[#1078b9] hover:shadow-xs transition duration-150 cursor-pointer group"
                >
                  <div className="space-y-2">
                    {/* Top Meta Bar: Status badge + Category + Date + Read Time */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {/* dwqa-status badge */}
                      <span className="bg-[#e8f5e9] text-[#2e7d32] border border-[#a5d6a7] text-[11px] font-bold px-2 py-0.5 rounded">
                        답변 완료
                      </span>

                      {/* Category Badge */}
                      <span className="bg-blue-50 text-[#1078b9] border border-blue-200 text-[11px] font-semibold px-2 py-0.5 rounded">
                        {meta.name}
                      </span>

                      <span className="text-gray-400 text-[11px]">·</span>

                      {/* Post Date */}
                      <span className="text-gray-500 text-xs">
                        게시: {post.date.split(' ')[0]}
                      </span>

                      <span className="text-gray-400 text-[11px]">·</span>

                      {/* dwqa-answers-count / read time */}
                      <span className="text-gray-500 text-xs">
                        <strong className="text-gray-900 font-bold">{readTime}</strong>
                        <sup className="text-[10px] text-gray-500 font-semibold ml-0.5">m</sup> 읽기
                      </span>
                    </div>

                    {/* Question / Post Title */}
                    <h3 className="text-[17px] sm:text-[18px] font-bold text-gray-900 group-hover:text-[#1078b9] transition-colors font-heading leading-snug">
                      {post.title}
                    </h3>

                    {/* Summary Excerpt */}
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed font-body">
                      {post.summary}
                    </p>

                    {/* Tags & Author Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags && post.tags.slice(0, 3).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[11px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-200 group-hover:border-gray-300 transition"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Author */}
                      <span className="text-gray-400 text-[11px]">
                        작성자: <span className="text-gray-600 font-medium">{post.author || '박과장'}</span>
                      </span>
                    </div>
                  </div>
                </article>

                {/* Ad Placement between 3rd and 4th post (Standard AdSense unit) */}
                {index === 2 && (
                  <div className="bg-white border border-gray-200 rounded-xl p-3 my-3">
                    <AdSenseMock slotId="home-infeed-ad" type="inline" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Bottom Pagination */}
      {totalPages > 1 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-center gap-1.5 shadow-xs">
          <button
            type="button"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-2.5 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition"
            aria-label="이전 페이지"
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
              className={`min-w-[32px] px-2.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                currentPage === page
                  ? 'bg-[#1078b9] text-white font-bold shadow-xs'
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
            className="px-2.5 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition"
            aria-label="다음 페이지"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
