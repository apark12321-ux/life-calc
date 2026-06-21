import { CalculatorSpec, ResultRow, Values } from './model';

const num = (values: Values, key: string) => Number(values[key] ?? 0) || 0;
const str = (values: Values, key: string) => String(values[key] ?? '');
const div = (a: number, b: number) => (b ? a / b : 0);
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const won = (value: number) => `${Math.round(Number.isFinite(value) ? value : 0).toLocaleString('ko-KR')}원`;
const qty = (value: number, unit = '') => `${(Math.round((Number.isFinite(value) ? value : 0) * 100) / 100).toLocaleString('ko-KR')}${unit}`;
const pct = (value: number) => qty(value, '%');
const row = (label: string, value: string, highlight = false): ResultRow => ({ label, value, highlight });
const date = (raw: string) => new Date(`${raw}T00:00:00`);
const daysBetween = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / 86400000);
const metaText = (spec: CalculatorSpec, key: string, fallback: string) => String(spec.meta?.[key] ?? fallback);
const clock = (minutes: number) => {
  const normalized = ((Math.round(minutes) % 1440) + 1440) % 1440;
  return `${String(Math.floor(normalized / 60)).padStart(2, '0')}:${String(normalized % 60).padStart(2, '0')}`;
};

export function defaultValues(spec: CalculatorSpec): Values {
  return Object.fromEntries(spec.fields.map((field) => [field.key, field.defaultValue]));
}

