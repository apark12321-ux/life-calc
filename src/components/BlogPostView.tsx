import React, { useState } from 'react';
import { PostItem, CategoryType } from '../types';
import { ALL_BLOG_POSTS, CATEGORY_META } from '../data/postsData';
import { 
  Calendar, User, Share2, Printer, ChevronRight, ChevronLeft, 
  Sparkles, ShieldCheck, ArrowRight, ExternalLink, MessageSquare, Send, Check, Heart, Bookmark, BookOpen,
  List
} from 'lucide-react';
import TableOfContents from './TableOfContents';
import AdSenseMock from './AdSenseMock';

interface BlogPostViewProps {
  post: PostItem;
  onSelectPost: (post: PostItem) => void;
  onSelectCategory: (cat: CategoryType) => void;
  onNavigateToCalculator: (calcId: string) => void;
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
      content: '박과장님 글 보고 지난주에 인사팀에 상여금 3/12 산입 여부 문의드렸는데, 실제로 계산 착오가 확인되어 68만원 추가 정산받았습니다! 진짜 직장인들에게 꼭 필요한 정보입니다ㅠㅠ'
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
    .slice(0, 3);

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

  const meta = CATEGORY_META[post.category] || { name: '실전기록', icon: '📝', bg: 'bg-slate-100', color: 'text-slate-800', border: 'border-slate-200' };

