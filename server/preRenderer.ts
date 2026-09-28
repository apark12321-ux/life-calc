import { PostItem, CategoryType } from '../src/types';

// Simple markdown-to-HTML parser for crawler pre-rendering
export function markdownToHtml(md: string): string {
  if (!md) return '';

  const lines = md.split('\n');
  const htmlLines: string[] = [];
  let inTable = false;
  let tableHeaderParsed = false;
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Table detection
    if (line.startsWith('|') && line.endsWith('|')) {
      if (!inTable) {
        if (inList) { htmlLines.push('</ul>'); inList = false; }
        htmlLines.push('<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-gray-200 text-sm">');
        inTable = true;
        tableHeaderParsed = false;
      }

      // Check if separator line |--|--|
      if (/^\|(\s*[:-]+[-| :]*)\|$/.test(line)) {
        tableHeaderParsed = true;
        continue;
      }

      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      if (!tableHeaderParsed) {
        htmlLines.push('  <thead><tr class="bg-gray-100 font-bold text-gray-800">');
        cells.forEach(c => htmlLines.push(`    <th class="border border-gray-200 px-3 py-2 text-left">${formatInline(c)}</th>`));
        htmlLines.push('  </tr></thead><tbody>');
      } else {
        htmlLines.push('  <tr class="hover:bg-gray-50 border-b border-gray-100">');
        cells.forEach(c => htmlLines.push(`    <td class="border border-gray-200 px-3 py-2 text-gray-700">${formatInline(c)}</td>`));
        htmlLines.push('  </tr>');
      }
      continue;
    } else if (inTable) {
      htmlLines.push('</tbody></table></div>');
      inTable = false;
    }

    // List item detection
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        htmlLines.push('<ul class="list-disc pl-5 my-3 space-y-1 text-gray-700 text-sm">');
        inList = true;
      }
      htmlLines.push(`  <li>${formatInline(line.substring(2))}</li>`);
      continue;
    } else if (inList) {
      htmlLines.push('</ul>');
      inList = false;
    }

    if (!line) {
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      htmlLines.push(`<h3 class="text-lg font-bold text-gray-900 mt-6 mb-2">${formatInline(line.substring(4))}</h3>`);
    } else if (line.startsWith('## ')) {
      htmlLines.push(`<h2 class="text-xl font-bold text-gray-900 mt-8 mb-3 pb-2 border-b border-gray-200">${formatInline(line.substring(3))}</h2>`);
    } else if (line.startsWith('# ')) {
      htmlLines.push(`<h1 class="text-2xl font-extrabold text-gray-900 mt-8 mb-4">${formatInline(line.substring(2))}</h1>`);
    } else if (line.startsWith('> ')) {
      htmlLines.push(`<blockquote class="border-l-4 border-[#1078b9] bg-blue-50/50 p-3 my-4 rounded-r text-gray-700 text-sm">${formatInline(line.substring(2))}</blockquote>`);
    } else if (line === '---') {
      htmlLines.push('<hr class="my-6 border-gray-200" />');
    } else {
      htmlLines.push(`<p class="my-3 text-gray-700 leading-relaxed text-sm sm:text-base">${formatInline(line)}</p>`);
    }
  }

  if (inTable) htmlLines.push('</tbody></table></div>');
  if (inList) htmlLines.push('</ul>');

  return htmlLines.join('\n');
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 text-[#1078b9] px-1 py-0.5 rounded text-xs">$1</code>');
}

