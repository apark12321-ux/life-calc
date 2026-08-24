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
import AutoPostDashboardModal from './components/AutoPostDashboardModal';
import { ShieldCheck, Mail, Heart, Check, X, Shield, Cookie, ChevronUp, BookOpen, Calculator, Sparkles, Bot } from 'lucide-react';

export default function App() {
  const [posts, setPosts] = useState<PostItem[]>(ALL_BLOG_POSTS);
  const [currentCategory, setCurrentCategory] = useState<CategoryType>('all');
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCalculatorSubId, setActiveCalculatorSubId] = useState<string>('wage_salary');
  const [showCookieBanner, setShowCookieBanner] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [isAutoPostModalOpen, setIsAutoPostModalOpen] = useState<boolean>(false);

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
    // Poll posts every 20 seconds to catch newly scheduled auto-posts
    const interval = setInterval(fetchPosts, 20000);
    return () => clearInterval(interval);
  }, [fetchPosts]);

  // Parse deep link parameters on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const postId = params.get('post');
      const cat = params.get('cat') || params.get('c') || params.get('category');
      const calcId = params.get('calc') || params.get('s');
      const openScheduler = params.get('autopost') || params.get('admin');

      if (openScheduler) {
        setIsAutoPostModalOpen(true);
      }

      if (postId) {
        const found = posts.find(p => p.id === postId) || ALL_BLOG_POSTS.find(p => p.id === postId);
        if (found) {
          setSelectedPost(found);
          setCurrentCategory(found.category);
        }
      } else if (calcId) {
        setCurrentCategory('calculators');
        setActiveCalculatorSubId(calcId);
      } else if (cat && ['work', 'property', 'finance', 'calculators', 'about', 'privacy', 'terms'].includes(cat)) {
        setCurrentCategory(cat as CategoryType);
      }
    } catch (e) {
      console.warn('URL parsing failed:', e);
    }
  }, [posts]);

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
        }, 1200);
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

  // Category navigation handler
  const handleSelectCategory = (cat: CategoryType) => {
    setCurrentCategory(cat);
    setSelectedPost(null);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Post selection handler
  const handleSelectPost = (post: PostItem) => {
    setSelectedPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to calculator tool
  const handleNavigateToCalculator = (calcId: string) => {
    setCurrentCategory('calculators');
    setActiveCalculatorSubId(calcId);
    setSelectedPost(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-body text-slate-800 antialiased selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* 1. Top Header & Navigation */}
      <BlogHeader
        currentCategory={currentCategory}
        onSelectCategory={handleSelectCategory}
        onSearch={(q) => {
          setSearchQuery(q);
          if (selectedPost) setSelectedPost(null);
          if (currentCategory === 'calculators' || currentCategory === 'about' || currentCategory === 'privacy' || currentCategory === 'terms') {
            setCurrentCategory('all');
          }
        }}
        searchQuery={searchQuery}
        onOpenAutoPoster={() => setIsAutoPostModalOpen(true)}
      />

      {/* 2. Main Content Container (2-Column Blog Layout) */}
      <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dynamic layout: If calculators or full-width page, render full width; otherwise, classic 2-column blog layout */}
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
            <main className="lg:col-span-8 space-y-8">
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
                  onOpenAutoPoster={() => setIsAutoPostModalOpen(true)}
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
                onOpenAutoPoster={() => setIsAutoPostModalOpen(true)}
              />
            </div>

          </div>
        )}
      </div>

      {/* Auto-Posting System Modal */}
      <AutoPostDashboardModal
        isOpen={isAutoPostModalOpen}
        onClose={() => setIsAutoPostModalOpen(false)}
        onSelectPost={handleSelectPost}
        onPostsUpdated={fetchPosts}
      />

      {/* 3. Footer */}
      <footer className="bg-slate-950 text-slate-400 mt-16 border-t border-slate-800 text-xs leading-relaxed font-body">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
            
            {/* Col 1: Brand & Bio */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-slate-800 text-white font-bold flex items-center justify-center text-base">
                  👨‍💼
                </div>
                <span className="font-heading text-lg font-black text-white">
                  박과장의 돈 지키는 실전 노트
                </span>
              </div>
              <p className="text-slate-400 text-xs max-w-md leading-relaxed">
                11년차 직장인 박과장이 직접 겪은 퇴직금 누락, 첫 집 매수 취득세 감면, 건보료 피부양자 방어 등 100% 팩트 기반 실전 기록 및 모의 계산기입니다.
              </p>
              <p className="text-slate-500 text-[11px]">
                공식 이메일: <span className="font-mono text-slate-300">contact@park-money.kr</span>
              </p>
            </div>

            {/* Col 2: 3 Category Quick Links */}
            <div className="space-y-2">
              <h4 className="font-heading text-xs font-black text-slate-200 uppercase tracking-wider">
                3대 실전 카테고리
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>
                  <button onClick={() => handleSelectCategory('work')} className="hover:text-indigo-400 transition cursor-pointer">
                    💼 직장·월급·퇴직
                  </button>
                </li>
                <li>
                  <button onClick={() => handleSelectCategory('property')} className="hover:text-indigo-400 transition cursor-pointer">
                    🏠 내집·부동산·세금
                  </button>
                </li>
                <li>
                  <button onClick={() => handleSelectCategory('finance')} className="hover:text-indigo-400 transition cursor-pointer">
                    🛡️ 연금·보험·재테크
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Policy & Calculators */}
            <div className="space-y-2">
              <h4 className="font-heading text-xs font-black text-slate-200 uppercase tracking-wider">
                실전 도구 및 안내
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>
                  <button onClick={() => handleSelectCategory('about')} className="hover:text-indigo-400 transition cursor-pointer">
                    👨‍💼 박과장 소개
                  </button>
                </li>
                <li>
                  <button onClick={() => handleSelectCategory('calculators')} className="hover:text-indigo-400 transition cursor-pointer">
                    🧮 실생활 모의 계산기
                  </button>
                </li>
                <li>
                  <button onClick={() => handleSelectCategory('privacy')} className="hover:text-indigo-400 transition cursor-pointer">
                    🔒 개인정보처리방침
                  </button>
                </li>
                <li>
                  <button onClick={() => handleSelectCategory('terms')} className="hover:text-indigo-400 transition cursor-pointer">
                    📄 이용약관 및 면책조항
                  </button>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright & Disclaimer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>
              &copy; 2026 박과장의 돈 지키는 실전 노트. All rights reserved. 본 웹사이트의 모든 글은 개인 경험과 공식 법령을 바탕으로 작성되었으며, 개별 소송이나 세무 신고 시 법적 대리를 대신하지 않습니다.
            </p>
            <div className="flex items-center space-x-3 text-slate-400">
              <button onClick={() => handleSelectCategory('privacy')} className="hover:underline cursor-pointer">개인정보처리방침</button>
              <span>·</span>
              <button onClick={() => handleSelectCategory('terms')} className="hover:underline cursor-pointer">이용약관</button>
            </div>
          </div>

        </div>
      </footer>

      {/* 4. Scroll To Top Floating Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-slate-900/90 hover:bg-indigo-600 text-white rounded-2xl shadow-lg transition-all duration-200 z-30 cursor-pointer backdrop-blur-xs no-print"
          title="맨 위로 이동"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* 5. Non-intrusive Cookie Consent Banner */}
      {showCookieBanner && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom duration-300 no-print space-y-3">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shrink-0 mt-0.5">
              <Cookie className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-heading text-xs sm:text-sm font-black text-slate-900">
                쿠키 및 브라우저 저장 안내
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                본 블로그는 원활한 서비스 제공 및 최적화된 칼럼 조회를 위해 최소한의 브라우저 로컬 저장소를 사용합니다.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={handleDeclineCookies}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              거부
            </button>
            <button
              type="button"
              onClick={handleAcceptCookies}
              className="px-4 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              동의 및 계속
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
