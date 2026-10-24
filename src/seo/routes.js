/**
 * routes.js — canonical registry of every public, indexable page.
 *
 * Single source of truth consumed by:
 *   • src/Router.jsx          — routes are declared there; the test
 *                                in src/test/seoRoutes.test.js asserts both stay in sync
 *   • src/components/SEO.jsx  — canonical URL + noindex guard
 *   • scripts/prerenderSeo.js — static per-route <head> + sitemap.xml generation
 *   • scripts/routeWhitelist.js — the .htaccess route whitelist
 *
 * Each route now carries both English (en) and Hungarian (hu) metadata so the
 * prerender can emit a /path (EN) and /hu/path (HU) shell for every public page.
 *
 * Keep this file free of JSX and browser APIs so Node can import it at build time.
 */

export const SITE_URL = 'https://telc.englishexamexercises.com';
export const SITE_NAME = 'English Exam Excellence';
export const OG_IMAGE = `${SITE_URL}/og-image.png`;

export const DEFAULT_TITLE = `${SITE_NAME} — TELC B1, B2 & C1 Preparation`;

export const DEFAULT_DESCRIPTION =
  'Prepare for TELC B1, B2, and C1 exams with expert strategies, practice tests, and interactive 15-minute training sessions for English exam success.';

export const DEFAULT_HU_TITLE = 'TELC Angol Vizsga Felkészítés — B1, B2 & C1';

export const DEFAULT_HU_DESCRIPTION =
  'Felkészülj a TELC B1, B2 és C1 nyelvvizsgákra szakértői stratégiákkal, gyakorlati tesztekkel és interaktív 15 perces tréningekkel.';

export const DEFAULT_KEYWORDS =
  'TELC preparation, TELC practice tests, TELC B1, TELC B2, TELC C1, TELC English, English exam strategies, test-taking tips';

export const DEFAULT_HU_KEYWORDS =
  'TELC angol, TELC felkészítés, TELC B2 feladatok, TELC B1 teszt, TELC C1 teszt, angol vizsga felkészítés, TELC nyelvvizsga, online angol tanfolyam';

const LEVELS = ['b1', 'b2', 'c1'];
const SKILLS = ['reading', 'writing', 'speaking', 'listening'];

const LEVEL_TITLES = { b1: 'B1', b2: 'B2', c1: 'C1' };
const LEVEL_TITLES_HU = { b1: 'B1', b2: 'B2', c1: 'C1' };

const LEVEL_DESCRIPTIONS = {
  b1: 'Prepare for the TELC B1 (Intermediate) exam with targeted vocabulary drills, grammar exercises, and full practice tests for reading, listening, writing, and speaking.',
  b2: 'Prepare for the TELC B2 (Upper-Intermediate) exam with expert strategies, practice tests, and interactive 15-minute training sessions for English exam success.',
  c1: 'Prepare for the TELC C1 (Advanced) exam with advanced vocabulary, complex grammar drills, and full-length practice tests for all four skills.',
};

const LEVEL_DESCRIPTIONS_HU = {
  b1: 'Felkészülés a TELC B1 (középső) nyelvvizsgára: célzott szókincs gyakorlatok, nyelvtanfeladatok és teljes próbavizsga olvasás, hallás, írás és beszédre.',
  b2: 'Felkészülés a TELC B2 (felső-középső) nyelvvizsgára: szakértői stratégiák, gyakorlati tesztek és interaktív 15 perces tréningek.',
  c1: 'Felkészülés a TELC C1 (haladó) nyelvvizsgára: haladó szókincs, komplex nyelvtanfeladatok és teljes hosszúságú próbavizsga az összes képességre.',
};

const SKILL_NAMES = {
  reading: 'Reading',
  writing: 'Writing',
  speaking: 'Speaking',
  listening: 'Listening',
};

const SKILL_NAMES_HU = {
  reading: 'Olvasás',
  writing: 'Írás',
  speaking: 'Beszéd',
  listening: 'Hallás',
};

/* ── Route table ──────────────────────────────────────────── */

