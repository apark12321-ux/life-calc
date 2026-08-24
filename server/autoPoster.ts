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

// Topic Ideas Pool for 1st-person storytelling Korean financial/legal content
const TOPIC_SUGGESTIONS: Record<PostCategory, { title: string; hint: string; calculatorId: string; calculatorName: string }[]> = {
  work: [
    {
      title: '내가 2026년 최저시급 10,030원 기준으로 월급 계산기 돌려보고 회사에 항의한 사연',
      hint: '주 40시간 월 209시간 기본급 2,096,270원 미달 여부와 주휴수당 미지급분 전액 소급',
      calculatorId: 'wage',
      calculatorName: '주휴수당 & 시급 계산기'
    },
    {
      title: '내가 육아휴직 1년 쓰고 월 최대 250만원 상한액 챙긴 실전 수령기 (사후지급금 폐지 팩트)',
      hint: '2026년 육아휴직 급여 상한액 개편(첫 3개월 250만원)과 복직 후 사후지급금 전액 폐지 실무',
      calculatorId: 'wage',
      calculatorName: '육아휴직 & 시급 계산기'
    },
    {
      title: '내가 프리랜서 투잡 3.3% 떼인 세금 5월 종합소득세 때 142만원 전액 환급받은 비법',
      hint: '단순경비율 vs 기준경비율 적용과 원천징수 3.3% 기납부세액 삼쩜삼 없이 홈택스로 환급받기',
      calculatorId: 'wage',
      calculatorName: '종합소득세 & 급여 계산기'
    },
    {
      title: '내가 포괄임금제 계약서의 고정 야근 20시간 넘겼을 때 추가 수당 48만원 받아낸 썰',
      hint: '포괄임금 약정 시간을 초과한 실근로시간 기록 앱 증거와 근로기준법상 차액 청구 공식',
      calculatorId: 'wage',
      calculatorName: '연봉 실수령액 계산기'
    }
  ],
  property: [
    {
      title: '내가 전세 만기 때 집주인이 보증금 안 빼주길래 임차권등기명령 걸고 HUG 보증금 타낸 썰',
      hint: '계약 만료 전 내용증명 발송부터 전자소송 임차권등기명령 신청, 이사 후 지연이자 연 12% 청구',
      calculatorId: 'property',
      calculatorName: '부동산 취득세 및 복비 계산기'
    },
    {
      title: '내가 전월세 전환율(기준금리+2.0%) 계산기로 집주인의 무리한 월세 20만원 인상 막아낸 방법',
      hint: '보증금 5,000만원 감액 시 법정 전환율(연 5.5% 한도) 역산으로 적정 월세 22.9만원 방어',
      calculatorId: 'property',
      calculatorName: '부동산 복비 및 전월세 계산기'
    },
    {
      title: '내가 1주택자 12억원 비과세 특례 챙겨서 양도소득세 0원 만든 실전 매도 일기',
      hint: '2년 보유(조정지역 2년 거주) 요건 충족과 장기보유특별공제 최대 80% 적용으로 5억 차익 비과세',
      calculatorId: 'property',
      calculatorName: '부동산 세금 및 취득세 계산기'
    },
    {
      title: '내가 스트레스 DSR 3단계 적용 앞두고 대출 한도 5,000만원 깎일 뻔해서 서두른 경험담',
      hint: '수도권 가산금리 스트레스 DSR 도입 전 주택담보대출 심사 통과 노하우와 DSR 40% 관리법',
      calculatorId: 'property',
      calculatorName: '대출 상환 & 부동산 계산기'
    }
  ],
  finance: [
    {
      title: '내가 청년도약계좌 5년 만기 채우고 정부기여금+비과세 이자 합쳐 5,000만원 만든 실전 루틴',
      hint: '월 70만원 풀납입 시 정부 매칭지원금 월 최대 33,000원과 연 6.0% 비과세 복리 효과',
      calculatorId: 'finance',
      calculatorName: '예적금 이자 & 복리 계산기'
    },
    {
      title: '내가 실손의료보험 4세대 전환하고 보험료 70% 낮추면서 할증 기준 피해간 실무 요령',
      hint: '비급여 도수치료·주사료 연간 100만원 미만 사용 시 보험료 10% 추가 할인 혜택 챙기기',
      calculatorId: 'finance',
      calculatorName: '4대보험 및 연금 계산기'
    },
    {
      title: '내가 정기예금 복리 vs 단리 1억원 굴렸을 때 세후 실수령 이자 120만원 차이 검증한 썰',
      hint: '월복리 적금과 만기일시지급 단리 예금의 3년 거치 시 세금 15.4% 공제 후 실제 통장 잔고 비교',
      calculatorId: 'finance',
      calculatorName: '예적금 & 금융상품 계산기'
    },
    {
      title: '내가 퇴직연금(DC형) 방치하다 디폴트옵션 고위험 TDF로 변경하고 수익률 연 8.4% 달성한 후기',
      hint: '원리금보장 예금 1.8%에 묶여있던 퇴직연금을 생애주기형 TDF 2050으로 분산 리밸런싱한 기록',
      calculatorId: 'finance',
      calculatorName: '연금 및 IRP 계산기'
    }
  ]
};

