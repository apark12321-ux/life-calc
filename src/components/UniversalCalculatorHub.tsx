import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ListChecks, RotateCcw, Search } from 'lucide-react';
import { CategoryType } from '../types';

type CalcCategory = Exclude<CategoryType, 'policy'>;
type FieldType = 'number' | 'date' | 'select';
type Field = {
  key: string;
  label: string;
  unit?: string;
  type?: FieldType;
  defaultValue: number | string;
  options?: Array<{ label: string; value: string }>;
};
type CalcItem = {
  id: string;
  name: string;
  category: CalcCategory;
  icon: string;
  description: string;
};
type ResultRow = { label: string; value: string; highlight?: boolean };

const categoryKeys: CalcCategory[] = [
  'insurance',
  'wage',
  'life',
  'finance',
  'property',
  'health',
  'auto',
  'education',
  'business',
  'shopping',
  'unit',
  'travel',
];

const categoryLabels: Record<CalcCategory, string> = {
  insurance: '4대보험',
  wage: '급여·퇴직금',
  life: '생활·달력',
  finance: '금융·예적금',
  property: '부동산·세금',
  health: '건강·운동',
  auto: '자동차·교통',
  education: '교육·학습',
  business: '사업·마케팅',
  shopping: '쇼핑·소비',
  unit: '단위변환',
  travel: '여행·해외',
};

const icons: Record<CalcCategory, string> = {
  insurance: '🛡️',
  wage: '💼',
  life: '🧭',
  finance: '💰',
  property: '🏠',
  health: '💪',
  auto: '🚗',
  education: '📚',
  business: '📊',
  shopping: '🛒',
  unit: '📐',
  travel: '✈️',
};

