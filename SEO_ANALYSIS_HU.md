# SEO Analysis — English Exam Excellence (TELC) — Hungarian Market

**Target market:** Hungary only
**Primary competitor keyword:** TELC (very popular in Hungary)
**Domain:** `https://telc.englishexamexercises.com`
**Stack:** React 19 + Vite 7 + React Router 7 + client-side rendering with build-time prerendering

---

## 1. Executive Summary

The site is technically well-structured for English-language SEO (prerendered static HTML per route, sitemap.xml, robots.txt, canonical URLs, Open Graph, JSON-LD schema). However, it is **not optimized for the Hungarian market at all**. Despite having Hungarian UI translations and a documented list of Hungarian keyword targets, **none of those targets are implemented in any indexable content, meta tag, or URL.**

Because language switching is done via an external IP-lookup API (`ipapi.co`) and stored in localStorage/React state, **Googlebot sees only English content**. Hungarian users searching in Hungarian will not find this site.

---

## 2. What Is Already Done Well (Technical SEO Baseline)

| Item | Status | Notes |
|------|--------|-------|
| Prerendered static HTML per public route | ✅ | 37 routes generated at build time via `scripts/prerenderSeo.js` |
| Unique `<title>` per route | ✅ | From `src/seo/routes.js` |
| Unique meta description per route | ✅ | Same source |
| Canonical URLs | ✅ | Absolute, self-referencing |
| `sitemap.xml` + `robots.txt` | ✅ | Auto-generated, `lastmod` = build date |
| `noindex` on unknown/404 URLs | ✅ | Prevents soft-404 indexing |
| JSON-LD schema (Organization, Course, Breadcrumb, FAQ, WebSite) | ✅ | Via `SEO.jsx` |
| Clean, keyword-friendly URL structure | ✅ | `/telc/b2`, `/telc/b2/reading`, `/free-test/b1`, etc. |
| PWA + service worker | ✅ | Offline capability |
| Cache headers, compression, security headers | ✅ | Via `.htaccess` |

---

## 3. Critical Blockers for Hungarian SEO

### 3.1 No Hungarian URL Versions (Most Critical)

There are **zero** Hungarian-prefixed URLs (e.g., `/hu/telc/b2`). The only language switching is:

- Client-side IP detection via `fetch('https://ipapi.co/json/')` in `LanguageContext.jsx` and `LanguageDetectionInitializer.jsx`
- Result stored in React state + `localStorage`

**Why this fails for SEO:** Googlebot crawls from a single IP (typically US-based) and does not execute IP-based language redirects reliably. It sees one version of each page: English. There is no `/hu/` path for Google to index, so Hungarian search queries (`TELC angol`, `TELC B2 feladatok`, `angol vizsga felkészítés`) have no matching landing page.

### 3.2 No hreflang Annotations

`SEO.jsx` only emits `hreflang="en"` pointing to the canonical URL. There is no `hreflang="hu"` alternate. Without hreflang, Google cannot associate a Hungarian page with its English equivalent, and Hungarian users are not served the right language version.

### 3.3 English-Only Meta Tags

Every page's `<title>`, `<meta description>`, `<meta keywords>`, Open Graph, and Twitter Card tags are English-only. The documented Hungarian keyword targets (see section 4) appear **nowhere** in any indexable tag.

Current homepage example:
```html
<title>English Exam Excellence — TELC B1, B2 & C1 Preparation</title>
<meta name="description" content="Prepare for TELC B1, B2, and C1 exams with expert strategies...">
<meta name="keywords" content="TELC preparation, TELC practice tests, TELC B1, ...">
```

A Hungarian searcher using `TELC angol vizsga felkészítés` gets no keyword match.

### 3.4 Hardcoded `lang="en"` and `og:locale="en_US"`

`SEO.jsx:99` sets `document.documentElement.lang = 'en'` unconditionally, and `og:locale` is hardcoded to `en_US`. Even when the UI switches to Hungarian, the HTML `lang` attribute stays `en`, which is a accessibility and SEO signal error.

### 3.5 Broken / Machine-Generated Hungarian Translations

`HUNGARIAN_TRANSLATION.md` explicitly warns the translations are machine-generated and need native review. Actual examples of errors in `LanguageContext.jsx`:

