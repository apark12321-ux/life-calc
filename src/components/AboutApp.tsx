import React from 'react';
import { ShieldCheck, UserCheck, CalendarDays, Sparkles, BookOpenCheck, ChevronRight } from 'lucide-react';
import { CategoryType } from '../types';

interface AboutAppProps {
  onSelectCategory: (cat: CategoryType) => void;
  onNavigateToCalculator: (id: string) => void;
}

export default function AboutApp({ onSelectCategory, onNavigateToCalculator }: AboutAppProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 md:p-10 space-y-10 text-slate-700 leading-relaxed font-body shadow-xs">
      
      {/* 0. Regular Series Planning Notice Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-7 border border-indigo-500/20 shadow-md relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-400/20 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-indigo-600/60 border border-indigo-400/30 text-[11px] font-black text-indigo-200 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-300" />
              정기 기획 연재 안내
            </span>
            <span className="text-xs text-slate-300 font-medium hidden sm:inline">
              매주 수요일 업데이트
            </span>
          </div>
          <span className="text-[11px] text-indigo-300 font-bold flex items-center gap-1">
            <CalendarDays className="w-3.5 h-3.5" />
            2026 특별 기획 시리즈
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="font-heading text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5 text-indigo-400 shrink-0" />
            <span>[연재 기획] 11년차 박과장의 직장인 연차별 생존·자산 전략</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            사회초년생부터 팀장급까지, 각 연차별로 반드시 챙겨야 할 <strong>급여명세서 비밀·청약/주거 사다리·이직 협상·퇴직금 관리 노하우</strong>를 매주 실무 데이터와 함께 집중 연재합니다.
          </p>
        </div>

        {/* Series Roadmap Schedule Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10 space-y-1">
            <span className="text-[10px] font-black text-indigo-300">1단계 (1~3년차)</span>
            <h3 className="font-heading font-black text-xs text-white">첫 통장과 청약의 기초</h3>
            <p className="text-[11px] text-slate-300 line-clamp-2">실수령액 파악, 청년도약계좌 및 소득공제 세팅</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10 space-y-1">
            <span className="text-[10px] font-black text-amber-300">2단계 (4~7년차)</span>
            <h3 className="font-heading font-black text-xs text-white">이직 연봉협상과 주거 사다리</h3>
            <p className="text-[11px] text-slate-300 line-clamp-2">원천징수 기반 협상, 디딤돌·버팀목 대출 활용</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10 space-y-1">
            <span className="text-[10px] font-black text-emerald-300">3단계 (8년차 이상)</span>
            <h3 className="font-heading font-black text-xs text-white">퇴직연금(IRP)과 절세 파이프라인</h3>
            <p className="text-[11px] text-slate-300 line-clamp-2">DB/DC 전환 타이밍, ISA 계좌 만기 연금 전환</p>
          </div>
        </div>

        <div className="pt-1 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-400 text-[11px]">
            * 연재되는 모든 콘텐츠는 '직장·급여·퇴직' 및 '연금·금융·절세' 카테고리에 순차 수록됩니다.
          </span>
          <button
            type="button"
            onClick={() => onSelectCategory('work')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-500/30 hover:bg-indigo-500/50 text-indigo-200 border border-indigo-400/30 font-bold transition cursor-pointer"
          >
            <span>직장·급여 최신 칼럼 보러가기</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 1. Page Header & Author Persona */}
      <div className="border-b border-slate-100 pb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-950 to-slate-900 text-white flex items-center justify-center font-black shadow-md shrink-0">
          <UserCheck className="w-10 h-10 text-indigo-300" />
        </div>
        <div className="space-y-2 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-950">
              박과장의 생활경제 노트
            </h1>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full border border-indigo-200">
              10년차 데이터 기획자 · 11년차 직장인
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            "관행이라는 말에 속지 마세요. 내 피 같은 월급과 자산은 직접 두드린 숫자만이 지켜줍니다."
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-slate-700 font-semibold">2026년 공공 고시 산식 기준 실시간 모의계산기 제공</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Story Behind the Blog - Authentic Failures & Philosophy */}
      <section className="space-y-4">
        <h2 className="font-heading text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-indigo-600" />
          <span>운영자 소개 및 사이트 탄생 비하인드</span>
        </h2>
        
        <div className="bg-slate-50 p-6 sm:p-7 rounded-2xl border border-slate-200/80 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
          <p>
            안녕하세요. 지난 10년 동안 IT 및 대기업 실무에서 데이터를 분석하고 다뤄온 데이터 기획자이자, 대한민국 평범한 11년차 직장인 <strong>박과장</strong>입니다.
          </p>
          
          <div className="space-y-2 bg-white p-4 sm:p-5 rounded-xl border border-slate-200">
            <h3 className="font-heading font-black text-slate-950 text-sm flex items-center gap-1.5">
              <span className="text-indigo-600 font-bold">※</span>
              <span>제가 이 사이트와 계산기를 직접 만든 진짜 이유</span>
            </h3>
            <p className="text-slate-600">
              사회초년생 시절, 첫 직장을 이직하면서 회사에서 준 퇴직금 명세서에 그냥 서명했습니다. 
              나중에야 정기상여금과 미사용 연차수당이 평균임금에 제대로 산입되지 않아 <strong>무려 180만 원이 덜 입금되었다는 사실</strong>을 뒤늦게 알았습니다. 
              전셋집을 구할 때는 법정 중개보수 상한 요율을 몰라 부동산에서 부르는 대로 복비를 냈고, 첫 집을 살 때는 감면 서류 기준을 놓쳐 구청을 세 번이나 오가며 환급받아야 했습니다.
            </p>
            <p className="text-slate-600 font-medium pt-1">
              "법과 제도는 분명 존재하지만, 내가 직접 계산기를 두드려 증명하지 않으면 세상은 아무것도 챙겨주지 않는다"는 뼈아픈 교훈을 얻었습니다.
            </p>
          </div>

          <p>
            시중에 떠도는 수많은 재테크 글들은 복사해 붙여넣은 듯한 딱딱한 법 조항이나 출처 불명의 카더라 정보뿐이었습니다. 
            그래서 제가 10년간 다뤄온 데이터 기획 경험을 살려, <strong>2026년 최신 고시·세법 공식을 1원 단위까지 엑셀로 역산하고 모의계산기로 직접 코딩하여 구현한 공간</strong>이 바로 이 블로그입니다.
          </p>
        </div>
      </section>

      {/* 3. Operational Philosophy (E-E-A-T) */}
      <section className="space-y-4">
        <h2 className="font-heading text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <span>박과장의 3대 운영 원칙 (Human Touch & E-E-A-T)</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-sm">
              ■
            </div>
            <h3 className="font-heading font-black text-slate-900 text-sm">1. 공공 고시 기준 산식 산출</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              모호한 추측성 정보 대신, 고용노동부·국세청·국민건강보험공단의 2026년 최신 고시 데이터를 토대로 직접 역산한 공식을 전달합니다.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-black text-sm">
              ◆
            </div>
            <h3 className="font-heading font-black text-slate-900 text-sm">2. 기계적 서식 탈피와 경험담</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              뻔한 사전식 정의 대신, 실제 직장 생활과 계약 현장에서 겪었던 갈등, 시행착오, 주관적 팁을 담아 친근하고 생생하게 풀어냅니다.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-sm">
              ●
            </div>
            <h3 className="font-heading font-black text-slate-900 text-sm">3. 즉시 실천하는 Action Item</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              글을 읽고 끝나는 것이 아니라, 오늘 퇴근 전 급여명세서를 확인하거나 8종의 자체 모의계산기를 통해 1분 만에 내 권리를 지킬 수 있도록 돕습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Feedback Guide Box */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-3">
        <h3 className="font-heading text-lg font-black text-white flex items-center gap-2">
          <span>의견 및 피드백</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          칼럼 내용에 대한 질문이나 계산 검증 관련 의견은 각 칼럼 하단의 댓글란을 통해 자유롭게 남겨주실 수 있습니다.
        </p>
      </section>

    </div>
  );
}
