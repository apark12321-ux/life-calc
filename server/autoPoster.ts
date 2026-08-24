import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { PostItem, PostCategory } from '../src/types';
import { ALL_BLOG_POSTS, CATEGORY_META } from '../src/data/postsData';

const DATA_DIR = path.join(process.cwd(), 'data');
const AUTO_POSTS_FILE = path.join(DATA_DIR, 'auto_posts.json');
const SCHEDULE_FILE = path.join(DATA_DIR, 'schedule_state.json');

export interface AutoPostScheduleSlot {
  id: string;
  category: PostCategory;
  categoryName: string;
  categoryIcon: string;
  scheduledTime: string; // ISO string or "HH:mm:ss"
  scheduledHour: number;
  scheduledMinute: number;
  scheduledSecond: number;
  status: 'pending' | 'published' | 'failed';
  publishedPostId?: string;
  publishedPostTitle?: string;
  publishedAt?: string;
}

export interface ScheduleState {
  date: string; // YYYY-MM-DD
  enabled: boolean;
  intervalHours: number;
  lastRunDate?: string;
  slots: AutoPostScheduleSlot[];
  logs: { timestamp: string; message: string; type: 'info' | 'success' | 'warn' | 'error' }[];
}

// Topic Ideas Pool for diverse high-value Korean financial/legal content in 2026
const TOPIC_SUGGESTIONS: Record<PostCategory, { title: string; hint: string; calculatorId: string; calculatorName: string }[]> = {
  insurance: [
    {
      title: '2026년 국민연금 조기노령연금 수령 조건과 감액률 손익분기점 분석',
      hint: '조기노령연금 신청 시 연간 6%(월 0.5%) 감액률과 수명에 따른 총 수령액 손익분기점 계산',
      calculatorId: 'insurance',
      calculatorName: '4대보험 및 연금 모의계산기'
    },
    {
      title: '건강보험료 본인부담상한제 사후정환금 신청 기준과 환급금 조회법',
      hint: '소득 분위별 연간 의료비 본인부담상한액 초과금 국가지원 환급 절차 및 서류',
      calculatorId: 'insurance',
      calculatorName: '4대보험 모의계산기'
    },
    {
      title: '2026년 고용보험 실업급여 상·하한액 및 수급기간 최신 기준',
      hint: '이직 전 평균임금의 60% 기준 일 최대 지급액 및 연령/가입기간별 소정급여일수',
      calculatorId: 'insurance',
      calculatorName: '4대보험 및 실업급여 계산기'
    },
    {
      title: '일용직·단기 알바 4대보험 가입 기준(월 8일/60시간)과 공제액 계산법',
      hint: '월 60시간 이상 또는 1개월 이상 근무 시 4대보험 당연 가입 대상 요건 및 세금',
      calculatorId: 'insurance',
      calculatorName: '4대보험 계산기'
    }
  ],
  wage: [
    {
      title: '2026년 최저임금 10,030원 기준 월급 산출과 주휴수당 분쟁 예방법',
      hint: '주 40시간(월 209시간) 기준 기본급 2,096,270원 및 주 15시간 미만 초단기 근로자 예외',
      calculatorId: 'hourly',
      calculatorName: '주휴수당 & 시급 계산기'
    },
    {
      title: '야간근로수당 및 연장·휴일근로 가산수당 중복 할증 계산 완전정복',
      hint: '야간(22:00~06:00)과 휴일근로가 겹칠 때 통상임금의 200% 할증 계산 공식',
      calculatorId: 'hourly',
      calculatorName: '시급 및 가산수당 계산기'
    },
    {
      title: '퇴직금 산정 시 연차수당 및 경영성과급의 평균임금 포함 여부 총정리',
      hint: '미사용 연차유급휴가수당 3/12 반영 원칙과 대법원 판례 기준 성과급 임금성 판단',
      calculatorId: 'severance',
      calculatorName: '퇴직금 정밀 모의계산기'
    },
    {
      title: '2026년 포괄임금제 사업장의 고정 연장근로수당 역산 및 위법 체크리스트',
      hint: '실제 초과근무 시간이 계약상 포괄시간을 넘을 때 추가 청구 가능한 차액 산정법',
      calculatorId: 'salary',
      calculatorName: '연봉 실수령액 계산기'
    }
  ],
  finance: [
    {
      title: '2026년 청년도약계좌 5년 만기 정부기여금 최대 수령 전략과 비과세 혜택',
      hint: '월 최대 70만원 납입 시 정부매칭지원금과 비과세 이자 합산 실질 수익률 분석',
      calculatorId: 'savings',
      calculatorName: '예적금 이자 및 복리 계산기'
    },
    {
      title: 'ISA 계좌(개인종합자산관리계좌) 납입한도 확대와 배당소득 절세 효과',
      hint: '일반형 200만원, 서민형 400만원 비과세 한도 초과 시 9.9% 분리과세 절세 계산',
      calculatorId: 'savings',
      calculatorName: '예적금 & 금융상품 계산기'
    },
    {
      title: '원리금균등 vs 원금균등 vs 만기일시상환 대출 이자 총액 비교와 선택 기준',
      hint: '동일 금리·기간 조건에서 총 발생 이자 차이와 중도상환 계획에 따른 상환방식',
      calculatorId: 'loan',
      calculatorName: '대출 이자 및 상환액 계산기'
    },
    {
      title: '신용점수 900점대 유지를 위한 카드 한도 대비 사용 비율과 대출 관리법',
      hint: 'KCB·NICE 기준 총 한도 대비 30~50% 이내 이용 권장 및 체크카드 혼용 효과',
      calculatorId: 'savings',
      calculatorName: '금융 자산 계산기'
    }
  ],
  property: [
    {
      title: '2026년 생애최초 주택구입 취득세 200만원 감면 요건과 환수 주의점',
      hint: '취득가액 12억원 이하 실거주 3년 의무기간 및 1가구 1주택 자격 유지 기준',
      calculatorId: 'property',
      calculatorName: '부동산 취득세 및 중개보수 계산기'
    },
    {
      title: '2026년 전월세 전환율 법정 상한선(기준금리+2.0%)과 월세 인상 계산법',
      hint: '보증금 1억원 감액 시 적정 월세 전환 금액 공식과 주택임대차보호법 한도',
      calculatorId: 'property',
      calculatorName: '부동산 계산기'
    },
    {
      title: '부동산 중개보수 요율표 상한 및 부가세 10% 협의 시 체크포인트',
      hint: '매매·임대차 거래금액 구간별 법정 상한요율과 간이과세자 중개사 부가세 청구 기준',
      calculatorId: 'property',
      calculatorName: '중개수수료 모의계산기'
    },
    {
      title: '1주택자 종합부동산세 기본공제 12억원과 고령자·장기보유 세액공제 활용법',
      hint: '공시가격 합산 12억원 이하 비과세 및 최대 80% 세액공제 중복 적용 방법',
      calculatorId: 'property',
      calculatorName: '부동산 세금 계산기'
    }
  ],
  life: [
    {
      title: '2026년 만 나이 통일법 완벽 적용: 연령별 혜택과 법적 기준 정리',
      hint: '청소년보호법(연 나이)과 민법·도로교통법·국민연금(만 나이)의 실무 적용 기준 비교',
      calculatorId: 'age',
      calculatorName: '만 나이 & D-Day 계산기'
    },
    {
      title: '신생아 출산일수·백일·돌잔치 날짜 계산 시 초일산입 원칙과 디데이 팁',
      hint: '태어난 날을 1일로 계산하는 관습과 100일(출생일+99일), 첫돌 날짜 계산 공식',
      calculatorId: 'age',
      calculatorName: '디데이 & 기념일 계산기'
    },
    {
      title: '2026년 대체공휴일 적용 대상과 5인 이상 사업장 유급휴일 법정 기준',
      hint: '삼일절, 광복절, 개천절, 한글날 등 주말 겹침 시 대체휴일 부여 및 휴일근로수당',
      calculatorId: 'hourly',
      calculatorName: '근로시간 및 공휴일 계산기'
    },
    {
      title: '평수(坪)와 제곱미터(㎡) 환산 공식(3.305785) 및 전용면적 체감 팁',
      hint: '전용면적 59㎡(구 25평형)와 84㎡(구 34평형)의 실제 주거공용면적 비교 분석',
      calculatorId: 'property',
      calculatorName: '평수·면적 변환 계산기'
    }
  ]
};

