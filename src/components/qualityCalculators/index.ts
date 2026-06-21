import { insuranceWageCalculators } from './catalogInsuranceWage';
import { lifeFinancePropertyCalculators } from './catalogLifeFinanceProperty';

export const calculatorCatalog = [
  ...insuranceWageCalculators,
  ...lifeFinancePropertyCalculators,
];

export { calculate, defaultValues } from './logic';
export { categoryKeys, categoryLabels } from './model';
export type { CalcCategory, CalculatorSpec, Field, ResultRow, Values } from './model';
