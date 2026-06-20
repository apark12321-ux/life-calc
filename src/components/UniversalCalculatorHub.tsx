import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Info, ListChecks, RotateCcw, Search } from 'lucide-react';
import { CategoryType } from '../types';

type RealCategory = 'insurance' | 'wage' | 'life' | 'finance' | 'property';
type HubCategory = 'all' | RealCategory;
type Seed = [slug: string, name: string, description: string];
type InputDef = { key: string; label: string; suffix: string; defaultValue: number; step?: number };
type CalculatorItem = { id: string; slug: string; name: string; category: RealCategory; icon: string; description: string; formula: string; inputs: InputDef[] };
type ResultRow = { label: string; value: string; highlight?: boolean };

const categoryLabels: Record<HubCategory, string> = {
  all: '전체', insurance: '4대보험', wage: '급여·퇴직금', life: '생활·달력', finance: '금융·예적금', property: '부동산·세금'
};

const categoryIcons: Record<RealCategory, string> = { insurance: '🛡️', wage: '💼', life: '🧭', finance: '💰', property: '🏠' };
const categoryKeys = ['insurance', 'wage', 'life', 'finance', 'property'] as const;

const seeds: Record<RealCategory, Seed[]> = {
  insurance: [
    ['total-premium','4대보험 총액 계산기','월 보수 기준 4대보험 합산 보험료를 계산합니다.'],
    ['national-pension','국민연금 부담액 계산기','기준소득월액과 요율로 국민연금 부담액을 계산합니다.'],
    ['health-insurance','건강보험료 계산기','월 보수액 기준 건강보험료를 계산합니다.'],
    ['longterm-care','장기요양보험료 계산기','건강보험료에 장기요양보험 요율을 적용합니다.'],
    ['employment-insurance','고용보험료 계산기','근로자와 사업주 고용보험 부담액을 계산합니다.'],
    ['industrial-accident','산재보험료 계산기','업종별 산재보험 요율로 사업주 부담액을 계산합니다.'],
    ['employer-cost','회사 총 인건비 계산기','급여와 회사 부담 보험료를 합산합니다.'],
    ['employee-deduction','급여 공제 보험료 계산기','급여에서 공제될 보험료 합계를 계산합니다.'],
    ['freelancer-withholding','프리랜서 3.3% 실수령액 계산기','용역비에서 원천징수액을 차감합니다.'],
    ['parttime-base','아르바이트 월 보수 계산기','시급과 근무시간으로 보험 적용 보수를 추정합니다.'],
    ['annual-premium','연간 보험료 예산 계산기','월 보험료를 연간 예산으로 환산합니다.'],
    ['pension-cap','국민연금 상한 적용 계산기','보수월액 상한 적용 시 보험료를 비교합니다.'],
    ['rate-compare','보험료율 변경 영향 계산기','요율 변경 전후 부담액 차이를 계산합니다.'],
    ['small-business-burden','소상공인 인건비 부담 계산기','직원 수 기준 월 인건비 부담을 계산합니다.'],
    ['net-after-insurance','보험 공제 후 월급 계산기','세전 급여에서 보험료를 뺀 금액을 계산합니다.']
  ],
  wage: [
    ['hourly-monthly','시급 월급 환산 계산기','시급과 근무시간으로 월급을 환산합니다.'],
    ['weekly-holiday','주휴수당 계산기','주 근무시간 기준 주휴수당을 계산합니다.'],
    ['overtime-pay','연장근로수당 계산기','연장근로 가산수당을 계산합니다.'],
    ['night-pay','야간근로수당 계산기','야간근무 가산수당을 계산합니다.'],
    ['holiday-pay','휴일근로수당 계산기','휴일근로 수당을 계산합니다.'],
    ['annual-to-monthly','연봉 월급 환산 계산기','연봉을 월 급여로 환산합니다.'],
    ['monthly-to-annual','월급 연봉 환산 계산기','월급을 연봉으로 환산합니다.'],
    ['net-salary','월급 실수령액 계산기','세전 급여에서 예상 공제율을 차감합니다.'],
    ['retirement-pay','퇴직금 계산기','평균임금과 재직일수로 퇴직금을 계산합니다.'],
    ['unemployment-benefit','실업급여 총액 계산기','구직급여 일액과 지급일수를 곱합니다.'],
    ['daily-pay','일급 계산기','시급과 근무시간으로 일급을 계산합니다.'],
    ['weekly-pay','주급 계산기','일급과 근무일수로 주급을 계산합니다.'],
    ['commission','성과급 수수료 계산기','매출액 기준 성과급을 계산합니다.'],
    ['bonus-net','상여금 실수령액 계산기','상여금에서 예상 공제액을 차감합니다.'],
    ['freelance-net','프리랜서 실수령액 계산기','원천징수 후 수령액을 계산합니다.'],
    ['minimum-wage-check','최저임금 차액 계산기','지급 시급과 기준 시급의 차이를 계산합니다.'],
    ['late-deduction','지각 공제액 계산기','지각 시간의 임금 상당액을 계산합니다.'],
    ['leave-deduction','무급휴가 공제액 계산기','무급휴가일수 기준 공제액을 계산합니다.'],
    ['parttime-tax','아르바이트 세금 계산기','급여에서 원천징수액을 차감합니다.'],
    ['yearend-refund','연말정산 환급액 계산기','기납부세액과 결정세액의 차이를 계산합니다.']
  ],
  life: [
    ['age','만 나이 계산기','출생연도와 기준연도로 나이를 계산합니다.'],
    ['dday','디데이 계산기','목표일까지 남은 일수를 계산합니다.'],
    ['anniversary','기념일 n일째 계산기','시작일 기준 n일째를 계산합니다.'],
    ['bmi','BMI 계산기','키와 몸무게로 BMI를 계산합니다.'],
    ['water-intake','하루 물 섭취량 계산기','체중 기준 물 섭취량을 계산합니다.'],
    ['calorie-bmr','기초대사량 간편 계산기','체중 기준 기초대사량을 추정합니다.'],
    ['steps-distance','걸음 수 거리 계산기','걸음 수와 보폭으로 거리를 계산합니다.'],
    ['fuel-cost','주유비 계산기','주행거리·연비·유가로 주유비를 계산합니다.'],
    ['travel-time','이동시간 계산기','거리와 속도로 이동시간을 계산합니다.'],
    ['electricity','전기요금 계산기','전력 사용량과 단가로 요금을 계산합니다.'],
    ['gas-bill','가스요금 계산기','가스 사용량과 단가로 요금을 계산합니다.'],
    ['water-bill','수도요금 계산기','수도 사용량과 단가로 요금을 계산합니다.'],
    ['moving-boxes','이사 박스 수 계산기','짐 부피 기준 박스 수를 계산합니다.'],
    ['paint','페인트 필요량 계산기','면적 기준 페인트 필요량을 계산합니다.'],
    ['wallpaper','도배지 롤 수 계산기','벽면 면적 기준 도배지 수량을 계산합니다.'],
    ['tiles','타일 수량 계산기','시공 면적 기준 타일 수량을 계산합니다.'],
    ['pet-age','반려견 나이 환산 계산기','반려견 나이를 사람 나이로 환산합니다.'],
    ['recipe','요리 비율 계산기','인분 변화에 따른 재료량을 계산합니다.'],
    ['cm-inch','센티미터 인치 변환기','cm를 inch로 변환합니다.'],
    ['kg-lb','킬로그램 파운드 변환기','kg를 lb로 변환합니다.'],
    ['celsius-fahrenheit','섭씨 화씨 변환기','섭씨를 화씨로 변환합니다.'],
    ['running-pace','러닝 페이스 계산기','거리와 시간으로 페이스를 계산합니다.'],
    ['sleep-cycle','수면 사이클 계산기','수면시간을 90분 사이클로 나눕니다.'],
    ['school-year','입학·졸업연도 계산기','입학연도와 수업연한으로 졸업연도를 계산합니다.'],
    ['subscription-split','구독료 N분의 1 계산기','구독료를 인원수로 나눕니다.']
  ],
  finance: [
    ['simple-interest','예금 단리 이자 계산기','원금·금리·기간으로 단리 이자를 계산합니다.'],
    ['savings-maturity','적금 만기 수령액 계산기','월 납입액과 금리로 만기액을 계산합니다.'],
    ['compound-interest','복리 이자 계산기','복리 기준 미래가치를 계산합니다.'],
    ['loan-payment','대출 원리금 상환 계산기','대출 월 상환액을 계산합니다.'],
    ['interest-only','대출 월이자 계산기','이자만 납부할 때 월 이자를 계산합니다.'],
    ['dsr','DSR 계산기','연소득 대비 원리금 상환비율을 계산합니다.'],
    ['ltv','LTV 계산기','담보가치 대비 대출비율을 계산합니다.'],
    ['card-installment','카드 할부 월납입 계산기','구매금액을 할부개월로 나눕니다.'],
    ['vat','부가세 계산기','공급가액 기준 부가세를 계산합니다.'],
    ['vat-reverse','부가세 포함가 역산 계산기','부가세 포함 금액에서 공급가액을 역산합니다.'],
    ['discount','할인율 계산기','정가와 할인율로 결제금액을 계산합니다.'],
    ['margin','마진율 계산기','판매가와 원가로 마진율을 계산합니다.'],
    ['markup','판매가 산정 계산기','원가와 목표마진율로 판매가를 계산합니다.'],
    ['stock-profit','주식 수익률 계산기','매수가·매도가·수량으로 손익을 계산합니다.'],
    ['coin-profit','코인 수익률 계산기','투입금액과 평가액으로 수익률을 계산합니다.'],
    ['exchange','환율 환산 계산기','외화금액을 원화로 환산합니다.'],
    ['goal-saving','목표금액 월저축 계산기','목표금액 달성을 위한 월 저축액을 계산합니다.'],
    ['emergency-fund','비상금 필요액 계산기','월 생활비 기준 비상금을 계산합니다.'],
    ['inflation','물가상승 반영 계산기','물가상승률을 반영한 미래금액을 계산합니다.'],
    ['cagr','연평균 수익률 계산기','초기금액과 최종금액으로 CAGR을 계산합니다.']
  ],
  property: [
    ['pyeong-to-m2','평수 제곱미터 변환기','평을 제곱미터로 변환합니다.'],
    ['m2-to-pyeong','제곱미터 평수 변환기','제곱미터를 평으로 변환합니다.'],
    ['acquisition-tax','취득세 계산기','취득가액과 세율로 취득세를 계산합니다.'],
    ['agent-fee','부동산 중개보수 계산기','거래금액 기준 중개보수를 계산합니다.'],
    ['monthly-yield','월세 수익률 계산기','임대수입 기준 수익률을 계산합니다.'],
    ['jeonse-rate','전세가율 계산기','매매가 대비 전세금 비율을 계산합니다.'],
    ['loan-interest','주택담보대출 월이자 계산기','주담대 월 이자를 계산합니다.'],
    ['dti','DTI 계산기','연소득 대비 주택대출 상환비율을 계산합니다.'],
    ['ltv','주택 LTV 계산기','주택가격 대비 대출비율을 계산합니다.'],
    ['deposit-interest','전세보증금 이자기회비용 계산기','보증금의 월 이자 기회비용을 계산합니다.'],
    ['monthly-to-jeonse','월세 전세 환산 계산기','월세를 전세금 상당액으로 환산합니다.'],
    ['jeonse-to-monthly','전세 월세 환산 계산기','전세금을 월세 상당액으로 환산합니다.'],
    ['maintenance-split','관리비 분담 계산기','총 관리비를 세대수로 나눕니다.'],
    ['repair-reserve','장기수선충당금 계산기','월 충당금과 거주개월을 곱합니다.'],
    ['moving-cost','이사비 예산 계산기','기본 이사비와 추가 옵션을 합산합니다.'],
    ['interior-budget','인테리어 평당 비용 계산기','평수와 평당 공사비로 예산을 계산합니다.'],
    ['roi','부동산 투자수익률 계산기','투자금 대비 연간 순수익률을 계산합니다.'],
    ['capital-gain','양도차익 계산기','양도가액에서 취득가와 비용을 차감합니다.'],
    ['broker-vat','중개보수 부가세 포함 계산기','중개보수에 부가세를 더합니다.'],
    ['price-per-pyeong','평당가 계산기','거래금액을 평수로 나눕니다.']
  ]
};

