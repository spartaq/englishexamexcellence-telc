import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  PUBLIC_ROUTES,
  absoluteUrl,
  findRoute,
  formatTitle,
  isIndexable,
  normalizePath,
  routeMeta,
} from '../seo/routes';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const readProjectFile = (relativePath) =>
  readFileSync(join(projectRoot, relativePath), 'utf8');

/** Every <Route path="..."> declared in the router, excluding the "*" catch-all. */
const routerPaths = () =>
  [...readProjectFile('src/Router.jsx').matchAll(/<Route\s+path="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((path) => path !== '*');

describe('SEO route registry', () => {
  it('has no duplicate paths', () => {
    const paths = PUBLIC_ROUTES.map((route) => route.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('gives every route a title, description, changefreq and priority', () => {
    for (const route of PUBLIC_ROUTES) {
      expect(route.path.startsWith('/'), route.path).toBe(true);
      expect(route.title, route.path).toBeTruthy();
      expect(route.description.length, route.path).toBeGreaterThan(50);
      expect(['daily', 'weekly', 'monthly', 'yearly'], route.path).toContain(route.changefreq);
      expect(Number(route.priority), route.path).toBeGreaterThan(0);
      expect(Number(route.priority), route.path).toBeLessThanOrEqual(1);
    }
  });

  it('exposes exactly the routes the router declares', () => {
    expect(routerPaths().sort()).toEqual(PUBLIC_ROUTES.map((route) => route.path).sort());
  });

  it('normalises trailing slashes and query strings', () => {
    expect(normalizePath('/telc/b2/')).toBe('/telc/b2');
    expect(normalizePath('/telc/b2?utm_source=x')).toBe('/telc/b2');
    expect(normalizePath('telc/b2#top')).toBe('/telc/b2');
    expect(normalizePath(undefined)).toBe('/');
  });

  it('treats unknown URLs as non-indexable', () => {
    expect(isIndexable('/telc/b1')).toBe(true);
    expect(isIndexable('/telc/b2/junk')).toBe(false);
    expect(isIndexable('/totally-made-up')).toBe(false);
    expect(absoluteUrl('/totally-made-up')).toBe('https://telc.englishexamexercises.com/');
  });

  it('canonicalises to the registry path, not the requested URL', () => {
    expect(findRoute('/telc/b2/reading').path).toBe('/telc/b2/reading');
    expect(absoluteUrl('/telc/b2/reading/')).toBe(
      'https://telc.englishexamexercises.com/telc/b2/reading'
    );
  });

  it('does not double the brand suffix on the default title', () => {
    expect(formatTitle(undefined)).not.toMatch(/English Exam Excellence.*English Exam Excellence/);
    expect(formatTitle('TELC B2 Mini Test')).toBe(
      'TELC B2 Mini Test | English Exam Excellence'
    );
  });

  it('returns metadata for every registered route', () => {
    for (const route of PUBLIC_ROUTES) {
      expect(routeMeta(route.path).title, route.path).toBe(route.title);
      expect(routeMeta(route.path).description, route.path).toBe(route.description);
    }
    expect(routeMeta('/nope')).toEqual({});
  });
});

describe('.htaccess route handling', () => {
  const htaccess = readProjectFile('.htaccess');

  it('returns a real 404 for unknown URLs instead of the SPA fallback', () => {
    expect(htaccess).toMatch(/RewriteRule \. - \[R=404,L\]/);
    expect(htaccess).toMatch(/ErrorDocument 404 \/index\.html/);
  });

  it('serves prerendered route shells directly without rewriting to root', () => {
    // The new .htaccess serves directory index files directly
    expect(htaccess).toMatch(/REQUEST_FILENAME} -f/);
    expect(htaccess).toMatch(/index\\.html.*- \[L\]/);
    
    // No rules rewriting telc/* or free-test/* or vocabulary/drillshub to root
    expect(htaccess).not.toMatch(/telc.*RewriteRule.*\/index\.html/);
    expect(htaccess).not.toMatch(/free-test.*RewriteRule.*\/index\.html/);
    expect(htaccess).not.toMatch(/(vocabulary|drillshub).*RewriteRule.*\/index\.html/);
  });
});

describe('build-time prerender', () => {
  it('produces one absolute <loc> per route', async () => {
    const { renderSitemap } = await import('../../scripts/prerenderSeo.js');
    const xml = renderSitemap('2026-10-02');

    for (const route of PUBLIC_ROUTES) {
      expect(xml).toContain(`<loc>${absoluteUrl(route.path)}</loc>`);
    }
    expect(xml.match(/<lastmod>2026-10-02<\/lastmod>/g).length).toBe(PUBLIC_ROUTES.length);
  });

  it('injects a canonical and noindex-free robots meta into each route shell', async () => {
    const { renderRoute } = await import('../../scripts/prerenderSeo.js');
    const template = readProjectFile('index.html');
    const html = renderRoute(template, findRoute('/telc/b2/reading'));

    expect(html).toContain('<link rel="canonical" href="https://telc.englishexamexercises.com/telc/b2/reading" />');
    expect(html).toContain('<title>TELC B2 Reading | English Exam Excellence</title>');
    expect(html).toContain('<meta name="robots" content="index, follow" />');
    expect(html).toContain('<meta property="og:url" content="https://telc.englishexamexercises.com/telc/b2/reading">');
  });
});