export class AutoPosterEngine {
  private autoPosts: PostItem[] = [];
  private scheduleState: ScheduleState;
  private intervalTimer: NodeJS.Timeout | null = null;
  private isProcessing = false;

  constructor() {
    this.ensureDataDirectory();
    this.autoPosts = this.loadAutoPosts();
    this.scheduleState = this.loadScheduleState();
    this.startScheduler();
  }

  private ensureDataDirectory() {
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
      console.error('Failed to load auto_posts.json:', e);
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
        if (parsed.date === today && Array.isArray(parsed.slots) && parsed.slots.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load schedule_state.json:', e);
    }

    return {
      date: today,
      enabled: true,
      intervalHours: 6,
      slots: [],
      logs: [
        {
          timestamp: new Date().toISOString(),
          message: '자동 포스팅 엔진 가동 (직장·월급·퇴직 / 내집·부동산·세금 / 연금·보험·재테크 1인칭 실화 스토리텔링)',
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
   * Generates randomized schedule slots for today across the 3 streamlined categories.
   */
  public generateTodaySchedule(force = false): AutoPostScheduleSlot[] {
    const today = new Date().toISOString().split('T')[0];
    const categories: PostCategory[] = ['work', 'property', 'finance'];

    // 3 slots spaced across day: Morning (07:00~08:00), Lunch (12:30~13:30), Evening (19:30~20:30)
    const baseHours = [7, 13, 20];
    
    // Shuffle categories daily for organic distribution
    const shuffledCategories = [...categories].sort(() => Math.random() - 0.5);

    const slots: AutoPostScheduleSlot[] = [];

    for (let i = 0; i < 3; i++) {
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
        categoryIcon: meta?.icon || '💼',
        scheduledTime: `${today}T${timeStr}`,
        scheduledHour: hour,
        scheduledMinute: minute,
        scheduledSecond: second,
        status: 'pending'
      });
    }

    slots.sort((a, b) => (a.scheduledHour * 3600 + a.scheduledMinute * 60 + a.scheduledSecond) - (b.scheduledHour * 3600 + b.scheduledMinute * 60 + b.scheduledSecond));

    this.scheduleState.date = today;
    this.scheduleState.slots = slots;
    this.addLog(`오늘(${today}) 3대 핵심 카테고리별 1인칭 스토리텔링 자동 포스팅 스케줄 배정 완료`, 'info');
    this.saveScheduleState();
    return slots;
  }

  private verifyAndGenerateTodaySchedule() {
    const today = new Date().toISOString().split('T')[0];
    if (this.scheduleState.date !== today || !this.scheduleState.slots || this.scheduleState.slots.length === 0) {
      this.generateTodaySchedule();
    }
  }

  private startScheduler() {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
    }

    this.intervalTimer = setInterval(() => {
      this.tick();
    }, 20000);

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

      this.addLog(`[발행 완료] "${newPost.title}" (${slot.categoryName}) 1인칭 실전 스토리 발행 성공`, 'success');
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
   * Generates a rich 1st-person storytelling post using Gemini or procedural generator.
   */
  public async generatePostForCategory(category: PostCategory, customTopic?: string): Promise<PostItem> {
    const today = new Date().toISOString().split('T')[0];
    const meta = CATEGORY_META[category] || { name: category, icon: '💼' };
    const suggestions = TOPIC_SUGGESTIONS[category] || [];
    const chosenSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    const targetTopic = customTopic || chosenSuggestion?.title || `${meta.name} 직접 겪은 실전 가이드`;

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

        const prompt = `당신은 11년차 직장인이자 생활금융 서바이벌 블로그를 운영하는 '박과장'입니다.
다음 주제에 대해 반드시 "1인칭 주인공 시점('나', '제가 직접 겪은 실화')"으로 생생하고 몰입감 넘치는 포스팅을 작성하세요.

[주제]: ${targetTopic}
[카테고리]: ${meta.name} (${category})
[연관 계산기]: ${chosenSuggestion?.calculatorName || '모의계산기'}

[필수 작성 규칙 - 절대 준수]
1. 1인칭 실화 스토리텔링: "제가 이번에...", "제가 지난달에 퇴사(또는 계약)하면서 겪었던 일입니다"로 시작하여 실제 겪은 갈등/위기 상황을 실감나게 묘사하십시오.
2. 철저한 팩트와 숫자: 허구가 아닌 2026년 대한민국 최신 법령·고시·세율·금리 및 실제 통장/영수증 숫자를 정확하게 명시하십시오.
3. 마크다운 표(| 항목 | 과거/일반적 경우 | 박과장이 직접 해결한 결과 | 차액/효과 |): 직접 검증한 엑셀 비교표를 반드시 1개 이상 포함하십시오.
4. 해결책과 교훈: 어떻게 대화하고 어떤 서류/법조항을 제시해서 돈을 지키거나 환급받았는지 3단계 실천 팁을 제시하십시오.
5. 어조: 솔직하고 똑부러지며 직장인·서민의 입장에서 공감 가는 따뜻하고 당찬 어조.

다음 JSON 포맷으로만 응답하십시오 (JSON 외 텍스트 일체 금지):
{
  "title": "내가 직접 겪은 느낌을 살린 매력적인 1인칭 실전 제목 (예: 내가 ~해서 ~만원 지켜낸 실전 썰)",
  "summary": "내가 겪은 핵심 상황과 구체적인 팩트 결과 요약 2문장",
  "authorNote": "박과장의 실전 한줄 팁 (💡 이모지와 함께)",
  "readTimeMinutes": 5,
  "tags": ["실제후기", "절약팁", "팩트체크", "${meta.name}", "2026기준"],
  "highlights": [
    { "label": "실제 아낀/수령 금액", "value": "구체적 금액/수치" },
    { "label": "핵심 적용 기준", "value": "2026년 법령/요율" },
    { "label": "해결 핵심 키워드", "value": "핵심 제도명" }
  ],
  "legalBasis": "실제 근거 법률 및 시행령 조항",
  "content": "마크다운 형식의 1인칭 본문 전체 (## 소제목, 마크다운 표, 인용구, 번호 목록 포함)"
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
          summary: parsed.summary || `${meta.name}에 대해 제가 직접 겪고 해결한 2026년 실전 경험담입니다.`,
          category,
          categoryName: meta.name,
          categoryIcon: meta.icon,
          author: '박과장 (11년차 직장인)',
          authorRole: '돈 지키는 박과장',
          authorNote: parsed.authorNote || '💡 제가 직접 겪어보고 엑셀로 검증한 팩트만 공유합니다. 여러분도 권리를 꼭 챙기세요.',
          readTimeMinutes: parsed.readTimeMinutes || 5,
          date: today,
          viewCount: Math.floor(Math.random() * 150) + 120,
          tags: parsed.tags || [meta.name, '실제경험', '2026최신', '박과장후기'],
          highlights: parsed.highlights || [
            { label: '실전 검증', value: '100% 팩트 수치' },
            { label: '절세/보호', value: '실제 통장 반영' },
            { label: '모의 연산', value: '실시간 계산기 검증' }
          ],
          legalBasis: parsed.legalBasis || '대한민국 관계 법령 및 2026년 행정고시',
          relatedCalculatorId: chosenSuggestion?.calculatorId || 'wage',
          relatedCalculatorName: chosenSuggestion?.calculatorName || '간편 모의계산기',
          content: parsed.content,
          status: 'published'
        };

        return newPost;
      } catch (geminiError) {
        console.warn('Gemini API 1st-person auto-generation fallback used:', geminiError);
      }
    }

    // High quality procedural 1st-person storytelling fallback
    const postId = `auto-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const fallbackPost: PostItem = {
      id: postId,
      title: `${targetTopic} - 내가 직접 겪고 팩트로 해결한 생생 후기`,
      summary: `${targetTopic} 상황에서 제가 직접 겪었던 위기와 2026년 법령 및 엑셀 계산표를 무기로 내 피 같은 돈을 지켜낸 사이다 실화입니다.`,
      category,
      categoryName: meta.name,
      categoryIcon: meta.icon,
      author: '박과장 (11년차 직장인)',
      authorRole: '돈 지키는 박과장',
      authorNote: `💡 ${chosenSuggestion?.hint || '가만히 있으면 아무도 안 챙겨줍니다. 내가 직접 계산해보고 당당하게 요구해야 합니다.'}`,
      readTimeMinutes: 5,
      date: today,
      viewCount: Math.floor(Math.random() * 120) + 90,
      tags: [meta.name, '실화후기', '팩트체크', '2026기준', '돈지키기'],
      highlights: [
        { label: '실전 경험', value: '직접 검증 완료' },
        { label: '2026년 적용', value: '최신 법정 기준' },
        { label: '모의 연산', value: '계산기 즉시 확인' }
      ],
      legalBasis: '대한민국 최신 법률 규정 및 2026년 행정해석',
      relatedCalculatorId: chosenSuggestion?.calculatorId || 'wage',
      relatedCalculatorName: chosenSuggestion?.calculatorName || '모의계산기',
      content: `## "가만히 있었으면 그냥 생돈 날릴 뻔했습니다"

제가 이번에 **${meta.name}** 관련 일을 겪으면서 뼈저리게 느낀 점이 하나 있습니다. 
아무리 법으로 보장된 권리라도, **내가 직접 숫자를 두드려보고 당당하게 요구하지 않으면 세상은 내 돈을 지켜주지 않는다는 사실**입니다.

---

### 내가 실제로 겪었던 전후 비교

당시 상대방이 제시했던 금액과 제가 2026년 최신 법령을 기준으로 재계산한 차이는 어마어마했습니다.

| 구분 항목 | 상대방이 처음 요구/제시한 내용 | 박과장이 팩트로 수정한 결과 | 내 통장의 실질 차액 |
| :--- | :--- | :--- | :--- |
| **기준 산정** | 관행대로 대충 뭉뚱그린 계산 | **2026년 법정 기준 및 비과세 반영** | 불필요한 과세·감액 차단 |
| **적용 요율** | 법정 최고 상한 요율 청구 | **법령상 협의 조항 제시하여 조정** | 수십~수백만원 즉시 세이브 |
| **최종 결과** | 억울하게 손해 볼 뻔함 | **1원도 손해 없이 전액 수령/방어** | **완전한 권리 회수!** |

---

### 내가 문제를 해결한 3단계 실천 로드맵

1. **1단계: 감정 빼고 팩트와 수치로만 대화하기**
   - 화를 내거나 읍소하지 않고, 공문서와 법령 조항을 캡처하여 객관적인 숫자로 전달했습니다.
2. **2단계: 모의계산기로 1원 단위까지 시뮬레이션**
   - 상대방의 말만 믿지 않고, 본 블로그의 계산기를 켜서 실제 실수령액과 이자 차이를 직접 확인했습니다.
3. **3단계: 서면 및 메일로 기록 남기기**
   - 구두 통화보다는 메일이나 문자, 내용증명으로 명확한 계산 근거를 남겨 반박의 여지를 없앴습니다.

여러분도 비슷한 상황에 처하셨다면 당황하지 마시고, 아래 모의계산기를 통해 본인의 정확한 권리 금액을 먼저 확인해보세요!`,
      status: 'published'
    };

    return fallbackPost;
  }

  public async triggerInstantPost(category: PostCategory, topic?: string): Promise<PostItem> {
    const post = await this.generatePostForCategory(category, topic);
    this.autoPosts.unshift(post);
    this.saveAutoPosts();
    this.addLog(`[즉시 수동 발행] "${post.title}" (${post.categoryName}) 1인칭 스토리텔링 등록 완료`, 'success');
    return post;
  }

  public getAllPosts(): PostItem[] {
    const combined = [...this.autoPosts, ...ALL_BLOG_POSTS];
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
      this.addLog(`[삭제] 포스트 "${removed[0]?.title}" 삭제 완료`, 'info');
      return true;
    }
    return false;
  }
}

export const autoPosterEngine = new AutoPosterEngine();
