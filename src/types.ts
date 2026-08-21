export interface ToolTipProps {
  text: string;
}

export type CategoryType = 'all' | 'insurance' | 'wage' | 'life' | 'finance' | 'property' | 'calculators' | 'about' | 'policy' | 'privacy' | 'terms';

export type PostCategory = 'insurance' | 'wage' | 'life' | 'finance' | 'property';

export interface Calculator {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: PostCategory;
}

export interface CalculationHistory {
  id: string;
  calculatorId: string;
  calculatorName: string;
  timestamp: string;
  summary: string;
}

export interface PostHighlight {
  label: string;
  value: string;
}

export interface PostItem {
  id: string;
  title: string;
  summary: string;
  category: PostCategory;
  categoryName: string;
  categoryIcon: string;
  author: string;
  authorRole?: string;
  authorNote?: string;
  readTimeMinutes: number;
  date: string; // YYYY-MM-DD
  viewCount: number;
  tags: string[];
  content: string;
  highlights?: PostHighlight[];
  legalBasis?: string;
  relatedCalculatorId?: string;
  relatedCalculatorName?: string;
  status?: 'published' | 'scheduled';
  scheduledTime?: string;
}

export interface CommentItem {
  id: string;
  author: string;
  date: string;
  content: string;
  reply?: {
    author: string;
    date: string;
    content: string;
  };
}