const names: Record<CalcCategory, string[]> = {
  insurance: ['4대보험 총액 계산기','국민연금 부담액 계산기','건강보험료 계산기','장기요양보험료 계산기','고용보험료 계산기','산재보험료 계산기','회사 총 인건비 계산기','급여 공제 보험료 계산기','프리랜서 3.3% 실수령액 계산기','아르바이트 월 보수 계산기','연간 보험료 예산 계산기','국민연금 상한 적용 계산기','보험료율 변경 영향 계산기','소상공인 인건비 부담 계산기','보험 공제 후 월급 계산기','일용직 4대보험 계산기','두루누리 지원금 계산기','보험료 회사부담 계산기','건보 피부양자 소득 기준 계산기','월별 보험료 비교 계산기'],
  wage: ['시급 월급 환산 계산기','주휴수당 계산기','연장근로수당 계산기','야간근로수당 계산기','휴일근로수당 계산기','연봉 월급 환산 계산기','월급 연봉 환산 계산기','월급 실수령액 계산기','퇴직금 계산기','실업급여 총액 계산기','일급 계산기','주급 계산기','성과급 수수료 계산기','상여금 실수령액 계산기','프리랜서 실수령액 계산기','최저임금 차액 계산기','지각 공제액 계산기','무급휴가 공제액 계산기','아르바이트 세금 계산기','연말정산 환급액 계산기'],
  life: ['만 나이 계산기','디데이 계산기','기념일 n일째 계산기','전기요금 계산기','가스요금 계산기','수도요금 계산기','이사 박스 수 계산기','페인트 필요량 계산기','도배지 롤 수 계산기','타일 수량 계산기','요리 비율 계산기','구독료 N분의 1 계산기','생활비 예산 계산기','식비 예산 계산기','공과금 분담 계산기','냉난방비 계산기','인터넷 위약금 계산기','휴대폰 요금 비교 계산기','가계부 저축률 계산기','공동구매 분담금 계산기'],
  finance: ['예금 단리 이자 계산기','적금 만기 수령액 계산기','복리 이자 계산기','대출 원리금 상환 계산기','대출 월이자 계산기','DSR 계산기','LTV 계산기','카드 할부 월납입 계산기','부가세 계산기','부가세 포함가 역산 계산기','할인율 계산기','마진율 계산기','판매가 산정 계산기','주식 수익률 계산기','코인 수익률 계산기','환율 환산 계산기','목표금액 월저축 계산기','비상금 필요액 계산기','물가상승 반영 계산기','연평균 수익률 계산기'],
  property: ['평수 제곱미터 변환기','제곱미터 평수 변환기','취득세 계산기','부동산 중개보수 계산기','월세 수익률 계산기','전세가율 계산기','주택담보대출 월이자 계산기','DTI 계산기','주택 LTV 계산기','전세보증금 이자기회비용 계산기','월세 전세 환산 계산기','전세 월세 환산 계산기','관리비 분담 계산기','장기수선충당금 계산기','이사비 예산 계산기','인테리어 평당 비용 계산기','부동산 투자수익률 계산기','양도차익 계산기','중개보수 부가세 포함 계산기','평당가 계산기'],
  health: ['BMI 계산기','기초대사량 계산기','하루 물 섭취량 계산기','권장 칼로리 계산기','체지방률 계산기','목표 체중 감량 기간 계산기','운동 칼로리 소모 계산기','러닝 페이스 계산기','수면 사이클 계산기','임신 주수 계산기','배란일 계산기','심박수 구간 계산기','단백질 섭취량 계산기','탄수화물 섭취량 계산기','체중 증가율 계산기','허리 엉덩이 비율 계산기','혈압 평균 계산기','금연 절약액 계산기','음주 칼로리 계산기','반려견 나이 환산 계산기'],
  auto: ['주유비 계산기','연비 계산기','주행 가능 거리 계산기','고속도로 통행료 분담 계산기','자동차 할부 계산기','자동차 감가상각 계산기','자동차 보험료 월환산 계산기','자동차세 월환산 계산기','렌터카 비용 계산기','택시비 분담 계산기','대중교통 정기권 손익 계산기','출퇴근 교통비 계산기','전기차 충전비 계산기','주차비 계산기','차량 유지비 계산기','타이어 교체 주기 계산기','엔진오일 교체 주기 계산기','차량 리스 월비용 계산기','중고차 취득비용 계산기','운전 시간 계산기'],
  education: ['평균 점수 계산기','가중 평균 계산기','등급 환산 계산기','내신 비율 계산기','시험 목표점수 계산기','오답률 계산기','정답률 계산기','공부 시간 계획 계산기','독서 속도 계산기','원고지 매수 계산기','글자수 원고지 변환 계산기','학점 GPA 계산기','출석률 계산기','결석 가능 횟수 계산기','입학연도 계산기','졸업연도 계산기','학원비 월평균 계산기','교육비 연간 계산기','온라인 강의 진도율 계산기','과제 마감 디데이 계산기'],
  business: ['손익분기점 계산기','매출 목표 계산기','광고 ROAS 계산기','광고 CPA 계산기','전환율 계산기','객단가 계산기','재구매율 계산기','마케팅 예산 계산기','인건비율 계산기','원가율 계산기','영업이익률 계산기','순이익률 계산기','부가세 납부액 계산기','프리랜서 견적 계산기','외주 견적 계산기','프로젝트 시간당 단가 계산기','재고 회전율 계산기','구독 서비스 MRR 계산기','이탈률 계산기','월 고정비 계산기'],
  shopping: ['할인가 계산기','원플러스원 단가 계산기','묶음상품 단가 계산기','쿠폰 적용가 계산기','포인트 적립 계산기','배송비 포함 단가 계산기','해외직구 관부가세 계산기','카드 청구할인 계산기','무이자 할부 월납입 계산기','최저가 비교 계산기','리터당 단가 계산기','그램당 단가 계산기','가성비 점수 계산기','예산 초과율 계산기','정기배송 절약액 계산기','환불 금액 계산기','중고거래 감가 계산기','선물 예산 분배 계산기','장보기 총액 계산기','멤버십 손익 계산기'],
  unit: ['센티미터 인치 변환기','인치 센티미터 변환기','미터 피트 변환기','킬로미터 마일 변환기','제곱미터 평수 변환기','평수 제곱미터 변환기','킬로그램 파운드 변환기','파운드 킬로그램 변환기','리터 갤런 변환기','섭씨 화씨 변환기','화씨 섭씨 변환기','시속 분속 변환기','분 초 변환기','시간 분 변환기','바이트 메가바이트 변환기','기가바이트 메가바이트 변환기','압력 단위 변환기','부피 단위 변환기','면적 단위 변환기','속도 단위 변환기'],
  travel: ['여행 경비 계산기','숙박비 분담 계산기','항공권 총액 계산기','환율 환산 계산기','여행자보험 일할 계산기','렌터카 여행비 계산기','여행 디데이 계산기','시차 계산기','일정별 예산 계산기','해외 결제 수수료 계산기','면세 한도 계산기','팁 계산기','공항버스 비용 계산기','유심 이심 비용 계산기','로밍 비용 계산기','여행 적금 계산기','가족 여행비 분담 계산기','일일 환전액 계산기','배낭 무게 계산기','마일리지 가치 계산기'],
};

