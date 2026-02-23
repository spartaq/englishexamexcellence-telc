import { useEffect } from 'react';

const SEO = ({ title, description, keywords, canonicalUrl }) => {
  useEffect(() => {
    // Update title
    const defaultTitle = "English Exam Excellence - IELTS, TOEFL & LangCert Preparation";
    document.title = title ? `${title} | ${defaultTitle}` : defaultTitle;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description || 'Prepare for IELTS, TOEFL, and LangCert exams with expert strategies, practice tests, and interactive lessons.');
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'description';
      newMeta.content = description || 'Prepare for IELTS, TOEFL, and LangCert exams with expert strategies, practice tests, and interactive lessons.';
      document.head.appendChild(newMeta);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords || 'IELTS preparation, TOEFL practice, LangCert tests, English exam strategies, academic English, test-taking tips');
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'keywords';
      newMeta.content = keywords || 'IELTS preparation, TOEFL practice, LangCert tests, English exam strategies, academic English, test-taking tips';
      document.head.appendChild(newMeta);
    }

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonicalUrl) {
      if (canonical) {
        canonical.setAttribute('href', canonicalUrl);
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'canonical';
        newLink.href = canonicalUrl;
        document.head.appendChild(newLink);
      }
    } else if (canonical) {
      canonical.remove();
    }

    // Add Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title || 'English Exam Excellence');
    } else {
      const newMeta = document.createElement('meta');
      newMeta.property = 'og:title';
      newMeta.content = title || 'English Exam Excellence';
      document.head.appendChild(newMeta);
    }

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description || 'Prepare for IELTS, TOEFL, and LangCert exams with expert strategies, practice tests, and interactive lessons.');
    } else {
      const newMeta = document.createElement('meta');
      newMeta.property = 'og:description';
      newMeta.content = description || 'Prepare for IELTS, TOEFL, and LangCert exams with expert strategies, practice tests, and interactive lessons.';
      document.head.appendChild(newMeta);
    }

    let ogType = document.querySelector('meta[property="og:type"]');
    if (ogType) {
      ogType.setAttribute('content', 'website');
    } else {
      const newMeta = document.createElement('meta');
      newMeta.property = 'og:type';
      newMeta.content = 'website';
      document.head.appendChild(newMeta);
    }

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', canonicalUrl || window.location.href);
    } else {
      const newMeta = document.createElement('meta');
      newMeta.property = 'og:url';
      newMeta.content = canonicalUrl || window.location.href;
      document.head.appendChild(newMeta);
    }

    // Add Twitter Card tags
    let twitterCard = document.querySelector('meta[name="twitter:card"]');
    if (twitterCard) {
      twitterCard.setAttribute('content', 'summary');
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'twitter:card';
      newMeta.content = 'summary';
      document.head.appendChild(newMeta);
    }

    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', title || 'English Exam Excellence');
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'twitter:title';
      newMeta.content = title || 'English Exam Excellence';
      document.head.appendChild(newMeta);
    }

    let twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', description || 'Prepare for IELTS, TOEFL, and LangCert exams with expert strategies, practice tests, and interactive lessons.');
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'twitter:description';
      newMeta.content = description || 'Prepare for IELTS, TOEFL, and LangCert exams with expert strategies, practice tests, and interactive lessons.';
      document.head.appendChild(newMeta);
    }

  }, [title, description, keywords, canonicalUrl]);

  return null;
};

export default SEO;
