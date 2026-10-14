// 사이트 주소 규칙 (한곳에서 관리).
// 예전에는 /?p=글ID 처럼 물음표 주소를 썼는데, 정적 호스팅(Vercel)은 물음표 뒤 값에 따라
// 다른 파일을 줄 수 없어 모든 글이 홈 화면과 같은 HTML로 응답했다. 그래서 글·카테고리·계산기마다
// 고유한 경로 주소를 쓴다. 예전 물음표 주소는 parseRoute 가 계속 인식한다.

export const POST_CATEGORIES = ['work', 'property', 'finance'] as const;
export const STATIC_PAGES = ['about', 'privacy', 'terms'] as const;

export const postPath = (postId: string) => `/post/${encodeURIComponent(postId)}`;
export const calcPath = (calcId: string) => `/calculators/${encodeURIComponent(calcId)}`;

/** 'all' → '/', work/property/finance → '/category/..', calculators → '/calculators', about 등 → '/about' */
export const categoryPath = (cat: string) => {
  if ((POST_CATEGORIES as readonly string[]).includes(cat)) return `/category/${cat}`;
  if (cat === 'calculators') return '/calculators';
  if ((STATIC_PAGES as readonly string[]).includes(cat)) return `/${cat}`;
  return '/';
};

export interface ParsedRoute {
  postId?: string;
  calcId?: string;
  catId?: string;
  /** 예전 물음표 주소로 들어온 경우 true (대표 주소로 바꿔 줘야 함) */
  legacy: boolean;
}

type QueryLike = { get(key: string): string | null | undefined };

const decode = (v: string) => {
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
};

export function parseRoute(pathname: string, query?: QueryLike): ParsedRoute {
  const path = (pathname || '/').replace(/\/+$/, '') || '/';

  let m = path.match(/^\/post\/([^/]+)$/);
  if (m) return { postId: decode(m[1]), legacy: false };

  m = path.match(/^\/category\/([^/]+)$/);
  if (m) return { catId: decode(m[1]), legacy: false };

  m = path.match(/^\/calculators(?:\/([^/]+))?$/);
  if (m) return m[1] ? { calcId: decode(m[1]), catId: 'calculators', legacy: false } : { catId: 'calculators', legacy: false };

  m = path.match(/^\/(about|privacy|terms)$/);
  if (m) return { catId: m[1], legacy: false };

  if (query) {
    const postId = query.get('p') || query.get('post') || undefined;
    const calcId = query.get('calc') || query.get('s') || undefined;
    const catId = query.get('cat') || query.get('c') || query.get('category') || undefined;
    if (postId || calcId || catId) return { postId, calcId, catId, legacy: true };
  }
  return { legacy: false };
}

/** 파싱된 경로의 대표 주소 */
export function canonicalPath(route: ParsedRoute): string {
  if (route.postId) return postPath(route.postId);
  if (route.calcId) return calcPath(route.calcId);
  if (route.catId) return categoryPath(route.catId);
  return '/';
}