export function calculate(spec: CalculatorSpec, values: Values): ResultRow[] {
  switch (spec.mode) {
    case 'pension': {
      const base = clamp(num(values, 'income'), num(values, 'minIncome'), num(values, 'maxIncome'));
      const employee = base * num(values, 'employeeRate') / 100;
      const employer = base * num(values, 'employerRate') / 100;
      return [row('적용 기준소득', won(base)), row('근로자 부담액', won(employee), true), row('사업주 부담액', won(employer)), row('합계', won(employee + employer))];
    }
    case 'rateSplit': {
      const base = num(values, 'base');
      const totalRate = num(values, 'totalRate');
      const employeeRate = values.employeeRate !== undefined ? num(values, 'employeeRate') : totalRate / 2;
      const employerRate = values.employerRate !== undefined ? num(values, 'employerRate') : totalRate / 2;
      const employee = base * employeeRate / 100;
      const employer = base * employerRate / 100;
      return [row(metaText(spec, 'totalLabel', '총 부담액'), won(employee + employer)), row(metaText(spec, 'employeeLabel', '근로자 부담액'), won(employee), true), row(metaText(spec, 'employerLabel', '사업주 부담액'), won(employer))];
    }
    case 'rateAmount': {
      const amount = num(values, 'base') * num(values, 'rate') / 100;
      return [row(metaText(spec, 'resultLabel', '예상 금액'), won(amount), true), row('적용 비율', pct(num(values, 'rate')))];
    }
    case 'employeeInsuranceTotal': {
      const income = num(values, 'income');
      const pension = income * num(values, 'pensionRate') / 100;
      const health = income * num(values, 'healthRate') / 100;
      const care = health * num(values, 'careRate') / 100;
      const employment = income * num(values, 'employmentRate') / 100;
      return [row('국민연금', won(pension)), row('건강보험', won(health)), row('장기요양', won(care)), row('고용보험', won(employment)), row('근로자 공제 합계', won(pension + health + care + employment), true)];
    }
    case 'freelancerNet': {
      const tax = num(values, 'gross') * (num(values, 'incomeTax') + num(values, 'localTax')) / 100;
      return [row('원천징수액', won(tax)), row('실수령액', won(num(values, 'gross') - tax), true)];
    }
    case 'weeklyHolidayPay': {
      const eligible = num(values, 'weeklyHours') >= 15 && num(values, 'workDays') > 0;
      const hours = eligible ? Math.min(8, num(values, 'weeklyHours') / 40 * 8) : 0;
      return [row('주휴 인정 시간', qty(hours, '시간')), row('예상 주휴수당', won(num(values, 'hourly') * hours), true), row('발생 여부', eligible ? '요건 충족 가능' : '요건 미충족')];
    }
    case 'severancePay': {
      const averageDaily = (num(values, 'threeMonthWage') + num(values, 'annualBonus') / 4) / Math.max(1, num(values, 'threeMonthDays'));
      const pay = averageDaily * 30 * num(values, 'serviceDays') / 365;
      return [row('1일 평균임금', won(averageDaily)), row('예상 퇴직금', won(pay), true), row('계속근로연수', qty(num(values, 'serviceDays') / 365, '년'))];
    }
    case 'hourlyMonthly': {
      const monthly = num(values, 'hourly') * num(values, 'weeklyHours') * 4.345;
      return [row('월 환산 근무시간', qty(num(values, 'weeklyHours') * 4.345, '시간')), row('월 환산 급여', won(monthly), true)];
    }
    case 'premiumPay': {
      const amount = num(values, 'hourly') * num(values, 'hours') * num(values, 'multiplier');
      return [row(metaText(spec, 'resultLabel', '가산수당'), won(amount), true), row('적용 시간', qty(num(values, 'hours'), '시간'))];
    }
    case 'annualLeavePay': {
      const amount = num(values, 'hourly') * num(values, 'dailyHours') * num(values, 'days');
      return [row('1일 통상임금', won(num(values, 'hourly') * num(values, 'dailyHours'))), row('예상 연차수당', won(amount), true)];
    }
    case 'koreanAge': {
      const birth = date(str(values, 'birth'));
      const base = date(str(values, 'base'));
      let age = base.getFullYear() - birth.getFullYear();
      if (base.getMonth() < birth.getMonth() || (base.getMonth() === birth.getMonth() && base.getDate() < birth.getDate())) age -= 1;
      return [row('만 나이', qty(Math.max(0, age), '세'), true)];
    }
    case 'dateDiff': {
      const days = daysBetween(date(str(values, 'start')), date(str(values, 'end')));
      return [row('차이 일수', qty(Math.abs(days), '일'), true), row('주 단위', qty(Math.abs(days) / 7, '주'))];
    }
    case 'dday': {
      const days = daysBetween(date(str(values, 'base')), date(str(values, 'target')));
      return [row('남은 날짜', days >= 0 ? `D-${days}` : `D+${Math.abs(days)}`, true), row('일수', qty(days, '일'))];
    }
    case 'utilityBill': {
      const subtotal = num(values, 'baseFee') + num(values, 'usage') * num(values, 'unitPrice');
      const vat = subtotal * num(values, 'vatRate') / 100;
      return [row('공급가 추정', won(subtotal)), row('부가세', won(vat)), row('예상 청구액', won(subtotal + vat), true)];
    }
    case 'splitCost': {
      const each = div(num(values, 'total'), num(values, 'people'));
      return [row('총 비용', won(num(values, 'total'))), row('1인 부담액', won(each), true)];
    }
    case 'loanPayment': {
      const monthlyRate = num(values, 'rate') / 100 / 12;
      const months = num(values, 'months');
      const principal = num(values, 'principal');
      const payment = monthlyRate ? principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1) : div(principal, months);
      return [row('월 상환액', won(payment), true), row('총 상환액', won(payment * months)), row('총 이자', won(payment * months - principal))];
    }
    case 'monthlyInterest': {
      const interest = num(values, 'principal') * num(values, 'rate') / 100 / 12;
      return [row('월 이자', won(interest), true), row('연 이자', won(interest * 12))];
    }
    case 'simpleInterest': {
      const interest = num(values, 'principal') * num(values, 'rate') / 100 * num(values, 'months') / 12;
      return [row('세전 이자', won(interest)), row('만기금액', won(num(values, 'principal') + interest), true)];
    }
    case 'monthlySavings': {
      const r = num(values, 'rate') / 100 / 12;
      const n = num(values, 'months');
      const fv = r ? num(values, 'monthly') * ((Math.pow(1 + r, n) - 1) / r) : num(values, 'monthly') * n;
      return [row('총 납입액', won(num(values, 'monthly') * n)), row('예상 만기금액', won(fv), true), row('예상 이자', won(fv - num(values, 'monthly') * n))];
    }
    case 'dsr': {
      const total = num(values, 'annualDebtPayment') + num(values, 'otherDebtPayment');
      return [row('연간 상환액 합계', won(total)), row('DSR', pct(div(total, num(values, 'annualIncome')) * 100), true)];
    }
    case 'acquisitionTax': {
      const tax = num(values, 'price') * (num(values, 'taxRate') + num(values, 'extraRate')) / 100;
      return [row('예상 취득세 등', won(tax), true), row('취득가 대비 비율', pct(div(tax, num(values, 'price')) * 100))];
    }
    case 'pricePerPyeong':
      return [row('평당가', won(div(num(values, 'price'), num(values, 'area'))), true)];
    case 'ltv':
      return [row('LTV', pct(div(num(values, 'loan'), num(values, 'price')) * 100), true), row('주택가격', won(num(values, 'price')))];
    case 'rentConversion': {
      const monthly = num(values, 'depositDiff') * num(values, 'rate') / 100 / 12;
      return [row('월세 전환액', won(monthly), true), row('연 전환액', won(monthly * 12))];
    }
    case 'bmi': {
      const bmi = div(num(values, 'weight'), Math.pow(num(values, 'height') / 100, 2));
      return [row('BMI', qty(bmi), true), row('판정', bmi >= 25 ? '과체중 이상' : bmi >= 18.5 ? '정상 범위' : '저체중')];
    }
    case 'bmr': {
      const bmr = 10 * num(values, 'weight') + 6.25 * num(values, 'height') - 5 * num(values, 'age') + num(values, 'genderOffset');
      return [row('기초대사량', qty(bmr, 'kcal'), true)];
    }
    case 'waterIntake':
      return [row('하루 권장량', qty(num(values, 'weight') * num(values, 'mlPerKg'), 'mL'), true)];
    case 'runningPace': {
      const totalSeconds = num(values, 'minutes') * 60 + num(values, 'seconds');
      const pace = div(totalSeconds, num(values, 'distance'));
      return [row('km당 페이스', `${Math.floor(pace / 60)}분 ${Math.round(pace % 60)}초`, true), row('평균 속도', qty(div(num(values, 'distance'), totalSeconds / 3600), 'km/h'))];
    }
    case 'proteinIntake':
      return [row('하루 단백질 목표', qty(num(values, 'weight') * num(values, 'gramPerKg'), 'g'), true)];
    case 'fuelCost': {
      const liters = div(num(values, 'distance'), num(values, 'efficiency'));
      return [row('필요 연료', qty(liters, 'L')), row('예상 주유비', won(liters * num(values, 'fuelPrice')), true)];
    }
    case 'parkingFee': {
      const extra = Math.max(0, num(values, 'totalMinutes') - num(values, 'baseMinutes'));
      const units = Math.ceil(div(extra, num(values, 'unitMinutes')));
      return [row('추가 단위', qty(units, '회')), row('총 주차비', won(num(values, 'baseFee') + units * num(values, 'unitFee')), true)];
    }
    case 'commuteCost':
      return [row('월 교통비', won(num(values, 'daily') * num(values, 'days')), true)];
    case 'speed':
      return [row('평균속도', qty(div(num(values, 'distance'), num(values, 'minutes') / 60), 'km/h'), true)];
    case 'averageScore':
      return [row('평균 점수', qty((num(values, 'score1') + num(values, 'score2') + num(values, 'score3')) / 3, '점'), true)];
    case 'gpa': {
      const points = num(values, 'grade1') * num(values, 'credit1') + num(values, 'grade2') * num(values, 'credit2');
      const credits = num(values, 'credit1') + num(values, 'credit2');
      return [row('GPA', qty(div(points, credits), '점'), true)];
    }
    case 'attendanceRate':
      return [row('비율', pct(div(num(values, 'attended'), num(values, 'total')) * 100), true)];
    case 'finalScoreNeeded': {
      const needed = div(num(values, 'target') - num(values, 'current') * num(values, 'currentWeight') / 100, num(values, 'finalWeight') / 100);
      return [row('필요 기말점수', qty(needed, '점'), true)];
    }
    case 'studyPlan':
      return [row('하루 공부시간', qty(div(num(values, 'totalHours'), num(values, 'days')), '시간'), true)];
    case 'breakEven': {
      const margin = num(values, 'price') - num(values, 'variableCost');
      return [row('개당 공헌이익', won(margin)), row('손익분기 판매량', qty(Math.ceil(div(num(values, 'fixedCost'), margin)), '개'), true)];
    }
    case 'marginRate': {
      const margin = num(values, 'price') - num(values, 'cost') - num(values, 'fee');
      return [row('순마진', won(margin)), row('마진율', pct(div(margin, num(values, 'price')) * 100), true)];
    }
    case 'vat': {
      const vat = num(values, 'supply') * num(values, 'vatRate') / 100;
      return [row('부가세', won(vat)), row('합계금액', won(num(values, 'supply') + vat), true)];
    }
    case 'roas':
      return [row('ROAS', pct(div(num(values, 'revenue'), num(values, 'adCost')) * 100), true)];
    case 'conversionRate':
      return [row('전환율', pct(div(num(values, 'conversions'), num(values, 'visitors')) * 100), true)];
    case 'discountPrice': {
      const discount = num(values, 'price') * num(values, 'discountRate') / 100;
      return [row('할인금액', won(discount)), row('최종가', won(num(values, 'price') - discount), true)];
    }
    case 'bundleUnitPrice': {
      const total = num(values, 'total') + num(values, 'shipping');
      return [row('총 결제액', won(total)), row('개당 단가', won(div(total, num(values, 'quantity'))), true)];
    }
    case 'pointDiscount':
      return [row('최종 결제액', won(Math.max(0, num(values, 'price') - num(values, 'point') - num(values, 'coupon'))), true)];
    case 'freeShippingGap':
      return [row('추가 필요금액', won(Math.max(0, num(values, 'threshold') - num(values, 'cart'))), true)];
    case 'unitCompare':
      return [row('단위당 가격', won(div(num(values, 'price'), num(values, 'amount'))), true)];
    case 'cmToInch':
      return [row('인치', qty(num(values, 'cm') / 2.54, 'in'), true)];
    case 'kgToLb':
      return [row('파운드', qty(num(values, 'kg') * 2.20462, 'lb'), true)];
    case 'pyeongToM2':
      return [row('제곱미터', qty(num(values, 'pyeong') * 3.305785, '㎡'), true)];
    case 'm2ToPyeong':
      return [row('평', qty(num(values, 'm2') / 3.305785, '평'), true)];
    case 'celsiusFahrenheit':
      return [row('화씨', qty(num(values, 'celsius') * 9 / 5 + 32, '℉'), true)];
    case 'travelBudget': {
      const total = num(values, 'transport') + num(values, 'lodging') + num(values, 'food') + num(values, 'extra');
      return [row('총 여행경비', won(total), true), row('1인 경비', won(div(total, num(values, 'people'))))];
    }
    case 'timeZone':
      return [row('도착지 현지시각', clock(num(values, 'hour') * 60 + num(values, 'minute') + num(values, 'offset') * 60), true)];
    case 'exchange':
      return [row('환산 외화', qty(div(num(values, 'krw'), num(values, 'rate')), '달러/현지통화'), true)];
    case 'routeTime': {
      const hours = div(num(values, 'distance'), num(values, 'speed'));
      return [row('예상 이동시간', `${Math.floor(hours)}시간 ${Math.round((hours % 1) * 60)}분`, true)];
    }
    default:
      return [row('계산 결과', '입력값을 확인하세요', true)];
  }
}