| Key | Current (broken) Hungarian | Issue |
|-----|---------------------------|-------|
| `hero.advanced` | `Hαλadó` | Mixed Greek lambda (Ηαλadó) — not a real Hungarian word |
| `telc.reading.desc` | `Ez nem olvasási teszt; ez kereskedelmi teszt.` | `kereskedelmi` = "commercial/trading" — wrong word; should be `keresési` or rephrased entirely |
| `pricing.faq.payment` | `Milyen fizetési módokat kapunk?` | `kapunk` = "do we receive" — wrong subject; should be `elfogadunk` / `elszámolunk` |
| `pricing.faq.progress` | `Mentve a haladásöm örökkön?` | Broken grammar (`haladásöm` = "my progress" but question asks "is my progress saved") |
| `vocab.topical` | `TOVÁBBI TOVÁBBI TÉRMODULUSOK` | Nonsense word `TÉRMODULUSOK` |
| `vocab.passive` | `Passzív szókincs = olvasási fluentt + értés` | `fluentt` is not Hungarian (Frenglish) |
| `vocab.review.queue` | `FOLYTASITÁS Sor` | `FOLYTASITÁS` missing accent, wrong word choice |

Low-quality, grammatically broken content signals low E-E-A-T to Google and erodes user trust in a Hungarian market where TELC candidates are often professionals needing certified proof.

### 3.6 No Hungarian Keyword Implementation

The documented keyword targets in `HUNGARIAN_TRANSLATION.md:388-394` are not present in any meta tag, heading, or body copy:

- `TELC angol` (~1,600/mo)
- `TELC B2 feladatok` (~800/mo)
- `angol vizsga felkészítés` (~2,900/mo)
- `online angol tanfolyam` (~1,000/mo)
- `B1 angol szókincs` (~2,400/mo)

### 3.7 Schema.org & OG in English Only

JSON-LD `Organization`, `Course`, `WebSite`, and all Open Graph values are English-only. No Hungarian-language structured data exists.

---

## 4. Hungarian Keyword Research & Mapping

### 4.1 Primary Keywords (documented, verified search volume)

| Hungarian Keyword | English Approx. | Est. Monthly Searches | Intent | Target Page |
|-------------------|-----------------|----------------------|--------|-------------|
| `angol vizsga felkészítés` | English exam prep | ~2,900 | Informational/Commercial | Homepage `/` + `/hu/` |
| `TELC angol` | TELC English | ~1,600 | Commercial | `/hu/telc-info`, `/hu/` |
| `B1 angol szókincs` | B1 English vocabulary | ~2,400 | Informational | `/hu/telc/vocabulary/b1` |
| `TELC B2 feladatok` | TELC B2 tasks | ~800 | Commercial | `/hu/telc/b2` |
| `online angol tanfolyam` | online English course | ~1,000 | Commercial | `/hu/pricing` |

### 4.2 Secondary / Long-Tail Keywords (recommended additions)

| Keyword | Target Page |
|---------|-------------|
| `TELC B1 teszt`, `TELC B2 teszt`, `TELC C1 teszt` | `/hu/telc/b1`, `/hu/telc/b2`, `/hu/telc/c1` |
| `TELC nyelvvizsga` | `/hu/telc-info` |
| `TELC felkészítés online` | `/hu/` |
| `TELC olvasás gyakorlat` | `/hu/telc/b2/reading` |
| `TELC hallás gyakorlat` | `/hu/telc/b2/listening` |
| `TELC írás gyakorlat` | `/hu/telc/b2/writing` |
| `TELC beszéd gyakorlat` | `/hu/telc/b2/speaking` |
| `TELC B2 szókincs` | `/hu/telc/vocabulary/b2` |
| `TELC B2 nyelvtan` | `/hu/telc/drillshub/b2` |
| `ingyen TELC teszt` | `/hu/free-test/b2` |
| `TELC vizsga felkérés B2` | `/hu/telc/b2` |

### 4.3 Keyword-to-URL Mapping (Proposed)

