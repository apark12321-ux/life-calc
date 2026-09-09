import React, { useState, useEffect, useCallback } from 'react';
import { CategoryType, PostItem } from './types';
import { ALL_BLOG_POSTS } from './data/postsData';
import BlogHeader from './components/BlogHeader';
import BlogSidebar from './components/BlogSidebar';
import BlogHome from './components/BlogHome';
import BlogPostView from './components/BlogPostView';
import CalculatorsHub from './components/CalculatorsHub';
import AboutApp from './components/AboutApp';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import SitemapView from './components/SitemapView';
import AutoPostDashboardModal from './components/AutoPostDashboardModal';
import AdSenseAuditModal from './components/AdSenseAuditModal';
import { ShieldCheck, ChevronUp, BookOpen, Calculator, Sparkles, Shield, Cookie, Check } from 'lucide-react';

export default function App() {
  const [posts, setPosts] = useState<PostItem[]>(ALL_BLOG_POSTS);
  const [currentCategory, setCurrentCategory] = useState<CategoryType>('all');
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCalculatorSubId, setActiveCalculatorSubId] = useState<string>('wage_salary');
  const [showCookieBanner, setShowCookieBanner] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [isAutoPostModalOpen, setIsAutoPostModalOpen] = useState<boolean>(false);
  const [isAdSenseAuditModalOpen, setIsAdSenseAuditModalOpen] = useState<boolean>(false);

  // Fetch posts from backend (incorporating scheduled & auto-generated posts)
  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/posts');
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setPosts(json.data);
      }
    } catch (e) {
      console.warn('Using local posts fallback:', e);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 30000);
    return () => clearInterval(interval);
  }, [fetchPosts]);

  // Sync state from current URL
  const syncStateFromUrl = useCallback(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const postId = params.get('p') || params.get('post');
      const cat = params.get('cat') || params.get('c') || params.get('category');
      const calcId = params.get('calc') || params.get('s');
      const adminCode = params.get('admin');

      // Secret admin access (not exposed to public visitors)
      if (adminCode === 'autopost' || adminCode === 'manage') {
        setIsAutoPostModalOpen(true);
      } else if (adminCode === 'audit') {
        setIsAdSenseAuditModalOpen(true);
      }

      if (postId) {
        const found = posts.find(p => p.id === postId) || ALL_BLOG_POSTS.find(p => p.id === postId);
        if (found) {
          setSelectedPost(found);
          setCurrentCategory(found.category);
          document.title = `${found.title} | 박과장의 생활경제 노트`;
          return;
        }
      }

      setSelectedPost(null);

      if (calcId) {
        setCurrentCategory('calculators');
        setActiveCalculatorSubId(calcId);
        document.title = `실전 금융 계산기 | 박과장의 생활경제 노트`;
      } else if (cat && ['work', 'property', 'finance', 'calculators', 'about', 'privacy', 'terms', 'sitemap'].includes(cat)) {
        setCurrentCategory(cat as CategoryType);
        const titles: Record<string, string> = {
          work: '직장·급여·퇴직 실전 칼럼 | 박과장의 생활경제 노트',
          property: '부동산·세금 실전 칼럼 | 박과장의 생활경제 노트',
          finance: '연금·금융·절세 실전 칼럼 | 박과장의 생활경제 노트',
          about: '블로그 소개 및 편집 원칙 | 박과장의 생활경제 노트',
          privacy: '개인정보처리방침 | 박과장의 생활경제 노트',
          terms: '이용약관 및 법적 고지 | 박과장의 생활경제 노트',
          sitemap: '전체 사이트맵 | 박과장의 생활경제 노트',
        };
        document.title = titles[cat] || '박과장의 생활경제 노트';
      } else {
        setCurrentCategory('all');
        document.title = '박과장의 생활경제 노트 | 2026 급여, 세금, 부동산, 연금 실전 가이드';
      }
    } catch (e) {
      console.warn('URL parsing failed:', e);
    }
  }, [posts]);

  // Initial load from URL
  useEffect(() => {
    syncStateFromUrl();
  }, [syncStateFromUrl]);

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      syncStateFromUrl();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [syncStateFromUrl]);

  // Admin secret shortcut: Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        setIsAdSenseAuditModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Track scroll position for "Back to top" button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cookie consent banner logic
  useEffect(() => {
    try {
      const consent = localStorage.getItem('park_money_cookie_consent');
      if (!consent) {
        const timer = setTimeout(() => {
          setShowCookieBanner(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn('Cookie consent check failed:', e);
    }
  }, []);

  const handleAcceptCookies = () => {
    try {
      localStorage.setItem('park_money_cookie_consent', 'all_granted');
      setShowCookieBanner(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeclineCookies = () => {
    try {
      localStorage.setItem('park_money_cookie_consent', 'all_denied');
      setShowCookieBanner(false);
    } catch (e) {
      console.error(e);
    }
  };

  // Category navigation handler with URL push
  const handleSelectCategory = (cat: CategoryType) => {
    setCurrentCategory(cat);
    setSelectedPost(null);
    setSearchQuery('');
    
    const newUrl = cat === 'all' ? window.location.pathname : `${window.location.pathname}?cat=${cat}`;
    window.history.pushState({ category: cat }, '', newUrl);

    const titles: Record<string, string> = {
      all: '박과장의 생활경제 노트 | 2026 급여, 세금, 부동산, 연금 실전 가이드',
      work: '직장·급여·퇴직 실전 칼럼 | 박과장의 생활경제 노트',
      property: '부동산·세금 실전 칼럼 | 박과장의 생활경제 노트',
      finance: '연금·금융·절세 실전 칼럼 | 박과장의 생활경제 노트',
      calculators: '실전 금융 계산기 | 박과장의 생활경제 노트',
      about: '블로그 소개 및 편집 원칙 | 박과장의 생활경제 노트',
      privacy: '개인정보처리방침 | 박과장의 생활경제 노트',
      terms: '이용약관 및 법적 고지 | 박과장의 생활경제 노트',
      sitemap: '전체 사이트맵 | 박과장의 생활경제 노트',
    };
    document.title = titles[cat] || '박과장의 생활경제 노트';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Post selection handler with URL push
  const handleSelectPost = (post: PostItem) => {
    setSelectedPost(post);
    setCurrentCategory(post.category);
    const newUrl = `${window.location.pathname}?p=${post.id}`;
    window.history.pushState({ postId: post.id }, '', newUrl);
    document.title = `${post.title} | 박과장의 생활경제 노트`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to calculator tool with URL push
  const handleNavigateToCalculator = (calcId: string) => {
    setCurrentCategory('calculators');
    setActiveCalculatorSubId(calcId);
    setSelectedPost(null);
    const newUrl = `${window.location.pathname}?calc=${calcId}`;
    window.history.pushState({ calcId }, '', newUrl);
    document.title = `실전 금융 계산기 | 박과장의 생활경제 노트`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-body text-gray-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      
      {/* 1. Top Header & Navigation - Classic Tistory / Naver Style */}
      <BlogHeader
        currentCategory={currentCategory}
        onSelectCategory={handleSelectCategory}
        onSearch={(q) => {
          setSearchQuery(q);
          if (selectedPost) setSelectedPost(null);
          if (currentCategory === 'calculators' || currentCategory === 'about' || currentCategory === 'privacy' || currentCategory === 'terms' || currentCategory === 'sitemap') {
            setCurrentCategory('all');
          }
        }}
        searchQuery={searchQuery}
        onOpenAutoPoster={() => setIsAutoPostModalOpen(true)}
      />

      {/* 2. Main Content Container (Classic Korean Blog 2-Column or Full Width) */}
      <div className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {currentCategory === 'calculators' ? (
          <CalculatorsHub
            initialTab={activeCalculatorSubId}
            onBackToBlog={() => handleSelectCategory('all')}
          />
        ) : currentCategory === 'privacy' ? (
          <div className="max-w-4xl mx-auto">
            <PrivacyPolicy onBack={() => handleSelectCategory('all')} />
          </div>
        ) : currentCategory === 'terms' ? (
          <div className="max-w-4xl mx-auto">
            <TermsOfService onBack={() => handleSelectCategory('all')} />
          </div>
        ) : currentCategory === 'sitemap' ? (
          <div className="max-w-5xl mx-auto">
            <SitemapView
              posts={posts}
              onSelectPost={handleSelectPost}
              onSelectCategory={handleSelectCategory}
              onNavigateToCalculator={handleNavigateToCalculator}
              onBack={() => handleSelectCategory('all')}
            />
          </div>
        ) : currentCategory === 'about' ? (
          <div className="max-w-4xl mx-auto">
            <AboutApp
              onSelectCategory={handleSelectCategory}
              onNavigateToCalculator={handleNavigateToCalculator}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Main Column (8 cols on lg) */}
            <main className="lg:col-span-8">
              {selectedPost ? (
                <BlogPostView
                  post={selectedPost}
                  onSelectPost={handleSelectPost}
                  onSelectCategory={handleSelectCategory}
                  onNavigateToCalculator={handleNavigateToCalculator}
                />
              ) : (
                <BlogHome
                  currentCategory={currentCategory}
                  onSelectCategory={handleSelectCategory}
                  onSelectPost={handleSelectPost}
                  searchQuery={searchQuery}
                  onClearSearch={() => setSearchQuery('')}
                  posts={posts}
                  onNavigateToCalculator={handleNavigateToCalculator}
                />
              )}
            </main>

            {/* Sidebar Column (4 cols on lg) */}
            <div className="lg:col-span-4 no-print">
              <BlogSidebar
                onSelectPost={handleSelectPost}
                onSelectCategory={handleSelectCategory}
                onNavigateToCalculator={handleNavigateToCalculator}
                activePost={selectedPost}
                posts={posts}
              />
            </div>

          </div>
        )}
      </div>

      {/* Auto-Posting System Modal (Admin Only) */}
      <AutoPostDashboardModal
        isOpen={isAutoPostModalOpen}
        onClose={() => setIsAutoPostModalOpen(false)}
        onSelectPost={handleSelectPost}
        onPostsUpdated={fetchPosts}
      />

      {/* AdSense Compliance Audit Modal (Admin Only, triggered via Ctrl+Shift+A or ?admin=audit) */}
      <AdSenseAuditModal
        isOpen={isAdSenseAuditModalOpen}
        onClose={() => setIsAdSenseAuditModalOpen(false)}
        posts={posts}
      />

      {/* 3. Classic Korean Blog Footer (Tistory / Naver Style) */}
      <footer className="bg-white border-t border-gray-200 mt-16 text-xs text-gray-500 font-body">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-6">
          
          {/* Footer Navigation Links */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 pb-4 border-b border-gray-100 font-medium">
            <button onClick={() => handleSelectCategory('all')} className="hover:text-gray-900 transition">홈</button>
            <span className="text-gray-300">|</span>
            <button onClick={() => handleSelectCategory('work')} className="hover:text-gray-900 transition">직장·급여</button>
            <span className="text-gray-300">|</span>
            <button onClick={() => handleSelectCategory('property')} className="hover:text-gray-900 transition">부동산·세금</button>
            <span className="text-gray-300">|</span>
            <button onClick={() => handleSelectCategory('finance')} className="hover:text-gray-900 transition">연금·금융</button>
            <span className="text-gray-300">|</span>
            <button onClick={() => handleSelectCategory('calculators')} className="hover:text-gray-900 transition">실무 계산기</button>
            <span className="text-gray-300">|</span>
            <button onClick={() => handleSelectCategory('about')} className="hover:text-gray-900 transition">블로그 소개</button>
            <span className="text-gray-300">|</span>
            <button onClick={() => handleSelectCategory('privacy')} className="hover:text-gray-900 transition font-bold text-gray-700">개인정보처리방침</button>
            <span className="text-gray-300">|</span>
            <button onClick={() => handleSelectCategory('terms')} className="hover:text-gray-900 transition">이용약관</button>
            <span className="text-gray-300">|</span>
            <button onClick={() => handleSelectCategory('sitemap')} className="hover:text-gray-900 transition">사이트맵</button>
          </div>

          {/* Blog Description & Legal Disclaimer */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs leading-relaxed text-gray-500">
            <div className="space-y-1">
              <p className="font-bold text-gray-800 text-sm font-heading">
                박과장의 생활경제 노트
              </p>
              <p className="text-[11px] text-gray-500">
                11년차 직장인이 전하는 2026년 급여·퇴직금, 4대보험, 부동산 취득세·복비, 연금·절세 실전 경험담과 간편 금융 계산기를 제공합니다.
              </p>
              <p className="text-[11px] text-gray-400">
                본 블로그에 수록된 모든 글과 계산기는 공공기관 고시 및 세법을 바탕으로 제작되었으며, 개별적인 법률·세무 자문을 대신할 수 없습니다.
              </p>
            </div>

            <div className="text-[11px] text-gray-400 text-left sm:text-right shrink-0">
              <p>Copyright &copy; 2026 박과장의 생활경제 노트. All rights reserved.</p>
              <p className="text-gray-400 mt-0.5">생활금융 정보 및 실무 가이드</p>
            </div>
          </div>

        </div>
      </footer>

      {/* 4. Back to Top Floating Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-full shadow-md transition cursor-pointer no-print"
          aria-label="맨 위로 이동"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      )}

      {/* 5. Cookie Consent Banner */}
      {showCookieBanner && (
        <aside
          aria-label="쿠키 이용 동의"
          className="fixed bottom-0 inset-x-0 z-50 bg-white text-gray-800 border-t border-gray-200 p-4 shadow-xl no-print"
        >
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 text-xs leading-relaxed">
              <Cookie className="w-5 h-5 text-gray-600 shrink-0 hidden sm:block" />
              <p className="text-gray-600">
                본 웹사이트는 사용자 경험 향상 및 콘텐츠 분석, 맞춤형 광고 게재(Google AdSense)를 위해 쿠키를 사용합니다.{' '}
                <button
                  type="button"
                  onClick={() => handleSelectCategory('privacy')}
                  className="text-blue-600 underline hover:text-blue-800 font-semibold cursor-pointer"
                >
                  개인정보처리방침
                </button>
              </p>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={handleDeclineCookies}
                className="px-3 py-1.5 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 text-xs font-medium transition cursor-pointer"
              >
                필수만 허용
              </button>
              <button
                type="button"
                onClick={handleAcceptCookies}
                className="px-3.5 py-1.5 rounded bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium transition cursor-pointer flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>모두 동의</span>
              </button>
            </div>
          </div>
        </aside>
      )}

    </div>
  );
}