export const calculatorCatalog: CalcItem[] = categoryKeys.flatMap((category) =>
  names[category].map((name, index) => ({
    id: `${category}_${String(index + 1).padStart(2, '0')}`,
    name,
    category,
    icon: icons[category],
    description: `${name.replace(' 계산기', '').replace(' 변환기', '')}에 맞는 입력값과 결과 항목으로 계산합니다.`,
  }))
);

const won = (value: number) => `${Math.round(Number.isFinite(value) ? value : 0).toLocaleString('ko-KR')}원`;
const qty = (value: number, unit = '') => `${(Math.round((Number.isFinite(value) ? value : 0) * 100) / 100).toLocaleString('ko-KR')}${unit}`;
const pct = (value: number) => qty(value, '%');
const safeDiv = (a: number, b: number) => (b ? a / b : 0);
const field = (key: string, label: string, unit: string, defaultValue: number | string, type: FieldType = 'number', options?: Field['options']): Field => ({ key, label, unit, defaultValue, type, options });
const select = (key: string, label: string, defaultValue: string, options: Field['options']): Field => field(key, label, '', defaultValue, 'select', options);
const value = (values: Record<string, string | number>, key: string) => Number(values[key] ?? 0) || 0;
const text = (values: Record<string, string | number>, key: string) => String(values[key] ?? '');
const date = (raw: string) => new Date(`${raw}T00:00:00`);
const dayMs = 24 * 60 * 60 * 1000;

