import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ListChecks, RotateCcw, Search } from 'lucide-react';
import { CategoryType } from '../types';

type CalcCategory = 'insurance' | 'wage' | 'life' | 'finance' | 'property';
type FieldType = 'number' | 'date' | 'select';
type Field = { key: string; label: string; unit?: string; type?: FieldType; defaultValue: number | string; options?: Array<{ label: string; value: string }> };
type CalcItem = { id: string; name: string; category: CalcCategory; icon: string; description: string };
type ResultRow = { label: string; value: string; highlight?: boolean };

const categoryKeys: CalcCategory[] = ['insurance', 'wage', 'life', 'finance', 'property'];
const categoryLabels: Record<CalcCategory, string> = { insurance: '4대보험', wage: '급여·퇴직금', life: '생활·달력', finance: '금융·예적금', property: '부동산·세금' };
const icons: Record<CalcCategory, string> = { insurance: '🛡️', wage: '💼', life: '🧭', finance: '💰', property: '🏠' };

const names: Record<CalcCategory, string[]> = {
  insurance: ['4대보험 총액 계산기','국민연금 부담액 계산기','건강보험료 계산기','장기요양보험료 계산기','고용보험료 계산기','산재보험료 계산기','회사 총 인건비 계산기','급여 공제 보험료 계산기','프리랜서 3.3% 실수령액 계산기','아르바이트 월 보수 계산기','연간 보험료 예산 계산기','국민연금 상한 적용 계산기','보험료율 변경 영향 계산기','소상공인 인건비 부담 계산기','보험 공제 후 월급 계산기'],
  wage: ['시급 월급 환산 계산기','주휴수당 계산기','연장근로수당 계산기','야간근로수당 계산기','휴일근로수당 계산기','연봉 월급 환산 계산기','월급 연봉 환산 계산기','월급 실수령액 계산기','퇴직금 계산기','실업급여 총액 계산기','일급 계산기','주급 계산기','성과급 수수료 계산기','상여금 실수령액 계산기','프리랜서 실수령액 계산기','최저임금 차액 계산기','지각 공제액 계산기','무급휴가 공제액 계산기','아르바이트 세금 계산기','연말정산 환급액 계산기'],
  life: ['만 나이 계산기','디데이 계산기','기념일 n일째 계산기','BMI 계산기','하루 물 섭취량 계산기','기초대사량 간편 계산기','걸음 수 거리 계산기','주유비 계산기','이동시간 계산기','전기요금 계산기','가스요금 계산기','수도요금 계산기','이사 박스 수 계산기','페인트 필요량 계산기','도배지 롤 수 계산기','타일 수량 계산기','반려견 나이 환산 계산기','요리 비율 계산기','센티미터 인치 변환기','킬로그램 파운드 변환기','섭씨 화씨 변환기','러닝 페이스 계산기','수면 사이클 계산기','입학·졸업연도 계산기','구독료 N분의 1 계산기'],
  finance: ['예금 단리 이자 계산기','적금 만기 수령액 계산기','복리 이자 계산기','대출 원리금 상환 계산기','대출 월이자 계산기','DSR 계산기','LTV 계산기','카드 할부 월납입 계산기','부가세 계산기','부가세 포함가 역산 계산기','할인율 계산기','마진율 계산기','판매가 산정 계산기','주식 수익률 계산기','코인 수익률 계산기','환율 환산 계산기','목표금액 월저축 계산기','비상금 필요액 계산기','물가상승 반영 계산기','연평균 수익률 계산기'],
  property: ['평수 제곱미터 변환기','제곱미터 평수 변환기','취득세 계산기','부동산 중개보수 계산기','월세 수익률 계산기','전세가율 계산기','주택담보대출 월이자 계산기','DTI 계산기','주택 LTV 계산기','전세보증금 이자기회비용 계산기','월세 전세 환산 계산기','전세 월세 환산 계산기','관리비 분담 계산기','장기수선충당금 계산기','이사비 예산 계산기','인테리어 평당 비용 계산기','부동산 투자수익률 계산기','양도차익 계산기','중개보수 부가세 포함 계산기','평당가 계산기']
};

export const calculatorCatalog: CalcItem[] = categoryKeys.flatMap((category) => names[category].map((name, index) => ({ id: `${category}_${String(index + 1).padStart(2, '0')}`, name, category, icon: icons[category], description: `${name.replace(' 계산기', '')} 전용 입력값과 계산식으로 바로 계산합니다.` })));

const won = (value: number) => `${Math.round(Number.isFinite(value) ? value : 0).toLocaleString('ko-KR')}원`;
const qty = (value: number, unit = '') => `${(Math.round((Number.isFinite(value) ? value : 0) * 100) / 100).toLocaleString('ko-KR')}${unit}`;
const pct = (value: number) => qty(value, '%');
const safeDiv = (a: number, b: number) => b ? a / b : 0;
const field = (key: string, label: string, unit: string, defaultValue: number | string, type: FieldType = 'number', options?: Field['options']): Field => ({ key, label, unit, defaultValue, type, options });
const select = (key: string, label: string, defaultValue: string, options: Field['options']): Field => field(key, label, '', defaultValue, 'select', options);
const value = (values: Record<string, string | number>, key: string) => Number(values[key] ?? 0) || 0;
const text = (values: Record<string, string | number>, key: string) => String(values[key] ?? '');
const date = (raw: string) => new Date(`${raw}T00:00:00`);
const dayMs = 24 * 60 * 60 * 1000;