const TOP_LEVEL = [
  {
    path: '/',
    title: DEFAULT_TITLE,
    huTitle: DEFAULT_HU_TITLE,
    description: DEFAULT_DESCRIPTION,
    huDescription: DEFAULT_HU_DESCRIPTION,
    keywords: DEFAULT_KEYWORDS,
    huKeywords: DEFAULT_HU_KEYWORDS,
    changefreq: 'weekly',
    priority: '1.0',
  },
  {
    path: '/telc-info',
    title: 'About the TELC Exam',
    huTitle: 'A TELC Nyelvvizsga — Mit kell tudni?',
    description:
      'Learn about the European Language Certificates (TELC) — internationally recognised language examinations aligned with CEFR, assessing Reading, Listening, Writing, and Speaking.',
    huDescription:
      'Tudnivalók a TELC Európai Nyelvtanúsítványokról — Nemzetileg elismerendő nyelvvizsgák, amelyek a CEFR-nek megfelelően értékelik az olvasást, hallást, írást és beszédet.',
    keywords: 'TELC English, TELC exam, CEFR language certificate, TELC information',
    huKeywords: 'TELC nyelvvizsga, TELC angol, CEFR nyelvvizsga, TELC tudnivalók',
    changefreq: 'monthly',
    priority: '0.9',
  },
  {
    path: '/pricing',
    title: 'Pricing — Pay Once, Study Forever',
    huTitle: 'TELC Angol Tanfolyam — Árak',
    description:
      'No subscriptions. No hidden fees. Just lifetime access to TELC B1, B2, and C1 exam preparation with expert strategies and practice tests.',
    huDescription:
      'Nincs előfizetés. Nincs rejtett díj. Csak élettartamos hozzáférés a TELC B1, B2 és C1 nyelvvizsga felkészítéséhez szakértői stratégiákkal és gyakorlati tesztekkel.',
    keywords: 'TELC pricing, TELC course price, pay once study forever',
    huKeywords: 'TELC árak, TELC tanfolyam ár, egyszeri fizetés örökkön tanulás',
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    path: '/sitemap',
    title: 'Sitemap',
    huTitle: 'Oldaltérkép',
    description: 'A complete map of every page on English Exam Excellence.',
    huDescription: 'Egy teljes térkép minden oldalról az English Exam Excellence oldalon.',
    keywords: 'sitemap, English Exam Excellence',
    huKeywords: 'oldaltérkép, TELC oldal',
    changefreq: 'weekly',
    priority: '0.5',
  },
  {
    path: '/privacy',
    title: 'Privacy Policy',
    huTitle: 'Adatvédelmi Irányelv',
    description:
      'Privacy Policy for English Exam Excellence. Learn how we collect, use, and protect your data, including cookies and Google AdSense advertising.',
    huDescription:
      'Adatvédelmi irányelv az English Exam Excellence-nak. Tudj meg róla, hogyan gyűjtjük, használjuk és védjük az adataidat, beleértve a sütiket és a Google AdSense hirdetéseket.',
    keywords: 'privacy policy, English Exam Excellence',
    huKeywords: 'adatvédelem, TELC adatvédelmi irányelv',
    changefreq: 'yearly',
    priority: '0.3',
  },
  {
    path: '/contact',
    title: 'Contact Us',
    huTitle: 'Kapcsolat',
    description:
      'Contact English Exam Excellence for TELC exam preparation questions. We reply within 24-48 hours.',
    huDescription:
      'Kapcsolatfelvétel az English Exam Excellence-nal a TELC nyelvvizsga felkészítéssel kapcsolatos kérdésekre. 24-48 órán belül válaszolunk.',
    keywords: 'contact, TELC exam preparation',
    huKeywords: 'kapcsolat, TELC felkészítés kérdés',
    changefreq: 'monthly',
    priority: '0.3',
  },
];