function getFields(item: CalcItem): Field[] {
  const n = item.name;

  if (n.includes('나이') || n.includes('배란') || n.includes('임신') || n.includes('디데이') || n.includes('마감') || n.includes('기념일')) {
    return [
      field('baseDate', '기준일', '', '2026-06-20', 'date'),
      field('targetDate', n.includes('나이') ? '생년월일' : '목표일', '', n.includes('나이') ? '1990-01-01' : '2026-12-31', 'date'),
    ];
  }
  if (n.includes('BMI')) return [field('weight', '몸무게', 'kg', 70), field('height', '키', 'cm', 170)];
  if (n.includes('기초대사량') || n.includes('칼로리') || n.includes('단백질') || n.includes('탄수화물')) {
    return [select('gender', '성별', 'male', [{ label: '남성', value: 'male' }, { label: '여성', value: 'female' }]), field('weight', '몸무게', 'kg', 70), field('height', '키', 'cm', 170), field('age', '나이', '세', 35), field('activity', '활동계수', '배', 1.35)];
  }
  if (n.includes('평수 제곱미터')) return [field('pyeong', '평수', '평', 30)];
  if (n.includes('제곱미터 평수')) return [field('m2', '면적', '㎡', 84)];
  if (n.includes('센티미터')) return [field('cm', '센티미터', 'cm', 100)];
  if (n.includes('인치')) return [field('inch', '인치', 'in', 39.37)];
  if (n.includes('미터 피트')) return [field('meter', '미터', 'm', 10)];
  if (n.includes('킬로미터') || n.includes('마일')) return [field('km', '킬로미터', 'km', 10)];
  if (n.includes('킬로그램')) return [field('kg', '킬로그램', 'kg', 10)];
  if (n.includes('파운드')) return [field('lb', '파운드', 'lb', 22)];
  if (n.includes('리터') || n.includes('갤런')) return [field('liter', '리터', 'L', 10)];
  if (n.includes('섭씨')) return [field('celsius', '섭씨', '℃', 25)];
  if (n.includes('화씨')) return [field('fahrenheit', '화씨', '℉', 77)];
  if (n.includes('환율') || n.includes('해외') || n.includes('직구') || n.includes('면세')) return [field('foreign', '외화 금액', '달러', 1000), field('rate', '환율', '원', 1350), field('feeRate', '수수료·세율', '%', 3)];
  if (n.includes('대출') || n.includes('할부') || n.includes('리스')) return [field('principal', '원금', '원', 30000000), field('rate', '연 이율', '%', 4.5), field('months', '기간', '개월', 36)];
  if (n.includes('수익률') || n.includes('마진') || n.includes('이익률') || n.includes('원가율') || n.includes('ROAS') || n.includes('CPA') || n.includes('전환율')) return [field('sales', '매출·판매가', '원', 10000000), field('cost', '비용·원가', '원', 6500000), field('count', '전환·수량', '건', 100)];
  if (n.includes('예금') || n.includes('적금') || n.includes('복리') || n.includes('저축') || n.includes('비상금')) return [field('principal', '현재 금액', '원', 10000000), field('monthly', '월 납입액', '원', 300000), field('rate', '연 이율', '%', 4), field('months', '기간', '개월', 12)];
  if (n.includes('시급') || n.includes('주휴') || n.includes('근로') || n.includes('급여') || n.includes('월급') || n.includes('연봉') || n.includes('퇴직금')) return [field('pay', '급여·시급', '원', 3000000), field('hours', '근무시간', '시간', 160), field('rate', '공제·가산율', '%', 9.5)];
  if (n.includes('보험') || n.includes('연금') || n.includes('건보') || n.includes('고용') || n.includes('산재')) return [field('income', '월 보수', '원', 3000000), field('rate', '적용 요율', '%', 4.75), field('extraRate', '추가 요율', '%', 0.9)];
  if (n.includes('주유') || n.includes('연비') || n.includes('주행') || n.includes('교통') || n.includes('차량') || n.includes('렌터카') || n.includes('충전') || item.category === 'auto') return [field('distance', '거리', 'km', 120), field('efficiency', '효율', 'km/L', 12), field('price', '단가', '원', 1650), field('days', '일수', '일', 1)];
  if (n.includes('점수') || n.includes('평균') || n.includes('등급') || n.includes('학점') || n.includes('출석') || n.includes('진도율')) return [field('score', '획득 점수·현재값', '점', 85), field('total', '만점·전체값', '점', 100), field('weight', '반영 비율', '%', 40)];
  if (n.includes('할인') || n.includes('쿠폰') || n.includes('포인트') || n.includes('단가') || n.includes('배송비') || n.includes('멤버십')) return [field('price', '상품가', '원', 100000), field('discountRate', '할인·적립률', '%', 15), field('quantity', '수량', '개', 2), field('fee', '배송비·회비', '원', 3000)];
  if (n.includes('숙박') || n.includes('여행') || n.includes('항공') || n.includes('로밍') || n.includes('유심')) return [field('people', '인원', '명', 4), field('days', '일수', '일', 3), field('dailyCost', '1일 비용', '원', 120000), field('fixedCost', '고정비', '원', 400000)];
  if (n.includes('전기') || n.includes('가스') || n.includes('수도') || n.includes('요금') || n.includes('공과금')) return [field('usage', '사용량', '단위', 250), field('unitPrice', '단가', '원', 120), field('baseFee', '기본요금', '원', 1200)];
  return [field('amount', '기준 금액', '원', 1000000), field('rate', '비율', '%', 10), field('count', '수량·기간', '', 12)];
}

