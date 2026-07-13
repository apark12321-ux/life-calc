export interface ToolTipProps {
  text: string;
}

export type CategoryType = 'insurance' | 'wage' | 'life' | 'finance' | 'property' | 'policy';

export interface Calculator {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: CategoryType;
}

export interface CalculationHistory {
  id: string;
  calculatorId: string;
  calculatorName: string;
  timestamp: string;
  summary: string;
}
