import { useEffect } from 'react';

import {
  organizationSchema,
  websiteSchema,
  faqSchema,
  breadcrumbSchema,
  courseSchema,
} from '../utils/structuredData';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_HU_DESCRIPTION,
  DEFAULT_HU_KEYWORDS,
  DEFAULT_HU_TITLE,
  DEFAULT_TITLE,
  DEFAULT_KEYWORDS,
  OG_IMAGE,
  SITE_URL,
  absoluteUrl,
  formatHuTitle,
  formatTitle,
  isIndexable,
  normalizePath,
} from '../seo/routes';

const JSON_META_KEY = 'data-schema-type';

/**
 * SEO — dynamic <head> manager for English Exam Excellence
 *
 * Props
 * ─────
 * title         — Optional page-specific title (appended to brand suffix).
 * description   — Optional meta description override.
 * keywords      — Optional meta keywords override (deprecated by Google; kept for Bing/Yahoo).
 * canonicalUrl  — Optional absolute canonical URL. Defaults to the registry entry
 *                 for the current path; unknown paths fall back to the site root.
 * noindex       — Force noindex (unknown URLs are noindexed automatically).
 * schemaBlock   — Structured-data extras for this page.
 *                 breadcrumbs: [{ name, url }]   → BreadcrumbList
 *                 faq: [{ question, answer }]   → FAQPage
 *                 course: { level, title, description, url } → Course
 *                 website: true                  → WebSite + SearchAction (landing page)
*/
const SEO = ({ title, description, keywords, canonicalUrl, noindex, schemaBlock, lang }) => {
  const currentPath =
    typeof window !== 'undefined' ? normalizePath(window.location.pathname) : '/';

  // Resolve language: explicit prop > path prefix > default 'en'
  const resolvedLang =
    lang ||
    (typeof window !== 'undefined' && currentPath.startsWith('/hu/') ? 'hu' : 'en') ||
    'en';

  // Unknown paths (junk URLs, 404s) must not be indexed, and must never
  // canonicalise to themselves or they compete with the real pages.
  const resolvedNoindex = Boolean(noindex ?? schemaBlock?.noindex ?? !isIndexable(currentPath));

  const resolvedCanonical =
    canonicalUrl || (isIndexable(currentPath) ? absoluteUrl(currentPath) : `${SITE_URL}/`);

  // Alternate-language URLs for hreflang
  const enUrl = resolvedLang === 'hu' ? absoluteUrl(currentPath.replace(/^\/hu/, '')) : resolvedCanonical;
  const huUrl = resolvedLang === 'en' ? absoluteUrl(`/hu${currentPath}`) : resolvedCanonical;

  useEffect(() => {
    const baseTitle = title || (resolvedLang === 'hu' ? DEFAULT_HU_TITLE : DEFAULT_TITLE);
    const pageTitle = formatHuTitle(baseTitle);
    const pageDescription = description || (resolvedLang === 'hu' ? DEFAULT_HU_DESCRIPTION : DEFAULT_DESCRIPTION);
    const pageKeywords = keywords || (resolvedLang === 'hu' ? DEFAULT_HU_KEYWORDS : DEFAULT_KEYWORDS);

    // ══════════════════════════════════════════════════════════
    // 1. Document <title>
    // ══════════════════════════════════════════════════════════
    document.title = pageTitle;

    // ══════════════════════════════════════════════════════════
    // 2. Standard meta tags
    // ══════════════════════════════════════════════════════════
    setMeta('name', 'description', pageDescription);
    setMeta('name', 'keywords', pageKeywords);
    setMeta('name', 'author', 'English Exam Excellence');

    // ══════════════════════════════════════════════════════════
    // 3. Canonical URL
    // ══════════════════════════════════════════════════════════
    setLink('canonical', resolvedCanonical);

    // ══════════════════════════════════════════════════════════
    // 4. Open Graph tags
    // ══════════════════════════════════════════════════════════
    setMeta('property', 'og:title', pageTitle);
    setMeta('property', 'og:description', pageDescription);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', resolvedCanonical);
    setMeta('property', 'og:image', OG_IMAGE);
    setMeta('property', 'og:image:width', '1200');
    setMeta('property', 'og:image:height', '630');
    setMeta('property', 'og:site_name', 'English Exam Excellence');
    setMeta('property', 'og:locale', resolvedLang === 'hu' ? 'hu_HU' : 'en_US');

    // ═══════════════════════════════════════════════════════════
    // 5. Twitter Card tags
    // ═══════════════════════════════════════════════════════════
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:url', resolvedCanonical);
    setMeta('name', 'twitter:title', pageTitle);
    setMeta('name', 'twitter:description', pageDescription);
    setMeta('name', 'twitter:image', OG_IMAGE);

    // ═══════════════════════════════════════════════════════════
    // 6. Lang / hreflang
    // ═══════════════════════════════════════════════════════════
    document.documentElement.lang = resolvedLang;
    let langLink = document.querySelector('link[hreflang="en"]');
    if (langLink) {
      langLink.setAttribute('href', enUrl);
    } else {
      langLink = document.createElement('link');
      langLink.rel = 'alternate';
      langLink.hreflang = 'en';
      langLink.href = enUrl;
      document.head.appendChild(langLink);
    }

    let huLink = document.querySelector('link[hreflang="hu"]');
    if (huLink) {
      huLink.setAttribute('href', huUrl);
    } else {
      huLink = document.createElement('link');
      huLink.rel = 'alternate';
      huLink.hreflang = 'hu';
      huLink.href = huUrl;
      document.head.appendChild(huLink);
    }

    let xDefaultLink = document.querySelector('link[hreflang="x-default"]');
    if (xDefaultLink) {
      xDefaultLink.setAttribute('href', enUrl);
    } else {
      xDefaultLink = document.createElement('link');
      xDefaultLink.rel = 'alternate';
      xDefaultLink.hreflang = 'x-default';
      xDefaultLink.href = enUrl;
      document.head.appendChild(xDefaultLink);
    }

    // ═══════════════════════════════════════════════════════════
    // 7. Robots meta — noindex for the 404 catch-all and anything
    //    not in the public route registry.
    // ═══════════════════════════════════════════════════════════
    setMeta('name', 'robots', resolvedNoindex ? 'noindex, nofollow' : 'index, follow');

    // ══════════════════════════════════════════════════════════
    // 8. JSON-LD structured data
    // ══════════════════════════════════════════════════════════
    updateJsonLd(schemaBlock);
  }, [title, description, keywords, resolvedLang, resolvedCanonical, resolvedNoindex, schemaBlock]);

  return null;
};