export function renderPreRenderedHeader(currentCat?: string): string {
  const categories = [
    { id: 'all', label: '홈', href: '/' },
    { id: 'work', label: '직장·급여', href: '/?cat=work' },
    { id: 'property', label: '부동산·세금', href: '/?cat=property' },
    { id: 'finance', label: '연금·금융', href: '/?cat=finance' },
    { id: 'calculators', label: '실무 계산기', href: '/?cat=calculators' },
    { id: 'about', label: '소개', href: '/?cat=about' }
  ];

  return `
<header class="bg-[#1078b9] text-white shadow-sm sticky top-0 z-40">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="flex items-center justify-between h-14 sm:h-16">
      <a href="/" class="flex items-center gap-2.5 text-white hover:text-blue-100 transition no-underline">
        <div class="w-9 h-9 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center font-bold text-white text-base">Q&A</div>
        <div>
          <span class="text-lg sm:text-xl font-bold tracking-tight block leading-tight">박과장의 생활경제 Q&A</span>
          <span class="text-[11px] text-white/80 font-normal hidden sm:block">급여 · 퇴직금 · 부동산 세금 · 연금 실무 지식 베이스</span>
        </div>
      </a>
      <nav class="hidden md:flex items-center h-full">
        <ul class="flex items-center h-full">
          ${categories.map(c => `
            <li class="h-full border-r border-[#005f8d]/60 last:border-r-0">
              <a href="${c.href}" class="h-full px-3.5 lg:px-4 text-sm font-semibold transition-colors flex items-center text-white/95 hover:bg-[#0e69a3] ${currentCat === c.id ? 'bg-[#0a5888] font-bold' : ''}">
                ${c.label}
              </a>
            </li>
          `).join('')}
        </ul>
      </nav>
    </div>
  </div>
</header>`;
}

export function renderPreRenderedFooter(): string {
  return `
<footer class="bg-white border-t border-gray-200 mt-16 text-xs text-gray-500 font-body">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-6">
    <div class="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 pb-4 border-b border-gray-100 font-medium">
      <a href="/" class="hover:text-[#1078b9] text-gray-700">홈</a>
      <span class="text-gray-300">|</span>
      <a href="/?cat=work" class="hover:text-[#1078b9] text-gray-700">직장·급여</a>
      <span class="text-gray-300">|</span>
      <a href="/?cat=property" class="hover:text-[#1078b9] text-gray-700">부동산·세금</a>
      <span class="text-gray-300">|</span>
      <a href="/?cat=finance" class="hover:text-[#1078b9] text-gray-700">연금·금융</a>
      <span class="text-gray-300">|</span>
      <a href="/?cat=calculators" class="hover:text-[#1078b9] text-gray-700">실무 계산기</a>
      <span class="text-gray-300">|</span>
      <a href="/?cat=about" class="hover:text-[#1078b9] text-gray-700">블로그 소개</a>
      <span class="text-gray-300">|</span>
      <a href="/?cat=privacy" class="hover:text-[#1078b9] font-bold text-gray-900 underline">개인정보처리방침</a>
      <span class="text-gray-300">|</span>
      <a href="/?cat=terms" class="hover:text-[#1078b9] text-gray-700">이용약관</a>
    </div>

    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs leading-relaxed text-gray-500">
      <div class="space-y-1">
        <p class="font-bold text-gray-800 text-sm">박과장의 생활경제 Q&A</p>
        <p class="text-[11px] text-gray-600">
          운영자: 박과장 (11년차 직장인 데이터 기획자) | 문의: <a href="mailto:apark12321@gmail.com" class="text-blue-600">apark12321@gmail.com</a>
        </p>
        <p class="text-[11px] text-gray-500">
          11년차 직장인이 전하는 2026년 급여·퇴직금, 4대보험, 부동산 취득세·복비, 연금·절세 실전 경험담과 간편 금융 계산기를 제공합니다.
        </p>
        <p class="text-[11px] text-gray-400">
          본 사이트에 수록된 모든 글과 계산기는 공공기관 고시 및 세법을 바탕으로 제작되었으며, 개별적인 법률·세무 자문을 대신할 수 없습니다.
        </p>
      </div>
      <div class="text-[11px] text-gray-400 text-left sm:text-right shrink-0">
        <p>Copyright &copy; 2026 박과장의 생활경제 Q&A. All rights reserved.</p>
        <p class="text-gray-400 mt-0.5">생활금융 정보 및 실무 Q&A 포털</p>
      </div>
    </div>
  </div>
</footer>`;
}

