import fs from 'node:fs';
import path from 'node:path';

const SITE_URL = (process.env.SITE_URL || 'https://life-calc.kr').replace(/\/$/, '');
const today = new Date().toISOString().slice(0, 10);
const root = process.cwd();
const catalogPath = path.join(root, 'src/components/qualityCalculators/catalogKoreaEssential.ts');
const modelPath = path.join(root, 'src/components/qualityCalculators/model.ts');
const outPath = path.join(root, 'public/sitemap.xml');

const escapeXml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const toKoreanSlug = (name) =>
  String(name)
    .trim()
    .replace(/계산기$/u, '')
    .trim()
    .replace(/\s+/gu, '-')
    .replace(/[^\p{L}\p{N}-]+/gu, '-')
    .replace(/-+/gu, '-')
    .replace(/^-|-$/gu, '') + '-계산기';

const read = (filePath) => fs.readFileSync(filePath, 'utf8');
const catalogSource = read(catalogPath);
const modelSource = read(modelPath);

const categoryKeysMatch = modelSource.match(/categoryKeys:[\s\S]*?=\s*\[([\s\S]*?)\];/);
const categoryKeys = categoryKeysMatch
  ? Array.from(categoryKeysMatch[1].matchAll(/'([^']+)'/g)).map((match) => match[1])
  : [];

const calculators = Array.from(
  catalogSource.matchAll(/\{\s*id:'([^']+)'\s*,\s*name:'([^']+)'\s*,\s*category:'([^']+)'/g),
).map((match) => ({ id: match[1], name: match[2], category: match[3], slug: toKoreanSlug(match[2]) }));

if (calculators.length === 0) {
  throw new Error('No calculators found. Check catalogKoreaEssential.ts format.');
}

const urls = [
  { loc: '/', priority: '1.0', changefreq: 'daily' },
  { loc: '/about', priority: '0.6', changefreq: 'monthly' },
  { loc: '/contact', priority: '0.5', changefreq: 'monthly' },
  { loc: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { loc: '/terms', priority: '0.3', changefreq: 'yearly' },
  ...categoryKeys.map((key) => ({ loc: `/category/${key}`, priority: '0.7', changefreq: 'weekly' })),
  ...calculators.map((calculator) => ({
    loc: `/calculators/${calculator.slug}`,
    priority: '0.85',
    changefreq: 'weekly',
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(`${SITE_URL}${url.loc}`)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, xml, 'utf8');

console.log(`Generated sitemap: ${outPath}`);
console.log(`Calculator URLs: ${calculators.length}`);
console.log(`Total URLs: ${urls.length}`);
