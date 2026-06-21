import { CategoryType } from '../../types';

export type CalcCategory = Exclude<CategoryType, 'policy'>;
export type FieldType = 'number' | 'date' | 'select';
export type CalcMode = string;

export type Field = {
  key: string;
  label: string;
  unit?: string;
  type?: FieldType;
  defaultValue: number | string;
  options?: Array<{ label: string; value: string }>;
};

export type Values = Record<string, string | number>;
export type ResultRow = { label: string; value: string; highlight?: boolean };
export type CalculatorSpec = {
  id: string;
  name: string;
  category: CalcCategory;
  icon: string;
  description: string;
  formula: string;
  note: string;
  mode: CalcMode;
  fields: Field[];
  meta?: Record<string, string | number | boolean>;
};

export const categoryKeys: CalcCategory[] = [
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

export const categoryLabels: Record<CalcCategory, string> = {
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