export function renderPreRenderedPost(post: PostItem, allPosts: PostItem[]): string {
  const contentHtml = markdownToHtml(post.content);
  const relatedPosts = allPosts.filter(p => p.category === post.category && p.id !== post.id).slice(0, 4);

  return `
<div class="min-h-screen bg-[#f0f4f9] flex flex-col font-sans text-gray-800">
  ${renderPreRenderedHeader(post.category)}
  <div class="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <main class="lg:col-span-8 space-y-6">
        <article class="bg-white border border-gray-200 rounded-xl p-5 sm:p-8 shadow-xs space-y-6">
          <nav aria-label="Breadcrumb" class="text-xs text-gray-500 flex items-center gap-1.5 pb-3 border-b border-gray-100">
            <a href="/" class="hover:text-[#1078b9]">홈</a>
            <span>&gt;</span>
            <a href="/?cat=${post.category}" class="hover:text-[#1078b9]">${post.categoryName}</a>
            <span>&gt;</span>
            <span class="text-gray-700 font-medium truncate max-w-xs">${post.title}</span>
          </nav>

          <header class="space-y-3">
            <div class="flex items-center gap-2">
              <span class="bg-blue-50 text-[#1078b9] border border-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded">
                ${post.categoryName}
              </span>
              <span class="text-gray-400 text-xs">·</span>
              <time class="text-xs text-gray-500" datetime="${post.date}">${post.date}</time>
              <span class="text-gray-400 text-xs">·</span>
              <span class="text-xs text-gray-500">${post.author || '박과장'}</span>
            </div>
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-snug">
              ${post.title}
            </h1>
          </header>

          <div class="bg-blue-50/60 border border-blue-100 rounded-xl p-4 sm:p-5 text-gray-700 text-sm leading-relaxed">
            <p class="font-medium text-gray-800">${post.summary}</p>
            ${post.authorNote ? `<div class="mt-3 pt-3 border-t border-blue-200/60 text-xs text-blue-900">${post.authorNote}</div>` : ''}
          </div>

          ${post.highlights && post.highlights.length > 0 ? `
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            ${post.highlights.map(h => `
              <div class="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                <span class="block text-xs text-gray-500">${h.label}</span>
                <span class="block font-bold text-gray-900 text-sm mt-1">${h.value}</span>
              </div>
            `).join('')}
          </div>` : ''}

          <div class="prose max-w-none text-gray-800 leading-relaxed">
            ${contentHtml}
          </div>

          ${post.relatedCalculatorId ? `
          <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p class="font-bold text-sm text-[#1078b9]">직접 계산해보기: ${post.relatedCalculatorName || '실무 모의 계산기'}</p>
              <p class="text-xs text-gray-600">2026년 최신 법정 요율과 세법 기준으로 내 실 수령액을 즉시 모의 연산해 보세요.</p>
            </div>
            <a href="/?calc=${post.relatedCalculatorId}" class="px-4 py-2 bg-[#1078b9] text-white rounded-lg text-xs font-bold shrink-0 hover:bg-[#0e69a3] transition">
              계산기 바로가기 &rarr;
            </a>
          </div>` : ''}

          ${post.tags && post.tags.length > 0 ? `
          <div class="flex flex-wrap gap-1.5 pt-4 border-t border-gray-100 text-xs">
            <span class="text-gray-400">태그:</span>
            ${post.tags.map(t => `<a href="/?q=${encodeURIComponent(t)}" class="bg-gray-50 text-gray-600 px-2 py-0.5 rounded border border-gray-200 hover:text-[#1078b9]">#${t}</a>`).join(' ')}
          </div>` : ''}
        </article>

        ${relatedPosts.length > 0 ? `
        <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
          <h2 class="text-sm font-bold text-gray-900 mb-3">'${post.categoryName}' 분야의 다른 실무 지식</h2>
          <ul class="divide-y divide-gray-100 text-xs">
            ${relatedPosts.map(r => `
              <li class="py-2.5 flex items-center justify-between">
                <a href="/?p=${r.id}" class="text-gray-800 hover:text-[#1078b9] font-medium truncate max-w-md">${r.title}</a>
                <span class="text-gray-400 shrink-0 ml-4">${r.date.split(' ')[0]}</span>
              </li>
            `).join('')}
          </ul>
        </div>` : ''}
      </main>

      <aside class="lg:col-span-4 space-y-4">
        <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
          <div class="flex items-center gap-3.5 pb-4 border-b border-gray-100">
            <div class="w-12 h-12 rounded-full bg-[#1078b9] text-white flex items-center justify-center font-bold text-base">박</div>
            <div>
              <h3 class="font-bold text-gray-900 text-base">박과장</h3>
              <p class="text-xs text-gray-500">11년차 데이터 기획자</p>
            </div>
          </div>
          <p class="pt-3 text-xs text-gray-600 leading-relaxed">
            11년 동안 회사 생활, 이직, 내 집 마련을 거치며 직접 겪고 엑셀로 검증한 월급, 퇴직금, 부동산 세금, 연금 정보를 알기 쉽게 기록합니다.
          </p>
          <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <a href="/?cat=about" class="text-gray-700 hover:text-[#1078b9] font-medium">블로그 소개</a>
            <span class="text-gray-300">|</span>
            <a href="/?cat=calculators" class="text-gray-700 hover:text-[#1078b9] font-medium">실무 계산기 (8종)</a>
          </div>
        </div>
      </aside>
    </div>
  </div>
  ${renderPreRenderedFooter()}
</div>`;
}