  return (
    <article className="space-y-8 bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200 shadow-xs">
      
      {/* 1. Breadcrumbs Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium no-print">
        <button 
          onClick={() => onSelectCategory('all')}
          className="hover:text-indigo-600 transition"
        >
          전체 글
        </button>
        <span>&gt;</span>
        <button 
          onClick={() => onSelectCategory(post.category)}
          className="hover:text-indigo-600 transition font-semibold"
        >
          {meta.name}
        </button>
        <span>&gt;</span>
        <span className="text-slate-400 truncate max-w-[200px] sm:max-w-xs">{post.title}</span>
      </nav>

      {/* 2. Post Header */}
      <header className="space-y-4 border-b border-slate-100 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onSelectCategory(post.category)}
            className={`font-display text-xs font-extrabold px-3 py-1 rounded-full border ${meta.bg} ${meta.color} ${meta.border} flex items-center gap-1.5 cursor-pointer`}
          >
            <span>{meta.icon}</span>
            <span>{meta.name}</span>
          </button>

          {/* Social Action Rail */}
          <div className="flex items-center space-x-2 no-print">
            <button
              type="button"
              onClick={handleToggleLike}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                liked 
                  ? 'bg-rose-50 border-rose-200 text-rose-600' 
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{liked ? '추천됨' : '추천'}</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{copied ? '링크 복사됨!' : '공유'}</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs transition cursor-pointer"
              title="인쇄하기"
            >
              <Printer className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 leading-tight tracking-tight">
          {post.title}
        </h1>

        <p className="font-body text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
          {post.summary}
        </p>

        {/* Author Meta Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 text-xs text-slate-600">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-sm border border-indigo-200">
              👨‍💼
            </div>
            <div>
              <span className="font-bold text-slate-950">{post.author}</span>
              <span className="text-slate-500 ml-1.5 font-normal">({post.authorRole || '블로그 운영자'})</span>
            </div>
          </div>

          <div className="flex items-center text-slate-500 text-xs font-medium">
            <span className="flex items-center gap-1 text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {post.date}
            </span>
          </div>
        </div>
      </header>

      {/* 3. Author's Personal Note Callout */}
      {post.authorNote && (
        <div className="bg-amber-50/90 border-l-4 border-amber-500 p-4 sm:p-5 rounded-r-2xl text-amber-950 space-y-1.5 shadow-2xs">
          <p className="font-heading text-xs font-black text-amber-950 flex items-center gap-1.5 uppercase tracking-wider">
            <span>💡</span>
            <span>참고 사항</span>
          </p>
          <p className="font-body text-xs sm:text-sm leading-relaxed text-amber-950 font-medium">
            {post.authorNote}
          </p>
        </div>
      )}

      {/* 4. Highlights Metrics Box */}
      {post.highlights && post.highlights.length > 0 && (
        <div className="bg-slate-50/90 rounded-2xl p-5 border border-slate-200 space-y-3">
          <p className="font-heading text-xs sm:text-sm font-black text-slate-950 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            핵심 요약
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {post.highlights.map((h, i) => (
              <div key={i} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-600 font-medium block mb-1">{h.label}</span>
                <span className="font-heading font-black text-xs sm:text-sm text-indigo-950 font-num">{h.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Banner AdSlot */}
      <AdSenseMock slotId="1001-post-top" type="banner" className="no-print" />

      {/* 4.1 Mobile Table of Contents */}
      <div className="lg:hidden">
        <TableOfContents content={post.content} variant="inline" title="글 목차" />
      </div>

      {/* 5. Main Post Markdown-styled Rich Content */}
      <div className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-5 font-body">
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
                  className="scroll-mt-24 font-heading text-xl sm:text-2xl font-black text-slate-950 mt-8 mb-3 border-b border-slate-100 pb-2.5 flex items-center gap-2 group"
                >
                  <span className="text-indigo-600 text-base select-none opacity-60 group-hover:opacity-100 transition-opacity">#</span>
                  <span>{text}</span>
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
                  className="scroll-mt-24 font-heading text-base sm:text-lg font-black text-slate-900 mt-6 mb-2 flex items-center gap-2 group"
                >
                  <span className="text-indigo-400 text-sm select-none opacity-50 group-hover:opacity-100 transition-opacity">##</span>
                  <span>{text}</span>
                </h3>
              );
            }
            if (paragraph.startsWith('#### ')) {
              const text = paragraph.replace('#### ', '');
              return (
                <h4 key={idx} className="font-heading text-sm sm:text-base font-bold text-indigo-950 mt-4 mb-1">
                  {text}
                </h4>
              );
            }
            if (paragraph.startsWith('> ')) {
              return (
                <blockquote key={idx} className="bg-slate-50 border-l-4 border-indigo-500 p-4 rounded-r-xl text-slate-700 text-xs sm:text-sm my-4 font-medium italic">
                  {paragraph.replace('> ', '')}
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
                  <div key={idx} className="overflow-x-auto my-4 rounded-2xl border border-slate-200 shadow-2xs">
                    <table className="w-full text-xs sm:text-sm text-left">
                      <thead className="bg-slate-900 text-white font-heading font-black text-xs">
                        <tr>
                          {headerRow.map((h, hi) => (
                            <th key={hi} className="px-4 py-3 border-r border-slate-700 last:border-r-0">
                              {h.replace(/\*\*/g, '')}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {dataRows.map((row, ri) => (
                          <tr key={ri} className={ri % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/70 hover:bg-slate-100/70'}>
                            {row.map((cell, ci) => (
                              <td key={ci} className="px-4 py-3 border-r border-slate-100 last:border-r-0 text-slate-800">
                                {cell.includes('**') ? <strong>{cell.replace(/\*\*/g, '')}</strong> : cell}
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
                <ul key={idx} className="list-disc pl-5 space-y-1.5 text-slate-700 text-xs sm:text-sm">
                  {paragraph.split('\n').map((item, itemIdx) => (
                    <li key={itemIdx} className="leading-relaxed">
                      {item.replace(/^- /, '')}
                    </li>
                  ))}
                </ul>
              );
            }
            if (paragraph.match(/^\d+\. /)) {
              return (
                <ol key={idx} className="list-decimal pl-5 space-y-1.5 text-slate-700 text-xs sm:text-sm">
                  {paragraph.split('\n').map((item, itemIdx) => (
                    <li key={itemIdx} className="leading-relaxed">
                      {item.replace(/^\d+\. /, '')}
                    </li>
                  ))}
                </ol>
              );
            }
            return (
              <p key={idx} className="text-slate-700 text-xs sm:text-sm sm:leading-relaxed leading-normal whitespace-pre-line">
                {paragraph}
              </p>
            );
          });
        })()}
      </div>

      {/* 6. Statutory / Administrative Legal Basis */}
      {post.legalBasis && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900">⚖️ 실무 법령 및 근거 조항:</span>{' '}
            <span className="text-slate-700">{post.legalBasis}</span>
          </div>
        </div>
      )}

      {/* 7. Calculator Link CTA */}
      {post.relatedCalculatorId && (
        <div className="bg-gradient-to-r from-indigo-50/80 via-blue-50/80 to-indigo-50/80 border border-indigo-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="space-y-1">
            <p className="font-heading text-sm sm:text-base font-black text-slate-950">
              🧮 내 조건에 맞게 직접 계산해보기
            </p>
            <p className="font-body text-xs text-slate-700">
              박과장이 직접 제작한 [{post.relatedCalculatorName}]로 내 급여·세금·이자 예상치를 1초 만에 확인해보세요.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (post.relatedCalculatorId) {
                onNavigateToCalculator(post.relatedCalculatorId);
              }
            }}
            className="font-display px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer shadow-xs shrink-0"
          >
            <span>모의계산기 열기</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 8. Tags */}
      <div className="flex flex-wrap gap-1.5 pt-2">
        {post.tags.map((tag, idx) => (
          <span key={idx} className="font-body text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-lg transition font-semibold">
            #{tag}
          </span>
        ))}
      </div>

      {/* Bottom Inline AdSlot */}
      <AdSenseMock slotId="1002-post-bottom" type="inline" className="no-print" />

      {/* 9. Author Persona Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-2xl shadow-2xs shrink-0 border border-indigo-100">
          👨‍💼
        </div>
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h4 className="font-heading font-black text-slate-950 text-sm sm:text-base">{post.author}</h4>
            <span className="text-xs text-indigo-700 bg-indigo-50 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-100">
              {post.authorRole || '데이터 기획자 & 블로거'}
            </span>
          </div>
          <p className="font-body text-xs sm:text-sm text-slate-700 leading-relaxed">
            11년 동안 회사 생활, 이직, 내 집 마련을 거치며 직접 겪고 엑셀로 검증한 실전 경제 지식을 공유합니다.
          </p>
          <p className="text-xs text-slate-500 pt-0.5 font-medium">
            독자 피드백 & 칼럼 제안: <span className="font-mono text-slate-700 font-semibold">contact@park-money.kr</span>
          </p>
        </div>
      </div>

      {/* 10. Previous / Next Post Navigation Rail */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 no-print">
        {prevPost ? (
          <div
            onClick={() => onSelectPost(prevPost)}
            className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition cursor-pointer group space-y-1"
          >
            <span className="text-[11px] text-slate-500 font-bold flex items-center gap-1 group-hover:text-indigo-600">
              <ChevronLeft className="w-3.5 h-3.5" />
              이전 칼럼
            </span>
            <p className="font-heading text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600">
              {prevPost.title}
            </p>
          </div>
        ) : <div />}

        {nextPost && (
          <div
            onClick={() => onSelectPost(nextPost)}
            className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition cursor-pointer group space-y-1 text-right"
          >
            <span className="text-[11px] text-slate-500 font-bold flex items-center justify-end gap-1 group-hover:text-indigo-600">
              다음 칼럼
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
            <p className="font-heading text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600">
              {nextPost.title}
            </p>
          </div>
        )}
      </div>

      {/* 11. Related Articles Grid */}
      {relatedPosts.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-100 no-print">
          <h3 className="font-heading text-base font-black text-slate-950 flex items-center gap-2">
            <span>📚</span>
            <span>박과장의 추천 관련 칼럼</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedPosts.map(rel => (
              <div
                key={rel.id}
                onClick={() => onSelectPost(rel)}
                className="p-4 rounded-2xl border border-slate-200 hover:shadow-md hover:border-indigo-300 transition cursor-pointer flex flex-col justify-between group space-y-2"
              >
                <div>
                  <span className="text-[10px] text-slate-500 font-medium">{rel.date}</span>
                  <h4 className="font-heading text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 line-clamp-2 leading-snug mt-1">
                    {rel.title}
                  </h4>
                </div>
                <span className="text-[11px] text-indigo-600 font-bold flex items-center gap-0.5">
                  <span>칼럼 읽기</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 12. Interactive Comments Section */}
      <div className="space-y-6 pt-6 border-t border-slate-100 no-print">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-base sm:text-lg font-black text-slate-950 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <span>독자 소통 및 질문 ({comments.length})</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">경험이나 궁금한 점을 편하게 남겨주세요</span>
        </div>

        {/* Comment Input Form */}
        <form onSubmit={handleAddComment} className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              value={newCommentName}
              onChange={(e) => setNewCommentName(e.target.value)}
              placeholder="작성자 닉네임 (예: 신입사원박군)"
              className="bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-xl p-2.5 border border-slate-200 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
          <textarea
            required
            rows={3}
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="궁금한 점이나 의견을 편하게 남겨주세요..."
            className="w-full bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-xl p-3 border border-slate-200 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
          <div className="flex items-center justify-between">
            {commentSubmitted && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" />
                댓글이 성공적으로 등록되었습니다!
              </span>
            )}
            <div className="ml-auto">
              <button
                type="submit"
                className="font-display px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>댓글 등록</span>
              </button>
            </div>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-slate-50/60 rounded-2xl p-4 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">{comment.author}</span>
                <span className="text-slate-400">{comment.date}</span>
              </div>
              <p className="font-body text-xs sm:text-sm text-slate-700 leading-relaxed">
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
