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
      title: '2026년 최저시급 10,030원 기준으로 월급 계산기 돌려보고 회사에 항의한 사연',
      hint: '주 40시간 월 209시간 기본급 2,096,270원 미달 여부와 주휴수당 미지급분 전액 소급',
      calculatorId: 'wage',
      calculatorName: '주휴수당 & 시급 계산기'
    },
    {
      title: '육아휴직 1년 쓰고 월 최대 250만원 상한액 챙긴 실전 수령기 (사후지급금 폐지 팩트)',
      hint: '2026년 육아휴직 급여 상한액 개편(첫 3개월 250만원)과 복직 후 사후지급금 전액 폐지 실무',
      calculatorId: 'wage',
      calculatorName: '육아휴직 & 시급 계산기'
    },
    {
      title: '프리랜서 투잡 3.3% 떼인 세금 5월 종합소득세 때 142만원 전액 환급받은 비법',
      hint: '단순경비율 vs 기준경비율 적용과 원천징수 3.3% 기납부세액 삼쩜삼 없이 홈택스로 환급받기',
      calculatorId: 'wage',
      calculatorName: '종합소득세 & 급여 계산기'
    },
    {
      title: '포괄임금제 계약서의 고정 야근 20시간 넘겼을 때 추가 수당 48만원 받아낸 썰',
      hint: '포괄임금 약정 시간을 초과한 실근로시간 기록 앱 증거와 근로기준법상 차액 청구 공식',
      calculatorId: 'wage',
      calculatorName: '연봉 실수령액 계산기'
    }
  ],
  property: [
    {
      title: '전세 만기 때 집주인이 보증금 안 빼주길래 임차권등기명령 걸고 HUG 보증금 타낸 썰',
      hint: '계약 만료 전 내용증명 발송부터 전자소송 임차권등기명령 신청, 이사 후 지연이자 연 12% 청구',
      calculatorId: 'property',
      calculatorName: '부동산 취득세 및 복비 계산기'
    },
    {
      title: '전월세 전환율(기준금리+2.0%) 계산기로 집주인의 무리한 월세 20만원 인상 막아낸 방법',
      hint: '보증금 5,000만원 감액 시 법정 전환율(연 5.5% 한도) 역산으로 적정 월세 22.9만원 방어',
      calculatorId: 'property',
      calculatorName: '부동산 복비 및 전월세 계산기'
    },
    {
      title: '1주택자 12억원 비과세 특례 챙겨서 양도소득세 0원 만든 실전 매도 일기',
      hint: '2년 보유(조정지역 2년 거주) 요건 충족과 장기보유특별공제 최대 80% 적용으로 5억 차익 비과세',
      calculatorId: 'property',
      calculatorName: '부동산 세금 및 취득세 계산기'
    },
    {
      title: '스트레스 DSR 3단계 적용 앞두고 대출 한도 5,000만원 깎일 뻔해서 서두른 경험담',
      hint: '수도권 가산금리 스트레스 DSR 도입 전 주택담보대출 심사 통과 노하우와 DSR 40% 관리법',
      calculatorId: 'property',
      calculatorName: '대출 상환 & 부동산 계산기'
    }
  ],
  finance: [
    {
      title: '청년도약계좌 5년 만기 채우고 정부기여금+비과세 이자 합쳐 5,000만원 만든 실전 루틴',
      hint: '월 70만원 풀납입 시 정부 매칭지원금 월 최대 33,000원과 연 6.0% 비과세 복리 효과',
      calculatorId: 'finance',
      calculatorName: '예적금 이자 & 복리 계산기'
    },
    {
      title: '실손의료보험 4세대 전환하고 보험료 70% 낮추면서 할증 기준 피해간 실무 요령',
      hint: '비급여 도수치료·주사료 연간 100만원 미만 사용 시 보험료 10% 추가 할인 혜택 챙기기',
      calculatorId: 'finance',
      calculatorName: '4대보험 및 연금 계산기'
    },
    {
      title: '정기예금 복리 vs 단리 1억원 굴렸을 때 세후 실수령 이자 120만원 차이 검증한 썰',
      hint: '월복리 적금과 만기일시지급 단리 예금의 3년 거치 시 세금 15.4% 공제 후 실제 통장 잔고 비교',
      calculatorId: 'finance',
      calculatorName: '예적금 & 금융상품 계산기'
    },
    {
      title: '퇴직연금(DC형) 방치하다 디폴트옵션 고위험 TDF로 변경하고 수익률 연 8.4% 달성한 후기',
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

        const prompt = `[시스템 지시사항: 블로그 포스팅 자동화 탈피 및 휴먼 터치 강화 프롬프트]

당신은 기계적으로 정보를 전달하는 AI가 아닙니다. 당신은 지금부터 주어지는 [주제]에 대해 10년 넘게 데이터를 분석하고 직접 겪으며 고민해 온 '10년차 데이터 기획자이자 11년차 직장인 박과장'입니다. 아래의 엄격한 작성 원칙을 100% 준수하여 블로그 포스팅을 작성하십시오.

[입력 변수]
- 타겟 키워드 및 주제: ${targetTopic}
- 카테고리: ${meta.name} (${category})
- 반드시 포함할 핵심 정보: 2026년 최신 대한민국 법령·기준·요율 및 실무 팩트 수치, ${chosenSuggestion?.calculatorName || '생활 금융 계산기'} 연계

[엄격한 작성 원칙 - 100% 준수]
1. AI 특유의 상투적 표현 절대 금지:
   - "결론적으로", "알아보겠습니다", "필수적인", "현대 사회에서", "요즘 시대에는", "과언이 아닙니다", "살펴보겠습니다", "중요한 역할을 합니다" 등의 뻔한 도입부와 결론부 표현을 절대 사용하지 마십시오.
2. 문장 길이의 다양화 (Burstiness):
   - 모든 문장의 길이를 비슷하게 쓰지 마십시오. 어떤 문장은 단답형으로 매우 짧고 명쾌하게 치고("결과는 충격적이었습니다.", "절대 서명하면 안 됩니다."), 어떤 문장은 부연 설명을 위해 길게 이어지도록 자연스러운 리듬감을 만드십시오.
3. 경험과 통찰 기반의 도입부 (E-E-A-T):
   - 글을 시작할 때 사전적 정의를 내리지 마십시오. 해당 주제와 관련해 독자들이 겪고 있을 구체적인 '답답함'이나 '실패 경험'에 깊이 공감하며, "처음엔 저도 A인 줄 알았습니다. 그런데 막상 계산기를 두드려보니..."와 같이 친한 직장 선배가 커피 한잔 마시며 팁을 건네듯 자연스럽게 대화체로 시작하십시오.
4. 정보의 구조화와 주관적 평가 혼합:
   - 불렛포인트나 마크다운 표(| 항목 | 과거/일반적 경우 | 박과장이 팩트로 수정한 결과 | 실질 차액 |)를 사용하여 핵심 데이터를 깔끔하게 정리하십시오.
   - 정보 정리 바로 아래에 반드시 "개인적으로 이 부분은 정말 아쉬웠다", "실제로 적용해 보니 이 방식이 가장 효율적이었다"라는 식의 주관적인 통찰과 평가를 한 줄씩 덧붙이십시오.
5. 독자와의 상호작용 유도 (Action Item & 소통 질문):
   - 글의 마무리에는 뻔한 요약 대신, 독자가 오늘 퇴근 전이나 주말에 당장 실행해 볼 수 있는 아주 작은 행동 지침(Action Item) 하나를 제안하십시오.
   - 마지막 문장은 독자의 생각이나 경험을 묻는 가벼운 질문으로 자연스럽게 끝맺으십시오.

다음 JSON 포맷으로만 응답하십시오 (JSON 외 텍스트 일체 금지):
{
  "title": "사람 냄새 나는 매력적인 실전 제목 (구체적 상황과 결과 명시, 예: 전세 만기 때 보증금 안 주길래 내용증명 보내고 연 12% 지연이자 받아낸 썰)",
  "summary": "직접 겪은 핵심 상황과 팩트 해결 결과를 담은 자연스러운 요약 2문장",
  "authorNote": "박과장의 실전 한줄 조언 (💡 이모지와 함께)",
  "readTimeMinutes": 5,
  "tags": ["${meta.name}", "실전경험", "팩트체크", "2026기준", "박과장노트"],
  "highlights": [
    { "label": "실제 아낀/지킨 금액", "value": "구체적 금액/수치" },
    { "label": "적용 핵심 기준", "value": "2026년 법령/공식" },
    { "label": "실전 해결 열쇠", "value": "핵심 제도/서류명" }
  ],
  "legalBasis": "근거 법률 및 2026년 행정규칙 조항",
  "content": "마크다운 형식의 본문 전체 (## 소제목, 생생한 대화체 도입부, 마크다운 표, 주관적 평가 코멘트, 1단계 Action Item, 소통 질문 포함)"
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
      title: `${targetTopic} - 박과장의 팩트 해결 생생 후기`,
      summary: `${targetTopic} 상황에서 제가 직접 겪었던 위기와 2026년 법령 및 엑셀 계산표를 무기로 내 피 같은 돈을 지켜낸 사이다 실화입니다.`,
      category,
      categoryName: meta.name,
      categoryIcon: meta.icon,
      author: '박과장 (11년차 직장인)',
      authorRole: '돈 지키는 박과장',
      authorNote: `💡 ${chosenSuggestion?.hint || '가만히 있으면 아무도 안 챙겨줍니다. 본인이 직접 계산해보고 당당하게 요구해야 합니다.'}`,
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
      content: `처음엔 저도 회사나 기관에서 안내해 준 내용이 당연히 맞는 줄 알았습니다.

바쁜 일상에 치이다 보면 "알아서 법대로 잘 처리해 줬겠지" 하고 넘어가기 십상입니다. 저 역시 11년 전 첫 직장에서 그렇게 멍하니 서명했다가 수백만 원 단위의 손해를 본 쓰라린 경험이 있습니다. 하지만 막상 2026년 최신 고시와 세법 계산식을 하나하나 뜯어보니 현실은 전혀 딴판이었습니다.

---

### 직접 부딪히며 검증한 전후 비교표

| 비교 항목 | 상대방이 처음 제시한 관행 기준 | 박과장이 팩트로 수정한 결과 | 내 통장의 실질 차액 |
| :--- | :--- | :--- | :--- |
| **산정 기준** | 관행대로 대충 뭉뚱그린 포괄 계산 | **2026년 법정 비과세 및 가산 기준 전액 반영** | 불필요한 공제·세금 원천 차단 |
| **적용 요율** | 법정 최고 상한 요율 일방 청구 | **시행령 협의 조항 및 고시 기준 제시** | 수십~수백만 원 즉시 방어 |
| **최종 수령액** | 억울하게 손해 볼 뻔한 상태 | **1원도 누락 없이 전액 수령 및 환급** | **정당한 내 권리 100% 회수** |

> 📌 **박과장의 실전 코멘트**: 솔직히 담당자에게 문제를 제기할 땐 얼굴 붉힐까 봐 망설여졌습니다. 하지만 감정을 싹 빼고 "2026년 기준 계산식과 법령 조항"만 엑셀로 깔끔하게 정리해 보내니, 상대방도 두말없이 정정 처리해 주더군요. 역시 숫자가 가장 강력한 무기입니다.

---

### 지금 당장 실행할 수 있는 오늘자 Action Item

- **오늘 퇴근 전 딱 3분만 투자해 보세요**: 서랍이나 메일에 있는 최근 서류(급여명세서, 계약서, 납입 영수증)를 열고, 본 블로그의 모의계산기에 숫자를 그대로 입력해 보세요.
- 법정 기준과 1원이라도 차이가 난다면, 절대 그냥 넘어가지 마시고 증빙 화면을 캡처해 두시기 바랍니다.

혹시 여러분도 비슷한 상황에서 억울하게 넘어가거나 고민했던 경험이 있으신가요? 궁금한 점이나 나누고 싶은 사례가 있다면 편하게 의견을 남겨주세요!`,
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