export function renderPreRenderedHome(allPosts: PostItem[], category: CategoryType = 'all'): string {
  let displayPosts = allPosts;
  if (category !== 'all') {
    displayPosts = allPosts.filter(p => p.category === category);
  }

  const categoryTitles: Record<string, string> = {
    all: '전체 최신 실전 칼럼',
    work: '직장·급여·퇴직 실전 가이드',
    property: '부동산·세금 실전 가이드',
    finance: '연금·금융·절세 실전 가이드'
  };

  return `
<div class="min-h-screen bg-[#f0f4f9] flex flex-col font-sans text-gray-800">
  ${renderPreRenderedHeader(category)}
  <div class="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
    
    <!-- 2026 Authoritative Platform Introduction -->
    <section class="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-6 shadow-xs">
      <div class="max-w-3xl space-y-3">
        <span class="bg-blue-100 text-[#1078b9] text-xs font-bold px-2.5 py-1 rounded-full">2026 대한민국 최신 개정 법령 반영</span>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
          박과장의 생활경제 Q&A | 급여·세금·부동산·연금 실전 포털
        </h1>
        <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
          11년차 직장인이 현업에서 직접 부딪히며 검증한 2026년 연봉 실수령액, 최저시급 주휴수당, 4대보험 공제, 퇴직금 정산, 부동산 취득세 감면 및 비과세 혜택을 1원 단위까지 엑셀과 계산기로 알기 쉽게 정리합니다.
        </p>
      </div>

      <!-- Quick 2026 Core Benchmark Table -->
      <div class="mt-6 pt-6 border-t border-gray-100">
        <h2 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">2026년 핵심 생활금융 법정 지표</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <span class="text-gray-500 block">2026년 법정 최저시급</span>
            <strong class="text-gray-900 text-sm font-bold block mt-0.5">10,030원 (+1.7%)</strong>
            <span class="text-[11px] text-gray-400">월 209시간 2,096,270원</span>
          </div>
          <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <span class="text-gray-500 block">월 식대 비과세 한도</span>
            <strong class="text-gray-900 text-sm font-bold block mt-0.5">월 최대 20만 원</strong>
            <span class="text-[11px] text-gray-400">소득세 및 4대보험 비과세</span>
          </div>
          <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <span class="text-gray-500 block">신생아 특례 디딤돌</span>
            <strong class="text-gray-900 text-sm font-bold block mt-0.5">부부합산 소득 2억 원</strong>
            <span class="text-[11px] text-gray-400">금리 연 1%대 5억원 한도</span>
          </div>
          <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <span class="text-gray-500 block">IRP·연금저축 공제</span>
            <strong class="text-gray-900 text-sm font-bold block mt-0.5">연간 최대 900만 원</strong>
            <span class="text-[11px] text-gray-400">최대 148만 5천원 환급</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <main class="lg:col-span-8 space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-gray-200">
          <h2 class="text-lg font-bold text-gray-900">${categoryTitles[category] || '최신 글 목록'}</h2>
          <span class="text-xs text-gray-500">총 ${displayPosts.length}개의 실무 글</span>
        </div>

        <div class="space-y-3">
          ${displayPosts.slice(0, 15).map(post => `
            <article class="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 hover:border-[#1078b9] transition shadow-xs">
              <a href="/?p=${post.id}" class="block group no-underline">
                <div class="flex items-center gap-2 text-xs mb-2">
                  <span class="bg-blue-50 text-[#1078b9] border border-blue-200 text-[11px] font-semibold px-2 py-0.5 rounded">
                    ${post.categoryName}
                  </span>
                  <span class="text-gray-400">·</span>
                  <span class="text-gray-500">${post.date.split(' ')[0]}</span>
                </div>
                <h3 class="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#1078b9] transition-colors leading-snug mb-2">
                  ${post.title}
                </h3>
                <p class="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3">
                  ${post.summary}
                </p>
                <div class="flex items-center justify-between text-xs pt-2 border-t border-gray-100 text-gray-400">
                  <span class="text-[11px] text-gray-500">작성자: ${post.author || '박과장'}</span>
                  <span class="text-[#1078b9] font-semibold group-hover:underline">자세히 보기 &rarr;</span>
                </div>
              </a>
            </article>
          `).join('')}
        </div>
      </main>

      <aside class="lg:col-span-4 space-y-4">
        <!-- Profile Widget -->
        <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
          <div class="flex items-center gap-3.5 pb-4 border-b border-gray-100">
            <div class="w-12 h-12 rounded-full bg-[#1078b9] text-white flex items-center justify-center font-bold text-base">박</div>
            <div>
              <h3 class="font-bold text-gray-900 text-base">박과장</h3>
              <p class="text-xs text-gray-500">11년차 데이터 기획자</p>
            </div>
          </div>
          <p class="pt-3 text-xs text-gray-600 leading-relaxed">
            11년 동안 회사 생활, 이직, 내 집 마련을 거치며 직접 겪고 엑셀로 검증한 월급, 퇴직금, 부동산 세금, 연금 정보를 알기 쉽게 기록합니다.
          </p>
          <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <a href="/?cat=about" class="text-gray-700 hover:text-[#1078b9] font-medium">블로그 소개</a>
            <span class="text-gray-300">|</span>
            <a href="/?cat=calculators" class="text-gray-700 hover:text-[#1078b9] font-medium">실무 계산기 (8종)</a>
          </div>
        </div>

        <!-- Quick Calculators -->
        <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
          <h3 class="text-xs font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">2026 실무 금융 계산기 바로가기</h3>
          <ul class="space-y-2 text-xs">
            <li><a href="/?calc=wage_salary" class="text-gray-700 hover:text-[#1078b9] block py-1">&bull; 2026 연봉 실수령액 계산기</a></li>
            <li><a href="/?calc=wage_hourly" class="text-gray-700 hover:text-[#1078b9] block py-1">&bull; 최저시급(10,030원) & 주휴수당 계산기</a></li>
            <li><a href="/?calc=wage_severance" class="text-gray-700 hover:text-[#1078b9] block py-1">&bull; 퇴직금 및 평균임금 산정 계산기</a></li>
            <li><a href="/?calc=property_tax" class="text-gray-700 hover:text-[#1078b9] block py-1">&bull; 부동산 취득세 & 감면 계산기</a></li>
            <li><a href="/?calc=property_brokerage" class="text-gray-700 hover:text-[#1078b9] block py-1">&bull; 부동산 중개보수(복비) 상한요율 계산기</a></li>
            <li><a href="/?calc=property_loan" class="text-gray-700 hover:text-[#1078b9] block py-1">&bull; 주택담보대출 원리금 상환 계산기</a></li>
            <li><a href="/?calc=finance_deposit" class="text-gray-700 hover:text-[#1078b9] block py-1">&bull; 예적금 이자 & 비과세 복리 계산기</a></li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
  ${renderPreRenderedFooter()}
</div>`;
}

