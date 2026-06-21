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
      return [row('적용 기준소득', won(base)), row('근로자 부담액', won(base * num(values, 'employeeRate') / 100), true), row('사업주 부담액', won(base * num(values, 'employerRate') / 100))];
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
    case 'koreanAge': {
      const birth = date(str(values, 'birth'));
      const base = date(str(values, 'base'));
      let age = base.getFullYear() - birth.getFullYear();
      if (base.getMonth() < birth.getMonth() || (base.getMonth() === birth.getMonth() && base.getDate() < birth.getDate())) age -= 1;
      return [row('만 나이', qty(Math.max(0, age), '세'), true)];
    }
    case 'electricBill': {
      const subtotal = num(values, 'baseFee') + num(values, 'usage') * num(values, 'unitPrice');
      const vat = subtotal * num(values, 'vatRate') / 100;
      return [row('공급가 추정', won(subtotal)), row('부가세', won(vat)), row('예상 청구액', won(subtotal + vat), true)];
    }
    case 'loanPayment': {
      const monthlyRate = num(values, 'rate') / 100 / 12;
      const months = num(values, 'months');
      const principal = num(values, 'principal');
      const payment = monthlyRate ? principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1) : div(principal, months);
      return [row('월 상환액', won(payment), true), row('총 상환액', won(payment * months)), row('총 이자', won(payment * months - principal))];
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
    case 'bmi': {
      const bmi = div(num(values, 'weight'), Math.pow(num(values, 'height') / 100, 2));
      return [row('BMI', qty(bmi), true), row('판정', bmi >= 25 ? '과체중 이상' : bmi >= 18.5 ? '정상 범위' : '저체중')];
    }
    case 'runningPace': {
      const totalSeconds = num(values, 'minutes') * 60 + num(values, 'seconds');
      const pace = div(totalSeconds, num(values, 'distance'));
      return [row('km당 페이스', `${Math.floor(pace / 60)}분 ${Math.round(pace % 60)}초`, true), row('평균 속도', qty(div(num(values, 'distance'), totalSeconds / 3600), 'km/h'))];
    }
    case 'fuelCost': {
      const liters = div(num(values, 'distance'), num(values, 'efficiency'));
      return [row('필요 연료', qty(liters, 'L')), row('예상 주유비', won(liters * num(values, 'fuelPrice')), true)];
    }
    case 'parkingFee': {
      const extra = Math.max(0, num(values, 'totalMinutes') - num(values, 'baseMinutes'));
      const units = Math.ceil(div(extra, num(values, 'unitMinutes')));
      return [row('추가 단위', qty(units, '회')), row('총 주차비', won(num(values, 'baseFee') + units * num(values, 'unitFee')), true)];
    }
    case 'averageScore':
      return [row('평균 점수', qty((num(values, 'score1') + num(values, 'score2') + num(values, 'score3')) / 3, '점'), true)];
    case 'gpa': {
      const points = num(values, 'grade1') * num(values, 'credit1') + num(values, 'grade2') * num(values, 'credit2');
      const credits = num(values, 'credit1') + num(values, 'credit2');
      return [row('GPA', qty(div(points, credits), '점'), true)];
    }
    case 'breakEven': {
      const margin = num(values, 'price') - num(values, 'variableCost');
      return [row('개당 공헌이익', won(margin)), row('손익분기 판매량', qty(Math.ceil(div(num(values, 'fixedCost'), margin)), '개'), true)];
    }
    case 'marginRate': {
      const margin = num(values, 'price') - num(values, 'cost') - num(values, 'fee');
      return [row('순마진', won(margin)), row('마진율', pct(div(margin, num(values, 'price')) * 100), true)];
    }
    case 'discountPrice': {
      const discount = num(values, 'price') * num(values, 'discountRate') / 100;
      return [row('할인금액', won(discount)), row('최종가', won(num(values, 'price') - discount), true)];
    }
    case 'bundleUnitPrice': {
      const total = num(values, 'total') + num(values, 'shipping');
      return [row('총 결제액', won(total)), row('개당 단가', won(div(total, num(values, 'quantity'))), true)];
    }
    case 'cmToInch':
      return [row('인치', qty(num(values, 'cm') / 2.54, 'in'), true)];
    case 'kgToLb':
      return [row('파운드', qty(num(values, 'kg') * 2.20462, 'lb'), true)];
    case 'travelBudget': {
      const total = num(values, 'transport') + num(values, 'lodging') + num(values, 'food') + num(values, 'extra');
      return [row('총 여행경비', won(total), true), row('1인 경비', won(div(total, num(values, 'people'))))];
    }
    case 'timeZone':
      return [row('도착지 현지시각', clock(num(values, 'hour') * 60 + num(values, 'minute') + num(values, 'offset') * 60), true)];
    default:
      return [row('계산 결과', '입력값을 확인하세요', true)];
  }
}
