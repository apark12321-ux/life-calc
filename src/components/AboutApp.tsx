import React from 'react';
import { ShieldCheck, UserCheck, CalendarDays, Sparkles, BookOpenCheck, ChevronRight, FileCheck, Landmark, CheckCircle2 } from 'lucide-react';
import { CategoryType } from '../types';

interface AboutAppProps {
  onSelectCategory: (cat: CategoryType) => void;
  onNavigateToCalculator: (id: string) => void;
}

export default function AboutApp({ onSelectCategory, onNavigateToCalculator }: AboutAppProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 md:p-10 space-y-10 text-slate-700 leading-relaxed font-body shadow-xs">
      
      {/* 1. Page Header & Author Persona */}
      <div className="border-b border-slate-100 pb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white flex items-center justify-center font-black shadow-md shrink-0">
          <UserCheck className="w-10 h-10 text-indigo-300" />
        </div>
        <div className="space-y-2 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-950">
              박과장의 생활경제 노트 소개
            </h1>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>11년차 직장인 실무 검증</span>
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            &ldquo;관행이라는 말에 속지 마세요. 내 피 같은 월급과 자산은 법령과 숫자로 직접 증명할 때 지켜집니다.&rdquo;
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-slate-700 font-semibold">2026년 정부 공공 고시 및 세법 개정안 산식 전수 반영</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Story Behind the Blog - Authentic Experience & Purpose */}
      <section className="space-y-4">
        <h2 className="font-heading text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-indigo-600" />
          <span>운영자 소개 및 블로그 설립 목적</span>
        </h2>
        
        <div className="bg-slate-50 p-6 sm:p-7 rounded-2xl border border-slate-200 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            안녕하세요. 지난 10년 이상 IT 및 대기업 실무에서 데이터를 분석하고 기획해 온 데이터 기획자이자, 대한민국 평범한 11년차 직장인 <strong>박과장</strong>입니다.
          </p>
          
          <div className="space-y-2.5 bg-white p-5 rounded-2xl border border-slate-200">
            <h3 className="font-heading font-black text-slate-950 text-sm flex items-center gap-1.5">
              <span className="text-indigo-600 font-bold">※</span>
              <span>퇴직금 180만 원 누락에서 시작된 실전 기록</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              직장 생활 5년 차에 첫 이직을 하던 날, 회사에서 건네준 퇴직금 명세서에 서명했습니다. 
              나중에 세무 영수증을 훑어보다가, 최근 1년간 받았던 정기상여금과 미사용 연차수당이 법정 평균임금 산정에서 통째로 누락되어 <strong>무려 180만 원이 덜 지급되었다는 사실</strong>을 확인했습니다. 
              근로기준법 조항과 엑셀 계산식을 정리해 정중히 청구하여 180만 원을 전액 소급 수령했습니다.
            </p>
            <p className="text-slate-600 leading-relaxed pt-1">
              생애최초 주택을 마련할 때도 200만 원 취득세 감면 서류 기준을 지자체 창구에서 직접 확인하고 환급받았으며, 전월세 계약 시 법정 중개보수 상한 요율을 몰라 과다 지급하는 동료들을 숱하게 목격했습니다.
            </p>
          </div>

          <p>
            복사해 붙여넣은 듯한 딱딱한 법령 조문이나 출처 불명의 재테크 카더라 대신, <strong>2026년 최신 고시·세법 공식을 1원 단위까지 엑셀로 역산하고 모의계산기로 구현한 공간</strong>이 바로 '박과장의 생활경제 노트'입니다.
          </p>
        </div>
      </section>

      {/* 3. Operational Standards & E-E-A-T Principles */}
      <section className="space-y-4">
        <h2 className="font-heading text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <span>박과장의 3대 편집 및 팩트체크 원칙</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-sm">
              ■
            </div>
            <h3 className="font-heading font-black text-slate-900 text-sm">1. 정부 공식 고시 기준 산출</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              추측이나 관행 대신, 고용노동부·국세청·국민건강보험공단·행정안전부의 2026년 공공 고시 및 법령을 1차 원전으로 삼아 검증합니다.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-black text-sm">
              ◆
            </div>
            <h3 className="font-heading font-black text-slate-900 text-sm">2. 실제 현장 경험 기반 작성</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              사전식 나열을 배제하고, 실제 급여 협상, 이직, 주택 매매, 연말정산 현장에서 겪은 현실적 유의점과 실수 방지 노하우를 솔직하게 기록합니다.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-sm">
              ●
            </div>
            <h3 className="font-heading font-black text-slate-900 text-sm">3. 자체 모의계산기 검증 연계</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              단순히 글을 읽는 데 그치지 않고, 8종의 자체 개발 모의계산기를 통해 내 연봉, 퇴직금, 복비, 대출 이자를 1초 만에 직접 계산할 수 있도록 연결합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Official Data Sources & Legal Citations */}
      <section className="space-y-4">
        <h2 className="font-heading text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-indigo-600" />
          <span>공식 법령 및 데이터 인용 출처</span>
        </h2>
        
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 text-xs text-slate-700">
          <p className="leading-relaxed">
            본 블로그에 수록된 모든 산식과 기준은 대한민국 정부의 공식 법령 및 공공기관 고시 데이터를 근거로 합니다.
          </p>
          <ul className="space-y-1.5 list-disc pl-5">
            <li><strong>급여·퇴직금·실업급여</strong>: 고용노동부 (근로기준법, 근로자퇴직급여 보장법, 고용보험법)</li>
            <li><strong>연말정산·소득세·양도세</strong>: 국세청 홈택스 (소득세법, 조세특례제한법)</li>
            <li><strong>부동산 취득세·재산세</strong>: 행정안전부 위택스 (지방세법, 지방세특례제한법)</li>
            <li><strong>건강보험료 및 피부양자</strong>: 국민건강보험공단 (국민건강보험법 시행규칙)</li>
            <li><strong>국민연금 및 노령연금</strong>: 국민연금공단 (국민연금법 및 매년 고시 재평가율)</li>
            <li><strong>부동산 중개보수 요율</strong>: 국토교통부 및 각 시·도 주택 중개보수 조례</li>
          </ul>
        </div>
      </section>

      {/* 5. Editorial Correction and Reader Policy */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="font-heading text-lg font-black text-white flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-indigo-400" />
          <span>정정 및 업데이트 원칙</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          정부 정책, 세법 및 4대보험 요율 개정 시 관련 칼럼과 모의계산기를 즉시 갱신합니다. 
          칼럼 내용에 대한 의견이나 계산 산식에 관한 보완 제안은 각 칼럼 하단의 독자 피드백 위젯을 통해 남겨주시면 신속히 검토하여 반영하고 있습니다.
        </p>
      </section>

    </div>
  );
}