const formulaFor = (name: string, category: RealCategory, index: number) => {
  if (name.includes('BMI')) return 'bmi';
  if (name.includes('대출') || name.includes('원리금')) return 'loan';
  if (name.includes('복리') || name.includes('물가')) return 'compound';
  if (name.includes('단리') || name.includes('예금')) return 'interest';
  if (name.includes('적금')) return 'savings';
  if (name.includes('주휴')) return 'weeklyHoliday';
  if (name.includes('수당') || name.includes('시급') || name.includes('일급') || name.includes('주급')) return 'pay';
  if (name.includes('실수령') || name.includes('할인') || name.includes('원천징수') || name.includes('공제')) return 'net';
  if (name.includes('비율') || name.includes('수익률') || name.includes('DSR') || name.includes('LTV') || name.includes('DTI') || name.includes('전세가율') || name.includes('마진율')) return 'ratio';
  if (name.includes('변환') || name.includes('환산')) return 'convert';
  if (name.includes('나이') || name.includes('연도') || name.includes('디데이')) return 'difference';
  if (name.includes('수량') || name.includes('박스') || name.includes('롤') || name.includes('필요량')) return 'divideCeil';
  if (name.includes('주유비')) return 'fuel';
  if (name.includes('이동시간') || name.includes('페이스')) return 'time';
  if (name.includes('양도차익')) return 'gain';
  if (name.includes('월세') && name.includes('수익률')) return 'rentYield';
  if (name.includes('부가세') || name.includes('취득세') || name.includes('중개보수') || name.includes('보험료')) return 'percent';
  return index % 4 === 0 ? 'percent' : index % 4 === 1 ? 'multiply' : index % 4 === 2 ? 'divide' : 'add';
};