function getFields(item: CalcItem): Field[] {
  const n = item.name;
  if (n.includes('국민연금')) return [field('income','월 소득','원',3000000), field('lower','하한 기준소득월액','원',410000), field('upper','상한 기준소득월액','원',6590000), field('rate','근로자 부담률','%',4.75)];
  if (n.includes('건강보험료')) return [field('salary','월 보수','원',3000000), field('healthRate','건강보험 근로자율','%',3.595), field('careRate','장기요양보험료율','%',13.14)];
  if (n.includes('장기요양')) return [field('healthPremium','건강보험료','원',107850), field('careRate','장기요양보험료율','%',13.14)];
  if (n.includes('고용보험')) return [field('salary','월 보수','원',3000000), field('workerRate','근로자 부담률','%',0.9), field('companyRate','회사 부담률','%',1.15)];
  if (n.includes('산재보험')) return [field('payroll','월 보수 총액','원',3000000), field('industrialRate','산재보험 요율','%',0.7)];
  if (n.includes('회사 총 인건비') || n.includes('소상공인')) return [field('averagePay','1인 평균 월급','원',2500000), field('workers','근로자 수','명',3), field('companyRate','회사 부담 보험요율','%',10.5)];
  if (n.includes('프리랜서') || n.includes('3.3') || n.includes('상여금') || n.includes('아르바이트 세금')) return [field('gross','지급 총액','원',1000000), field('taxRate','공제율','%',n.includes('3.3') || n.includes('프리랜서') ? 3.3 : 9.5)];
  if (n.includes('월 보수')) return [field('hourly','시급','원',10320), field('weeklyHours','주 근무시간','시간',20), field('weeks','월 평균 주수','주',4.345)];
  if (n.includes('연간 보험료')) return [field('monthlyPayroll','월 급여 총액','원',12000000), field('rate','보험료율 합계','%',10.5), field('months','적용 개월','개월',12)];
  if (n.includes('변경 영향')) return [field('base','월 보수 총액','원',3000000), field('oldRate','기존 요율','%',9), field('newRate','변경 요율','%',9.5), field('months','적용 개월','개월',12)];
  if (item.category === 'insurance') return [field('gross','세전 월급','원',3000000), field('insuranceRate','보험 공제율','%',9.245), field('tax','소득세·지방세','원',85000)];

  if (n.includes('시급 월급')) return [field('hourly','시급','원',10320), field('weeklyHours','주 근무시간','시간',40), select('weeklyHoliday','주휴수당 포함','yes',[{label:'포함',value:'yes'},{label:'제외',value:'no'}])];
  if (n.includes('주휴수당')) return [field('hourly','시급','원',10320), field('weeklyHours','주 근무시간','시간',20), field('workingDays','주 근무일수','일',5)];
  if (n.includes('연장') || n.includes('야간') || n.includes('휴일')) return [field('hourly','통상시급','원',12000), field('hours',`${n.replace(' 계산기','')} 시간`,'시간',8), field('multiplier','가산 배율','배',n.includes('야간') ? 0.5 : 1.5)];
  if (n.includes('연봉 월급')) return [field('annual','연봉','원',36000000), field('deductionRate','예상 공제율','%',9.5)];
  if (n.includes('월급 연봉')) return [field('monthly','월급','원',3000000), field('bonus','연간 상여금','원',0)];
  if (n.includes('퇴직금')) return [field('averageDailyWage','1일 평균임금','원',100000), field('years','근속 연수','년',3), field('months','추가 개월','개월',6)];
  if (n.includes('실업급여')) return [field('averageDailyWage','1일 평균임금','원',90000), field('rate','지급률','%',60), field('days','지급일수','일',150), field('cap','1일 상한액','원',68100), field('floor','1일 하한액','원',66048)];
  if (n.includes('일급')) return [field('hourly','시급','원',10320), field('hours','하루 근무시간','시간',8)];
  if (n.includes('주급')) return [field('hourly','시급','원',10320), field('weeklyHours','주 근무시간','시간',20), select('weeklyHoliday','주휴수당 포함','yes',[{label:'포함',value:'yes'},{label:'제외',value:'no'}])];
  if (n.includes('성과급')) return [field('basePay','기본급','원',2000000), field('sales','인정 매출','원',10000000), field('commissionRate','수수료율','%',3)];
  if (n.includes('최저임금')) return [field('legalHourly','기준 시급','원',10320), field('currentHourly','현재 시급','원',9860), field('hours','총 근무시간','시간',160)];
  if (n.includes('지각')) return [field('hourly','통상시급','원',12000), field('lateMinutes','지각 시간','분',45)];
  if (n.includes('무급휴가')) return [field('monthly','월급','원',3000000), field('workDays','월 소정근로일','일',22), field('unpaidDays','무급휴가 일수','일',2)];
  if (n.includes('연말정산')) return [field('paidTax','기납부세액','원',1500000), field('finalTax','결정세액','원',1100000)];
  if (item.category === 'wage') return [field('gross','세전 월급','원',3000000), field('insuranceRate','보험 공제율','%',9.245), field('tax','소득세·지방세','원',85000)];

  if (n.includes('만 나이')) return [field('birthDate','생년월일','', '1990-01-01','date'), field('today','기준일','', '2026-06-20','date')];
  if (n.includes('디데이')) return [field('baseDate','기준일','', '2026-06-20','date'), field('targetDate','목표일','', '2026-12-31','date')];
  if (n.includes('기념일')) return [field('startDate','시작일','', '2026-01-01','date'), field('days','며칠째','일',100)];
  if (n.includes('BMI')) return [field('weight','몸무게','kg',70), field('height','키','cm',170)];
  if (n.includes('물 섭취')) return [field('weight','몸무게','kg',70), field('mlPerKg','kg당 섭취량','ml',35)];
  if (n.includes('기초대사량')) return [select('gender','성별','male',[{label:'남성',value:'male'},{label:'여성',value:'female'}]), field('weight','몸무게','kg',70), field('height','키','cm',170), field('age','나이','세',35)];
  if (n.includes('걸음')) return [field('steps','걸음 수','보',8000), field('stride','평균 보폭','cm',70)];
  if (n.includes('주유비')) return [field('distance','주행거리','km',120), field('efficiency','연비','km/L',12), field('price','유가','원/L',1650)];
  if (n.includes('이동시간')) return [field('distance','이동거리','km',100), field('speed','평균속도','km/h',80)];
  if (n.includes('전기') || n.includes('가스') || n.includes('수도')) return [field('usage','사용량',n.includes('전기') ? 'kWh' : '㎥',n.includes('전기') ? 250 : 20), field('unitPrice','단가','원',n.includes('전기') ? 120 : 900), field('baseFee','기본요금','원',1200)];
  if (n.includes('박스') || n.includes('도배지')) return [field('total','전체 필요량',n.includes('박스') ? 'L' : '㎡',n.includes('박스') ? 600 : 45), field('perUnit','1개 처리량',n.includes('박스') ? 'L' : '㎡',n.includes('박스') ? 40 : 5)];
  if (n.includes('페인트')) return [field('area','칠할 면적','㎡',30), field('coats','도장 횟수','회',2), field('coverage','1L당 면적','㎡/L',8)];
  if (n.includes('타일')) return [field('area','시공 면적','㎡',12), field('tileWidth','타일 가로','cm',30), field('tileHeight','타일 세로','cm',30), field('wasteRate','여유율','%',10)];
  if (n.includes('반려견')) return [field('dogAge','반려견 나이','세',5)];
  if (n.includes('요리')) return [field('originalServing','기존 인분','인분',2), field('targetServing','목표 인분','인분',5), field('ingredient','기존 재료량','g/ml',300)];
  if (n.includes('센티미터')) return [field('cm','센티미터','cm',100)];
  if (n.includes('킬로그램')) return [field('kg','킬로그램','kg',10)];
  if (n.includes('섭씨')) return [field('celsius','섭씨','℃',25)];
  if (n.includes('러닝')) return [field('distance','거리','km',5), field('minutes','기록','분',30)];
  if (n.includes('수면')) return [field('wakeHour','기상 시','시',7), field('wakeMinute','기상 분','분',0), field('cycles','수면 사이클','회',5)];
  if (n.includes('입학')) return [field('birthYear','출생연도','년',2020)];
  if (n.includes('구독료')) return [field('total','월 구독료','원',17000), field('people','나눌 인원','명',4)];

  if (n.includes('예금')) return [field('principal','예치금','원',10000000), field('rate','연 이율','%',3.5), field('months','예치 기간','개월',12)];
  if (n.includes('적금')) return [field('monthly','월 납입액','원',300000), field('rate','연 이율','%',4), field('months','납입 기간','개월',12)];
  if (n.includes('복리')) return [field('principal','원금','원',5000000), field('rate','연 이율','%',5), field('years','기간','년',5), field('compoundPerYear','연 복리 횟수','회',12)];
  if (n.includes('원리금')) return [field('principal','대출원금','원',100000000), field('rate','연 이율','%',4.5), field('months','상환 기간','개월',360)];
  if (n.includes('월이자')) return [field('principal','대출원금','원',50000000), field('rate','연 이율','%',5)];
  if (n.includes('DSR') || n.includes('DTI')) return [field('debt','연간 상환액','원',18000000), field('income','연소득','원',60000000)];
  if (n.includes('LTV')) return [field('loan','대출금','원',300000000), field('value','담보가치','원',600000000)];
  if (n.includes('할부')) return [field('amount','구매금액','원',1200000), field('months','할부개월','개월',12), field('feeRate','총 수수료율','%',5)];
  if (n.includes('부가세 포함')) return [field('total','부가세 포함 금액','원',110000), field('rate','부가세율','%',10)];
  if (n.includes('부가세')) return [field('price','공급가액','원',100000), field('rate','부가세율','%',10)];
  if (n.includes('할인율')) return [field('original','정가','원',100000), field('discountRate','할인율','%',20)];
  if (n.includes('마진율')) return [field('sale','판매가','원',50000), field('cost','원가','원',32000)];
  if (n.includes('판매가')) return [field('cost','원가','원',30000), field('targetMargin','목표 마진율','%',35)];
  if (n.includes('주식') || n.includes('코인')) return [field('buy','매수가','원',10000), field('sell','매도가','원',11200), field('quantity','수량',n.includes('주식') ? '주' : '개',100), field('fees','수수료·세금','원',5000)];
  if (n.includes('환율')) return [field('foreign','외화 금액','달러',1000), field('rate','환율','원',1350), field('fee','환전 수수료','원',5000)];
  if (n.includes('목표금액')) return [field('target','목표금액','원',10000000), field('current','현재 금액','원',1000000), field('months','남은 기간','개월',24)];
  if (n.includes('비상금')) return [field('monthlyExpense','월 생활비','원',2500000), field('months','목표 개월','개월',6)];
  if (n.includes('물가상승')) return [field('current','현재 금액','원',1000000), field('rate','연 물가상승률','%',3), field('years','기간','년',10)];
  if (n.includes('연평균')) return [field('start','시작금액','원',1000000), field('end','최종금액','원',1800000), field('years','기간','년',5)];

  if (n.includes('평수 제곱미터')) return [field('pyeong','평수','평',30)];
  if (n.includes('제곱미터 평수')) return [field('m2','면적','㎡',84)];
  if (n.includes('취득세')) return [field('price','취득가액','원',500000000), field('taxRate','취득세율','%',1.1), field('discount','감면액','원',0)];
  if (n.includes('중개보수') && !n.includes('부가세')) return [field('price','거래금액','원',500000000), field('rate','상한요율','%',0.4), field('cap','상한액','원',0)];
  if (n.includes('월세 수익률')) return [field('price','매입가','원',300000000), field('deposit','보증금','원',50000000), field('monthlyRent','월세','원',1000000), field('annualCost','연간 비용','원',1200000)];
  if (n.includes('전세가율')) return [field('deposit','전세보증금','원',300000000), field('price','매매가','원',500000000)];
  if (n.includes('전세보증금 이자')) return [field('principal','전세보증금','원',300000000), field('rate','예금 연 이율','%',3.5)];
  if (n.includes('월세 전세')) return [field('monthlyRent','월세','원',1000000), field('rate','전월세 전환율','%',5.5)];
  if (n.includes('전세 월세')) return [field('deposit','전세보증금','원',300000000), field('rate','전월세 전환율','%',5.5)];
  if (n.includes('관리비')) return [field('total','월 관리비','원',180000), field('usedDays','사용 일수','일',12), field('monthDays','해당 월 일수','일',30)];
  if (n.includes('장기수선')) return [field('monthly','월 장기수선충당금','원',25000), field('months','거주 개월','개월',24)];
  if (n.includes('이사비')) return [field('base','기본 이사비','원',500000), field('distance','이동거리','km',30), field('distanceRate','km당 추가비','원',5000), field('extra','추가 비용','원',150000)];
  if (n.includes('인테리어')) return [field('pyeong','공사 평수','평',24), field('costPerPyeong','평당 비용','원',1800000)];
  if (n.includes('투자수익률')) return [field('investment','실투자금','원',150000000), field('annualRent','연 임대수익','원',12000000), field('priceGain','예상 시세차익','원',30000000), field('costs','비용','원',5000000)];
  if (n.includes('양도차익')) return [field('sale','양도가액','원',650000000), field('buy','취득가액','원',500000000), field('costs','필요경비','원',20000000)];
  if (n.includes('중개보수 부가세')) return [field('fee','중개보수','원',2000000), field('vatRate','부가세율','%',10)];
  if (n.includes('평당가')) return [field('price','거래금액','원',600000000), field('pyeong','면적','평',30)];
  return [field('amount','기준값','원',1000000), field('rate','비율','%',10), field('count','수량·기간','',12)];
}