/* ── Internal helpers ─────────────────────────────────────── */

/** Create or update a <meta> element identified by a specific attribute/value pair */
function setMeta(attrName, attrValue, content) {
  let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  if (content !== undefined) el.setAttribute('content', content);
}

/** Create or update a <link> element identified by its `rel` attribute */
function setLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (el) {
    el.setAttribute('href', href);
  } else {
    el = document.createElement('link');
    el.rel = rel;
    el.href = href;
    document.head.appendChild(el);
  }
}

/**
 * Inject or replace JSON-LD <script type="application/ld+json"> blocks.
 *
 * Schema sources (each opt-in per page via schemaBlock):
 *   • Organization  — always injected unless schemaBlock.noSchema === true
 *   • BreadcrumbList— when schemaBlock.breadcrumbs is a non-empty array
 *   • FAQPage       — when schemaBlock.faq is a non-empty array
 *   • Course        — when schemaBlock.course object is provided
 *   • WebSite       — when schemaBlock.website === true (landing / root page)
 */
function updateJsonLd(schemaBlock) {
  // Build ordered list of { type, selector, jsonText } for this page
  const pageSchemas = [];

  // 1. Organization (global — always present unless explicitly suppressed)
  if (!schemaBlock?.noSchema) {
    pageSchemas.push(buildSchemaEntry(organizationSchema()));
  }

  // 2. WebSite + SearchAction (landing page only)
  if (schemaBlock?.website) {
    pageSchemas.push(buildSchemaEntry(websiteSchema()));
  }

  // 3. BreadcrumbList (hub / exercise routes)
  if (Array.isArray(schemaBlock?.breadcrumbs) && schemaBlock.breadcrumbs.length > 0) {
    pageSchemas.push(buildSchemaEntry(breadcrumbSchema(schemaBlock.breadcrumbs)));
  }

  // 4. FAQPage (PricingPage)
  if (Array.isArray(schemaBlock?.faq) && schemaBlock.faq.length > 0) {
    pageSchemas.push(buildSchemaEntry(faqSchema(schemaBlock.faq)));
  }

  // 5. Course (exam hub pages)
  if (schemaBlock?.course) {
    pageSchemas.push(buildSchemaEntry(courseSchema(schemaBlock.course)));
  }

  // Apply: insert new blocks and remove stale ones
  const activeTypes = new Set(pageSchemas.map((s) => s.type));

  // Remove scripts that are no longer needed
  document
    .querySelectorAll(`script[type="application/ld+json"][${JSON_META_KEY}]`)
    .forEach((el) => {
      if (!activeTypes.has(el.getAttribute(JSON_META_KEY))) el.remove();
    });

  // Create or update matching script elements
  for (const { type, jsonText } of pageSchemas) {
    const existing = document.querySelector(
      `script[type="application/ld+json"][${JSON_META_KEY}="${type}"]`
    );
    if (existing) {
      existing.textContent = jsonText;
    } else {
      const el = document.createElement('script');
      el.type = 'application/ld+json';
      el.setAttribute(JSON_META_KEY, type);
      el.textContent = jsonText;
      document.head.appendChild(el);
    }
  }
}

/**
 * Parse a JSON-LD string and return the structured entry properties
 * needed for updateJsonLd.
 */
function buildSchemaEntry(jsonText) {
  const parsed = JSON.parse(jsonText);
  return {
    type: String(parsed['@type'] ?? 'generic'),
    jsonText,
  };
}

export default SEO;