const inputsFor = (formula: string): InputDef[] => {
  switch (formula) {
    case 'bmi': return [{ key: 'weight', label: '몸무게', suffix: 'kg', defaultValue: 70 }, { key: 'height', label: '키', suffix: 'cm', defaultValue: 170 }];
    case 'loan': return [{ key: 'amount', label: '금액', suffix: '원', defaultValue: 100000000 }, { key: 'rate', label: '연 이율', suffix: '%', defaultValue: 4.5, step: 0.1 }, { key: 'months', label: '기간', suffix: '개월', defaultValue: 360 }];
    case 'compound': return [{ key: 'amount', label: '현재금액', suffix: '원', defaultValue: 10000000 }, { key: 'rate', label: '연 이율', suffix: '%', defaultValue: 5, step: 0.1 }, { key: 'years', label: '기간', suffix: '년', defaultValue: 3 }];
    case 'interest': return [{ key: 'amount', label: '원금', suffix: '원', defaultValue: 10000000 }, { key: 'rate', label: '연 이율', suffix: '%', defaultValue: 3.5, step: 0.1 }, { key: 'months', label: '기간', suffix: '개월', defaultValue: 12 }];
    case 'savings': return [{ key: 'amount', label: '월 납입액', suffix: '원', defaultValue: 300000 }, { key: 'rate', label: '연 이율', suffix: '%', defaultValue: 4, step: 0.1 }, { key: 'months', label: '기간', suffix: '개월', defaultValue: 12 }];
    case 'weeklyHoliday': return [{ key: 'amount', label: '시급', suffix: '원', defaultValue: 10320 }, { key: 'hours', label: '주 근무시간', suffix: '시간', defaultValue: 40 }];
    case 'pay': return [{ key: 'amount', label: '시급·일급', suffix: '원', defaultValue: 10320 }, { key: 'count', label: '시간·일수', suffix: '단위', defaultValue: 8 }, { key: 'rate', label: '가산율', suffix: '%', defaultValue: 100 }];
    case 'net': return [{ key: 'amount', label: '기준 금액', suffix: '원', defaultValue: 1000000 }, { key: 'rate', label: '차감율', suffix: '%', defaultValue: 3.3, step: 0.1 }];
    case 'ratio': return [{ key: 'amount', label: '비교 금액', suffix: '원', defaultValue: 300000000 }, { key: 'base', label: '기준 금액', suffix: '원', defaultValue: 500000000 }];
    case 'convert': return [{ key: 'amount', label: '입력값', suffix: '', defaultValue: 84 }, { key: 'rate', label: '변환계수', suffix: '× 또는 ÷', defaultValue: 3.305785, step: 0.000001 }];
    case 'difference': return [{ key: 'amount', label: '기준값', suffix: '', defaultValue: 2026 }, { key: 'base', label: '비교값', suffix: '', defaultValue: 1990 }];
    case 'divideCeil': return [{ key: 'amount', label: '전체 수량·면적', suffix: '', defaultValue: 100 }, { key: 'base', label: '1개 기준량', suffix: '', defaultValue: 8 }];
    case 'fuel': return [{ key: 'distance', label: '거리', suffix: 'km', defaultValue: 100 }, { key: 'efficiency', label: '연비', suffix: 'km/L', defaultValue: 12 }, { key: 'price', label: '유가', suffix: '원/L', defaultValue: 1700 }];
    case 'time': return [{ key: 'distance', label: '거리', suffix: 'km', defaultValue: 100 }, { key: 'hours', label: '시간', suffix: '시간', defaultValue: 2 }];
    case 'gain': return [{ key: 'sell', label: '매도가·양도가', suffix: '원', defaultValue: 700000000 }, { key: 'buy', label: '매수가·취득가', suffix: '원', defaultValue: 500000000 }, { key: 'cost', label: '비용', suffix: '원', defaultValue: 30000000 }];
    case 'rentYield': return [{ key: 'monthly', label: '월세', suffix: '원', defaultValue: 800000 }, { key: 'price', label: '투자금', suffix: '원', defaultValue: 300000000 }];
    case 'percent': return [{ key: 'amount', label: '기준 금액', suffix: '원', defaultValue: 1000000 }, { key: 'rate', label: '적용율', suffix: '%', defaultValue: 10, step: 0.1 }];
    case 'multiply': return [{ key: 'amount', label: '기준값', suffix: '', defaultValue: 100 }, { key: 'count', label: '곱할 값', suffix: '', defaultValue: 12 }];
    case 'divide': return [{ key: 'amount', label: '기준값', suffix: '', defaultValue: 1000000 }, { key: 'count', label: '나눌 값', suffix: '', defaultValue: 12 }];
    case 'add': return [{ key: 'amount', label: '값 A', suffix: '원', defaultValue: 800000 }, { key: 'base', label: '값 B', suffix: '원', defaultValue: 250000 }];
    default: return [{ key: 'amount', label: '기준 금액', suffix: '원', defaultValue: 1000000 }, { key: 'rate', label: '적용율', suffix: '%', defaultValue: 10 }];
  }
};