| Hungarian URL | Primary HU Keyword | Title Pattern |
|---------------|-------------------|---------------|
| `/hu/` | `angol vizsga felkészítés`, `TELC angol` | TELC Angol Vizsga Felkészítés B1, B2 & C1 |
| `/hu/telc-info` | `TELC nyelvvizsga`, `TELC angol` | A TELC Nyelvvizsga — Mit kell tudni? |
| `/hu/telc/b2` | `TELC B2 feladatok`, `TELC B2 teszt` | TELC B2 Vizsga Felkészítés — Gyakorlatok & Tesztek |
| `/hu/telc/b2/reading` | `TELC olvasás gyakorlat` | TELC B2 Olvasás — Gyakorlatok és Stratégiák |
| `/hu/telc/b2/listening` | `TELC hallás gyakorlat` | TELC B2 Hallás — Gyakorlatok |
| `/hu/telc/b2/writing` | `TELC írás gyakorlat` | TELC B2 Írás — Gyakorlatok és Minták |
| `/hu/telc/b2/speaking` | `TELC beszéd gyakorlat` | TELC B2 Beszéd — Gyakorlatok |
| `/hu/telc/b1` | `TELC B1 teszt`, `B1 angol szókincs` | TELC B1 Vizsga Felkészítés |
| `/hu/telc/c1` | `TELC C1 teszt` | TELC C1 Vizsga Felkészítés |
| `/hu/telc/vocabulary/b2` | `TELC B2 szókincs` | TELC B2 Szókincs — Gyakorlás |
| `/hu/telc/drillshub/b2` | `TELC B2 nyelvtan` | TELC B2 Nyelvtan Gyakorlatok |
| `/hu/free-test/b2` | `ingyen TELC teszt` | Ingyenes TELC B2 Teszt — Próbavizsga |
| `/hu/pricing` | `online angol tanfolyam` | TELC Angol Tanfolyam — Árak |

---

## 5. Technical SEO Recommendations (Implementation Order)

### Phase 1 — Hungarian URL Structure (Highest Impact)

1. **Add `/hu/` path-prefixed routes** for all 37 public routes (e.g., `/hu/telc/b2`, `/hu/free-test/b2`, `/hu/pricing`).
2. **Prerender Hungarian shells** at build time with Hungarian `<title>`, `<meta description>`, canonical, OG tags.
3. **Add Hungarian URLs to `sitemap.xml`** with `hreflang` x-default/en/hu links.
4. **Update `Router.jsx`** to mount Hungarian routes (can reuse the same `App` component with a `locale` prop).
5. **Update `.htaccess`** to serve `/hu/*` prerendered shells and rewrite to SPA for unprerendered paths.
6. **Add hreflang annotations** on every page: `en`, `hu`, and `x-default`.

### Phase 2 — Metadata & Content (High Impact)

7. **Dynamic `document.documentElement.lang`** — set to `hu` on Hungarian pages, `en` on English pages.
8. **Dynamic `og:locale`** — `hu_HU` on Hungarian pages, `en_US` on English pages.
9. **Hungarian `<title>` and `<meta description>`** per route using the keyword mapping in section 4.3.
10. **Hungarian `<meta keywords>`** (kept for Bing/Yahoo, deprecated by Google but harmless).
11. **Hungarian JSON-LD schema** (Organization name/description, Course descriptions).
12. **Fix all Hungarian translations** — replace machine-generated strings with native-reviewed Hungarian. Prioritize navigation, hero, CTAs, and SEO-visible text.

### Phase 3 — Language Detection & UX (Medium Impact)

13. **Replace IP-based detection** (`ipapi.co`) with URL-path language detection (`/hu/`). IP detection is unreliable for SEO and adds a third-party dependency/latency.
14. **Keep `Accept-Language` and localStorage as fallback** but prioritize the URL path.
15. **Add a visible language switcher** that changes the URL (e.g., `/telc/b2` ↔ `/hu/telc/b2`), not just client state.

---

## 6. Implementation Files to Modify

| File | Change |
|------|--------|
| `src/seo/routes.js` | Add Hungarian route variants (`HU_ROUTES`) with `/hu/` prefix + Hungarian titles/descriptions/keywords |
| `scripts/prerenderSeo.js` | Generate Hungarian route shells; add Hungarian URLs to sitemap with hreflang |
| `src/Router.jsx` | Add `<Route path="/hu/*">` entries |
| `src/components/SEO.jsx` | Accept `lang` prop; dynamic `lang` attr, `hreflang` (en+hu+x-default), `og:locale` |
| `src/contexts/LanguageContext.jsx` | Fix broken Hungarian translations; add SEO metadata translations |
| `.htaccess` | Add rewrite rules for `/hu/` prerendered shells |

---

## 7. Expected Impact

- **Indexable Hungarian landing pages** for all primary TELC keywords (`TELC angol`, `TELC B2 feladatok`, `angol vizsga felkészítés`, etc.)
- **Correct language serving** to Hungarian users via hreflang + path-based URLs
- **Improved CTR** from Hungarian SERPs because titles/descriptions match Hungarian search queries
- **Better E-E-A-T signals** from grammatically correct, native Hungarian content
- **No disruption** to existing English SEO (all current URLs unchanged)
