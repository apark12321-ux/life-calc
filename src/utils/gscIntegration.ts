/**
 * Invisible Google Search Console (GSC) Auto-Integration System
 *
 * Runs completely in the background without any visible UI elements:
 * 1. Automatic Google Site Verification (meta tag persistence & dynamic resolution)
 * 2. Background Search Engine & GSC Sitemap Ping Dispatcher
 * 3. Dynamic Canonical URL & BreadcrumbList Schema Synchronization
 */

import { useEffect } from 'react';
import { CategoryType, PostItem } from '../types';
import { categoryPath } from './routes';

const DEFAULT_GSC_TOKEN = 'google-site-verification-life-calc-kr-2026';
const STORAGE_KEY = 'gsc_verification_token';
const PING_SESSION_KEY = 'gsc_last_ping_session';

/**
 * Ensures the Google Site Verification meta tag exists and is up to date
 */
export function ensureGscMetaTag(customToken?: string): string {
  if (typeof document === 'undefined') return '';

  let token = customToken;

  if (!token) {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get('google-site-verification') || params.get('gsc_token') || params.get('gsc_verify');
      if (urlToken) {
        token = urlToken;
        localStorage.setItem(STORAGE_KEY, urlToken);
      } else {
        token = localStorage.getItem(STORAGE_KEY) || DEFAULT_GSC_TOKEN;
      }
    } catch {
      token = DEFAULT_GSC_TOKEN;
    }
  }

  try {
    let metaTag = document.querySelector('meta[name="google-site-verification"]') as HTMLMetaElement | null;
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = 'google-site-verification';
      document.head.appendChild(metaTag);
    }
    metaTag.content = token;
  } catch {
    // Silent fail
  }

  return token;
}

/**
 * Dynamically updates or creates the BreadcrumbList JSON-LD structured data
 * enabling Google Search Console to detect and render rich breadcrumbs in search results.
 */
export function updateBreadcrumbSchema(category: CategoryType, post: PostItem | null, calcId?: string) {
  if (typeof document === 'undefined') return;

  const SCRIPT_ID = 'gsc-structured-breadcrumbs';
  let scriptEl = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = SCRIPT_ID;
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }

  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: '홈',
      item: 'https://www.life-calc.kr/'
    }
  ];

  const categoryNames: Record<string, string> = {
    work: '직장·급여·퇴직',
    property: '부동산·세금',
    finance: '연금·금융·절세',
    calculators: '실전 금융 계산기',
    about: '블로그 소개',
    privacy: '개인정보처리방침',
    terms: '이용약관'
  };

  if (category !== 'all' && categoryNames[category]) {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: categoryNames[category],
      item: `https://www.life-calc.kr${categoryPath(category)}`
    });

    if (post) {
      items.push({
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://www.life-calc.kr/post/${post.id}`
      });
    } else if (calcId) {
      items.push({
        '@type': 'ListItem',
        position: 3,
        name: '실무 금융 모의계산기',
        item: `https://www.life-calc.kr/calculators/${calcId}`
      });
    }
  }

  const breadcrumbsData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items
  };

  scriptEl.textContent = JSON.stringify(breadcrumbsData);
}

/**
 * Silently triggers a background ping to notify Google Search Console & search crawlers
 */
export function silentGscPing() {
  if (typeof window === 'undefined') return;

  try {
    const now = Date.now();
    const lastPing = sessionStorage.getItem(PING_SESSION_KEY);
    // Ping at most once every 6 hours per browser session
    if (lastPing && now - Number(lastPing) < 6 * 3600 * 1000) {
      return;
    }
    sessionStorage.setItem(PING_SESSION_KEY, String(now));

    // Send background beacon or silent fetch to server ping endpoint
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/gsc/ping');
    } else {
      fetch('/api/gsc/ping', { method: 'POST', keepalive: true }).catch(() => {});
    }
  } catch {
    // Silent fail
  }
}

/**
 * React Hook: Invisibly attaches Google Search Console integration
 */
export function useGoogleSearchConsole(
  currentCategory: CategoryType,
  selectedPost: PostItem | null,
  activeCalculatorSubId?: string
) {
  useEffect(() => {
    // 1. Ensure verification meta tag
    ensureGscMetaTag();

    // 2. Trigger silent search console ping
    silentGscPing();
  }, []);

  useEffect(() => {
    // 3. Update breadcrumbs for Google Rich Snippets on page/category change
    updateBreadcrumbSchema(currentCategory, selectedPost, activeCalculatorSubId);

    // 4. Update canonical URL for search crawler consistency
    try {
      let canonicalTag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonicalTag) {
        canonicalTag = document.createElement('link');
        canonicalTag.rel = 'canonical';
        document.head.appendChild(canonicalTag);
      }

      if (selectedPost) {
        canonicalTag.href = `https://www.life-calc.kr/post/${selectedPost.id}`;
      } else if (currentCategory !== 'all') {
        canonicalTag.href = `https://www.life-calc.kr${categoryPath(currentCategory)}`;
      } else {
        canonicalTag.href = 'https://www.life-calc.kr/';
      }
    } catch {
      // Silent
    }
  }, [currentCategory, selectedPost, activeCalculatorSubId]);
}