export function renderPreRenderedCalculators(): string {
  return `
<div class="min-h-screen bg-[#f0f4f9] flex flex-col font-sans text-gray-800">
  ${renderPreRenderedHeader('calculators')}
  <div class="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
    <div class="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-6 shadow-xs">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">2026 실전 금융 계산기 모음 & 실수령액표</h1>
      <p class="text-sm text-gray-600 leading-relaxed mb-6">
        2026년 최신 4대보험 요율(국민연금 4.5%, 건강보험 3.545%, 장기요양 12.95%, 고용보험 0.9%)과 개정 근로소득 간이세액표를 반영한 공인 금융 계산 도구입니다.
      </p>

      <h2 class="text-lg font-bold text-gray-900 mt-6 mb-3">2026년 주요 연봉대별 월 예상 실수령액 요약표 (비과세 식대 20만원 기준)</h2>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-gray-200 text-xs sm:text-sm">
          <thead>
            <tr class="bg-gray-100 font-bold text-gray-800">
              <th class="border border-gray-200 px-3 py-2 text-left">연봉(원)</th>
              <th class="border border-gray-200 px-3 py-2 text-right">월 세전급여</th>
              <th class="border border-gray-200 px-3 py-2 text-right">4대보험 공제합계</th>
              <th class="border border-gray-200 px-3 py-2 text-right">소득세+지방세</th>
              <th class="border border-gray-200 px-3 py-2 text-right text-[#1078b9] font-bold">월 실수령액</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-gray-100 hover:bg-gray-50"><td class="border border-gray-200 px-3 py-2 font-medium">30,000,000원</td><td class="border border-gray-200 px-3 py-2 text-right">2,500,000원</td><td class="border border-gray-200 px-3 py-2 text-right">228,850원</td><td class="border border-gray-200 px-3 py-2 text-right">38,120원</td><td class="border border-gray-200 px-3 py-2 text-right font-bold text-[#1078b9]">2,233,030원</td></tr>
            <tr class="border-b border-gray-100 hover:bg-gray-50"><td class="border border-gray-200 px-3 py-2 font-medium">40,000,000원</td><td class="border border-gray-200 px-3 py-2 text-right">3,333,330원</td><td class="border border-gray-200 px-3 py-2 text-right">306,120원</td><td class="border border-gray-200 px-3 py-2 text-right">124,540원</td><td class="border border-gray-200 px-3 py-2 text-right font-bold text-[#1078b9]">2,902,670원</td></tr>
            <tr class="border-b border-gray-100 hover:bg-gray-50"><td class="border border-gray-200 px-3 py-2 font-medium">50,000,000원</td><td class="border border-gray-200 px-3 py-2 text-right">4,166,660원</td><td class="border border-gray-200 px-3 py-2 text-right">386,410원</td><td class="border border-gray-200 px-3 py-2 text-right">241,830원</td><td class="border border-gray-200 px-3 py-2 text-right font-bold text-[#1078b9]">3,538,420원</td></tr>
            <tr class="border-b border-gray-100 hover:bg-gray-50"><td class="border border-gray-200 px-3 py-2 font-medium">60,000,000원</td><td class="border border-gray-200 px-3 py-2 text-right">5,000,000원</td><td class="border border-gray-200 px-3 py-2 text-right">466,700원</td><td class="border border-gray-200 px-3 py-2 text-right">396,480원</td><td class="border border-gray-200 px-3 py-2 text-right font-bold text-[#1078b9]">4,136,820원</td></tr>
            <tr class="border-b border-gray-100 hover:bg-gray-50"><td class="border border-gray-200 px-3 py-2 font-medium">70,000,000원</td><td class="border border-gray-200 px-3 py-2 text-right">5,833,330원</td><td class="border border-gray-200 px-3 py-2 text-right">546,990원</td><td class="border border-gray-200 px-3 py-2 text-right">571,130원</td><td class="border border-gray-200 px-3 py-2 text-right font-bold text-[#1078b9]">4,715,210원</td></tr>
            <tr class="border-b border-gray-100 hover:bg-gray-50"><td class="border border-gray-200 px-3 py-2 font-medium">80,000,000원</td><td class="border border-gray-200 px-3 py-2 text-right">6,666,660원</td><td class="border border-gray-200 px-3 py-2 text-right">627,280원</td><td class="border border-gray-200 px-3 py-2 text-right">768,540원</td><td class="border border-gray-200 px-3 py-2 text-right font-bold text-[#1078b9]">5,270,840원</td></tr>
            <tr class="border-b border-gray-100 hover:bg-gray-50"><td class="border border-gray-200 px-3 py-2 font-medium">100,000,000원</td><td class="border border-gray-200 px-3 py-2 text-right">8,333,330원</td><td class="border border-gray-200 px-3 py-2 text-right">758,240원</td><td class="border border-gray-200 px-3 py-2 text-right">1,215,620원</td><td class="border border-gray-200 px-3 py-2 text-right font-bold text-[#1078b9]">6,359,470원</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  ${renderPreRenderedFooter()}
</div>`;
}

