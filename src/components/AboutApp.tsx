import React from 'react';
import { BookOpen, Map, HelpCircle, CheckCircle2, Award, Users } from 'lucide-react';

interface AboutAppProps {
  onNavigateToCalculator: (id: string) => void;
}

export default function AboutApp({ onNavigateToCalculator }: AboutAppProps) {
  const sitemapItems = [
    { id: 'insurance', name: '🛡️ 4대사회보험 모의계산기', desc: '국민연금, 건강보험, 노인장기요양, 고용보험, 산재보험 기입 계산 및 사업주/근로자 기여분 분할해석' },
    { id: 'wage_hourly', name: '⏱ 시급 및 주휴수당 환산', desc: '2026 최저임금(10,320원) 기반 주수정근무 주휴시간 보정 및 예상 월임금 환산 가이드' },
    { id: 'wage_salary', name: '💰 연봉 실수령액 세전세후 계산', desc: '의무 공제세금(간이소득세, 주민세 등)과 4대보험 자동 공제를 제외한 소득실수령 NET 산정' },
    { id: 'wage_retirement', name: '🏢 퇴직금 예산 시뮬레이터', desc: '최종 3개월 평균 근무일당 기반 법정 기준 퇴직연금 수령액 모의 추정' },
    { id: 'wage_unemployment', name: '☂ 실업급여 수령일수 모의', desc: '비자발적 이직 및 나이/근로기간 대비 고용노동부 가이드 구직일당 구산' },
    { id: 'life_age', name: '🎂 만나이 및 전통 띠 계산기', desc: '생년월약에 입각한 개정 만나이 체킹 및 입춘 전통 기점의 상징 띠 분석' },
    { id: 'life_dday', name: '💖 날짜 간격 및 커플 주년 계산', desc: '커플 백일, 천일 기념일부터 국가 자격증 디데이 도래 타임 연산' },
    { id: 'life_school', name: '🎓 학년 입학/졸업 연도 역산', desc: '출생연도에 기반한 한국식 표준 초교, 중교, 고교, 대학 입학졸업년도 자동 트레이싱' },
    { id: 'finance_savings', name: '💸 예적금 이자과세 계산기', desc: '단리/복리 및 비과세 혜택 구도에 따른 저축이자 만기 수령액 총액 환산' },
    { id: 'finance_loan', name: '💳 대출 이자 상환 스케줄러', desc: '원리금 균등, 원금 균등, 만기일시 상환 구분별 초회차 6개월 페이 테이블' },
    { id: 'property_size', name: '📏 아파트 전용 ㎡ ↔ 평형 변환', desc: '국민평형 84제곱미터 등의 표준 아파트 실 평수 상호 전단 퀵스케일 변환' },
    { id: 'property_agent', name: '📂 부동산 법정 요율 중개 복비', desc: '주택거래 매매/임대 세분화에 따른 최대 수수료 한도 및 부가세 예측' },
    { id: 'property_tax', name: '🏛 주택 취득세 간이 세율표', desc: '매매금액, 85㎡ 초과 여부, 일가구 주택조건에 준한 취득세 부과 모의산수' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-100 p-5 md:p-8 space-y-8 text-slate-700 leading-relaxed font-sans text-xs md:text-sm">
      {/* Page Header */}
      <div className="border-b border-slate-100 pb-5">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">서비스 소개 (About Portal)</h1>
            <p className="text-xs text-slate-500 mt-0.5">실생활의 복잡한 보수 세무 및 일생 행정 계산을 가장 깔끔하고 신속하게 풀어 드립니다.</p>
          </div>
        </div>
      </div>

      {/* Intro Mission Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 rounded-xl p-5 border border-slate-150">
        <div className="space-y-2">
          <h3 className="font-bold text-slate-900 flex items-center">
            <Users className="w-4 h-4 text-indigo-600 mr-2" />
            서비스 설립 취지 및 가치
          </h3>
          <p className="text-[11px] text-slate-650">
            실생활의 중요한 고비마다 마주하는 4대보험, 실수령 세금, 전세 복비 등의 복잡한 계산은 국가별 정보나 법안 수정 내용이 제때 반영되지 않아 불필요한 행정 탐색 시간을 유발합니다. 
            이에 당 서비스는 2026년 기준 갱신 완료된 대한민국 사회안전망 법령 및 표준 가이드를 대입하여, 가짜 mock-up 데이터 없이 가장 유용하고 정확한 원스톱 모의 결과를 전파하기위해 구상되었습니다.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-slate-900 flex items-center">
            <Award className="w-4 h-4 text-emerald-600 mr-2" />
            주요 차별화 가치
          </h3>
          <ul className="space-y-1 text-[11px] text-slate-600">
            <li className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>최신 2026 규정 (최저시급 10,320원 등) 완벽 대응</span>
            </li>
            <li className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>개인정보 보존 일절 없는 100% 브라우저 기반 안전 설계</span>
            </li>
            <li className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>검증된 세무 학설 및 정밀 산식 설명 텍스트 동시 수급</span>
            </li>
          </ul>
        </div>
      </div>

      {/* HTML Sitemap Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Map className="w-4 h-4 text-indigo-600" />
          구글 로봇 친화형 통합 사이트맵 (HTML Sitemap Index)
        </h2>
        <p className="text-[11px] text-slate-500">
          본 색인 인덱스는 구글 크롤링 봇(Crawler)의 효율적인 링크 순회를 장려하고 가치 지향적 하이퍼텍스트 구조를 형성하기 위해 디자인되었습니다. 메뉴 명칭을 클릭하면 해당하는 정밀 모의계산기로 이동합니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sitemapItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigateToCalculator(item.id)}
              className="group block text-left bg-white hover:bg-slate-50 p-3.5 rounded-xl border border-slate-150 transition-all hover:border-indigo-400 hover:shadow-xs"
            >
              <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-xs flex items-center justify-between">
                <span>{item.name}</span>
                <span className="text-[10px] text-indigo-400">바로가기 ➔</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 lines-clamp-2 leading-relaxed">
                {item.desc}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
