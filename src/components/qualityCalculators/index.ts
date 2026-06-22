import { koreaEssentialCalculators } from './catalogKoreaEssential';
import { koreaExpansionCalculators } from './catalogKoreaExpansion';
import { calculate as baseCalculate, defaultValues } from './logic';
import { calculateExpansion } from './logicExpansion';
import { CalculatorSpec, Values } from './model';

export const calculatorCatalog = [...koreaEssentialCalculators, ...koreaExpansionCalculators];

export const calculate = (spec: CalculatorSpec, values: Values) => calculateExpansion(spec, values) ?? baseCalculate(spec, values);

export { defaultValues };
export { categoryKeys, categoryLabels } from './model';
export type { CalcCategory, CalculatorSpec, Field, ResultRow, Values } from './model';