export function renderPreRenderedAbout(): string {
  return `
<div class="min-h-screen bg-[#f0f4f9] flex flex-col font-sans text-gray-800">
  ${renderPreRenderedHeader('about')}
  <div class="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
    <div class="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">블로그 소개 및 운영 철학 (E-E-A-T)</h1>
      <div class="prose max-w-none text-gray-700 leading-relaxed text-sm sm:text-base space-y-4">
        <p>
          <strong>'박과장의 생활경제 Q&A'</strong>는 11년차 직장인(데이터 기획자)이 일상생활과 직장 생활, 자산 운용 과정에서 직접 겪은 문제를 세법과 노동법을 바탕으로 팩트체크하여 기록하는 실무 지식 포털입니다.
        </p>
        <h2 class="text-lg font-bold text-gray-900 pt-4 border-t border-gray-100">1. 전문성 및 검증 원칙</h2>
        <p>
          본 사이트에 수록된 모든 칼럼과 계산식은 고용노동부, 국세청, 국토교통부, 금융위원회, 국민건강보험공단 등 관계 부처의 2026년 최신 공식 행정 고시 및 대법원 판례를 준용하여 엑셀과 통계 코드로 전수 검증 후 발행됩니다.
        </p>
        <h2 class="text-lg font-bold text-gray-900 pt-4 border-t border-gray-100">2. 운영자 정보 및 문의처</h2>
        <ul class="list-disc pl-5 space-y-1 text-sm">
          <li><strong>운영자:</strong> 박과장 (11년차 데이터 기획자)</li>
          <li><strong>공식 이메일:</strong> <a href="mailto:apark12321@gmail.com" class="text-blue-600">apark12321@gmail.com</a></li>
          <li><strong>공식 도메인:</strong> <a href="https://life-calc.kr" class="text-blue-600">https://life-calc.kr</a></li>
          <li><strong>답변 기한:</strong> 질문 및 오류 제보는 확인 후 영업일 기준 48시간 이내 회신합니다.</li>
        </ul>
      </div>
    </div>
  </div>
  ${renderPreRenderedFooter()}
</div>`;
}