const LEVEL_ROUTES = LEVELS.flatMap((level) => {
  const L = LEVEL_TITLES[level];
  const LH = LEVEL_TITLES_HU[level];

  return [
    {
      path: `/telc/${level}`,
      title: `TELC ${L} Exam Preparation`,
      huTitle: `TELC ${LH} Nyelvvizsga Felkészítés`,
      description: LEVEL_DESCRIPTIONS[level],
      huDescription: LEVEL_DESCRIPTIONS_HU[level],
      keywords: `TELC ${L} preparation, TELC ${L} practice, TELC ${L} exam`,
      huKeywords: `TELC ${LH} felkészítés, TELC ${LH} teszt, TELC ${LH} gyakorlat`,
      changefreq: 'weekly',
      priority: level === 'b2' ? '0.9' : '0.8',
      schema: { level: L, kind: 'course' },
    },
    {
      path: `/telc/${level}/mini-test`,
      title: `TELC ${L} Mini Test`,
      huTitle: `TELC ${LH} Mini Próbavizsga`,
      description: `A short TELC ${L} practice test covering all four skills. Free, no sign-up required.`,
      huDescription: `Rövid TELC ${LH} gyakorlati teszt az összes négy képességre. Ingyenes, nincs regisztráció szükséges.`,
      keywords: `TELC ${L} mini test, free TELC ${L} test`,
      huKeywords: `TELC ${LH} mini teszt, ingyenes TELC ${LH} próbavizsga`,
      changefreq: 'monthly',
      priority: '0.7',
    },
    ...SKILLS.map((skill) => ({
      path: `/telc/${level}/${skill}`,
      title: `TELC ${L} ${SKILL_NAMES[skill]}`,
      huTitle: `TELC ${LH} ${SKILL_NAMES_HU[skill]}`,
      description: `Free TELC ${L} ${SKILL_NAMES[skill].toLowerCase()} practice: timed exercises, model answers, and examiner-style strategies for the ${L} exam.`,
      huDescription: `Ingyenes TELC ${LH} ${SKILL_NAMES_HU[skill].toLowerCase()} gyakorlat: időzített feladatok, minta válaszok és vizsgáztói stílusú stratégiák a ${LH} vizsgára.`,
      keywords: `TELC ${L} ${SKILL_NAMES[skill]} practice, TELC ${L} ${SKILL_NAMES[skill]}`,
      huKeywords: `TELC ${LH} ${SKILL_NAMES_HU[skill]} gyakorlat, TELC ${LH} ${SKILL_NAMES_HU[skill]}`,
      changefreq: 'monthly',
      priority: '0.7',
    })),
  ];
});

const TOOL_ROUTES = [
  {
    path: '/telc/vocabulary',
    title: 'Vocabulary Lab',
    huTitle: 'TELC Angol Szókincs Labor',
    description:
      'Spaced-repetition vocabulary training for the TELC exam. Build lasting word knowledge that speeds up reading comprehension.',
    huDescription:
      'Időintervallumos ismétlés alapú szókincs tréning a TELC nyelvvizsgára. Építs maradandó szótudást, ami felgyorsítja az olvasási megértést.',
    keywords: 'TELC vocabulary, English vocabulary practice, TELC words',
    huKeywords: 'TELC szókincs, angol szókincs gyakorlat, TELC szavak',
    changefreq: 'monthly',
    priority: '0.6',
  },
  ...LEVELS.map((level) => ({
    path: `/telc/vocabulary/${level}`,
    title: `TELC ${LEVEL_TITLES[level]} Vocabulary`,
    huTitle: `TELC ${LEVEL_TITLES_HU[level]} Szókincs`,
    description: `Vocabulary practice for the TELC ${LEVEL_TITLES[level]} exam, built around the words that actually appear in the reading and listening papers.`,
    huDescription: `Szókincs gyakorlat a TELC ${LEVEL_TITLES_HU[level]} nyelvvizsgára, a valódi olvasási és hallási szövegokban esiintő szavak körül épülve.`,
    keywords: `TELC ${LEVEL_TITLES[level]} vocabulary, TELC words`,
    huKeywords: `TELC ${LEVEL_TITLES_HU[level]} szókincs, TELC szavak`,
    changefreq: 'monthly',
    priority: '0.6',
  })),
  {
    path: '/telc/drillshub',
    title: 'Drills Hub',
    huTitle: 'TELC Gyakorlatok Központ',
    description:
      'Targeted grammar, reading, writing and speaking drills that transfer beyond any single test. Free, no sign-up required.',
    huDescription: 'Célzott nyelvtan, olvasás, írás és beszéd gyakorlatok, amelyek minden vizsgán túl is hasznosak. Ingyenes, nincs regisztráció.',
    keywords: 'TELC drills, TELC grammar practice, TELC reading practice',
    huKeywords: 'TELC gyakorlatok, TELC nyelvtan gyakorlat, TELC olvasás gyakorlat',
    changefreq: 'monthly',
    priority: '0.6',
  },
  ...LEVELS.map((level) => ({
    path: `/telc/drillshub/${level}`,
    title: `TELC ${LEVEL_TITLES[level]} Drills`,
    huTitle: `TELC ${LEVEL_TITLES_HU[level]} Gyakorlatok`,
    description: `Targeted ${LEVEL_TITLES[level]} drills: grammar, reading, writing and speaking exercises with instant scoring and XP rewards.`,
    huDescription: `Célzott ${LEVEL_TITLES_HU[level]} gyakorlatok: nyelvtan, olvasás, írás és beszéd feladatok azonnali pontozással és XP jutalommal.`,
    keywords: `TELC ${LEVEL_TITLES[level]} drills, TELC practice`,
    huKeywords: `TELC ${LEVEL_TITLES_HU[level]} gyakorlatok, TELC gyakorlat`,
    changefreq: 'monthly',
    priority: '0.6',
  })),
  {
    path: '/telc/mywords',
    title: 'My Saved Words',
    huTitle: 'Mentett Szavaim',
    description: 'Your personal word list, saved in your browser, for review between practice sessions.',
    huDescription: 'Személyes szólista a böngésződben mentve, az ismétléshez a gyakorlati munkamenetek között.',
    keywords: 'my saved words, vocabulary list',
    huKeywords: 'mentett szavak, szókincs lista',
    changefreq: 'monthly',
    priority: '0.5',
  },
];

