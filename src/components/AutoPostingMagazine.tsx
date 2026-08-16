import React, { useState, useEffect } from 'react';
import { PostItem, PostCategory, DailyScheduleReport } from '../types';
import { generateDailySchedule, getAllPostsWithSchedule, forcePublishSlot, resetDailyOverrides } from '../utils/postScheduler';
import { CATEGORY_META } from '../data/postsData';
import { 
  Sparkles, Clock, Calendar, CheckCircle2, AlertCircle, ArrowRight, 
  Search, BookOpen, Share2, Printer, ChevronRight, RefreshCw, Zap,
  ExternalLink, ShieldCheck, Tag, X, User, Eye
} from 'lucide-react';

interface AutoPostingMagazineProps {
  onNavigateToCalculator: (id: string) => void;
}

export default function AutoPostingMagazine({ onNavigateToCalculator }: AutoPostingMagazineProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | PostCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [now, setNow] = useState<Date>(new Date());
  const [scheduleReport, setScheduleReport] = useState<DailyScheduleReport | null>(null);
  const [postsList, setPostsList] = useState<PostItem[]>([]);

  // Refresh schedule and posts every 30 seconds or on demand
  const refreshData = () => {
    const currentDate = new Date();
    setNow(currentDate);
    const todayStr = currentDate.toISOString().split('T')[0];
    const report = generateDailySchedule(todayStr, currentDate);
    setScheduleReport(report);
    const posts = getAllPostsWithSchedule(currentDate, { includeScheduled: true });
    setPostsList(posts);
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(() => {
      refreshData();
    }, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const handleForcePublishNext = () => {
    if (!scheduleReport || !scheduleReport.nextScheduledSlot) return;
    forcePublishSlot(scheduleReport.date, scheduleReport.nextScheduledSlot.category);
    refreshData();
  };

  const handleForcePublishAll = () => {
    if (!scheduleReport) return;
    for (const slot of scheduleReport.slots) {
      forcePublishSlot(scheduleReport.date, slot.category);
    }
    refreshData();
  };

  const handleResetSchedule = () => {
    if (!scheduleReport) return;
    resetDailyOverrides(scheduleReport.date);
    refreshData();
  };

  const handleCopyLink = (postId: string) => {
    try {
      const url = `${window.location.origin}${window.location.pathname}?post=${postId}`;
      navigator.clipboard.writeText(url);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Filter posts
  const filteredPosts = postsList.filter(post => {
    const matchesCat = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* 1. Automated Posting Header & Live Schedule Status Board */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-900/40 relative overflow-hidden">
        {/* Background decorative accent */}
        <div className="absolute right-[-40px] top-[-40px] w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-[-20px] bottom-[-20px] w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-800/40 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-display bg-indigo-500 text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5" />
                  포스팅 자동화 시스템 가동 중
                </span>
                <span className="font-display bg-emerald-550/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  규정 준수: 1일 1포스팅 & 최소 4시간 간격
                </span>
              </div>
              <h1 className="font-heading text-2xl md:text-3xl font-black tracking-tight text-white">
                매일 자동 업로드 매거진 & 세무·법정 칼럼
              </h1>
              <p className="font-body text-xs md:text-sm text-indigo-200/90 mt-1 max-w-3xl leading-relaxed">
                4대보험, 임금, 금융, 부동산, 생활 등 5대 카테고리별로 매일 랜덤 시간에 최소 4시간 이상 간격을 두고 자동 발행되는 지능형 라이브 지식 허브입니다.
              </p>
            </div>

            {/* Quick Admin Test Controls */}
            <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
              <button
                type="button"
                onClick={handleForcePublishNext}
                disabled={!scheduleReport?.nextScheduledSlot}
                title="다음 예약된 포스팅을 지금 즉시 강제 발행합니다"
                className="font-display px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl border border-indigo-400/40 flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>다음 예약글 즉시 발행</span>
              </button>
              <button
                type="button"
                onClick={refreshData}
                className="font-display p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 text-xs transition cursor-pointer"
                title="스케줄 상태 새로고침"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Today's Schedule Timeline & Intervals Verification Grid */}
          {scheduleReport && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-indigo-200/90 gap-1">
                <div className="flex items-center gap-2 font-display font-semibold">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span>오늘({scheduleReport.date}) 자동 발행 현황:</span>
                  <span className="font-num text-emerald-300 font-bold">{scheduleReport.publishedCount}건 완료</span>
                  <span>/</span>
                  <span className="font-num text-amber-300 font-bold">{scheduleReport.scheduledCount}건 대기</span>
                </div>
                <div className="font-display text-[11px] text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>카테고리 간격 안전율: 최소 <strong>{scheduleReport.minIntervalHours}시간</strong> (≥ 4.0h 충족)</span>
                </div>
              </div>

              {/* 5 Category Slots Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
                {scheduleReport.slots.map((slot) => {
                  return (
                    <div
                      key={slot.category}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                        slot.isPublished
                          ? 'bg-slate-800/80 border-emerald-500/40 text-white shadow-xs'
                          : 'bg-slate-900/60 border-indigo-500/20 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="text-base">{slot.categoryIcon}</span>
                          {slot.isPublished ? (
                            <span className="font-display text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              발행 완료
                            </span>
                          ) : (
                            <span className="font-display text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-300" />
                              D-{slot.minutesRemaining}분
                            </span>
                          )}
                        </div>

                        <p className="font-heading font-extrabold text-xs text-white">
                          {slot.categoryName}
                        </p>
                        <p className="font-num text-[11px] text-indigo-300 font-bold mt-0.5">
                          ⏰ 업로드 시각: {slot.scheduledTimeStr}
                        </p>
                      </div>

                      {slot.intervalHoursFromPrev !== undefined && (
                        <div className="mt-2 pt-2 border-t border-slate-700/50 text-[10px] text-slate-400 flex items-center justify-between">
                          <span>이전글 간격</span>
                          <span className="font-num font-bold text-emerald-400">+{slot.intervalHoursFromPrev}시간</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Controls: Category Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`font-display px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            전체 보기 ({postsList.length})
          </button>
          {(['insurance', 'wage', 'finance', 'property', 'life'] as PostCategory[]).map((cat) => {
            const meta = CATEGORY_META[cat];
            const isSelected = selectedCategory === cat;
            const count = postsList.filter(p => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`font-display px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{meta.icon}</span>
                <span>{meta.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="칼럼 및 가이드 검색..."
            className="font-body w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-xl py-2 pl-9 pr-4 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white border border-slate-200 font-medium"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* 3. Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPosts.map((post) => {
          const isScheduled = post.status === 'scheduled';
          const meta = CATEGORY_META[post.category];

          return (
            <article
              key={post.id}
              className={`bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between p-5 relative overflow-hidden group ${
                isScheduled ? 'opacity-90 bg-slate-50/70 border-dashed border-amber-300' : ''
              }`}
            >
              <div>
                {/* Upper Meta Tag Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`font-display text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 border ${meta.bg} ${meta.color}`}>
                    <span>{meta.icon}</span>
                    <span>{meta.name}</span>
                  </span>

                  {isScheduled ? (
                    <span className="font-display text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-500" />
                      오늘 {post.scheduledTime} 자동발행 예정
                    </span>
                  ) : (
                    <span className="font-display text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date} {post.scheduledTime}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 
                  onClick={() => setSelectedPost(post)}
                  className="font-heading text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer leading-snug line-clamp-2 mb-2.5"
                >
                  {post.title}
                </h2>

                {/* Summary */}
                <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">
                  {post.summary}
                </p>

                {/* Quick Highlights Pill Box */}
                {post.highlights && post.highlights.length > 0 && (
                  <div className="bg-slate-50 rounded-xl p-3 mb-4 space-y-1 border border-slate-100 text-xs">
                    {post.highlights.slice(0, 2).map((h, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500">{h.label}</span>
                        <span className="font-bold text-slate-800 font-num">{h.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="font-display text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Footer Action Rail */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTimeMinutes}분 소요
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedPost(post)}
                    className="font-display text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 transition cursor-pointer text-xs"
                  >
                    <span>본문 읽기</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* 4. Full Post Reader Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 md:p-8 space-y-6 my-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`font-display text-xs font-bold px-2.5 py-0.5 rounded-md border ${CATEGORY_META[selectedPost.category].bg} ${CATEGORY_META[selectedPost.category].color}`}>
                    {CATEGORY_META[selectedPost.category].icon} {CATEGORY_META[selectedPost.category].name}
                  </span>
                  <span className="text-xs text-slate-400">
                    발행일: {selectedPost.date} {selectedPost.scheduledTime}
                  </span>
                </div>
                <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-950 leading-tight">
                  {selectedPost.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition cursor-pointer shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Author & Meta Row */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex items-center gap-4">
                <span>작성: <strong>{selectedPost.author}</strong></span>
                <span>예상 소요시간: <strong>{selectedPost.readTimeMinutes}분</strong></span>
                <span>조회수: <strong>{selectedPost.viewCount.toLocaleString()}회</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyLink(selectedPost.id)}
                  className="font-display px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedNotification ? '링크 복사됨!' : '공유하기'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="font-display px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>인쇄</span>
                </button>
              </div>
            </div>

            {/* Key Highlights Table */}
            {selectedPost.highlights && selectedPost.highlights.length > 0 && (
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 md:p-5 space-y-2.5">
                <p className="font-heading text-xs sm:text-sm font-black text-indigo-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  핵심 요약 & 법정 기준 포인트
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedPost.highlights.map((h, i) => (
                    <div key={i} className="bg-white p-2.5 rounded-xl border border-indigo-100 flex justify-between items-center shadow-2xs">
                      <span className="text-slate-600 font-medium">{h.label}</span>
                      <span className="font-bold text-indigo-900 font-num">{h.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Post Rich Content Body */}
            <div className="prose prose-slate max-w-none text-slate-700 text-xs sm:text-sm leading-relaxed space-y-4 font-body">
              {selectedPost.content.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('## ')) {
                  return (
                    <h3 key={idx} className="font-heading text-lg font-black text-slate-900 mt-5 mb-2 border-b border-slate-100 pb-2">
                      {paragraph.replace('## ', '')}
                    </h3>
                  );
                }
                if (paragraph.startsWith('### ')) {
                  return (
                    <h4 key={idx} className="font-heading text-base font-bold text-slate-800 mt-4 mb-1">
                      {paragraph.replace('### ', '')}
                    </h4>
                  );
                }
                if (paragraph.startsWith('> ')) {
                  return (
                    <div key={idx} className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-xl text-amber-900 text-xs my-3 font-medium">
                      {paragraph.replace('> ', '')}
                    </div>
                  );
                }
                return (
                  <p key={idx} className="text-slate-700 leading-relaxed whitespace-pre-line">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Legal Basis Callout */}
            {selectedPost.legalBasis && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>관련 법령 및 행정 근거: <strong>{selectedPost.legalBasis}</strong></span>
                </div>
              </div>
            )}

            {/* Related Calculator CTA */}
            {selectedPost.relatedCalculatorId && (
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
                <div>
                  <p className="font-heading text-xs font-bold text-blue-100">이 칼럼의 내용으로 직접 연산해 보세요</p>
                  <p className="font-heading text-base sm:text-lg font-black mt-0.5">{selectedPost.relatedCalculatorName || '모의계산기 바로가기'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedPost.relatedCalculatorId) {
                      onNavigateToCalculator(selectedPost.relatedCalculatorId);
                      setSelectedPost(null);
                    }
                  }}
                  className="font-display px-4 py-2.5 bg-white hover:bg-slate-100 text-blue-700 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer shrink-0"
                >
                  <span>계산기 실행하기</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Close Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="font-display px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