function calculate(item: CalcItem, values: Record<string, string | number>): ResultRow[] {
  const n = item.name;
  const v = (key: string) => value(values, key);
  const t = (key: string) => text(values, key);
  if (n.includes('4대보험 총액')) { const pension=v('gross')*.0475; const health=v('gross')*.03595; const care=health*.1314; const emp=v('gross')*.009; const total=pension+health+care+emp; return [{label:'근로자 부담 합계',value:won(total),highlight:true},{label:'공제 후 월급',value:won(v('gross')-total-v('tax'))}]; }
  if (n.includes('국민연금')) { const base=Math.min(Math.max(v('income'),v('lower')),v('upper')); return [{label:'적용 기준소득월액',value:won(base)},{label:'국민연금 부담액',value:won(base*v('rate')/100),highlight:true}]; }
  if (n.includes('건강보험료')) { const health=v('salary')*v('healthRate')/100; return [{label:'건강보험료',value:won(health),highlight:true},{label:'장기요양보험료',value:won(health*v('careRate')/100)}]; }
  if (n.includes('장기요양')) return [{label:'장기요양보험료',value:won(v('healthPremium')*v('careRate')/100),highlight:true}];
  if (n.includes('고용보험')) return [{label:'근로자 부담액',value:won(v('salary')*v('workerRate')/100),highlight:true},{label:'회사 부담액',value:won(v('salary')*v('companyRate')/100)}];
  if (n.includes('산재보험')) return [{label:'산재보험료',value:won(v('payroll')*v('industrialRate')/100),highlight:true}];
  if (n.includes('회사 총 인건비') || n.includes('소상공인')) { const pay=v('averagePay')*v('workers'); const extra=pay*v('companyRate')/100; return [{label:'월 급여 총액',value:won(pay)},{label:'월 총 부담',value:won(pay+extra),highlight:true}]; }
  if (n.includes('변경 영향')) { const diff=v('base')*(v('newRate')-v('oldRate'))/100; return [{label:'월 증감액',value:won(diff),highlight:true},{label:'기간 총 증감액',value:won(diff*v('months'))}]; }
  if (n.includes('연간 보험료')) { const monthly=v('monthlyPayroll')*v('rate')/100; return [{label:'월 보험료 예산',value:won(monthly)},{label:'연간 보험료 예산',value:won(monthly*v('months')),highlight:true}]; }
  if (n.includes('프리랜서') || n.includes('3.3') || n.includes('상여금') || n.includes('아르바이트 세금')) { const tax=v('gross')*v('taxRate')/100; return [{label:'공제액',value:won(tax)},{label:'실수령액',value:won(v('gross')-tax),highlight:true}]; }
  if (n.includes('월 보수')) return [{label:'월 보수',value:won(v('hourly')*v('weeklyHours')*v('weeks')),highlight:true}];
  if (item.category==='insurance' || n.includes('실수령액') || n.includes('공제 후')) { const ins=v('gross')*v('insuranceRate')/100; return [{label:'보험료 공제',value:won(ins)},{label:'예상 실수령액',value:won(v('gross')-ins-v('tax')),highlight:true}]; }

  if (n.includes('시급 월급')) { const weekly=v('hourly')*v('weeklyHours'); const holiday=t('weeklyHoliday')==='yes'&&v('weeklyHours')>=15?v('hourly')*Math.min(8,v('weeklyHours')/5):0; return [{label:'예상 월급',value:won((weekly+holiday)*52/12),highlight:true},{label:'주휴수당 주간분',value:won(holiday)}]; }
  if (n.includes('주휴수당')) { const hours=v('weeklyHours')>=15?Math.min(8,v('weeklyHours')/Math.max(v('workingDays'),1)):0; return [{label:'주휴 인정 시간',value:qty(hours,'시간')},{label:'주휴수당',value:won(hours*v('hourly')),highlight:true}]; }
  if (n.includes('연장') || n.includes('야간') || n.includes('휴일')) return [{label:'수당',value:won(v('hourly')*v('hours')*v('multiplier')),highlight:true}];
  if (n.includes('연봉 월급')) return [{label:'세전 월급',value:won(v('annual')/12)},{label:'예상 월 실수령',value:won(v('annual')/12*(1-v('deductionRate')/100)),highlight:true}];
  if (n.includes('월급 연봉')) return [{label:'예상 연봉',value:won(v('monthly')*12+v('bonus')),highlight:true}];
  if (n.includes('퇴직금')) return [{label:'예상 퇴직금',value:won(v('averageDailyWage')*30*(v('years')+v('months')/12)),highlight:true}];
  if (n.includes('실업급여')) { const daily=Math.min(Math.max(v('averageDailyWage')*v('rate')/100,v('floor')),v('cap')); return [{label:'1일 지급액',value:won(daily)},{label:'총 지급액',value:won(daily*v('days')),highlight:true}]; }
  if (n.includes('일급')) return [{label:'일급',value:won(v('hourly')*v('hours')),highlight:true}];
  if (n.includes('주급')) { const holiday=t('weeklyHoliday')==='yes'&&v('weeklyHours')>=15?v('hourly')*Math.min(8,v('weeklyHours')/5):0; return [{label:'주급',value:won(v('hourly')*v('weeklyHours')+holiday),highlight:true}]; }
  if (n.includes('성과급')) return [{label:'성과급',value:won(v('sales')*v('commissionRate')/100)},{label:'총 지급액',value:won(v('basePay')+v('sales')*v('commissionRate')/100),highlight:true}];
  if (n.includes('최저임금')) return [{label:'부족액',value:won(Math.max(0,v('legalHourly')-v('currentHourly'))*v('hours')),highlight:true}];
  if (n.includes('지각')) return [{label:'지각 공제액',value:won(v('hourly')*v('lateMinutes')/60),highlight:true}];
  if (n.includes('무급휴가')) return [{label:'무급휴가 공제액',value:won(safeDiv(v('monthly'),v('workDays'))*v('unpaidDays')),highlight:true}];
  if (n.includes('연말정산')) { const diff=v('paidTax')-v('finalTax'); return [{label:diff>=0?'예상 환급액':'추가 납부액',value:won(Math.abs(diff)),highlight:true}]; }

  if (n.includes('만 나이')) { const birth=date(t('birthDate')); const today=date(t('today')); let age=today.getFullYear()-birth.getFullYear(); if(today.getMonth()<birth.getMonth()||(today.getMonth()===birth.getMonth()&&today.getDate()<birth.getDate())) age--; return [{label:'만 나이',value:qty(age,'세'),highlight:true}]; }
  if (n.includes('디데이')) return [{label:'일수 차이',value:qty(Math.round((date(t('targetDate')).getTime()-date(t('baseDate')).getTime())/dayMs),'일'),highlight:true}];
  if (n.includes('기념일')) { const target=date(t('startDate')); target.setDate(target.getDate()+v('days')-1); return [{label:'해당 날짜',value:target.toLocaleDateString('ko-KR'),highlight:true}]; }
  if (n.includes('BMI')) return [{label:'BMI',value:qty(safeDiv(v('weight'),Math.pow(v('height')/100,2))),highlight:true}];
  if (n.includes('물 섭취')) return [{label:'권장 섭취량',value:qty(v('weight')*v('mlPerKg'),'ml'),highlight:true}];
  if (n.includes('기초대사량')) return [{label:'기초대사량',value:qty(10*v('weight')+6.25*v('height')-5*v('age')+(t('gender')==='male'?5:-161),'kcal'),highlight:true}];
  if (n.includes('걸음')) return [{label:'예상 거리',value:qty(v('steps')*v('stride')/100000,'km'),highlight:true}];
  if (n.includes('주유비')) { const liters=safeDiv(v('distance'),v('efficiency')); return [{label:'필요 연료',value:qty(liters,'L')},{label:'예상 주유비',value:won(liters*v('price')),highlight:true}]; }
  if (n.includes('이동시간')) { const h=safeDiv(v('distance'),v('speed')); return [{label:'예상 이동시간',value:`${Math.floor(h)}시간 ${Math.round((h%1)*60)}분`,highlight:true}]; }
  if (n.includes('전기') || n.includes('가스') || n.includes('수도')) return [{label:'예상 요금',value:won(v('usage')*v('unitPrice')+v('baseFee')),highlight:true}];
  if (n.includes('박스') || n.includes('도배지')) return [{label:'필요 수량',value:qty(Math.ceil(safeDiv(v('total'),v('perUnit'))),'개'),highlight:true}];
  if (n.includes('페인트')) return [{label:'필요 페인트',value:qty(safeDiv(v('area')*v('coats'),v('coverage')),'L'),highlight:true}];
  if (n.includes('타일')) { const tile=(v('tileWidth')/100)*(v('tileHeight')/100); return [{label:'필요 타일 수',value:qty(Math.ceil(safeDiv(v('area'),tile)*(1+v('wasteRate')/100)),'장'),highlight:true}]; }
  if (n.includes('반려견')) return [{label:'사람 나이 환산',value:qty(v('dogAge')<=2?v('dogAge')*12:24+(v('dogAge')-2)*4,'세'),highlight:true}];
  if (n.includes('요리')) { const f=safeDiv(v('targetServing'),v('originalServing')); return [{label:'환산 배율',value:qty(f,'배')},{label:'목표 재료량',value:qty(v('ingredient')*f),highlight:true}]; }
  if (n.includes('센티미터')) return [{label:'인치',value:qty(v('cm')/2.54,'in'),highlight:true}];
  if (n.includes('킬로그램')) return [{label:'파운드',value:qty(v('kg')*2.20462,'lb'),highlight:true}];
  if (n.includes('섭씨')) return [{label:'화씨',value:qty(v('celsius')*9/5+32,'℉'),highlight:true}];
  if (n.includes('러닝')) { const p=safeDiv(v('minutes'),v('distance')); return [{label:'1km 페이스',value:`${Math.floor(p)}분 ${Math.round((p%1)*60)}초`,highlight:true}]; }
  if (n.includes('수면')) { const wake=v('wakeHour')*60+v('wakeMinute'); const sleep=(wake-v('cycles')*90+1440)%1440; return [{label:'권장 취침 시각',value:`${String(Math.floor(sleep/60)).padStart(2,'0')}:${String(Math.round(sleep%60)).padStart(2,'0')}`,highlight:true}]; }
  if (n.includes('입학')) return [{label:'초등 입학연도',value:qty(v('birthYear')+7,'년'),highlight:true},{label:'고등 졸업연도',value:qty(v('birthYear')+19,'년')}];
  if (n.includes('구독료')) return [{label:'1인 부담액',value:won(safeDiv(v('total'),v('people'))),highlight:true}];

  if (n.includes('예금')) { const interest=v('principal')*v('rate')/100*v('months')/12; return [{label:'세전 이자',value:won(interest)},{label:'만기 수령액',value:won(v('principal')+interest),highlight:true}]; }
  if (n.includes('적금')) { const m=v('months'); const principal=v('monthly')*m; const interest=v('monthly')*m*(m+1)/2*v('rate')/100/12; return [{label:'납입 원금',value:won(principal)},{label:'만기 예상액',value:won(principal+interest),highlight:true}]; }
  if (n.includes('복리')) { const fv=v('principal')*Math.pow(1+v('rate')/100/v('compoundPerYear'),v('compoundPerYear')*v('years')); return [{label:'복리 평가액',value:won(fv),highlight:true},{label:'이자수익',value:won(fv-v('principal'))}]; }
  if (n.includes('원리금')) { const r=v('rate')/100/12; const m=v('months'); const pay=r===0?safeDiv(v('principal'),m):v('principal')*r*Math.pow(1+r,m)/(Math.pow(1+r,m)-1); return [{label:'월 상환액',value:won(pay),highlight:true},{label:'총 이자',value:won(pay*m-v('principal'))}]; }
  if (n.includes('월이자') || n.includes('이자기회비용')) return [{label:'월 이자',value:won(v('principal')*v('rate')/100/12),highlight:true}];
  if (n.includes('DSR') || n.includes('DTI')) return [{label:n.includes('DSR')?'DSR':'DTI',value:pct(safeDiv(v('debt'),v('income'))*100),highlight:true}];
  if (n.includes('LTV')) return [{label:'LTV',value:pct(safeDiv(v('loan'),v('value'))*100),highlight:true}];
  if (n.includes('할부')) return [{label:'월 납입액',value:won(safeDiv(v('amount')*(1+v('feeRate')/100),v('months'))),highlight:true}];
  if (n.includes('부가세 포함')) { const supply=safeDiv(v('total'),1+v('rate')/100); return [{label:'공급가액',value:won(supply),highlight:true},{label:'부가세',value:won(v('total')-supply)}]; }
  if (n.includes('부가세')) return [{label:'부가세',value:won(v('price')*v('rate')/100)},{label:'합계금액',value:won(v('price')*(1+v('rate')/100)),highlight:true}];
  if (n.includes('할인율')) return [{label:'할인금액',value:won(v('original')*v('discountRate')/100)},{label:'판매가',value:won(v('original')*(1-v('discountRate')/100)),highlight:true}];
  if (n.includes('마진율')) return [{label:'마진액',value:won(v('sale')-v('cost'))},{label:'마진율',value:pct(safeDiv(v('sale')-v('cost'),v('sale'))*100),highlight:true}];
  if (n.includes('판매가')) return [{label:'필요 판매가',value:won(safeDiv(v('cost'),1-v('targetMargin')/100)),highlight:true}];
  if (n.includes('주식') || n.includes('코인')) { const profit=(v('sell')-v('buy'))*v('quantity')-v('fees'); return [{label:'손익',value:won(profit),highlight:true},{label:'수익률',value:pct(safeDiv(profit,v('buy')*v('quantity'))*100)}]; }
  if (n.includes('환율')) return [{label:'원화 환산액',value:won(v('foreign')*v('rate')+v('fee')),highlight:true}];
  if (n.includes('목표금액')) return [{label:'월 필요 저축액',value:won(safeDiv(v('target')-v('current'),v('months'))),highlight:true}];
  if (n.includes('비상금')) return [{label:'필요 비상금',value:won(v('monthlyExpense')*v('months')),highlight:true}];
  if (n.includes('물가상승')) return [{label:'미래 필요액',value:won(v('current')*Math.pow(1+v('rate')/100,v('years'))),highlight:true}];
  if (n.includes('연평균')) return [{label:'연평균 수익률',value:pct((Math.pow(safeDiv(v('end'),v('start')),1/v('years'))-1)*100),highlight:true}];

  if (n.includes('평수 제곱미터')) return [{label:'제곱미터',value:qty(v('pyeong')*3.305785,'㎡'),highlight:true}];
  if (n.includes('제곱미터 평수')) return [{label:'평수',value:qty(v('m2')/3.305785,'평'),highlight:true}];
  if (n.includes('취득세')) return [{label:'취득세 예상액',value:won(Math.max(0,v('price')*v('taxRate')/100-v('discount'))),highlight:true}];
  if (n.includes('중개보수') && !n.includes('부가세')) { const fee=v('price')*v('rate')/100; return [{label:'중개보수',value:won(v('cap')>0?Math.min(fee,v('cap')):fee),highlight:true}]; }
  if (n.includes('월세 수익률')) { const rent=v('monthlyRent')*12-v('annualCost'); return [{label:'연 순수익',value:won(rent)},{label:'월세 수익률',value:pct(safeDiv(rent,v('price')-v('deposit'))*100),highlight:true}]; }
  if (n.includes('전세가율')) return [{label:'전세가율',value:pct(safeDiv(v('deposit'),v('price'))*100),highlight:true}];
  if (n.includes('월세 전세')) return [{label:'전세 환산 보증금',value:won(safeDiv(v('monthlyRent')*12,v('rate')/100)),highlight:true}];
  if (n.includes('전세 월세')) return [{label:'월세 환산액',value:won(v('deposit')*v('rate')/100/12),highlight:true}];
  if (n.includes('관리비')) return [{label:'분담 관리비',value:won(v('total')*safeDiv(v('usedDays'),v('monthDays'))),highlight:true}];
  if (n.includes('장기수선')) return [{label:'총 장기수선충당금',value:won(v('monthly')*v('months')),highlight:true}];
  if (n.includes('이사비')) return [{label:'예상 이사비',value:won(v('base')+v('distance')*v('distanceRate')+v('extra')),highlight:true}];
  if (n.includes('인테리어')) return [{label:'총 공사비',value:won(v('pyeong')*v('costPerPyeong')),highlight:true}];
  if (n.includes('투자수익률')) { const profit=v('annualRent')+v('priceGain')-v('costs'); return [{label:'예상 수익',value:won(profit)},{label:'투자수익률',value:pct(safeDiv(profit,v('investment'))*100),highlight:true}]; }
  if (n.includes('양도차익')) return [{label:'양도차익',value:won(v('sale')-v('buy')-v('costs')),highlight:true}];
  if (n.includes('중개보수 부가세')) return [{label:'총 지급액',value:won(v('fee')*(1+v('vatRate')/100)),highlight:true}];
  if (n.includes('평당가')) return [{label:'평당가',value:won(safeDiv(v('price'),v('pyeong'))),highlight:true}];
  return [{label:'계산 결과',value:won(0),highlight:true}];
}