/** Every public, indexable route, in sitemap order. */
export const PUBLIC_ROUTES = [
  ...TOP_LEVEL,
  ...LEVEL_ROUTES,
  ...TOOL_ROUTES,
];

/** Full <title> value for a registry entry. */
export function formatTitle(title) {
  if (!title || title === DEFAULT_TITLE) return DEFAULT_TITLE;
  return `${title} | ${SITE_NAME}`;
}

/** Full Hungarian <title> value for a registry entry. */
export function formatHuTitle(huTitle) {
  if (!huTitle || huTitle === DEFAULT_HU_TITLE) return DEFAULT_HU_TITLE;
  return `${huTitle} | ${SITE_NAME}`;
}

/** Strip query/hash, collapse trailing slashes, guarantee a leading slash. */
export function normalizePath(pathname) {
  if (!pathname) return '/';
  let path = String(pathname).split('?')[0].split('#')[0];
  if (!path.startsWith('/')) path = `/${path}`;
  if (path.length > 1) path = path.replace(/\/+$/, '');
  return path;
}

/** Registry entry for a pathname, or null when the path is not a public route. */
export function findRoute(pathname) {
  const path = normalizePath(pathname);
  return PUBLIC_ROUTES.find((route) => route.path === path) || null;
}

/** Absolute canonical URL for a pathname (falls back to the site root). */
export function absoluteUrl(pathname) {
  const route = findRoute(pathname);
  return route ? `${SITE_URL}${route.path === '/' ? '/' : route.path}` : `${SITE_URL}/`;
}

/** False for unknown URLs so callers can emit noindex instead of a bogus canonical. */
export function isIndexable(pathname) {
  return findRoute(pathname) !== null;
}

/**
 * { title, description } for a route, or an empty object when unknown.
 * Page components read their <SEO> props from here so the runtime <head>
 * always matches the build-time prerender.
 */
export function routeMeta(pathname) {
  const route = findRoute(pathname);
  if (!route) return {};
  return { title: route.title, description: route.description };
}

/**
 * Hungarian { title, description } for a route, or an empty object when unknown.
 */
export function routeMetaHu(pathname) {
  const route = findRoute(pathname);
  if (!route) return {};
  return { title: route.huTitle, description: route.huDescription };
}

/**
 * All public routes with both English and Hungarian variants, for prerendering.
 * Each entry: { path, lang, title, description, ...routeFields }
 */
export function localizedRoutes() {
  const routes = [];
  for (const route of PUBLIC_ROUTES) {
    routes.push({
      ...route,
      path: route.path,
      lang: 'en',
      title: route.title,
      description: route.description,
      keywords: route.keywords,
    });
    routes.push({
      ...route,
      path: `/hu${route.path}`,
      lang: 'hu',
      title: route.huTitle,
      description: route.huDescription,
      keywords: route.huKeywords,
    });
  }
  return routes;
}