export const calculatorCatalog: CalculatorItem[] = categoryKeys.flatMap((category) =>
  seeds[category].map(([slug, name, description], index) => {
    const formula = formulaFor(name, category, index);
    return { id: `${category}_${slug}`, slug, name, category, icon: categoryIcons[category], description, formula, inputs: inputsFor(formula) };
  })
);

const defaultsFor = (item: CalculatorItem) => item.inputs.reduce<Record<string, number>>((acc, input) => ({ ...acc, [input.key]: input.defaultValue }), {});
const won = (n: number) => `${Math.round(Number.isFinite(n) ? n : 0).toLocaleString('ko-KR')}원`;
const num = (n: number, unit = '') => `${(Math.round((Number.isFinite(n) ? n : 0) * 100) / 100).toLocaleString('ko-KR')}${unit}`;
const div = (a: number, b: number) => b ? a / b : 0;

const calculate = (item: CalculatorItem, v: Record<string, number>): ResultRow[] => {
  const a = v.amount || 0, b = v.base || 0, c = v.count || 0, r = v.rate || 0, m = v.months || 0, y = v.years || 0;
  switch (item.formula) {
    case 'bmi': return [{ label: 'BMI', value: num(div(v.weight || 0, Math.pow((v.height || 1) / 100, 2))), highlight: true }];
    case 'loan': {
      const mr = r / 100 / 12;
      const pay = mr ? a * mr * Math.pow(1 + mr, m) / (Math.pow(1 + mr, m) - 1) : div(a, m);
      return [{ label: '월 상환액', value: won(pay), highlight: true }, { label: '총 상환액', value: won(pay * m) }];
    }
    case 'compound': { const f = a * Math.pow(1 + r / 100, y); return [{ label: '증가액', value: won(f - a) }, { label: '미래 금액', value: won(f), highlight: true }]; }
    case 'interest': { const i = a * r / 100 * m / 12; return [{ label: '세전 이자', value: won(i) }, { label: '만기 금액', value: won(a + i), highlight: true }]; }
    case 'savings': { const p = a * m, i = a * m * (m + 1) / 2 * (r / 100 / 12); return [{ label: '총 납입원금', value: won(p) }, { label: '세전 이자', value: won(i) }, { label: '만기 예상액', value: won(p + i), highlight: true }]; }
    case 'weeklyHoliday': { const h = (v.hours || 0) >= 40 ? 8 : (v.hours || 0) >= 15 ? (v.hours || 0) / 40 * 8 : 0; return [{ label: '주휴시간', value: num(h, '시간') }, { label: '주휴수당', value: won(h * a), highlight: true }]; }
    case 'pay': return [{ label: '계산 금액', value: won(a * c * r / 100), highlight: true }];
    case 'net': return [{ label: '차감액', value: won(a * r / 100) }, { label: '실수령액', value: won(a - a * r / 100), highlight: true }];
    case 'ratio': return [{ label: '비율', value: num(div(a, b) * 100, '%'), highlight: true }];
    case 'convert': return [{ label: '곱셈 환산', value: num(a * r), highlight: true }, { label: '나눗셈 환산', value: num(div(a, r)) }];
    case 'difference': return [{ label: '차이', value: num(a - b), highlight: true }];
    case 'divideCeil': return [{ label: '필요 수량', value: num(Math.ceil(div(a, b)), '개'), highlight: true }];
    case 'fuel': { const liters = div(v.distance || 0, v.efficiency || 0); return [{ label: '필요 연료', value: num(liters, 'L') }, { label: '예상 주유비', value: won(liters * (v.price || 0)), highlight: true }]; }
    case 'time': return [{ label: '단위당 시간', value: num(div(v.hours || 0, v.distance || 0), '시간/km') }, { label: '평균 속도', value: num(div(v.distance || 0, v.hours || 0), 'km/h'), highlight: true }];
    case 'gain': return [{ label: '차익', value: won((v.sell || 0) - (v.buy || 0) - (v.cost || 0)), highlight: true }];
    case 'rentYield': return [{ label: '연 임대수입', value: won((v.monthly || 0) * 12) }, { label: '수익률', value: num(div((v.monthly || 0) * 12, v.price || 0) * 100, '%'), highlight: true }];
    case 'percent': return [{ label: '계산 금액', value: won(a * r / 100), highlight: true }];
    case 'multiply': return [{ label: '계산 결과', value: num(a * c), highlight: true }];
    case 'divide': return [{ label: '계산 결과', value: num(div(a, c)), highlight: true }];
    case 'add': return [{ label: '합산 결과', value: won(a + b), highlight: true }];
    default: return [{ label: '계산 결과', value: won(a), highlight: true }];
  }
};

