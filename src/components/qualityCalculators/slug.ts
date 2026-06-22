import { CalculatorSpec } from './model';

export const calculatorSlug = (calculator: Pick<CalculatorSpec, 'id' | 'name'>): string => {
  const slug = calculator.name
    .trim()
    .normalize('NFC')
    .replaceAll(' ', '-')
    .replaceAll('/', '')
    .replaceAll('?', '')
    .replaceAll('#', '')
    .replaceAll('%', '')
    .replaceAll('&', '')
    .replaceAll('=', '')
    .replaceAll('+', '')
    .replaceAll('--', '-');

  return slug || calculator.id;
};

export const calculatorPath = (calculator: Pick<CalculatorSpec, 'id' | 'name'>): string => {
  return `/calculators/${calculatorSlug(calculator)}`;
};

export const findCalculatorBySlugOrId = <T extends Pick<CalculatorSpec, 'id' | 'name'>>(
  catalog: T[],
  value?: string | null,
): T | undefined => {
  if (!value) return undefined;
  const decoded = decodeURIComponent(value).normalize('NFC').replaceAll('/', '');
  return catalog.find((item) => item.id === decoded || calculatorSlug(item) === decoded);
};
