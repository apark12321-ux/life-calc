import 'dotenv/config';
import { encodePathParam, googleApiFetch, requireGoogleEnv } from './gsc-auth.mjs';

const sitemapUrl = process.env.SITEMAP_URL || 'https://life-calc.kr/sitemap.xml';
const { siteUrl } = requireGoogleEnv();

const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodePathParam(siteUrl)}/sitemaps/${encodePathParam(sitemapUrl)}`;

console.log(`Submitting sitemap to Google Search Console`);
console.log(`Site: ${siteUrl}`);
console.log(`Sitemap: ${sitemapUrl}`);

await googleApiFetch(endpoint, { method: 'PUT' });

console.log('Sitemap submitted successfully.');
