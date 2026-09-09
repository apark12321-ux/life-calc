import React, { useState, useEffect } from 'react';
import { PostItem, CategoryType } from '../types';
import { ALL_BLOG_POSTS, CATEGORY_META } from '../data/postsData';
import { 
  Calendar, User, Share2, Printer, ChevronRight, ChevronLeft, 
  ShieldCheck, MessageSquare, Send, Check, Heart, ExternalLink, Bookmark
} from 'lucide-react';
import TableOfContents from './TableOfContents';
import AdSenseMock from './AdSenseMock';

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
        <code key={index} className="bg-gray-100 text-blue-700 px-1.5 py-0.5 rounded text-xs font-mono">
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
  const [liked, setLiked] = useState(false);
  
  // Realistic reader discussions with author replies
  const [comments, setComments] = useState([
    {
      id: 'default-1',
      author: '7년차이직러김대리',
      date: post.date,
      content: '박과장님 글 보고 지난주에 인사팀에 상여금 3/12 산입 여부 재확인 요청드렸는데, 실제로 계산 착오가 확인되어 68만원 추가 정산받았습니다! 진짜 직장인들에게 꼭 필요한 정보입니다ㅠㅠ'
    },
    {
      id: 'default-2',
      author: '박과장 (작성자)',
      date: post.date,
      content: '김대리님, 소중한 권리 찾으셔서 정말 다행입니다! 인사팀도 악의가 있어서가 아니라 기본 세팅 산식 때문에 누락되는 경우가 많거든요. 이직하시는 새 회사에서도 승승장구하시길 응원합니다.'
    }
  ]);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);

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
    setLiked(prev => !prev);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;

    const newComment = {
      id: `user-${Date.now()}`,
      author: newCommentName.trim(),
      date: new Date().toISOString().split('T')[0],
      content: newCommentText.trim()
    };

    setComments(prev => [newComment, ...prev]);
    setNewCommentName('');
    setNewCommentText('');
    setCommentSubmitted(true);
    setTimeout(() => setCommentSubmitted(false), 3000);
  };

  const meta = CATEGORY_META[post.category] || { name: '실전 칼럼' };

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
      'name': '박과장의 생활경제 노트',
      'url': 'https://www.life-calc.kr'
    }
  };

  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${post.title} | 박과장의 생활경제 노트`;
    return () => {
      document.title = prevTitle;
    };
  }, [post]);

  return (
    <article className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 md:p-10 space-y-6">
      {/* 0. Embedded JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      {/* 1. Breadcrumbs Navigation - Classic Tistory Style */}
      <nav className="flex items-center space-x-2 text-xs text-gray-500 font-medium no-print">
        <button 
          onClick={() => onSelectCategory('all')}
          className="hover:text-blue-600 transition"
        >
          홈
        </button>
        <span>&gt;</span>
        <button 
          onClick={() => onSelectCategory(post.category)}
          className="hover:text-blue-600 transition font-semibold"
        >
          {meta.name}
        </button>
      </nav>

      {/* 2. Post Header */}
      <header className="space-y-3 pb-6 border-b border-gray-200">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-blue-600">
            {meta.name}
          </span>
          <div className="flex items-center gap-2 text-xs text-gray-500 no-print">
            <button
              type="button"
              onClick={handleToggleLike}
              className={`px-2.5 py-1 rounded border text-xs transition flex items-center gap-1 ${
                liked ? 'bg-red-50 border-red-200 text-red-600 font-bold' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
              <span>{liked ? '공감 1' : '공감'}</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="px-2.5 py-1 rounded border border-gray-200 hover:bg-gray-50 text-xs transition flex items-center gap-1"
            >
              <Share2 className="w-3.5 h-3.5 text-gray-500" />
              <span>{copied ? '복사됨!' : '공유'}</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="p-1 rounded border border-gray-200 hover:bg-gray-50 text-xs transition"
              title="인쇄하기"
            >
              <Printer className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug tracking-tight font-heading">
          {post.title}
        </h1>

        {/* Post Meta */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 pt-1 font-body">
          <span className="text-gray-700 font-medium">{post.author || '박과장'}</span>
          <span>·</span>
          <span>{post.date}</span>
          {post.viewCount && (
            <>
              <span>·</span>
              <span>조회 {post.viewCount.toLocaleString()}</span>
            </>
          )}
          <span>·</span>
          <span>댓글 {comments.length}</span>
        </div>
      </header>

      {/* Top Banner AdSlot - Standard Clean Google AdSense Unit */}
      <AdSenseMock slotId="1001-post-top" type="banner" className="no-print my-4" />

      {/* Author Note Callout */}
      {post.authorNote && (
        <div className="bg-blue-50/70 border-l-4 border-blue-600 p-4 rounded-r text-gray-800 text-xs sm:text-sm leading-relaxed">
          <p className="font-bold text-blue-900 mb-1">💡 박과장의 핵심 메모</p>
          <p>{post.authorNote}</p>
        </div>
      )}

      {/* Table of Contents - Clean Tistory Box */}
      <div className="bg-gray-50 border border-gray-200 rounded p-4">
        <TableOfContents content={post.content} variant="inline" title="목차" />
      </div>

      {/* Main Post Content */}
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
                  className="scroll-mt-24 text-xl sm:text-2xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-200 font-heading"
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
                <blockquote key={idx} className="bg-gray-50 border-l-4 border-gray-400 p-4 text-gray-700 text-sm my-4 italic">
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
                  <div key={idx} className="overflow-x-auto my-5 border border-gray-200 rounded">
                    <table className="w-full text-xs sm:text-sm text-left">
                      <thead className="bg-gray-100 text-gray-800 font-bold">
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
                          <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
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

      {/* Statutory Legal Basis */}
      {post.legalBasis && (
        <div className="bg-gray-50 border border-gray-200 rounded p-4 text-xs text-gray-700 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-gray-900">관련 법령 및 행정 고시:</span>{' '}
            <span>{post.legalBasis}</span>
          </div>
        </div>
      )}

      {/* Calculator Link CTA */}
      {post.relatedCalculatorId && (
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm sm:text-base font-bold text-gray-900">
              📊 관련 실무 계산기: {post.relatedCalculatorName}
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              2026년 공식을 적용한 무료 모의계산기로 내 조건에 맞게 직접 계산해보세요.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (post.relatedCalculatorId) {
                onNavigateToCalculator(post.relatedCalculatorId);
              }
            }}
            className="px-4 py-2 bg-gray-900 hover:bg-blue-600 text-white rounded text-xs font-bold transition shrink-0"
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
            <span key={idx} className="text-xs text-gray-600 bg-gray-50 hover:bg-gray-100 px-2.5 py-1 rounded border border-gray-200 transition">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom AdSlot - Official Google AdSense Unit */}
      <AdSenseMock slotId="1002-post-bottom" type="inline" className="no-print my-6" />

      {/* Author Card - Classic Korean Blog Style */}
      <div className="bg-gray-50 border border-gray-200 rounded p-5 flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-base font-heading shrink-0">
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

      {/* Previous / Next Post Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-gray-200 text-xs no-print">
        {prevPost ? (
          <div
            onClick={() => onSelectPost(prevPost)}
            className="p-3 border border-gray-200 rounded hover:bg-gray-50 transition cursor-pointer group space-y-1"
          >
            <span className="text-gray-400 flex items-center gap-1 group-hover:text-blue-600">
              <ChevronLeft className="w-3.5 h-3.5" />
              이전글
            </span>
            <p className="text-gray-800 group-hover:text-blue-600 font-medium line-clamp-1">
              {prevPost.title}
            </p>
          </div>
        ) : <div />}

        {nextPost && (
          <div
            onClick={() => onSelectPost(nextPost)}
            className="p-3 border border-gray-200 rounded hover:bg-gray-50 transition cursor-pointer group space-y-1 text-right"
          >
            <span className="text-gray-400 flex items-center justify-end gap-1 group-hover:text-blue-600">
              다음글
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
            <p className="text-gray-800 group-hover:text-blue-600 font-medium line-clamp-1">
              {nextPost.title}
            </p>
          </div>
        )}
      </div>

      {/* Related Posts in same category */}
      {relatedPosts.length > 0 && (
        <div className="pt-6 border-t border-gray-200 no-print">
          <h3 className="text-sm font-bold text-gray-900 mb-3 font-heading">
            &apos;{meta.name}&apos; 카테고리의 다른 글
          </h3>
          <ul className="divide-y divide-gray-100 text-xs">
            {relatedPosts.map(rel => (
              <li
                key={rel.id}
                onClick={() => onSelectPost(rel)}
                className="py-2.5 flex items-center justify-between group cursor-pointer hover:bg-gray-50 px-2 rounded"
              >
                <span className="text-gray-800 group-hover:text-blue-600 group-hover:underline line-clamp-1 font-medium">
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

      {/* Reader Comments Section */}
      <div className="space-y-4 pt-6 border-t border-gray-200 no-print">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5 font-heading">
          <MessageSquare className="w-4 h-4 text-gray-700" />
          <span>댓글 ({comments.length})</span>
        </h3>

        {/* Comment Form */}
        <form onSubmit={handleAddComment} className="bg-gray-50 border border-gray-200 rounded p-4 space-y-3">
          <div className="w-full sm:w-48">
            <input
              type="text"
              required
              value={newCommentName}
              onChange={(e) => setNewCommentName(e.target.value)}
              placeholder="작성자 닉네임"
              className="w-full bg-white text-gray-800 text-xs rounded p-2 border border-gray-300 focus:outline-none focus:border-gray-500"
            />
          </div>
          <textarea
            required
            rows={3}
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="궁금한 점이나 의견을 남겨주세요..."
            className="w-full bg-white text-gray-800 text-xs rounded p-2.5 border border-gray-300 focus:outline-none focus:border-gray-500"
          />
          <div className="flex items-center justify-between">
            {commentSubmitted && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" />
                댓글이 등록되었습니다.
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-4 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded text-xs font-medium transition cursor-pointer"
            >
              댓글 등록
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="p-3.5 bg-gray-50 rounded border border-gray-100 space-y-1.5 text-xs">
              <div className="flex items-center justify-between font-medium">
                <span className="text-gray-900 font-bold">{comment.author}</span>
                <span className="text-gray-400 text-[11px]">{comment.date}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export { BlogPostView as GuideReader };