export function renderPreRenderedPrivacy(): string {
  return `
<div class="min-h-screen bg-[#f0f4f9] flex flex-col font-sans text-gray-800">
  ${renderPreRenderedHeader('privacy')}
  <div class="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
    <div class="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">개인정보처리방침 (Privacy Policy)</h1>
      <div class="text-xs text-gray-500 pb-3 border-b border-gray-100">최종 개정일: 2026년 9월 28일</div>
      <div class="prose max-w-none text-gray-700 leading-relaxed text-sm space-y-4">
        <p>
          박과장의 생활경제 Q&A(이하 '회사' 또는 '사이트')는 이용자의 개인정보를 중요시하며, 개인정보보호법 및 정보통신망 이용촉진 및 정보보호 등에 관한 법률을 준수하고 있습니다.
        </p>
        <h2 class="text-base font-bold text-gray-900 pt-3">1. Google AdSense 및 쿠키(Cookie) 운영 정책</h2>
        <p>
          본 사이트는 Google 및 제3자 광고 공급업체를 통해 광고를 게재하며, Google은 사용자가 본 사이트 또는 다른 웹사이트를 방문한 기록을 바탕으로 관련성 높은 광고를 게재하기 위해 쿠키(DoubleClick 쿠키 포함)를 사용합니다.
        </p>
        <p>
          이용자는 <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">Google 광고 설정</a> 또는 <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">aboutads.info</a>를 방문하여 맞춤형 광고 게재를 위한 쿠키 사용을 선택 해제할 수 있습니다.
        </p>
        <h2 class="text-base font-bold text-gray-900 pt-3">2. 수집하는 개인정보 항목</h2>
        <p>
          본 사이트의 금융 계산기는 사용자의 입력값을 서버로 전송하거나 데이터베이스에 저장하지 않으며, 모든 계산은 이용자의 브라우저 내에서만 안전하게 실시간 처리됩니다. 서비스 이용 과정에서 IP 주소, 쿠키, 방문 일시, 브라우저 종류 등의 로그 데이터가 통계 목적으로 자동 생성되어 수집될 수 있습니다.
        </p>
        <h2 class="text-base font-bold text-gray-900 pt-3">3. 개인정보 보호책임자</h2>
        <p>
          이름: 박과장 | 이메일: <a href="mailto:apark12321@gmail.com" class="text-blue-600">apark12321@gmail.com</a>
        </p>
      </div>
    </div>
  </div>
  ${renderPreRenderedFooter()}
</div>`;
}

