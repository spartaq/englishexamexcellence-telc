import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import LandingPage from './components/LandingPage/LandingPage';
import ExamDescription from './components/ui/TELCExamDescription';
import PricingPage from './components/ui/PricingPage';
import SitemapPage from './components/ui/SitemapPage';
import PrivacyPage from './components/ui/PrivacyPage';
import ContactPage from './components/ui/ContactPage';
import NotFoundPage from './components/ui/NotFoundPage';

import CookieConsent from './components/ui/CookieConsent';
import LanguageProvider from './contexts/LanguageContext';
import LanguageDetectionInitializer from './components/ui/LanguageDetectionInitializer';

const Router = () => {
  return (
    <>
      <CookieConsent />
      <LanguageProvider>
        <LanguageDetectionInitializer />
        <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Public route for SEO - TELC Info page */}
        <Route path="/telc-info" element={<ExamDescription activeTest={{ title: 'TELC' }} />} />

        {/* Public route - Pricing page */}
        <Route path="/pricing" element={<PricingPage />} />

        {/* Public route - Human-readable sitemap */}
        <Route path="/sitemap" element={<SitemapPage />} />

        {/* Public route - Privacy Policy */}
        <Route path="/privacy" element={<PrivacyPage />} />

        {/* Public route - Contact */}
        <Route path="/contact" element={<ContactPage />} />

        {/* TELC B1 routes */}
        <Route path="/telc/b1" element={<App initialView="telc-b1-hub" />} />
        <Route path="/telc/b1/mini-test" element={<App initialView="telc-b1-mini-test" />} />
        <Route path="/telc/b1/reading" element={<App initialView="telc_b1_reading" />} />
        <Route path="/telc/b1/writing" element={<App initialView="telc_b1_writing" />} />
        <Route path="/telc/b1/speaking" element={<App initialView="telc_b1_speaking" />} />
        <Route path="/telc/b1/listening" element={<App initialView="telc_b1_listening" />} />

        {/* TELC B2 routes */}
        <Route path="/telc/b2" element={<App initialView="telc-b2-hub" />} />
        <Route path="/telc/b2/mini-test" element={<App initialView="telc-b2-mini-test" />} />
        <Route path="/telc/b2/reading" element={<App initialView="telc_b2_reading" />} />
        <Route path="/telc/b2/writing" element={<App initialView="telc_b2_writing" />} />
        <Route path="/telc/b2/speaking" element={<App initialView="telc_b2_speaking" />} />
        <Route path="/telc/b2/listening" element={<App initialView="telc_b2_listening" />} />

        {/* Split Pane Test Prototype */}
        <Route path="/split-pane-test" element={<App initialView="split-pane-test" />} />

        {/* TELC C1 routes */}
        <Route path="/telc/c1" element={<App initialView="telc-c1-hub" />} />
        <Route path="/telc/c1/mini-test" element={<App initialView="telc-c1-mini-test" />} />
        <Route path="/telc/c1/reading" element={<App initialView="telc_c1_reading" />} />
        <Route path="/telc/c1/writing" element={<App initialView="telc_c1_writing" />} />
        <Route path="/telc/c1/speaking" element={<App initialView="telc_c1_speaking" />} />
        <Route path="/telc/c1/listening" element={<App initialView="telc_c1_listening" />} />

        {/* Shared routes (vocab, drills, my words) */}
        <Route path="/telc/vocabulary/b1" element={<App initialView="vocabulary" initialLevel="b1" />} />
        <Route path="/telc/vocabulary/b2" element={<App initialView="vocabulary" initialLevel="b2" />} />
        <Route path="/telc/vocabulary/c1" element={<App initialView="vocabulary" initialLevel="c1" />} />
        <Route path="/telc/vocabulary" element={<App initialView="vocabulary" />} />
        <Route path="/telc/drillshub/b1" element={<App initialView="drillshub" initialLevel="b1" />} />
        <Route path="/telc/drillshub/b2" element={<App initialView="drillshub" initialLevel="b2" />} />
        <Route path="/telc/drillshub/c1" element={<App initialView="drillshub" initialLevel="c1" />} />
        <Route path="/telc/drillshub" element={<App initialView="drillshub" />} />
        <Route path="/telc/mywords" element={<App initialView="mywords" />} />

        {/* Hungarian language routes (/hu/) */}
        <Route path="/hu/" element={<App initialView="telc-b2-hub" locale="hu" />} />
        <Route path="/hu/telc-info" element={<ExamDescription activeTest={{ title: 'TELC' }} locale="hu" />} />

        {/* Public route - Pricing page */}
        <Route path="/hu/pricing" element={<PricingPage locale="hu" />} />

        {/* Public route - Human-readable sitemap */}
        <Route path="/hu/sitemap" element={<SitemapPage locale="hu" />} />

        {/* Public route - Privacy Policy */}
        <Route path="/hu/privacy" element={<PrivacyPage locale="hu" />} />

        {/* Public route - Contact */}
        <Route path="/hu/contact" element={<ContactPage locale="hu" />} />

        {/* TELC B1 routes */}
        <Route path="/hu/telc/b1" element={<App initialView="telc-b1-hub" locale="hu" />} />
        <Route path="/hu/telc/b1/mini-test" element={<App initialView="telc-b1-mini-test" locale="hu" />} />
        <Route path="/hu/telc/b1/reading" element={<App initialView="telc_b1_reading" locale="hu" />} />
        <Route path="/hu/telc/b1/writing" element={<App initialView="telc_b1_writing" locale="hu" />} />
        <Route path="/hu/telc/b1/speaking" element={<App initialView="telc_b1_speaking" locale="hu" />} />
        <Route path="/hu/telc/b1/listening" element={<App initialView="telc_b1_listening" locale="hu" />} />

        {/* TELC B2 routes */}
        <Route path="/hu/telc/b2" element={<App initialView="telc-b2-hub" locale="hu" />} />
        <Route path="/hu/telc/b2/mini-test" element={<App initialView="telc-b2-mini-test" locale="hu" />} />
        <Route path="/hu/telc/b2/reading" element={<App initialView="telc_b2_reading" locale="hu" />} />
        <Route path="/hu/telc/b2/writing" element={<App initialView="telc_b2_writing" locale="hu" />} />
        <Route path="/hu/telc/b2/speaking" element={<App initialView="telc_b2_speaking" locale="hu" />} />
        <Route path="/hu/telc/b2/listening" element={<App initialView="telc_b2_listening" locale="hu" />} />

        {/* TELC C1 routes */}
        <Route path="/hu/telc/c1" element={<App initialView="telc-c1-hub" locale="hu" />} />
        <Route path="/hu/telc/c1/mini-test" element={<App initialView="telc-c1-mini-test" locale="hu" />} />
        <Route path="/hu/telc/c1/reading" element={<App initialView="telc_c1_reading" locale="hu" />} />
        <Route path="/hu/telc/c1/writing" element={<App initialView="telc_c1_writing" locale="hu" />} />
        <Route path="/hu/telc/c1/speaking" element={<App initialView="telc_c1_speaking" locale="hu" />} />
        <Route path="/hu/telc/c1/listening" element={<App initialView="telc_c1_listening" locale="hu" />} />

        {/* Shared routes (vocab, drills, my words) */}
        <Route path="/hu/telc/vocabulary/b1" element={<App initialView="vocabulary" initialLevel="b1" locale="hu" />} />
        <Route path="/hu/telc/vocabulary/b2" element={<App initialView="vocabulary" initialLevel="b2" locale="hu" />} />
        <Route path="/hu/telc/vocabulary/c1" element={<App initialView="vocabulary" initialLevel="c1" locale="hu" />} />
        <Route path="/hu/telc/vocabulary" element={<App initialView="vocabulary" locale="hu" />} />
        <Route path="/hu/telc/drillshub/b1" element={<App initialView="drillshub" initialLevel="b1" locale="hu" />} />
        <Route path="/hu/telc/drillshub/b2" element={<App initialView="drillshub" initialLevel="b2" locale="hu" />} />
        <Route path="/hu/telc/drillshub/c1" element={<App initialView="drillshub" initialLevel="c1" locale="hu" />} />
        <Route path="/hu/telc/drillshub" element={<App initialView="drillshub" locale="hu" />} />
        <Route path="/hu/telc/mywords" element={<App initialView="mywords" locale="hu" />} />
      </Routes>
      </LanguageProvider>
    </>
  );
};

export default Router;
