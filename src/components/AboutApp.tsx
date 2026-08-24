import React from 'react';
import { ShieldCheck, Mail, BookOpen, Calculator, Lock, RefreshCw, ArrowRight, UserCheck } from 'lucide-react';
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
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-950 to-slate-900 text-white flex items-center justify-center font-black text-4xl shadow-md shrink-0">
          👨‍💼
        </div>
        <div className="space-y-2 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-950">
              박과장의 돈 지키는 실전 노트
            </h1>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-black px-3 py-1 rounded-full border border-indigo-100">
              11년차 직장인의 1인칭 실화 기록소
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            &ldquo;퇴직금 누락 380만원을 스스로 찾아내고, 첫 집 살 때 취득세 200만원을 깎아낸 실전 팩트만 1인칭으로 기록합니다.&rdquo;
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-indigo-600" />
              박과장 이메일: <span className="font-mono font-bold text-slate-700">contact@park-money.kr</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Story Behind the Blog */}
      <section className="space-y-4">
        <h2 className="font-heading text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-indigo-600" />
          <span>이 블로그를 시작한 이유</span>
        </h2>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
          <p>
            안녕하세요, 11년 동안 중소기업과 대기업을 거치며 월급쟁이로 살아온 <strong>박과장</strong>입니다.
          </p>
          <p>
            사회 초년생 시절, 저는 회사 인사팀이나 은행 창구 직원, 공인중개사가 말하는 대로만 믿고 살았습니다. 
            하지만 첫 이직 때 <strong>퇴직금 380만원이 누락</strong>된 것을 발견하고, 전세 만기 때 집주인에게 <strong>보증금을 떼일 뻔한 위기</strong>를 겪으면서 깨달았습니다.
          </p>
          <p className="bg-white p-3.5 rounded-xl border border-indigo-100 text-indigo-950 font-bold">
            &ldquo;세상은 결코 내 통장의 돈을 알아서 지켜주지 않는다. 내가 직접 법조항을 찾고 엑셀을 두드려봐야만 내 권리를 지킬 수 있다.&rdquo;
          </p>
          <p>
            이 블로그는 인터넷에 떠도는 뻔한 AI 복붙 글이나 홍보성 낚시 글이 아닙니다. 제가 직접 겪은 갈등과 분쟁, 그리고 <strong>2026년 최신 법령과 계산기</strong>로 1원까지 따져서 해결한 <strong>100% 팩트 기반 실전 기록</strong>입니다.
          </p>
        </div>
      </section>

      {/* 3. 3 Core Focus Areas */}
      <section className="space-y-4">
        <h2 className="font-heading text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <span>3대 핵심 기록 영역</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-sm">
              💼
            </div>
            <h3 className="font-heading font-black text-slate-900 text-sm">1. 직장·월급·퇴직</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              월급명세서 4대보험 공제 분석, 주휴·야간수당 할증, 퇴직금 평균임금 누락 방어, 권고사직 시 실업급여 수령법.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-black text-sm">
              🏠
            </div>
            <h3 className="font-heading font-black text-slate-900 text-sm">2. 내집·부동산·세금</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              생애최초 주택 취득세 200만원 감면 신청, 전월세 복비 0.4% 협상, 원금균등 대출 이자 4천만원 절약기.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-sm">
              🛡️
            </div>
            <h3 className="font-heading font-black text-slate-900 text-sm">3. 연금·보험·재테크</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              부모님 건강보험 피부양자 탈락 방어, 국민연금 조기수령 손익분기점, ISA 배당소득세 비과세 전략.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Contact Box */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-3">
        <h3 className="font-heading text-lg font-black text-white flex items-center gap-2">
          <Mail className="w-5 h-5 text-indigo-400" />
          <span>박과장에게 사연 제보 및 문의하기</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          비슷한 월급, 퇴직금, 부동산 계약, 건강보험료 분쟁을 겪고 계시거나 계산 검증이 필요하신 분은 언제든 이메일을 보내주세요.
        </p>
        <div className="pt-2">
          <a
            href="mailto:contact@park-money.kr"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <span>이메일 보내기 (contact@park-money.kr)</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

    </div>
  );
}
