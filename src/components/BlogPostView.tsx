import React, { useState, useEffect } from 'react';
import { PostItem, CategoryType } from '../types';
import { ALL_BLOG_POSTS, CATEGORY_META } from '../data/postsData';
import { 
  Calendar, User, Share2, Printer, ChevronRight, ChevronLeft, 
  ShieldCheck, Heart, ExternalLink, Bookmark,
  ThumbsUp, ThumbsDown, HelpCircle, CheckCircle2
} from 'lucide-react';
import TableOfContents from './TableOfContents';

interface BlogPostViewProps {
  post: PostItem;
  onSelectPost: (post: PostItem) => void;
  onSelectCategory: (cat: CategoryType) => void;
  onNavigateToCalculator: (calcId: string) => void;
}

// Helper to render markdown inline elements (bold, links, code) without raw asterisks
function renderFormattedText(text: string): React.ReactNode {
  if (!text) return null;

  // Split text by bold markers **...**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={index} className="font-bold text-gray-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    // Handle inline code `...`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code key={index} className="bg-gray-100 text-[#1078b9] px-1.5 py-0.5 rounded text-xs font-mono">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export default function BlogPostView({
  post,
  onSelectPost,
  onSelectCategory,
  onNavigateToCalculator
}: BlogPostViewProps) {
  const [copied, setCopied] = useState(false);
  const [feedbackVote, setFeedbackVote] = useState<'none' | 'up' | 'down' | 'suggest'>('none');
  
  // Real like state per post
  const [liked, setLiked] = useState<boolean>(() => {
    try {
      return localStorage.getItem(`liked_${post.id}`) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      setLiked(localStorage.getItem(`liked_${post.id}`) === 'true');
      const savedVote = localStorage.getItem(`feedback_${post.id}`) as 'up' | 'down' | 'suggest' | null;
      setFeedbackVote(savedVote || 'none');
    } catch {
      setLiked(false);
      setFeedbackVote('none');
    }
  }, [post.id]);

  // Find previous and next posts
  const currentIndex = ALL_BLOG_POSTS.findIndex(p => p.id === post.id);
  const prevPost = currentIndex > 0 ? ALL_BLOG_POSTS[currentIndex - 1] : null;
  const nextPost = currentIndex < ALL_BLOG_POSTS.length - 1 ? ALL_BLOG_POSTS[currentIndex + 1] : null;

  // Related posts in same category (excluding current)
  const relatedPosts = ALL_BLOG_POSTS
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 4);

  const handleShare = () => {
    try {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleToggleLike = () => {
    const nextState = !liked;
    setLiked(nextState);
    try {
      localStorage.setItem(`liked_${post.id}`, String(nextState));
    } catch {
      // ignore
    }
  };

  const handleVoteFeedback = (type: 'up' | 'down' | 'suggest') => {
    setFeedbackVote(type);
    try {
      localStorage.setItem(`feedback_${post.id}`, type);
    } catch {
      // ignore
    }
  };

  const meta = CATEGORY_META[post.category] || { name: '실전 칼럼' };
  const readTime = post.readTimeMinutes || 5;

  // Generate comprehensive E-E-A-T Schema.org JSON-LD structured data
  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `https://www.life-calc.kr/post/${post.id}#blogposting`,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://www.life-calc.kr/?p=${post.id}`
    },
    'headline': post.title,
    'description': post.summary,
    'datePublished': post.date.includes(' ') ? `${post.date.replace(' ', 'T')}+09:00` : `${post.date}T09:00:00+09:00`,
    'dateModified': post.date.includes(' ') ? `${post.date.replace(' ', 'T')}+09:00` : `${post.date}T18:00:00+09:00`,
    'inLanguage': 'ko-KR',
    'isAccessibleForFree': true,
    'articleSection': meta.name,
    'keywords': post.tags ? post.tags.join(', ') : '직장인 재테크, 생활금융, 연봉 계산, 세금 상식',
    'wordCount': post.content ? post.content.replace(/\s+/g, ' ').length : 2200,
    'author': {
      '@type': 'Person',
      '@id': 'https://www.life-calc.kr/about#author',
      'name': post.author || '박과장',
      'jobTitle': post.authorRole || '11년차 데이터 기획자 & 생활경제 블로거',
      'description': '11년 동안 회사 생활, 이직, 내 집 마련을 거치며 직접 겪고 엑셀로 검증한 월급, 퇴직금, 세금, 연금 정보를 알기 쉽게 공유하는 실무자입니다.',
      'url': 'https://www.life-calc.kr/about'
    },
    'publisher': {
      '@type': 'Organization',
      '@id': 'https://www.life-calc.kr/#organization',
      'name': '박과장의 생활경제 Q&A',
      'url': 'https://www.life-calc.kr'
    }
  };

  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${post.title} | 박과장의 생활경제 Q&A`;
    return () => {
      document.title = prevTitle;
    };
  }, [post]);

  return (
    <div className="space-y-4">
      {/* 0. Embedded JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      {/* 1. #question Card - Benchmarked from ko.phongnhaexplorer.com DWQA Question Card */}
      <div id="question" className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-3">
        {/* Breadcrumbs Navigation */}
        <nav className="flex items-center space-x-1.5 text-xs text-gray-500 font-medium no-print">
          <button 
            onClick={() => onSelectCategory('all')}
            className="hover:text-[#1078b9] transition"
          >
            홈
          </button>
          <span>&gt;</span>
          <button 
            onClick={() => onSelectCategory(post.category)}
            className="hover:text-[#1078b9] transition font-semibold"
          >
            {meta.name}
          </button>
          <span>&gt;</span>
          <span className="text-gray-400 truncate max-w-[200px] sm:max-w-xs">{post.title}</span>
        </nav>

        {/* Top Badges & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Category Pill */}
            <span className="bg-blue-50 text-[#1078b9] border border-blue-200 text-[11px] font-semibold px-2 py-0.5 rounded">
              {meta.name}
            </span>

            <span className="text-gray-300">·</span>

            {/* Date */}
            <span className="text-gray-500 text-xs">
              게시: {post.date.split(' ')[0]}
            </span>

            <span className="text-gray-300">·</span>

            {/* Read Time */}
            <span className="text-gray-500 text-xs">
              <strong className="text-gray-900 font-bold">{readTime}</strong>
              <sup className="text-[10px] text-gray-500 font-semibold ml-0.5">m</sup> 읽기
            </span>
          </div>

          {/* Action buttons (Like, Share, Print) */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 no-print">
            <button
              type="button"
              onClick={handleToggleLike}
              className={`px-2 py-1 rounded-md border text-xs transition flex items-center gap-1 ${
                liked ? 'bg-red-50 border-red-200 text-red-600 font-bold' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
              <span>{liked ? '공감됨' : '공감'}</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="px-2 py-1 rounded-md border border-gray-200 hover:bg-gray-50 text-xs transition flex items-center gap-1"
            >
              <Share2 className="w-3.5 h-3.5 text-gray-500" />
              <span>{copied ? '복사됨' : '공유'}</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="p-1 rounded-md border border-gray-200 hover:bg-gray-50 text-xs transition"
              title="인쇄하기"
            >
              <Printer className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Main Question Title (h1) in Phong Nha Explorer deep blue #056cad */}
        <h1 className="text-xl sm:text-2xl font-bold text-[#056cad] leading-snug tracking-tight font-heading pt-1">
          {post.title}
        </h1>

        {/* Author Metadata */}
        <div className="flex items-center gap-2 text-xs text-gray-500 pt-1 border-t border-gray-100">
          <span className="text-gray-800 font-semibold">작성자: {post.author || '박과장'}</span>
          <span className="text-gray-400">({post.authorRole || '11년차 데이터 기획자'})</span>
        </div>
      </div>

      {/* 2. #best-answer Card - The Signature Core Feature of ko.phongnhaexplorer.com */}
      <div id="best-answer" className="bg-[#f6ffec] border border-[#a5d6a7] rounded-xl p-5 sm:p-6 shadow-xs space-y-2.5">
        <div className="flex items-center gap-2 text-[#2e7d32] font-bold text-sm sm:text-base font-heading pb-1 border-b border-[#c3e6cb]">
          <span className="text-lg">💡</span>
          <span>핵심 답변 (Best Answer / 박과장의 실무 정리)</span>
        </div>
        <p className="text-sm sm:text-[15px] text-gray-800 leading-relaxed font-body">
          {post.authorNote || post.summary}
        </p>
      </div>

      {/* 3. Table of Contents Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <TableOfContents content={post.content} variant="inline" title="칼럼 목차" />
      </div>

      {/* 4. #more-information Card - Main Detailed Post Content */}
      <article id="more-information" className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="text-gray-800 text-base leading-relaxed space-y-6 font-body">
          {(() => {
            let h2Count = 0;
            let h3Count = 0;

            return post.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('## ')) {
                const headingId = `toc-heading-h2-${h2Count++}`;
                const text = paragraph.replace('## ', '');
                return (
                  <h2 
                    key={idx} 
                    id={headingId}
                    className="scroll-mt-24 text-xl sm:text-2xl font-bold text-[#056cad] mt-10 mb-4 pb-2 border-b border-gray-200 font-heading"
                  >
                    {text}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                const headingId = `toc-heading-h3-${h3Count++}`;
                const text = paragraph.replace('### ', '');
                return (
                  <h3 
                    key={idx} 
                    id={headingId}
                    className="scroll-mt-24 text-lg font-bold text-gray-900 mt-6 mb-2 font-heading"
                  >
                    {text}
                  </h3>
                );
              }
              if (paragraph.startsWith('#### ')) {
                const text = paragraph.replace('#### ', '');
                return (
                  <h4 key={idx} className="font-bold text-gray-900 mt-4 mb-1">
                    {text}
                  </h4>
                );
              }
              if (paragraph.startsWith('> ')) {
                return (
                  <blockquote key={idx} className="bg-gray-50 border-l-4 border-[#1078b9] p-4 text-gray-700 text-sm my-4 italic rounded-r">
                    {renderFormattedText(paragraph.replace('> ', ''))}
                  </blockquote>
                );
              }
              if (paragraph.startsWith('|')) {
                // Parse Markdown table
                const rows = paragraph.trim().split('\n').filter(r => r.trim().startsWith('|'));
                if (rows.length >= 2) {
                  const headerRow = rows[0].split('|').map(c => c.trim()).filter(Boolean);
                  const dataRows = rows.slice(2).map(r => r.split('|').map(c => c.trim()).filter(Boolean));
                  return (
                    <div key={idx} className="overflow-x-auto my-5 border border-gray-200 rounded-lg shadow-xs">
                      <table className="w-full text-xs sm:text-sm text-left">
                        <thead className="bg-[#f0f4f9] text-gray-900 font-bold">
                          <tr>
                            {headerRow.map((h, hi) => (
                              <th key={hi} className="px-4 py-2.5 border-b border-r border-gray-200 last:border-r-0">
                                {renderFormattedText(h)}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {dataRows.map((row, ri) => (
                            <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-[#fafbfc]'}>
                              {row.map((cell, ci) => (
                                <td key={ci} className="px-4 py-2.5 border-r border-gray-200 last:border-r-0 text-gray-700">
                                  {renderFormattedText(cell)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-1.5 text-gray-700 text-sm sm:text-base">
                    {paragraph.split('\n').map((item, itemIdx) => (
                      <li key={itemIdx} className="leading-relaxed">
                        {renderFormattedText(item.replace(/^- /, ''))}
                      </li>
                    ))}
                  </ul>
                );
              }
              if (paragraph.match(/^\d+\. /)) {
                return (
                  <ol key={idx} className="list-decimal pl-5 space-y-1.5 text-gray-700 text-sm sm:text-base">
                    {paragraph.split('\n').map((item, itemIdx) => (
                      <li key={itemIdx} className="leading-relaxed">
                        {renderFormattedText(item.replace(/^\d+\. /, ''))}
                      </li>
                    ))}
                  </ol>
                );
              }
              return (
                <p key={idx} className="text-gray-800 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {renderFormattedText(paragraph)}
                </p>
              );
            });
          })()}
        </div>

        {/* Key Takeaways Box (.tkaw-box style from phongnhaexplorer) */}
        <div className="bg-[#f8fafc] border-l-4 border-[#1078b9] border-y border-r border-gray-200/80 rounded-r-lg p-5 my-6">
          <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-2 flex items-center gap-1.5">
            <span>📌</span>
            <span>요약 & 핵심 체크포인트</span>
          </h4>
          <ul className="text-xs sm:text-sm text-gray-700 space-y-1.5 list-disc pl-5">
            <li>모든 세액 공제 및 법정 수당은 최신 2026년 기준 법령 및 고시를 준수합니다.</li>
            <li>개별 계약 조건 및 사업장 상시 근로자 수에 따라 세부 적용 규정이 달라질 수 있습니다.</li>
            <li>정확한 모의계산 결과는 하단의 무료 실무 계산기에서 즉시 확인 가능합니다.</li>
          </ul>
        </div>

        {/* Statutory Legal Basis */}
        {post.legalBasis && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-700 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-gray-900">관련 법령 및 행정 고시:</span>{' '}
              <span>{post.legalBasis}</span>
            </div>
          </div>
        )}

        {/* Calculator Link CTA */}
        {post.relatedCalculatorId && (
          <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm sm:text-base font-bold text-gray-900">
                📊 관련 실무 계산기: {post.relatedCalculatorName}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                2026년 공식이 적용된 무료 모의계산기로 내 조건에 맞게 직접 시뮬레이션해보세요.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (post.relatedCalculatorId) {
                  onNavigateToCalculator(post.relatedCalculatorId);
                }
              }}
              className="px-4 py-2 bg-[#1078b9] hover:bg-[#0e69a3] text-white rounded-lg text-xs font-bold transition shrink-0 shadow-xs"
            >
              계산기 바로가기
            </button>
          </div>
        )}

        {/* Post Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-400 self-center mr-1">태그:</span>
            {post.tags.map((tag, idx) => (
              <span key={idx} className="text-xs text-gray-600 bg-gray-50 hover:bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200 transition">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* 5. Helpful Feedback Box - Benchmarked from ko.phongnhaexplorer.com popup group */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-xs text-center space-y-3 no-print">
        <p className="font-bold text-gray-800 text-sm sm:text-base font-heading">
          이 실무 답변이 도움이 되셨나요?
        </p>
        <p className="text-xs text-gray-500">
          독자 여러분의 피드백은 더 정확하고 유용한 콘텐츠를 작성하는 데 큰 힘이 됩니다.
        </p>

        {feedbackVote === 'none' ? (
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleVoteFeedback('up')}
              className="px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>유용함</span>
            </button>
            <button
              type="button"
              onClick={() => handleVoteFeedback('down')}
              className="px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-red-50 hover:border-red-300 hover:text-red-700 text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition"
            >
              <ThumbsDown className="w-3.5 h-3.5 text-red-500" />
              <span>유용하지 않음</span>
            </button>
            <button
              type="button"
              onClick={() => handleVoteFeedback('suggest')}
              className="px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-300 hover:text-[#1078b9] text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#1078b9]" />
              <span>내용 보완 제안</span>
            </button>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800 font-semibold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>소중한 피드백 감사합니다! 지속적으로 법령과 실무 기준을 업데이트하겠습니다.</span>
          </div>
        )}
      </div>

      {/* 6. Author Profile Card - E-E-A-T Real Background */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-xs flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-[#1078b9] text-white flex items-center justify-center font-bold text-base font-heading shrink-0 shadow-xs">
          박
        </div>
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-gray-900 text-sm sm:text-base">{post.author || '박과장'}</h4>
            <span className="text-xs text-gray-500">
              ({post.authorRole || '11년차 데이터 기획자'})
            </span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            11년 동안 회사 생활, 이직, 내 집 마련을 거치며 직접 겪고 엑셀로 검증한 월급, 퇴직금, 부동산 세금, 연금 정보를 알기 쉽게 기록합니다.
          </p>
        </div>
      </div>

      {/* 7. Previous / Next Post Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs no-print">
        {prevPost ? (
          <div
            onClick={() => onSelectPost(prevPost)}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#1078b9] transition cursor-pointer group space-y-1 shadow-xs"
          >
            <span className="text-gray-400 flex items-center gap-1 group-hover:text-[#1078b9]">
              <ChevronLeft className="w-3.5 h-3.5" />
              이전 질문 & 칼럼
            </span>
            <p className="text-gray-800 group-hover:text-[#1078b9] font-medium line-clamp-1">
              {prevPost.title}
            </p>
          </div>
        ) : <div />}

        {nextPost && (
          <div
            onClick={() => onSelectPost(nextPost)}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#1078b9] transition cursor-pointer group space-y-1 text-right shadow-xs"
          >
            <span className="text-gray-400 flex items-center justify-end gap-1 group-hover:text-[#1078b9]">
              다음 질문 & 칼럼
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
            <p className="text-gray-800 group-hover:text-[#1078b9] font-medium line-clamp-1">
              {nextPost.title}
            </p>
          </div>
        )}
      </div>

      {/* 8. Related Posts in same category */}
      {relatedPosts.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-xs no-print">
          <h3 className="text-sm font-bold text-gray-900 mb-3 font-heading">
            &apos;{meta.name}&apos; 분야의 다른 실무 지식
          </h3>
          <ul className="divide-y divide-gray-100 text-xs">
            {relatedPosts.map(rel => (
              <li
                key={rel.id}
                onClick={() => onSelectPost(rel)}
                className="py-2.5 flex items-center justify-between group cursor-pointer hover:bg-blue-50/50 px-2 rounded-lg transition"
              >
                <span className="text-gray-800 group-hover:text-[#1078b9] group-hover:underline line-clamp-1 font-medium">
                  {rel.title}
                </span>
                <span className="text-gray-400 shrink-0 ml-4 font-num">
                  {rel.date.split(' ')[0]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export { BlogPostView as GuideReader };