export default function UniversalCalculatorHub({ category, subCalculatorId = 'all' }: { category: CategoryType; subCalculatorId?: string }) {
  const [query, setQuery] = useState('');
  const activeCategory = categoryKeys.includes(category as CalcCategory) ? category as CalcCategory : 'insurance';
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

  const filtered = useMemo(() => available.filter((item) => !query || `${item.name} ${item.description}`.toLowerCase().includes(query.toLowerCase())), [available, query]);
  const result = calculate(selected, values);
  const counts = useMemo(() => Object.fromEntries(categoryKeys.map((key) => [key, names[key].length])) as Record<CalcCategory, number>, []);

  const choose = (id: string) => {
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
          <p className="text-sm text-slate-500 mt-2 max-w-3xl leading-relaxed">계산기마다 입력 항목과 공식이 다르게 구성되어 있습니다. 필요한 계산기를 선택하면 해당 계산에 맞는 전용 입력폼이 열립니다.</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
          <div className="rounded-xl bg-slate-900 text-white px-3 py-2"><p className="text-lg font-black">{calculatorCatalog.length}</p><p className="text-[10px] text-slate-300 font-bold">전체</p></div>
          {categoryKeys.map((key) => <div key={key} className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2"><p className="text-lg font-black text-slate-900">{counts[key]}</p><p className="text-[10px] text-slate-500 font-bold">{categoryLabels[key]}</p></div>)}
        </div>
      </div>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_430px] gap-6">
        <div className="space-y-4">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="계산기 검색: 주휴수당, 대출, 평수, 전기요금..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500" /></div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 max-h-[760px] overflow-y-auto pr-1">
            {filtered.map((item) => {
              const active = item.id === selected.id;
              return <button key={item.id} onClick={() => choose(item.id)} className={`text-left rounded-2xl border p-4 transition-all ${active ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'}`}>
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
            {fields.map((f) => <label key={f.key} className="block"><span className="block text-xs font-bold text-slate-300 mb-1.5">{f.label}{f.unit ? ` (${f.unit})` : ''}</span>{f.type === 'select' ? <select value={String(values[f.key] ?? f.defaultValue)} onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-3 text-white font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-400">{f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select> : <input type={f.type || 'number'} value={String(values[f.key] ?? f.defaultValue)} onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: (f.type || 'number') === 'number' ? Number(e.target.value) : e.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-right text-white font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-400" />}</label>)}
          </div>
          <div className="mt-5 rounded-2xl bg-white text-slate-900 p-4 space-y-2">{result.map((row) => <div key={row.label} className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 ${row.highlight ? 'bg-blue-50' : 'bg-slate-50'}`}><span className="text-xs font-bold text-slate-500">{row.label}</span><span className={`text-sm font-black text-right ${row.highlight ? 'text-blue-700' : 'text-slate-800'}`}>{row.value}</span></div>)}</div>
          <div className="flex gap-2 mt-4"><button onClick={() => setValues(Object.fromEntries(fields.map((f) => [f.key, f.defaultValue])))} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 py-3 text-xs font-black transition"><RotateCcw className="w-4 h-4" /> 초기화</button><button onClick={() => window.print()} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-400 py-3 text-xs font-black transition">결과 인쇄 <ArrowRight className="w-4 h-4" /></button></div>
        </aside>
      </div>
    </section>
  );
}