function calculate(item: CalcItem, values: Record<string, string | number>): ResultRow[] {
  const n = item.name;
  const c = item.category;
  const v = (key: string) => value(values, key);

  if (text(values, 'targetDate')) {
    const d = Math.round((date(text(values, 'targetDate')).getTime() - date(text(values, 'baseDate')).getTime()) / dayMs);
    return [{ label: n.includes('나이') ? '만 나이' : '남은 일수', value: n.includes('나이') ? `${Math.max(0, Math.floor(-d / 365.2425))}세` : qty(d, '일'), highlight: true }];
  }
  if (n.includes('BMI')) {
    const bmi = safeDiv(v('weight'), Math.pow(v('height') / 100, 2));
    return [{ label: 'BMI', value: qty(bmi), highlight: true }, { label: '판정', value: bmi >= 25 ? '과체중 이상' : bmi >= 18.5 ? '정상 범위' : '저체중' }];
  }
  if (n.includes('평수 제곱미터')) return [{ label: '제곱미터', value: qty(v('pyeong') * 3.305785, '㎡'), highlight: true }];
  if (n.includes('제곱미터 평수')) return [{ label: '평수', value: qty(v('m2') / 3.305785, '평'), highlight: true }];
  if (n.includes('센티미터')) return [{ label: '인치', value: qty(v('cm') / 2.54, 'in'), highlight: true }];
  if (n.includes('인치')) return [{ label: '센티미터', value: qty(v('inch') * 2.54, 'cm'), highlight: true }];
  if (n.includes('미터 피트')) return [{ label: '피트', value: qty(v('meter') * 3.28084, 'ft'), highlight: true }];
  if (n.includes('킬로미터') || n.includes('마일')) return [{ label: '마일', value: qty(v('km') * 0.621371, 'mi'), highlight: true }];
  if (n.includes('킬로그램')) return [{ label: '파운드', value: qty(v('kg') * 2.20462, 'lb'), highlight: true }];
  if (n.includes('파운드')) return [{ label: '킬로그램', value: qty(v('lb') / 2.20462, 'kg'), highlight: true }];
  if (n.includes('리터') || n.includes('갤런')) return [{ label: '갤런', value: qty(v('liter') * 0.264172, 'gal'), highlight: true }];
  if (n.includes('섭씨')) return [{ label: '화씨', value: qty(v('celsius') * 9 / 5 + 32, '℉'), highlight: true }];
  if (n.includes('화씨')) return [{ label: '섭씨', value: qty((v('fahrenheit') - 32) * 5 / 9, '℃'), highlight: true }];
  if (n.includes('대출') || n.includes('할부') || n.includes('리스')) {
    const r = v('rate') / 100 / 12;
    const m = v('months');
    const pay = r ? v('principal') * r * Math.pow(1 + r, m) / (Math.pow(1 + r, m) - 1) : safeDiv(v('principal'), m);
    return [{ label: '월 납입액', value: won(pay), highlight: true }, { label: '총 이자', value: won(pay * m - v('principal')) }];
  }
  if (n.includes('환율') || n.includes('해외') || n.includes('직구') || n.includes('면세')) return [{ label: '원화 환산액', value: won(v('foreign') * v('rate') * (1 + v('feeRate') / 100)), highlight: true }];
  if (n.includes('예금') || n.includes('적금') || n.includes('복리') || n.includes('저축') || n.includes('비상금')) {
    const total = v('principal') + v('monthly') * v('months');
    const interest = total * v('rate') / 100 * v('months') / 12;
    return [{ label: '예상 총액', value: won(total + interest), highlight: true }, { label: '예상 이자', value: won(interest) }];
  }
  if (n.includes('수익률') || n.includes('마진') || n.includes('이익률') || n.includes('원가율') || n.includes('ROAS') || n.includes('전환율')) {
    const profit = v('sales') - v('cost');
    return [{ label: '손익', value: won(profit), highlight: true }, { label: '비율', value: pct(safeDiv(profit, v('sales')) * 100) }];
  }
  if (n.includes('주유') || n.includes('연비') || n.includes('주행') || c === 'auto') return [{ label: '예상 비용', value: won(safeDiv(v('distance'), v('efficiency')) * v('price') * v('days')), highlight: true }, { label: '사용량', value: qty(safeDiv(v('distance'), v('efficiency')) * v('days'), 'L/kWh') }];
  if (c === 'education') return [{ label: '환산 점수', value: qty(safeDiv(v('score'), v('total')) * v('weight'), '점'), highlight: true }, { label: '달성률', value: pct(safeDiv(v('score'), v('total')) * 100) }];
  if (c === 'shopping') {
    const total = v('price') * v('quantity') * (1 - v('discountRate') / 100) + v('fee');
    return [{ label: '최종 결제액', value: won(total), highlight: true }, { label: '개당 단가', value: won(safeDiv(total, v('quantity'))) }];
  }
  if (c === 'travel') {
    const total = v('people') * v('days') * v('dailyCost') + v('fixedCost');
    return [{ label: '총 여행비', value: won(total), highlight: true }, { label: '1인 부담액', value: won(safeDiv(total, v('people'))) }];
  }
  if (c === 'health') {
    const base = 10 * v('weight') + 6.25 * v('height') - 5 * v('age') + 5;
    return [{ label: '예상 기준값', value: qty(base * v('activity'), 'kcal'), highlight: true }];
  }
  if (c === 'insurance' || c === 'wage') return [{ label: '예상 공제·수당', value: won(v('income') * v('rate') / 100 || v('pay') * v('rate') / 100), highlight: true }];
  if (c === 'life') return [{ label: '예상 금액', value: won(v('usage') * v('unitPrice') + v('baseFee') || v('amount') * v('count')), highlight: true }];
  return [{ label: '계산 결과', value: won(v('amount') * v('rate') / 100 * v('count')), highlight: true }];
}

