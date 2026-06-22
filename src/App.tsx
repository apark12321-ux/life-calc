import React, { useEffect, useState } from 'react';
import { CategoryType } from './types';
import Navigation from './components/Navigation';
import UniversalCalculatorHub from './components/UniversalCalculatorHub';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import AboutApp from './components/AboutApp';
import ContactPage from './components/ContactPage';
import { calculatorCatalog, categoryKeys } from './components/qualityCalculators';

type PageType = 'calculator' | 'about' | 'contact' | 'privacy' | 'terms';

type RouteState = {
  page: PageType;
  category: CategoryType;
  calculatorId?: string;
};

const pagePaths: Record<Exclude<PageType, 'calculator'>, string> = {
  about: '/about',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
};

const pageTitles: Record<Exclude<PageType, 'calculator'>, string> = {
  about: '서비스 소개 | 생활계산기 천국',
  contact: '문의하기 | 생활계산기 천국',
  privacy: '개인정보처리방침 | 생활계산기 천국',
  terms: '이용약관 | 생활계산기 천국',
};

const pageDescriptions: Record<Exclude<PageType, 'calculator'>, string> = {
  about: '생활계산기 천국은 급여, 금융, 부동산, 생활비 등 일상에서 필요한 계산을 쉽게 확인할 수 있도록 정리한 계산기 서비스입니다.',
  contact: '생활계산기 천국 이용 중 발견한 오류나 문의 사항을 보낼 수 있는 안내 페이지입니다.',
  privacy: '생활계산기 천국의 개인정보 처리 기준과 쿠키 사용 안내를 확인할 수 있습니다.',
  terms: '생활계산기 천국의 서비스 이용 기준과 계산 결과 이용 시 주의사항을 안내합니다.',
};

const isCategory = (value: string): value is Exclude<CategoryType, 'policy'> => categoryKeys.includes(value as any);
const findCalculator = (id?: string) => calculatorCatalog.find((item) => item.id === id);

const setMetaTag = (selector: string, attr: string, value: string) => {
  let element = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (!element) {
    element = selector.startsWith('link') ? document.createElement('link') : document.createElement('meta');
    if (selector.includes('description')) element.setAttribute('name', 'description');
    if (selector.includes('og:title')) element.setAttribute('property', 'og:title');
    if (selector.includes('og:description')) element.setAttribute('property', 'og:description');
    if (selector.includes('og:url')) element.setAttribute('property', 'og:url');
    if (selector.startsWith('link')) element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute(attr, value);
};

function routeFromLocation(): RouteState {
  if (typeof window === 'undefined') return { page: 'calculator', category: 'insurance' };

  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const segments = path.split('/').filter(Boolean);

  if (segments[0] === 'calculators' && segments[1]) {
    const id = decodeURIComponent(segments[1]);
    const calculator = findCalculator(id);
    if (calculator) return { page: 'calculator', category: calculator.category, calculatorId: calculator.id };
  }

  if (segments[0] === 'category' && segments[1] && isCategory(segments[1])) {
    return { page: 'calculator', category: segments[1] };
  }

  if (path === '/about') return { page: 'about', category: 'policy' };
  if (path === '/contact') return { page: 'contact', category: 'policy' };
  if (path === '/privacy') return { page: 'privacy', category: 'policy' };
  if (path === '/terms') return { page: 'terms', category: 'policy' };

  const params = new URLSearchParams(window.location.search);
  const calcId = params.get('calc');
  const calculator = findCalculator(calcId || undefined);
  if (calculator) return { page: 'calculator', category: calculator.category, calculatorId: calculator.id };
  if (calcId === 'policy') return { page: 'about', category: 'policy' };

  return { page: 'calculator', category: 'insurance' };
}

export default function App() {
  const [route, setRoute] = useState<RouteState>(() => routeFromLocation());

  useEffect(() => {
    const onPopState = () => setRoute(routeFromLocation());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (route.page === 'calculator') return;
    const title = pageTitles[route.page];
    const description = pageDescriptions[route.page];
    const url = `https://life-calc.kr${pagePaths[route.page]}`;
    document.title = title;
    setMetaTag('meta[name="description"]', 'content', description);
    setMetaTag('meta[property="og:title"]', 'content', title);
    setMetaTag('meta[property="og:description"]', 'content', description);
    setMetaTag('meta[property="og:url"]', 'content', url);
    setMetaTag('link[rel="canonical"]', 'href', url);
  }, [route.page]);

  const pushRoute = (next: RouteState, path: string) => {
    setRoute(next);
    window.history.pushState(null, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (cat: CategoryType) => {
    if (cat === 'policy') {
      pushRoute({ page: 'about', category: 'policy' }, '/about');
      return;
    }
    pushRoute({ page: 'calculator', category: cat }, cat === 'insurance' ? '/' : `/category/${cat}`);
  };

  const handleNavigateToCalculator = (id: string) => {
    const calculator = findCalculator(id);
    if (!calculator) return;
    pushRoute({ page: 'calculator', category: calculator.category, calculatorId: calculator.id }, `/calculators/${calculator.id}`);
  };

  const handleOpenPage = (page: Exclude<PageType, 'calculator'>) => {
    pushRoute({ page, category: 'policy' }, pagePaths[page]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navigation currentCategory={route.page === 'calculator' ? route.category : 'policy'} onSelectCategory={handleSelectCategory} onOpenPage={handleOpenPage} />
      <main className="flex-grow max-w-7xl w-full mx-auto px-0 sm:px-6 lg:px-8 py-0 sm:py-6">
        {route.page === 'about' ? (
          <div className="px-3 py-4 sm:px-0 sm:py-0"><AboutApp onNavigateToCalculator={handleNavigateToCalculator} /></div>
        ) : route.page === 'contact' ? (
          <div className="px-3 py-4 sm:px-0 sm:py-0"><ContactPage /></div>
        ) : route.page === 'privacy' ? (
          <div className="px-3 py-4 sm:px-0 sm:py-0"><PrivacyPolicy /></div>
        ) : route.page === 'terms' ? (
          <div className="px-3 py-4 sm:px-0 sm:py-0"><TermsOfService /></div>
        ) : (
          <UniversalCalculatorHub category={route.category} subCalculatorId={route.calculatorId} onNavigateToCalculator={handleNavigateToCalculator} />
        )}
      </main>
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-8 sm:mt-12 font-sans">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p className="text-white font-bold text-sm tracking-tight">생활계산기 천국</p>
            <p className="text-[11px] text-slate-500 mt-1">생활에 필요한 계산을 쉽고 빠르게 확인할 수 있도록 정리합니다.</p>
          </div>
          <div className="flex flex-wrap gap-3 text-slate-300 font-bold">
            <button onClick={() => handleOpenPage('about')} className="hover:text-white transition">서비스 소개</button>
            <button onClick={() => handleOpenPage('contact')} className="hover:text-white transition">문의하기</button>
            <button onClick={() => handleOpenPage('privacy')} className="hover:text-white transition">개인정보처리방침</button>
            <button onClick={() => handleOpenPage('terms')} className="hover:text-white transition">이용약관</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
