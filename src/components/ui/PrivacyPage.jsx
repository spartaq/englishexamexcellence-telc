import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '../SEO';
import { routeMeta } from '../../seo/routes';
import './PrivacyPage.css';

const PrivacyPage = () => {
  return (
    <>
      <SEO
        {...routeMeta('/privacy')}
      />
    <div className="privacy-page">
      <header className="privacy-header">
        <Link to="/" className="back-link">
          <ArrowLeft size={20} /> Back to Home
        </Link>
        <h1>Privacy Policy</h1>
        <p className="update-date">Last updated: September 21, 2026</p>
      </header>

      <div className="privacy-content">
        <section>
          <h2>1. Introduction</h2>
          <p>
            English Exam Excellence ("we", "us", or "our") operates the telc.englishexamexercises.com
            website (the "Site"). This Privacy Policy explains how we collect, use, disclose, and
            protect your information when you visit our Site.
          </p>
          <p>
            The Site provides free TELC (B1, B2, C1) English exam preparation materials including
            interactive exercises, mock exams, vocabulary drills, and skill-building tools. All
            content is freely accessible without registration.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>

          <h3>2.1 Information You Provide Directly</h3>
          <p>
            You may visit the Site without providing any personally identifiable information. We do
            not currently require registration to access any content. If we introduce optional
            registration in the future for progress-tracking features, we will ask for information
            such as your email address and will update this policy accordingly.
          </p>

          <h3>2.2 Information Collected Automatically</h3>
          <p>We may collect information about your device and usage automatically, including:</p>
          <ul>
            <li><strong>Log Data:</strong> IP address, browser type, operating system, referral URLs, pages viewed, and timestamps.</li>
            <li><strong>Cookies and Tracking Technologies:</strong> See Section 4 below.</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <ul>
            <li>To provide and maintain the Site</li>
            <li>To improve user experience and site performance</li>
            <li>To analyze usage patterns and diagnose technical issues</li>
            <li>To display personalized and non-personalized advertising via Google AdSense</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2>4. Cookies and Tracking Technologies</h2>
          <p>
            We and third parties may use cookies, web beacons, and similar technologies to collect
            information about your browsing behavior. Cookies are small data files stored on your
            device.
          </p>

          <h3>4.1 Cookies We Use</h3>
          <ul>
            <li><strong>Essential Cookies:</strong> Necessary for the Site to function (e.g., session state, theme preferences).</li>
            <li><strong>Analytics Cookies:</strong> Used to understand how visitors interact with the Site (e.g., Google Analytics).</li>
            <li><strong>Advertising Cookies:</strong> Used by Google AdSense to serve and track ads.</li>
          </ul>

          <h3>4.2 Third-Party Cookies — Google AdSense</h3>
          <p>
            We use Google AdSense to display advertisements. Google may place cookies (such as the
            DART cookie) on your browser to serve ads based on your visit to our Site and other
            sites on the internet. You can opt out of personalized advertising by visiting
            <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">
              Google Ads Settings
            </a>.
          </p>
          <p>
            For EU/EEA users: We serve non-personalized ads by default unless you explicitly consent
            to personalized advertising through our cookie consent banner. See Section 7 for GDPR
            rights.
          </p>
        </section>

        <section>
          <h2>5. Third-Party Services</h2>
          <p>
            Our Site may contain links to or use services from third parties, including:
          </p>
          <ul>
            <li><strong>Google AdSense:</strong> Serves advertisements. Google's privacy practices are governed by their <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</li>
            <li><strong>Google Analytics:</strong> May be used for site analytics. Google's privacy practices are governed by their <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</li>
            <li><strong>Lucide React:</strong> Icon library used for UI elements. No data collection.</li>
          </ul>
          <p>
            We are not responsible for the privacy practices of these third-party services. We
            encourage you to review their privacy policies.
          </p>
        </section>

        <section>
          <h2>6. Data Retention and Security</h2>
          <p>
            We retain information for as long as necessary to provide the Site and fulfill the
            purposes described in this Privacy Policy. We implement reasonable security measures to
            protect your data from unauthorized access, alteration, disclosure, or destruction.
          </p>
        </section>

        <section>
          <h2>7. Your Rights Under GDPR (EU/EEA Users)</h2>
          <p>
            If you are a resident of the European Economic Area or United Kingdom, you have the
            following rights under the General Data Protection Regulation (GDPR):
          </p>
          <ul>
            <li><strong>Right to Access:</strong> Request copies of your personal data.</li>
            <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data.</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your personal data.</li>
            <li><strong>Right to Restrict Processing:</strong> Restrict how we use your data.</li>
            <li><strong>Right to Data Portability:</strong> Receive your data in a structured format.</li>
            <li><strong>Right to Object:</strong> Object to processing based on legitimate interests.</li>
            <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time (including advertising cookies).</li>
          </ul>
          <p>
            To exercise these rights, please contact us using the information in Section 8. Please
            note that since we do not require registration, we may not have personal data linked to
            you. Cookie-based identifiers (if any) can be cleared by deleting your browser cookies.
          </p>
        </section>

        <section>
          <h2>8. Children's Privacy</h2>
          <p>
            The Site is not intended for children under the age of 13. We do not knowingly collect
            personally identifiable information from children under 13. If you believe we have
            collected such information, please contact us so we can remove it.
          </p>
        </section>

        <section>
          <h2>9. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The "Last updated" date at the top
            will reflect the most recent revision. We encourage you to review this page periodically.
          </p>
        </section>

        <section>
          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, your data, or your cookie
            preferences, please contact us:
          </p>
          <ul className="contact-info">
            <li>Email: <a href="mailto:hello@englishexamexercises.com">hello@englishexamexercises.com</a></li>
            <li>Page: <Link to="/contact">Contact Page</Link></li>
          </ul>
        </section>
      </div>
    </div>
    </>
  );
};

export default PrivacyPage;