export class AutoPosterEngine {
  private autoPosts: PostItem[] = [];
  private scheduleState: ScheduleState;
  private intervalTimer: NodeJS.Timeout | null = null;
  private isProcessing = false;

  constructor() {
    this.ensureDataDir();
    this.autoPosts = this.loadAutoPosts();
    this.scheduleState = this.loadScheduleState();
    this.verifyAndGenerateTodaySchedule();
    this.startScheduler();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadAutoPosts(): PostItem[] {
    try {
      if (fs.existsSync(AUTO_POSTS_FILE)) {
        const raw = fs.readFileSync(AUTO_POSTS_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Failed to read auto_posts.json:', e);
    }
    return [];
  }

  private saveAutoPosts() {
    try {
      fs.writeFileSync(AUTO_POSTS_FILE, JSON.stringify(this.autoPosts, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save auto_posts.json:', e);
    }
  }

  private loadScheduleState(): ScheduleState {
    const today = new Date().toISOString().split('T')[0];
    try {
      if (fs.existsSync(SCHEDULE_FILE)) {
        const raw = fs.readFileSync(SCHEDULE_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.date === today) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load schedule_state.json:', e);
    }

    return {
      date: today,
      enabled: true,
      intervalHours: 4,
      slots: [],
      logs: [
        {
          timestamp: new Date().toISOString(),
          message: '자동 포스팅 엔진 초기화 완료 (매일 5개 카테고리 4시간 텀 랜덤 시분초 발행)',
          type: 'info'
        }
      ]
    };
  }

  private saveScheduleState() {
    try {
      fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(this.scheduleState, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save schedule_state.json:', e);
    }
  }

  private addLog(message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') {
    const entry = {
      timestamp: new Date().toISOString(),
      message,
      type
    };
    this.scheduleState.logs.unshift(entry);
    if (this.scheduleState.logs.length > 100) {
      this.scheduleState.logs = this.scheduleState.logs.slice(0, 100);
    }
    this.saveScheduleState();
    console.log(`[AutoPoster] ${message}`);
  }

  /**
   * Generates randomized schedule slots for today across all 5 categories.
   * Spaced by ~4 hours interval with randomized minutes (0-59) and seconds (0-59).
   */
  public generateTodaySchedule(force = false): AutoPostScheduleSlot[] {
    const today = new Date().toISOString().split('T')[0];
    const categories: PostCategory[] = ['insurance', 'wage', 'finance', 'property', 'life'];

    // 5 slots spaced across 24 hours (e.g. Base hours: 01, 05, 09, 13, 17)
    // plus a small random shift (-30m to +30m) or randomized minutes/seconds
    const baseHours = [1, 5, 9, 13, 17];
    
    // Shuffle categories daily for organic distribution
    const shuffledCategories = [...categories].sort(() => Math.random() - 0.5);

    const slots: AutoPostScheduleSlot[] = [];

    for (let i = 0; i < 5; i++) {
      const cat = shuffledCategories[i];
      const meta = CATEGORY_META[cat];
      const hour = baseHours[i];
      const minute = Math.floor(Math.random() * 60);
      const second = Math.floor(Math.random() * 60);

      const hourStr = String(hour).padStart(2, '0');
      const minStr = String(minute).padStart(2, '0');
      const secStr = String(second).padStart(2, '0');
      const timeStr = `${hourStr}:${minStr}:${secStr}`;

      slots.push({
        id: `slot-${today}-${cat}-${i}`,
        category: cat,
        categoryName: meta?.name || cat,
        categoryIcon: meta?.icon || '📝',
        scheduledTime: `${today}T${timeStr}`,
        scheduledHour: hour,
        scheduledMinute: minute,
        scheduledSecond: second,
        status: 'pending'
      });
    }

    // Sort slots chronologically
    slots.sort((a, b) => (a.scheduledHour * 3600 + a.scheduledMinute * 60 + a.scheduledSecond) - (b.scheduledHour * 3600 + b.scheduledMinute * 60 + b.scheduledSecond));

    this.scheduleState.date = today;
    this.scheduleState.slots = slots;
    this.addLog(`오늘(${today}) 5개 카테고리별 4시간 텀 자동 포스팅 스케줄 배정 완료`, 'info');
    this.saveScheduleState();
    return slots;
  }

  private verifyAndGenerateTodaySchedule() {
    const today = new Date().toISOString().split('T')[0];
    if (this.scheduleState.date !== today || this.scheduleState.slots.length === 0) {
      this.generateTodaySchedule();
    }
  }

  private startScheduler() {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
    }

    // Tick every 20 seconds
    this.intervalTimer = setInterval(() => {
      this.tick();
    }, 20000);

    // Initial check
    setTimeout(() => this.tick(), 2000);
  }

  private async tick() {
    if (!this.scheduleState.enabled || this.isProcessing) {
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (this.scheduleState.date !== today) {
      this.verifyAndGenerateTodaySchedule();
    }

    const now = new Date();
    const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    for (const slot of this.scheduleState.slots) {
      if (slot.status === 'pending') {
        const slotSeconds = slot.scheduledHour * 3600 + slot.scheduledMinute * 60 + slot.scheduledSecond;
        if (currentSeconds >= slotSeconds) {
          // Time to execute!
          await this.executeSlot(slot);
        }
      }
    }
  }

  private async executeSlot(slot: AutoPostScheduleSlot) {
    this.isProcessing = true;
    try {
      this.addLog(`[자동 발행 실행] 카테고리: ${slot.categoryName}(${slot.category}) 예약 시각 도달 (${slot.scheduledHour}:${slot.scheduledMinute}:${slot.scheduledSecond})`, 'info');
      const newPost = await this.generatePostForCategory(slot.category);
      
      this.autoPosts.unshift(newPost);
      this.saveAutoPosts();

      slot.status = 'published';
      slot.publishedPostId = newPost.id;
      slot.publishedPostTitle = newPost.title;
      slot.publishedAt = new Date().toISOString();

      this.addLog(`[발행 완료] "${newPost.title}" (${slot.categoryName}) 자동 발행 및 사이트 반영 성공`, 'success');
      this.saveScheduleState();
    } catch (err: any) {
      console.error(`Failed to auto-post for ${slot.category}:`, err);
      slot.status = 'failed';
      this.addLog(`[발행 실패] ${slot.categoryName} 생성 중 오류: ${err?.message || err}`, 'error');
      this.saveScheduleState();
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Generates a rich post using Gemini 3.7 Flash or structured procedural generator.
   */
  public async generatePostForCategory(category: PostCategory, customTopic?: string): Promise<PostItem> {
    const today = new Date().toISOString().split('T')[0];
    const meta = CATEGORY_META[category] || { name: category, icon: '📝' };
    const suggestions = TOPIC_SUGGESTIONS[category] || [];
    const chosenSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    const targetTopic = customTopic || chosenSuggestion?.title || `${meta.name} 2026 핵심 가이드`;

    // Try Gemini API if key is available
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build'
            }
          }
        });

        const prompt = `당신은 대한민국 최고 수준의 생활금융·세무·노무 테크니컬 라이터입니다.
다음 주제에 대해 독자에게 극도로 유용하고 신뢰성 높은 2026년 기준 블로그 포스팅을 작성해주세요.

[주제]: ${targetTopic}
[카테고리]: ${meta.name} (${category})
[연관 계산기]: ${chosenSuggestion?.calculatorName || '모의계산기'}

[작성 규칙 - 절대 준수]
1. 두괄식 원칙 (Bottom-line First): 본문 첫 문단에 독자가 가장 궁금해하는 핵심 결론과 수치를 명확히 제시하십시오.
2. 구조화된 마크다운: 소제목(##, ###), 마크다운 표(| 항목 | 2026년 기준 | 비고 |), 불렛포인트(-), 인용구(>)를 풍부하게 활용하십시오.
3. 2026년 최신 공식 법령·고시 수치 반영 (최저시급 10,030원, 4대보험 요율 등).
4. 문단은 3~4문장 단위로 깔끔하게 끊어 가독성을 극대화하십시오.

다음 JSON 포맷으로만 응답해주세요 (JSON 이외의 텍스트 금지):
{
  "title": "클릭을 부르는 명확하고 매력적인 제목 (2026년 수치 포함)",
  "summary": "핵심 요약 2문장",
  "authorNote": "실무 핵심 팁 (1~2문장)",
  "readTimeMinutes": 4,
  "tags": ["태그1", "태그2", "태그3", "태그4", "태그5"],
  "highlights": [
    { "label": "핵심 기준 1", "value": "구체적 수치" },
    { "label": "핵심 기준 2", "value": "구체적 수치" },
    { "label": "비과세/혜택", "value": "구체적 수치" }
  ],
  "legalBasis": "근거 법령 및 고시 조항 (예: 소득세법, 근로기준법 등)",
  "content": "마크다운 형식의 본문 전체 (## 소제목, ### 세부사항, 마크다운 표, 불렛포인트 포함)"
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const rawText = response.text?.trim() || '';
        const parsed = JSON.parse(rawText);

        const newPost: PostItem = {
          id: `auto-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          title: parsed.title || targetTopic,
          summary: parsed.summary || `${meta.name}에 관한 2026년 핵심 가이드입니다.`,
          category,
          categoryName: meta.name,
          categoryIcon: meta.icon,
          author: '생활금융 에디터',
          authorRole: '생활금융 리서치팀',
          authorNote: parsed.authorNote || '💡 실무에서 자주 발생하는 혼선을 예방하기 위해 최신 기준을 반드시 확인하세요.',
          readTimeMinutes: parsed.readTimeMinutes || 4,
          date: today,
          viewCount: Math.floor(Math.random() * 200) + 120,
          tags: parsed.tags || [meta.name, '2026최신', '실무가이드'],
          highlights: parsed.highlights || [
            { label: '2026년 적용', value: '법정 최신 기준' },
            { label: '모의 연산', value: '실시간 계산기 지원' },
            { label: '데이터 보안', value: '서버 무저장 연산' }
          ],
          legalBasis: parsed.legalBasis || '대한민국 관계 법령 및 2026년 행정고시',
          relatedCalculatorId: chosenSuggestion?.calculatorId || 'insurance',
          relatedCalculatorName: chosenSuggestion?.calculatorName || '간편 모의계산기',
          content: parsed.content,
          status: 'published'
        };

        return newPost;
      } catch (geminiError) {
        console.warn('Gemini API auto-generation failed, using high-quality procedural fallback:', geminiError);
      }
    }

    // Procedural Fallback Template Generator
    const postId = `auto-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const fallbackPost: PostItem = {
      id: postId,
      title: `${targetTopic} (2026년 실전 요약)`,
      summary: `${targetTopic}에 대한 2026년 최신 기준, 핵심 변경점 및 실생활 적용 체크리스트를 표와 수치로 일목요연하게 정리했습니다.`,
      category,
      categoryName: meta.name,
      categoryIcon: meta.icon,
      author: '생활금융 에디터',
      authorRole: '생활금융 리서치팀',
      authorNote: `💡 ${chosenSuggestion?.hint || '정확한 금액을 미리 산출해두면 세금 및 지출 계획 수립에 큰 도움이 됩니다.'}`,
      readTimeMinutes: 4,
      date: today,
      viewCount: Math.floor(Math.random() * 150) + 80,
      tags: [meta.name, '2026개정', '실생활꿀팁', '세무가이드', '자동포스팅'],
      highlights: [
        { label: '적용 연도', value: '2026년 현행 고시' },
        { label: '핵심 혜택', value: '절세 및 권리 보장' },
        { label: '간편 계산', value: '원클릭 모의 연산' }
      ],
      legalBasis: '대한민국 최신 법률 규정 및 2026년 행정해석',
      relatedCalculatorId: chosenSuggestion?.calculatorId || 'insurance',
      relatedCalculatorName: chosenSuggestion?.calculatorName || '모의계산기',
      content: `## ${targetTopic} 핵심 요약과 2026년 가이드

2026년 실무에서 가장 빈번하게 문의가 발생하는 **${meta.name}** 관련 주요 쟁점과 실무 수칙을 일목요연하게 정리해 드립니다.

### 1. 2026년 주요 변동 사항 비교
| 구분 항목 | 종전 기준 | 2026년 현행 기준 | 비고 |
| :--- | :--- | :--- | :--- |
| **기준 소득/요율** | 과거 고시 기준 | **2026년 최신 고시 적용** | 상·하한선 변동 반영 |
| **비과세 한도** | 기본 한도 | **식대 월 20만원 등 확대** | 비과세 급여 분리 권장 |
| **신청 및 확인** | 오프라인 위주 | **온라인 원클릭 간편 조회** | 정부24/홈택스 연계 |

### 2. 핵심 체크리스트 3가지
- **사전 요건 점검:** 소득 기준 및 가입 기간 요건 충족 여부를 꼼꼼히 확인하십시오.
- **증빙 서류 준비:** 급여명세서, 원천징수영수증, 임대차계약서 등 관련 서류를 미리 스캔해 보관하십시오.
- **모의 시뮬레이션 활용:** 수식을 외울 필요 없이 본 블로그의 모의계산기를 통해 예상 금액을 사전에 검증하십시오.

### 3. 실무 전문가 팁
> "법령 개정 초기에 놓치기 쉬운 비과세 항목과 공제 혜택을 꼼꼼히 챙기면 불필요한 과세를 방지하고 실질 가처분 소득을 극대화할 수 있습니다."`,
      status: 'published'
    };

    return fallbackPost;
  }

  /**
   * Triggers an instant post immediately for testing / admin.
   */
  public async triggerInstantPost(category: PostCategory, topic?: string): Promise<PostItem> {
    const post = await this.generatePostForCategory(category, topic);
    this.autoPosts.unshift(post);
    this.saveAutoPosts();
    this.addLog(`[즉시 수동 발행] "${post.title}" (${post.categoryName}) 생성 및 등록 완료`, 'success');
    return post;
  }

  public getAllPosts(): PostItem[] {
    // Combine base posts with auto-generated posts
    const combined = [...this.autoPosts, ...ALL_BLOG_POSTS];
    // De-duplicate by ID
    const seen = new Set<string>();
    return combined.filter(p => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }

  public getScheduleState(): ScheduleState {
    this.verifyAndGenerateTodaySchedule();
    return this.scheduleState;
  }

  public toggleScheduler(enabled: boolean): boolean {
    this.scheduleState.enabled = enabled;
    this.addLog(`자동 포스팅 스케줄러 상태 변경: ${enabled ? '🟢 활성화 (ON)' : '🔴 비활성화 (OFF)'}`, 'info');
    this.saveScheduleState();
    return this.scheduleState.enabled;
  }

  public deleteAutoPost(id: string): boolean {
    const index = this.autoPosts.findIndex(p => p.id === id);
    if (index !== -1) {
      const removed = this.autoPosts.splice(index, 1);
      this.saveAutoPosts();
      this.addLog(`[삭제] 자동 생성 포스트 "${removed[0]?.title}" 삭제 완료`, 'info');
      return true;
    }
    return false;
  }
}

export const autoPosterEngine = new AutoPosterEngine();
