import React, { useState } from 'react';
import InsuranceCalculator from './InsuranceCalculator';
import WageCalculator from './WageCalculator';
import FinanceCalculator from './FinanceCalculator';
import PropertyCalculator from './PropertyCalculator';
import LifeCalculator from './LifeCalculator';
import { Calculator, Shield, Clock, DollarSign, Home, Calendar, ArrowLeft } from 'lucide-react';
import { CategoryType } from '../types';

interface CalculatorsHubProps {
  initialTab?: string;
  onBackToBlog: () => void;
}

export default function CalculatorsHub({
  initialTab = 'insurance',
  onBackToBlog
}: CalculatorsHubProps) {
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (initialTab.startsWith('wage')) return 'wage';
    if (initialTab.startsWith('finance')) return 'finance';
    if (initialTab.startsWith('property')) return 'property';
    if (initialTab.startsWith('life')) return 'life';
    return 'insurance';
  });

  const tabs = [
    { id: 'insurance', label: '4대사회보험', icon: '🛡️', desc: '국민연금, 건강보험, 고용보험, 산재보험 모의 계산' },
    { id: 'wage', label: '급여·퇴직금', icon: '⏱', desc: '최저임금, 주휴수당, 연봉 실수령액, 퇴직금, 실업급여' },
    { id: 'finance', label: '금융·예적금·대출', icon: '💰', desc: '예금·적금 만기 이자, 대출 상환 원리금 시뮬레이션' },
    { id: 'property', label: '부동산·세금', icon: '🏠', desc: '아파트 평수 변환, 취득세 감면 계산, 중개보수 요율' },
    { id: 'life', label: '생활·날짜', icon: '🎂', desc: '만 나이 통일법 계산, 디데이(D-Day), 커플 기념일' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-100">
              박과장의 실무 검증 도구
            </span>
            <span className="text-xs text-slate-400 font-medium">2026년 개정 세법 및 노동부 고시 기준</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-950">
            실생활 금융 & 급여 모의계산기
          </h1>
          <p className="font-body text-xs sm:text-sm text-slate-600 mt-1">
            제가 회사 생활하며 엑셀로 직접 두드려 검증했던 공식들을 모아, 이웃 직장인분들이 1원 단위까지 편하게 확인하실 수 있도록 만들었습니다.
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToBlog}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>실전 칼럼으로 돌아가기</span>
        </button>
      </div>

      {/* Calculator Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {tabs.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-indigo-500/20'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{t.icon}</span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                )}
              </div>
              <div>
                <p className="font-heading text-xs sm:text-sm font-black tracking-tight">
                  {t.label}
                </p>
                <p className={`text-[11px] line-clamp-1 mt-0.5 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                  {t.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Calculator Component Container */}
      <div className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-xs">
        {activeTab === 'insurance' && <InsuranceCalculator />}
        {activeTab === 'wage' && <WageCalculator />}
        {activeTab === 'finance' && <FinanceCalculator />}
        {activeTab === 'property' && <PropertyCalculator />}
        {activeTab === 'life' && <LifeCalculator />}
      </div>
    </div>
  );
}
