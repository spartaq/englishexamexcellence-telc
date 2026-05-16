/**
 * structuredData.js — JSON-LD schema builders for English Exam Excellence
 *
 * Import and pass the returned plain object stringified into
 * <script type="application/ld+json"> via the SEO component.
 *
 * Usage (inside SEO.jsx):
 *   import { organizationSchema, faqSchema, breadcrumbSchema } from '../utils/structuredData';
 *
 *   const jsonLdBlock = { __html: organizationSchema };
 *   useEffect(() => { setJsonLd(jsonLdBlock); }, []);
 *
 *   // Breadcrumbs per page
 *   const breadcrumbs = breadcrumbSchema([
 *     { name: 'TELC B1', url: '/telc/b1' },
 *     { name: 'Reading', url: '/telc/b1/reading' },
 *   ]);
 */

const SITE_URL = 'https://telc.englishexamexercises.com';

/* ============================================================
   1. ORGANIZATION — embedded on every page
   ============================================================ */
export function organizationSchema() {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'English Exam Excellence',
    url: SITE_URL,
    logo: `${SITE_URL}/icon-192x192.png`,
    description:
      'Expert TELC B1, B2, and C1 English exam preparation with interactive training sessions and practice tests.',
    sameAs: [],
  });
}

/* ============================================================
   2. WEBSITE + SEARCHACTION — landing / root page only
   ============================================================ */
export function websiteSchema() {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'English Exam Excellence',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      queryInput: 'required name=search_term_string',
    },
  });
}

/* ============================================================
   3. FAQPAGE — PricingPage only
   ============================================================ */
export function faqSchema(questions) {
  /*
   * questions: array of { question: string, answer: string }
   * e.g.
   *   [
   *     { question: 'Is this a subscription?', answer: 'No! You pay once…' },
   *   ]
   */
  const mainEntity = questions.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: answer,
    },
  }));

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
  });
}

/* ============================================================
   4. BREADCRUMBLIST — per-page dynamic breadcrumbs
   ============================================================ */
export function breadcrumbSchema(items) {
  /*
   * items: array of { name: string, url: string }
   * e.g.
   *   [
   *     { name: 'Home', url: SITE_URL },
   *     { name: 'TELC B2', url: `${SITE_URL}/telc/b2` },
   *     { name: 'Reading', url: `${SITE_URL}/telc/b2/reading` },
   *   ]
   */
  const itemListElement = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
  }));

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  });
}

/* ============================================================
   5. COURSE / EDUCATIONAL OFFERING — for exam-level pages
   ============================================================ */
export function courseSchema({ level, title, description, url }) {
  /*
   * level: 'B1' | 'B2' | 'C1'
   * title: 'TELC B1 Hub'
   * description: human-readable
   * url: full canonical URL
   */
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: title,
    description,
    url,
    provider: {
      '@type': 'Organization',
      name: 'English Exam Excellence',
      url: SITE_URL,
    },
    educationalLevel: `CEFR ${level}`,
    inLanguage: 'en',
    typicalAgeRange: '18-',
  });
}