export default function UniversalCalculatorHub({ category, subCalculatorId = 'all' }: { category: CategoryType; subCalculatorId?: string }) {
  const [query, setQuery] = useState('');
  const activeCategory = categoryKeys.includes(category as CalcCategory) ? (category as CalcCategory) : 'insurance';
  const available = useMemo(() => calculatorCatalog.filter((item) => item.category === activeCategory), [activeCategory]);
  const initial = calculatorCatalog.find((item) => item.id === subCalculatorId) || available[0] || calculatorCatalog[0];
  const [selectedId, setSelectedId] = useState(initial.id);
  const selected = calculatorCatalog.find((item) => item.id === selectedId) || initial;
  const fields = useMemo(() => getFields(selected), [selected]);
  const [values, setValues] = useState<Record<string, string | number>>({});

  useEffect(() => {
    if (!available.some((item) => item.id === selectedId)) setSelectedId((available[0] || calculatorCatalog[0]).id);
  }, [available, selectedId]);

  useEffect(() => {
    setValues(Object.fromEntries(fields.map((f) => [f.key, f.defaultValue])));
  }, [selected.id, fields]);

  const filtered = useMemo(
    () => available.filter((item) => !query || `${item.name} ${item.description}`.toLowerCase().includes(query.toLowerCase())),
    [available, query]
  );
  const result = calculate(selected, values);
  const counts = useMemo(() => Object.fromEntries(categoryKeys.map((key) => [key, names[key].length])) as Record<CalcCategory, number>, []);

  const choose = (id: string) => {
    setSelectedId(id);
    const url = new URL(window.location.href);
    url.searchParams.set('calc', id);
    window.history.replaceState(null, '', url.toString());
    if (window.innerWidth < 1024) {
      window.setTimeout(() => document.getElementById('calc-result-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
    }
  };

  return (
    <section className="bg-white border border-slate-100 shadow-xs rounded-none sm:rounded-2xl px-3 py-4 sm:p-6 lg:p-8 overflow-hidden">
      <div className="border-b border-slate-100 pb-4 sm:pb-6 mb-4 sm:mb-6">
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4 sm:gap-5">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-extrabold mb-2 sm:mb-3">
              <ListChecks className="w-3.5 h-3.5 shrink-0" />
              <span>계산기 {calculatorCatalog.length}종</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-slate-900 leading-tight">생활계산기 천국 {calculatorCatalog.length}종 모음</h1>
            <p className="text-[13px] sm:text-sm text-slate-500 mt-2 max-w-3xl leading-relaxed">모바일에서도 입력·계산·결과 확인이 끊기지 않도록 글자 크기, 간격, 카드 배열을 다시 맞췄습니다.</p>
          </div>

          <div className="-mx-1 px-1 overflow-x-auto scrollbar-none xl:overflow-visible xl:mx-0 xl:px-0">
            <div className="flex xl:flex-wrap gap-2 min-w-max xl:min-w-0 xl:justify-end">
              <div className="min-w-[76px] rounded-xl bg-slate-900 text-white px-3 py-2 text-center">
                <p className="text-base sm:text-lg font-black leading-none">{calculatorCatalog.length}</p>
                <p className="text-[10px] text-slate-300 font-bold mt-1">전체</p>
              </div>
              {categoryKeys.map((key) => (
                <button key={key} onClick={() => setQuery('')} className="min-w-[76px] rounded-xl bg-slate-50 border border-slate-100 px-3 py-2 text-center">
                  <p className="text-base sm:text-lg font-black leading-none text-slate-900">{counts[key]}</p>
                  <p className="text-[10px] text-slate-500 font-bold mt-1 whitespace-nowrap">{categoryLabels[key]}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(360px,430px)] gap-4 sm:gap-6 items-start">
        <aside id="calc-result-panel" className="order-1 lg:order-2 bg-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-lg h-fit lg:sticky lg:top-4 print-result scroll-mt-20">
          <div className="flex items-start gap-3 border-b border-white/10 pb-4 mb-4 sm:mb-5">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl shrink-0">{selected.icon}</div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-[11px] font-black text-blue-200 uppercase tracking-wider">{categoryLabels[selected.category]}</p>
              <h2 className="text-base sm:text-lg font-black leading-tight mt-1 break-keep">{selected.name}</h2>
              <p className="text-[12px] sm:text-xs text-slate-300 mt-1 leading-relaxed break-keep">{selected.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 print-hide">
            {fields.map((f) => (
              <label key={f.key} className="block min-w-0">
                <span className="block text-[13px] sm:text-xs font-bold text-slate-300 mb-1.5">{f.label}{f.unit ? ` (${f.unit})` : ''}</span>
                {f.type === 'select' ? (
                  <select
                    value={String(values[f.key] ?? f.defaultValue)}
                    onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full min-h-11 rounded-xl border border-white/10 bg-slate-800 px-3 py-3 text-base sm:text-sm text-white font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-400"
                  >
                    {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : (
                  <input
                    type={f.type || 'number'}
                    inputMode={(f.type || 'number') === 'number' ? 'decimal' : undefined}
                    value={String(values[f.key] ?? f.defaultValue)}
                    onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: (f.type || 'number') === 'number' ? Number(e.target.value) : e.target.value }))}
                    className="w-full min-h-11 rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-right text-base sm:text-sm text-white font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-400"
                  />
                )}
              </label>
            ))}
          </div>

          <div className="mt-4 sm:mt-5 rounded-2xl bg-white text-slate-900 p-3 sm:p-4 space-y-2 print-result-box">
            {result.map((row) => (
              <div key={row.label} className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 ${row.highlight ? 'bg-blue-50' : 'bg-slate-50'}`}>
                <span className="text-[13px] sm:text-xs font-bold text-slate-500">{row.label}</span>
                <span className={`text-base sm:text-sm font-black text-right break-keep ${row.highlight ? 'text-blue-700' : 'text-slate-800'}`}>{row.value}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 print-hide">
            <button onClick={() => setValues(Object.fromEntries(fields.map((f) => [f.key, f.defaultValue])))} className="min-h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 px-3 py-3 text-[13px] sm:text-xs font-black transition">
              <RotateCcw className="w-4 h-4" /> 초기화
            </button>
            <button onClick={() => window.print()} className="min-h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-400 px-3 py-3 text-[13px] sm:text-xs font-black transition">
              결과 인쇄 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </aside>

        <div className="order-2 lg:order-1 min-w-0 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="계산기 검색"
              className="w-full min-h-11 rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-base sm:text-sm font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 max-h-[520px] lg:max-h-[760px] overflow-y-auto pr-0 sm:pr-1">
            {filtered.map((item) => {
              const active = item.id === selected.id;
              return (
                <button
                  key={item.id}
                  onClick={() => choose(item.id)}
                  className={`text-left rounded-2xl border p-4 min-h-[116px] transition-all touch-manipulation ${active ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-2xl leading-none">{item.icon}</span>
                    <span className={`text-[10px] rounded-full px-2 py-0.5 font-black whitespace-nowrap ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{categoryLabels[item.category]}</span>
                  </div>
                  <h2 className="mt-3 text-[15px] sm:text-sm font-black leading-snug break-keep">{item.name}</h2>
                  <p className={`mt-1.5 text-[12px] leading-relaxed break-keep ${active ? 'text-blue-50' : 'text-slate-500'}`}>{item.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
