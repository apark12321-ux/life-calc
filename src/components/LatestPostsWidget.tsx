import React, { useState, useEffect } from 'react';
import { PostItem, DailyScheduleReport } from '../types';
import { generateDailySchedule, getAllPostsWithSchedule } from '../utils/postScheduler';
import { CATEGORY_META } from '../data/postsData';
import { Sparkles, Clock, CheckCircle2, ChevronRight, Newspaper } from 'lucide-react';

interface LatestPostsWidgetProps {
  onNavigateToMagazine: () => void;
  onNavigateToCalculator: (id: string) => void;
}

export default function LatestPostsWidget({ onNavigateToMagazine, onNavigateToCalculator }: LatestPostsWidgetProps) {
  const [scheduleReport, setScheduleReport] = useState<DailyScheduleReport | null>(null);
  const [todayPosts, setTodayPosts] = useState<PostItem[]>([]);

  useEffect(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const report = generateDailySchedule(todayStr, today);
    setScheduleReport(report);
    const posts = getAllPostsWithSchedule(today, { includeScheduled: true });
    setTodayPosts(posts.filter(p => p.date === todayStr));
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <span className="font-heading text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
          <Newspaper className="w-4 h-4 text-indigo-600" />
          오늘의 자동 발행 칼럼
        </span>
        <button
          type="button"
          onClick={onNavigateToMagazine}
          className="font-display text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5 cursor-pointer"
        >
          <span>전체보기</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Auto-posting status banner */}
      <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-2.5 text-[11px] text-indigo-900 space-y-1">
        <div className="flex items-center justify-between font-bold">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            1일 1포스팅 4시간 간격 분산
          </span>
          <span className="font-num text-indigo-700 bg-white px-1.5 py-0.5 rounded border border-indigo-200 text-[10px]">
            {scheduleReport?.publishedCount || 0}/5 완료
          </span>
        </div>
        {scheduleReport?.nextScheduledSlot && (
          <p className="text-slate-600 text-[10px]">
            다음 포스팅: <strong>{scheduleReport.nextScheduledSlot.categoryName}</strong> (⏰ {scheduleReport.nextScheduledSlot.scheduledTimeStr})
          </p>
        )}
      </div>

      {/* Today's 5 category posts mini list */}
      <div className="space-y-2.5">
        {todayPosts.slice(0, 4).map((post) => {
          const meta = CATEGORY_META[post.category];
          const isScheduled = post.status === 'scheduled';

          return (
            <div
              key={post.id}
              onClick={onNavigateToMagazine}
              className={`p-2.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                isScheduled
                  ? 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/80'
                  : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-display text-[10px] font-bold text-slate-600 flex items-center gap-1">
                  <span>{meta.icon}</span>
                  <span>{meta.name}</span>
                </span>
                {isScheduled ? (
                  <span className="font-display text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                    {post.scheduledTime} 예약
                  </span>
                ) : (
                  <span className="font-display text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 flex items-center gap-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                    발행완료
                  </span>
                )}
              </div>
              <p className="font-heading text-xs font-bold text-slate-800 line-clamp-1 hover:text-indigo-600 transition">
                {post.title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
