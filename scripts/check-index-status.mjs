import fs from 'node:fs';
import path from 'node:path';
import 'dotenv/config';
import { googleApiFetch, requireGoogleEnv } from './gsc-auth.mjs';

const root = process.cwd();
const sitemapPath = path.join(root, 'public/sitemap.xml');
const limit = Number(process.env.INDEX_CHECK_LIMIT || 20);
const { siteUrl } = requireGoogleEnv();

const sitemapXml = fs.readFileSync(sitemapPath, 'utf8');
const urls = Array.from(sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g))
  .map((match) => match[1].replaceAll('&amp;', '&'))
  .filter((url) => url.includes('/calculators/'))
  .slice(0, limit);

if (urls.length === 0) {
  throw new Error('No calculator URLs found in public/sitemap.xml. Run npm run generate:sitemap first.');
}

const endpoint = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';
const results = [];

console.log(`Checking Google index status for ${urls.length} URLs`);

for (const inspectionUrl of urls) {
  const data = await googleApiFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({ inspectionUrl, siteUrl, languageCode: 'ko-KR' }),
  });

  const indexStatus = data?.inspectionResult?.indexStatusResult;
  const verdict = indexStatus?.verdict || 'UNKNOWN';
  const coverageState = indexStatus?.coverageState || '';
  const indexingState = indexStatus?.indexingState || '';
  const lastCrawlTime = indexStatus?.lastCrawlTime || '';

  results.push({ inspectionUrl, verdict, coverageState, indexingState, lastCrawlTime });
  console.log(`${verdict.padEnd(12)} ${coverageState} ${inspectionUrl}`);
}

const outDir = path.join(root, 'reports');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, `gsc-index-status-${new Date().toISOString().slice(0, 10)}.json`);
fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');
console.log(`Index status report saved: ${outPath}`);
