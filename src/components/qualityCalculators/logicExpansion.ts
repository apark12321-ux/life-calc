import { CalculatorSpec, ResultRow, Values } from './model';

const num = (values: Values, key: string) => Number(values[key] ?? 0) || 0;
const div = (a: number, b: number) => (b ? a / b : 0);
const won = (value: number) => `${Math.round(Number.isFinite(value) ? value : 0).toLocaleString('ko-KR')}원`;
const qty = (value: number, unit = '') => `${(Math.round((Number.isFinite(value) ? value : 0) * 100) / 100).toLocaleString('ko-KR')}${unit}`;
const pct = (value: number) => qty(value, '%');
const row = (label: string, value: string, highlight = false): ResultRow => ({ label, value, highlight });
const metaText = (spec: CalculatorSpec, key: string, fallback: string) => String(spec.meta?.[key] ?? fallback);

export function calculateExpansion(spec: CalculatorSpec, values: Values): ResultRow[] | null {
  switch (spec.mode) {
    case 'monthlyToAnnual': {
      const monthly = num(values, 'monthly');
      return [row('월 기준 금액', won(monthly)), row('연간 합계', won(monthly * 12), true)];
    }
    case 'netPayByDeduction': {
      const gross = num(values, 'gross');
      const deduction = gross * num(values, 'deductionRate') / 100;
      return [row('예상 공제액', won(deduction)), row('예상 실수령액', won(gross - deduction), true)];
    }
    case 'percentageOf': {
      const rate = div(num(values, 'part'), num(values, 'total')) * 100;
      return [row(metaText(spec, 'resultLabel', '비율'), pct(rate), true), row('기준 금액', won(num(values, 'total')))];
    }
    case 'compoundInterest': {
      const principal = num(values, 'principal');
      const r = num(values, 'rate') / 100 / 12;
      const months = num(values, 'months');
      const amount = principal * Math.pow(1 + r, months);
      return [row('예상 이자', won(amount - principal)), row('예상 만기금액', won(amount), true)];
    }
    case 'divideAmount': {
      const each = div(num(values, 'total'), num(values, 'count'));
      return [row('총 금액', won(num(values, 'total'))), row(metaText(spec, 'resultLabel', '1회 금액'), won(each), true)];
    }
    case 'returnRate': {
      const buyTotal = num(values, 'buy') * num(values, 'quantity');
      const sellTotal = num(values, 'sell') * num(values, 'quantity');
      const profit = sellTotal - buyTotal;
      return [row('투자 손익', won(profit), true), row('수익률', pct(div(profit, buyTotal) * 100))];
    }
    case 'targetMonthlySaving': {
      const needed = Math.max(0, num(values, 'target') - num(values, 'current'));
      return [row('추가 필요금액', won(needed)), row('월 필요 저축액', won(div(needed, num(values, 'months'))), true)];
    }
    case 'rentalYield': {
      const annual = num(values, 'monthlyRent') * 12;
      return [row('연 임대수입', won(annual)), row('단순 수익률', pct(div(annual, num(values, 'investment')) * 100), true)];
    }
    case 'capitalGain': {
      const gain = num(values, 'sell') - num(values, 'buy') - num(values, 'expense');
      return [row('양도차익', won(gain), true), row('필요경비 반영액', won(num(values, 'expense')))];
    }
    case 'weightGoalDays': {
      const loss = Math.max(0, num(values, 'current') - num(values, 'target'));
      const weeks = div(loss, num(values, 'weeklyLoss'));
      return [row('감량 목표', qty(loss, 'kg')), row('예상 기간', `${Math.ceil(weeks)}주`, true)];
    }
    case 'calorieBurn': {
      const kcal = num(values, 'minutes') / 60 * num(values, 'kcalPerHour');
      return [row('예상 소모 칼로리', qty(kcal, 'kcal'), true)];
    }
    case 'ratio': {
      const ratio = div(num(values, 'a'), num(values, 'b'));
      return [row(metaText(spec, 'resultLabel', '비율'), qty(ratio), true)];
    }
    case 'dailySaving': {
      const saving = num(values, 'daily') * num(values, 'days');
      return [row('총 절약액', won(saving), true), row('월평균 절약액', won(div(saving, Math.max(1, num(values, 'days'))) * 30))];
    }
    case 'sleepCycle': {
      const total = num(values, 'hours') * 60 + num(values, 'minutes');
      return [row('총 수면시간', qty(total, '분')), row('90분 수면 사이클', qty(div(total, 90), '회'), true)];
    }
    case 'fuelEfficiency':
      return [row('실제 연비', qty(div(num(values, 'distance'), num(values, 'fuel')), 'km/L'), true)];
    case 'distanceByFuel':
      return [row('주행 가능 거리', qty(num(values, 'fuel') * num(values, 'efficiency'), 'km'), true)];
    case 'evChargeCost':
      return [row('예상 충전비', won(num(values, 'kwh') * num(values, 'unitPrice')), true)];
    case 'sumAndMonthly': {
      const total = num(values, 'a') + num(values, 'b') + num(values, 'c') + num(values, 'd');
      return [row('연간 합계', won(total)), row('월평균 비용', won(div(total, 12)), true)];
    }
    case 'annualToMonthly':
      return [row('월평균 금액', won(div(num(values, 'annual'), 12)), true), row('연간 금액', won(num(values, 'annual')))];
    case 'errorRate':
      return [row('오답률', pct(div(num(values, 'wrong'), num(values, 'total')) * 100), true)];
    case 'readingSpeed':
      return [row('분당 독서량', qty(div(num(values, 'pages'), num(values, 'minutes')), '쪽/분'), true)];
    case 'manuscriptPages':
      return [row('200자 원고지 기준', qty(Math.ceil(div(num(values, 'chars'), 200)), '매'), true)];
    case 'absenceAllowance': {
      const maxAbsence = Math.floor(num(values, 'total') * (1 - num(values, 'minRate') / 100));
      const remain = Math.max(0, maxAbsence - num(values, 'used'));
      return [row('최대 결석 가능일', qty(maxAbsence, '일')), row('남은 결석 가능일', qty(remain, '일'), true)];
    }
    case 'averageOrderValue':
      return [row(metaText(spec, 'resultLabel', '평균 금액'), won(div(num(values, 'revenue'), num(values, 'orders'))), true)];
    case 'multiply':
      return [row(metaText(spec, 'resultLabel', '계산 결과'), won(num(values, 'a') * num(values, 'b')), true)];
    case 'refundAmount':
      return [row('예상 환불액', won(Math.max(0, num(values, 'paid') - num(values, 'used') - num(values, 'fee'))), true)];
    case 'sumFive': {
      const total = num(values, 'a') + num(values, 'b') + num(values, 'c') + num(values, 'd') + num(values, 'e');
      return [row('총액', won(total), true)];
    }
    case 'inchToCm':
      return [row('센티미터', qty(num(values, 'inch') * 2.54, 'cm'), true)];
    case 'mileToKm':
      return [row('킬로미터', qty(num(values, 'mile') * 1.609344, 'km'), true)];
    case 'lbToKg':
      return [row('킬로그램', qty(div(num(values, 'lb'), 2.20462), 'kg'), true)];
    case 'fahrenheitCelsius':
      return [row('섭씨', qty((num(values, 'fahrenheit') - 32) * 5 / 9, '℃'), true)];
    case 'hourToMinute':
      return [row('분', qty(num(values, 'hour') * 60, '분'), true)];
    case 'excessAmount':
      return [row('초과금액', won(Math.max(0, num(values, 'amount') - num(values, 'limit'))), true)];
    default:
      return null;
  }
}