export default function UniversalCalculatorHub({ category, subCalculatorId = 'all' }: { category: CategoryType; subCalculatorId?: string }) {
  const [search, setSearch] = useState('');
  const available = useMemo(() => category === 'all' || category === 'policy' ? calculatorCatalog : calculatorCatalog.filter((item) => item.category === category), [category]);
  const firstId = useMemo(() => calculatorCatalog.some((item) => item.id === subCalculatorId) ? subCalculatorId : available[0]?.id || calculatorCatalog[0].id, [available, subCalculatorId]);
  const [selectedId, setSelectedId] = useState(firstId);
  const selected = calculatorCatalog.find((item) => item.id === selectedId) || available[0] || calculatorCatalog[0];
  const [values, setValues] = useState<Record<string, number>>(() => defaultsFor(selected));

  useEffect(() => setSelectedId(firstId), [firstId]);
  useEffect(() => setValues(defaultsFor(selected)), [selected.id]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return available.filter((item) => !q || `${item.name} ${item.description} ${item.slug}`.toLowerCase().includes(q));
  }, [available, search]);

  const counts = useMemo(() => categoryKeys.reduce<Record<RealCategory, number>>((acc, key) => ({ ...acc, [key]: seeds[key].length }), {} as Record<RealCategory, number>), []);
  const results = calculate(selected, values);

  const selectCalculator = (id: string) => {
    setSelectedId(id);
    const url = new URL(window.location.href);
    url.searchParams.set('calc', id);
    window.history.replaceState(null, '', url.toString());
  };

  return (
    <section className="bg-white rounded-2xl shadow-xs border border-slate-100 p-4 md:p-8">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 border-b border-slate-100 pb-6 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-extrabold mb-3"><ListChecks className="w-3.5 h-3.5" /> 계산기 100종</div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">생활계산기 천국 100종 모음</h1>
          <p className="text-sm text-slate-500 mt-2 max-w-3xl leading-relaxed">4대보험, 급여, 생활, 금융, 부동산 계산기를 검색하고 바로 계산할 수 있습니다.</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
          <div className="rounded-xl bg-slate-900 text-white px-3 py-2"><p className="text-lg font-black">{calculatorCatalog.length}</p><p className="text-[10px] text-slate-300 font-bold">전체</p></div>
          {categoryKeys.map((key) => <div key={key} className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2"><p className="text-lg font-black text-slate-900">{counts[key]}</p><p className="text-[10px] text-slate-500 font-bold">{categoryLabels[key]}</p></div>)}
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_420px] gap-6">
        <div className="space-y-4">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="계산기 검색: 주휴수당, 대출, 평수, 전기요금..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500" /></div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 max-h-[720px] overflow-y-auto pr-1">
            {filtered.map((item) => {
              const active = selected.id === item.id;
              return <button key={item.id} onClick={() => selectCalculator(item.id)} className={`text-left rounded-2xl border p-4 transition-all ${active ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'}`}>
                <div className="flex items-start justify-between gap-2"><span className="text-2xl">{item.icon}</span><span className={`text-[10px] rounded-full px-2 py-0.5 font-black ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{categoryLabels[item.category]}</span></div>
                <h2 className="mt-3 text-sm font-black leading-snug">{item.name}</h2>
                <p className={`mt-1.5 text-xs leading-relaxed ${active ? 'text-blue-50' : 'text-slate-500'}`}>{item.description}</p>
              </button>;
            })}
          </div>
        </div>

        <aside className="bg-slate-900 rounded-2xl p-5 text-white shadow-lg h-fit sticky top-4">
          <div className="flex items-start gap-3 border-b border-white/10 pb-4 mb-5"><div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">{selected.icon}</div><div><p className="text-[10px] font-black text-blue-200 uppercase tracking-wider">{categoryLabels[selected.category]}</p><h2 className="text-lg font-black leading-tight mt-1">{selected.name}</h2><p className="text-xs text-slate-300 mt-1 leading-relaxed">{selected.description}</p></div></div>
          <div className="space-y-3">
            {selected.inputs.map((input) => <label key={input.key} className="block"><span className="block text-xs font-bold text-slate-300 mb-1.5">{input.label}</span><div className="relative"><input type="number" step={input.step || 1} value={values[input.key] ?? 0} onChange={(e) => setValues((prev) => ({ ...prev, [input.key]: Number(e.target.value) }))} className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-3 pr-20 text-right text-white font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-400" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-300 font-bold">{input.suffix}</span></div></label>)}
          </div>
          <div className="mt-5 rounded-2xl bg-white text-slate-900 p-4 space-y-2">{results.map((row) => <div key={row.label} className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 ${row.highlight ? 'bg-blue-50' : 'bg-slate-50'}`}><span className="text-xs font-bold text-slate-500">{row.label}</span><span className={`text-sm font-black ${row.highlight ? 'text-blue-700' : 'text-slate-800'}`}>{row.value}</span></div>)}</div>
          <div className="flex gap-2 mt-4"><button onClick={() => setValues(defaultsFor(selected))} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 py-3 text-xs font-black transition"><RotateCcw className="w-4 h-4" /> 초기화</button><button onClick={() => window.print()} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-400 py-3 text-xs font-black transition">결과 인쇄 <ArrowRight className="w-4 h-4" /></button></div>
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-400/10 border border-amber-300/20 p-3 text-amber-100"><Info className="w-4 h-4 shrink-0 mt-0.5" /><p className="text-[11px] leading-relaxed">간편 계산 결과입니다. 실제 납부·정산·계약 금액은 적용 조건에 따라 달라질 수 있습니다.</p></div>
        </aside>
      </div>
    </section>
  );
}
