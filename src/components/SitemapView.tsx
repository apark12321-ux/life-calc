import React from 'react';
import { PostItem, CategoryType } from '../types';
import { CATEGORY_META } from '../data/postsData';
import { ArrowLeft, MapPin, ExternalLink, BookOpen, Calculator, ShieldCheck, ChevronRight } from 'lucide-react';

interface SitemapViewProps {
  posts: PostItem[];
  onSelectPost: (post: PostItem) => void;
  onSelectCategory: (cat: CategoryType) => void;
  onNavigateToCalculator: (calcId: string) => void;
  onBack: () => void;
}

export default function SitemapView({
  posts,
  onSelectPost,
  onSelectCategory,
  onNavigateToCalculator,
  onBack
}: SitemapViewProps) {
  const workPosts = posts.filter(p => p.category === 'work');
  const propPosts = posts.filter(p => p.category === 'property');
  const finPosts = posts.filter(p => p.category === 'finance');

  const calculators = [
    { id: 'wage_salary', name: '연봉 실수령액 계산기', desc: '4대보험 및 소득세 공제 후 실제 통장 입금액 계산' },
    { id: 'wage_severance', name: '퇴직금 & 평균임금 계산기', desc: '최근 3개월 급여 및 상여·연차수당 3/12 반영 정산' },
    { id: 'wage_hourly', name: '시급 & 주휴수당 계산기', desc: '2026 최저시급 10,030원 기준 유급 주휴수당 계산' },
    { id: 'prop_acquisition', name: '부동산 취득세 계산기', desc: '생애최초 200만원 감면 및 주택가액별 취득세 산정' },
    { id: 'prop_brokerage', name: '부동산 중개보수(복비) 계산기', desc: '매매·전월세 상한요율 및 부가세 계산' },
    { id: 'prop_mortgage', name: '주택담보대출 상환 계산기', desc: '원금균등 vs 원리금균등 이자 차이 시뮬레이션' },
    { id: 'fin_insurance', name: '4대보험 요율 계산기', desc: '건강보험, 국민연금, 고용보험, 산재보험 총액 산출' },
    { id: 'fin_savings', name: '예적금 이자 & 복리 계산기', desc: '단리/월복리 및 일반과세/비과세 실질 수익률 비교' },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-10">
      
      {/* 1. Header */}
      <div className="space-y-3 border-b border-slate-100 pb-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>메인으로 돌아가기</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-heading text-xl sm:text-2xl font-black text-slate-950">
              전체 사이트맵 (Sitemap)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              박과장의 생활경제 노트의 모든 콘텐츠와 실생활 계산 도구를 한눈에 탐색하실 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main Blog Categories and Posts Grid */}
      <div className="space-y-8">
        <h2 className="font-heading text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <span>전체 포스팅 목차 ({posts.length}편)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Work Posts */}
          <div className="space-y-3 bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <button
                type="button"
                onClick={() => onSelectCategory('work')}
                className="font-heading font-black text-sm text-indigo-900 flex items-center gap-1.5 hover:underline cursor-pointer"
              >
                <span>💼</span>
                <span>직장·급여·퇴직 ({workPosts.length})</span>
              </button>
            </div>
            <ul className="space-y-2 text-xs">
              {workPosts.map((p, idx) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => onSelectPost(p)}
                    className="text-left text-slate-700 hover:text-indigo-600 font-medium line-clamp-2 leading-relaxed hover:underline cursor-pointer flex items-start gap-1.5"
                  >
                    <span className="text-slate-400 font-mono text-[11px] shrink-0 mt-0.5">{idx + 1}.</span>
                    <span>{p.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Posts */}
          <div className="space-y-3 bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <button
                type="button"
                onClick={() => onSelectCategory('property')}
                className="font-heading font-black text-sm text-amber-900 flex items-center gap-1.5 hover:underline cursor-pointer"
              >
                <span>🏠</span>
                <span>부동산·세금 ({propPosts.length})</span>
              </button>
            </div>
            <ul className="space-y-2 text-xs">
              {propPosts.map((p, idx) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => onSelectPost(p)}
                    className="text-left text-slate-700 hover:text-amber-700 font-medium line-clamp-2 leading-relaxed hover:underline cursor-pointer flex items-start gap-1.5"
                  >
                    <span className="text-slate-400 font-mono text-[11px] shrink-0 mt-0.5">{idx + 1}.</span>
                    <span>{p.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Finance Posts */}
          <div className="space-y-3 bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <button
                type="button"
                onClick={() => onSelectCategory('finance')}
                className="font-heading font-black text-sm text-emerald-900 flex items-center gap-1.5 hover:underline cursor-pointer"
              >
                <span>🛡️</span>
                <span>연금·금융·절세 ({finPosts.length})</span>
              </button>
            </div>
            <ul className="space-y-2 text-xs">
              {finPosts.map((p, idx) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => onSelectPost(p)}
                    className="text-left text-slate-700 hover:text-emerald-700 font-medium line-clamp-2 leading-relaxed hover:underline cursor-pointer flex items-start gap-1.5"
                  >
                    <span className="text-slate-400 font-mono text-[11px] shrink-0 mt-0.5">{idx + 1}.</span>
                    <span>{p.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* 3. Calculators Section */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <h2 className="font-heading text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-600" />
          <span>생활 금융 계산기 (8종)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {calculators.map(calc => (
            <button
              key={calc.id}
              type="button"
              onClick={() => onNavigateToCalculator(calc.id)}
              className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30 transition text-left space-y-1 group cursor-pointer"
            >
              <div className="font-heading text-xs font-black text-slate-900 group-hover:text-indigo-600 flex items-center justify-between">
                <span>{calc.name}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {calc.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Policy & Info Pages */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <h2 className="font-heading text-base font-black text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <span>안내 및 정책</span>
        </h2>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => onSelectCategory('about')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition cursor-pointer"
          >
            👨‍💼 블로그 소개
          </button>
          <button
            type="button"
            onClick={() => onSelectCategory('privacy')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition cursor-pointer"
          >
            🔒 개인정보처리방침
          </button>
          <button
            type="button"
            onClick={() => onSelectCategory('terms')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition cursor-pointer"
          >
            📄 이용약관 및 면책조항
          </button>
        </div>
      </div>

    </div>
  );
}
