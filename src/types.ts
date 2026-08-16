export interface ToolTipProps {
  text: string;
}

export type CategoryType = 'insurance' | 'wage' | 'life' | 'finance' | 'property' | 'magazine' | 'policy';

export type PostCategory = 'insurance' | 'wage' | 'life' | 'finance' | 'property';

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
  readTimeMinutes: number;
  scheduledTime: string; // ISO string or HH:mm
  date: string; // YYYY-MM-DD
  publishedAt?: string;
  status: 'published' | 'scheduled';
  viewCount: number;
  tags: string[];
  content: string; // Full markdown or rich text
  highlights?: PostHighlight[];
  legalBasis?: string;
  relatedCalculatorId?: string;
  relatedCalculatorName?: string;
}

export interface DailyScheduleSlot {
  slotIndex: number;
  category: PostCategory;
  categoryName: string;
  categoryIcon: string;
  scheduledTimeStr: string; // e.g. "01:35"
  scheduledDateTime: string; // ISO string
  intervalHoursFromPrev?: number; // Should be >= 4.0
  postId: string;
  postTitle: string;
  isPublished: boolean;
  minutesRemaining: number;
}

export interface DailyScheduleReport {
  date: string; // YYYY-MM-DD
  isIntervalCompliant: boolean; // all intervals >= 4h
  minIntervalHours: number;
  totalCategories: number;
  publishedCount: number;
  scheduledCount: number;
  nextScheduledSlot?: DailyScheduleSlot | null;
  slots: DailyScheduleSlot[];
}

