/**
 * prerenderSeo.js — Vite plugin.
 *
 * The site is a client-rendered SPA, so every route would otherwise ship the
 * same <head>: one title, one description, and no canonical. This plugin
 * writes a static HTML shell per public route (title / description / canonical /
 * og / twitter / robots injected at build time) and generates sitemap.xml from
 * the same route registry, so `lastmod` is always the build date.
 *
 * Both English (/path) and Hungarian (/hu/path) shells are generated so
 * search engines can index each language under its own URL.
 *
 * Route metadata comes from src/seo/routes.js — do not duplicate it here.
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import {
  PUBLIC_ROUTES,
  SITE_NAME,
  SITE_URL,
  formatTitle,
  formatHuTitle,
  localizedRoutes,
} from '../src/seo/routes.js';

const escapeAttr = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const absolute = (routePath) => `${SITE_URL}${routePath === '/' ? '/' : routePath}`;

/** Replace the first match of `pattern`, or append to <head> when absent. */
function upsert(html, pattern, tag) {
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

/** Build the prerendered HTML for a single route from the built index.html. */
function renderRoute(template, route) {
  const url = absolute(route.path);
  const title = route.lang === 'hu' ? formatHuTitle(route.title) : formatTitle(route.title);
  const description = route.description;

  let html = template;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(title)}</title>`);

  html = upsert(
    html,
    /<meta name="description"[^>]*>/,
    `<meta name="description" content="${escapeAttr(description)}">`
  );
  if (route.keywords) {
    html = upsert(
      html,
      /<meta name="keywords"[^>]*>/,
      `<meta name="keywords" content="${escapeAttr(route.keywords)}">`
    );
  }
  html = upsert(
    html,
    /<meta name="robots"[^>]*>/,
    `<meta name="robots" content="index, follow" />`
  );
  html = html.replace(/<link rel="canonical"[^>]*>\s*/g, '');
  html = html.replace(
    '</head>',
    `    <link rel="canonical" href="${escapeAttr(url)}" />\n  </head>`
  );

  // hreflang alternates: point EN to EN, HU to HU
  const enPath = route.lang === 'hu' ? route.path.replace(/^\/hu/, '') : route.path;
  const huPath = route.lang === 'en' ? `/hu${route.path}` : route.path;
  html = upsert(
    html,
    /<link rel="alternate"[^>]*hreflang="en"[^>]*>/,
    `<link rel="alternate" hreflang="en" href="${escapeAttr(absolute(enPath))}" />`
  );
  html = upsert(
    html,
    /<link rel="alternate"[^>]*hreflang="hu"[^>]*>/,
    `<link rel="alternate" hreflang="hu" href="${escapeAttr(absolute(huPath))}" />`
  );
  html = upsert(
    html,
    /<link rel="alternate"[^>]*hreflang="x-default"[^>]*>/,
    `<link rel="alternate" hreflang="x-default" href="${escapeAttr(absolute(enPath))}" />`
  );

  html = upsert(
    html,
    /<meta property="og:url"[^>]*>/,
    `<meta property="og:url" content="${escapeAttr(url)}">`
  );
  html = upsert(
    html,
    /<meta property="og:title"[^>]*>/,
    `<meta property="og:title" content="${escapeAttr(title)}">`
  );
  html = upsert(
    html,
    /<meta property="og:description"[^>]*>/,
    `<meta property="og:description" content="${escapeAttr(description)}">`
  );
  html = upsert(
    html,
    /<meta property="og:locale"[^>]*>/,
    `<meta property="og:locale" content="${route.lang === 'hu' ? 'hu_HU' : 'en_US'}">`
  );

  html = upsert(
    html,
    /<meta name="twitter:url"[^>]*>/,
    `<meta name="twitter:url" content="${escapeAttr(url)}">`
  );
  html = upsert(
    html,
    /<meta name="twitter:title"[^>]*>/,
    `<meta name="twitter:title" content="${escapeAttr(title)}">`
  );
  html = upsert(
    html,
    /<meta name="twitter:description"[^>]*>/,
    `<meta name="twitter:description" content="${escapeAttr(description)}">`
  );

  // HTML lang attribute
  html = html.replace(/<html lang="[^"]*"/, `<html lang="${route.lang === 'hu' ? 'hu' : 'en'}"`);

  return html;
}

function renderSitemap(buildDate) {
  const urls = localizedRoutes()
    .map((route) =>
      [
        '  <url>',
        `    <loc>${escapeAttr(absolute(route.path))}</loc>`,
        `    <lastmod>${buildDate}</lastmod>`,
        `    <changefreq>${route.changefreq}</changefreq>`,
        `    <priority>${route.priority}</priority>`,
        '    <xhtml:link rel="alternate" hreflang="en" href="' +
          escapeAttr(
            absolute(
              route.lang === 'hu' ? route.path.replace(/^\/hu/, '') : route.path
            )
          ) +
          '" />',
        '    <xhtml:link rel="alternate" hreflang="hu" href="' +
          escapeAttr(
            absolute(
              route.lang === 'en' ? `/hu${route.path}` : route.path
            )
          ) +
          '" />',
        '  </url>',
      ].join('\n')
    )
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    urls,
    '</urlset>',
    '',
  ].join('\n');
}

export function prerenderSeo() {
  let outDir = 'dist';
  let command = 'build';

  return {
    name: 'prerender-seo',
    apply: 'build',

    configResolved(config) {
      outDir = config.build.outDir;
      command = config.command;
    },

    closeBundle() {
      if (command !== 'build') return;

      const root = process.cwd();
      const templatePath = join(root, outDir, 'index.html');
      const template = readFileSync(templatePath, 'utf8');

      const buildDate = new Date().toISOString().slice(0, 10);

      const allRoutes = localizedRoutes();

      for (const route of allRoutes) {
        const html = renderRoute(template, route);
        const target = join(root, outDir, route.path, 'index.html');
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, html, 'utf8');
      }

      const sitemapPath = join(root, outDir, 'sitemap.xml');
      writeFileSync(sitemapPath, renderSitemap(buildDate), 'utf8');

      const robotsPath = join(root, outDir, 'robots.txt');
      writeFileSync(
        robotsPath,
        [
          'User-agent: *',
          'Allow: /',
          '',
          `# ${SITE_NAME} - every public route is indexable; unknown URLs return HTTP 404.`,
          `Sitemap: ${SITE_URL}/sitemap.xml`,
          '',
        ].join('\n'),
        'utf8'
      );

      this.info?.(
        `prerendered ${allRoutes.length} routes (${PUBLIC_ROUTES.length} EN + ${PUBLIC_ROUTES.length} HU), sitemap.xml (lastmod ${buildDate}), robots.txt`
      );
    },
  };
}

export { renderRoute, renderSitemap };