export function renderPreRenderedTerms(): string {
  return `
<div class="min-h-screen bg-[#f0f4f9] flex flex-col font-sans text-gray-800">
  ${renderPreRenderedHeader('terms')}
  <div class="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
    <div class="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">이용약관 및 면책고지</h1>
      <div class="text-xs text-gray-500 pb-3 border-b border-gray-100">최종 개정일: 2026년 9월 28일</div>
      <div class="prose max-w-none text-gray-700 leading-relaxed text-sm space-y-4">
        <h2 class="text-base font-bold text-gray-900 pt-2">1. 서비스의 목적 및 면책</h2>
        <p>
          본 사이트에서 제공하는 모든 칼럼, 계산 결과, 서식 가이드는 일반적인 정보 제공을 목적으로 작성되었습니다. 관계 법령의 개정이나 개별 사업장 취업규칙, 개인의 특수 상황에 따라 실제 수령액이나 세액은 달라질 수 있으며, 본 사이트의 정보는 변호사, 공인노무사, 세무사의 법률·세무 자문을 대신할 수 없습니다.
        </p>
        <h2 class="text-base font-bold text-gray-900 pt-2">2. 저작권의 귀속</h2>
        <p>
          본 사이트에 게재된 모든 텍스트, 엑셀 산출 모델, 디자인의 저작권은 박과장의 생활경제 Q&A에 귀속되며, 사전 서면 동의 없는 무단 전재, 크롤링을 통한 상업적 재배포를 금지합니다.
        </p>
      </div>
    </div>
  </div>
  ${renderPreRenderedFooter()}
</div>`;
}
