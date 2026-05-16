import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Globe, Sparkles, Users, ShieldCheck } from 'lucide-react';
import PRICING_TIERS from '../../data/pricing/tiers';
import PRICING_TESTIMONIALS from '../../data/pricing/testimonials';
import './PricingPage.css';

const PricingPage = () => {
  return (
    <div className="pricing-page">
      <header className="pricing-hero">
        <div className="pricing-hero-content">
          <h1>Pay Once, Study Forever</h1>
          <p className="pricing-subtitle">
            No subscriptions. No hidden fees. Just lifetime access to TELC mastery.
          </p>
          <div className="pricing-value-props">
            <div className="pricing-prop">
              <Globe size={20} />
              <span>Study anytime, anywhere</span>
            </div>
            <div className="pricing-prop">
              <Sparkles size={20} />
              <span>One-time payment, lifetime access</span>
            </div>
            <div className="pricing-prop">
              <ShieldCheck size={20} />
              <span>14-day money-back guarantee</span>
            </div>
          </div>
        </div>
      </header>

      <section className="pricing-tiers">
        <h2>Choose Your Access Level</h2>
        <div className="pricing-cards">
          {Object.values(PRICING_TIERS).map(tier => (
            <div 
              key={tier.id} 
              className={`pricing-card ${tier.popular ? 'popular' : ''}`}
            >
              <div className="pricing-card-header">
                <h3>{tier.title}</h3>
                {tier.price.amount > 0 && (
                  <div className="pricing-price">
                    {tier.price.amount.toLocaleString()}{tier.price.currency}
                    {tier.price.period === 'one-time' && (
                      <span className="pricing-period"> (one-time)</span>
                    )}
                  </div>
                )}
                <div className="pricing-badge">
                  {tier.popular && 'Most Popular'}
                </div>
              </div>

              <div className="pricing-card-body">
                <p className="pricing-description">{tier.description}</p>
                
                <ul className="pricing-features">
                  {tier.features.map((feature, index) => (
                    <li key={index}>
                      <span className="feature-check">✓</span> {feature}
                    </li>
                  ))}
                </ul>
                
                <Link 
                  to={tier.ctaLink} 
                  className="pricing-cta-button"
                >
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="pricing-testimonials">
        <h2>What Our Students Say</h2>
        <div className="testimonials-container">
          {PRICING_TESTIMONIALS.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <p>"{testimonial.text}"</p>
              <p className="testimonial-author">
                - {testimonial.author}, {testimonial.location}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="pricing-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-items">
          <div className="faq-item">
            <h3 className="faq-question">Is this a subscription?</h3>
            <div className="faq-answer">
              No! You pay once for lifetime access. No recurring charges, no auto-renewals.
            </div>
          </div>
          <div className="faq-item">
            <h3 className="faq-question">What payment methods do you accept?</h3>
            <div className="faq-answer">
              We accept all major credit cards through our secure payment processor.
            </div>
          </div>
          <div className="faq-item">
            <h3 className="faq-question">Do I get all future updates?</h3>
            <div className="faq-answer">
              Yes! Your lifetime access includes all future content updates and improvements.
            </div>
          </div>
          <div className="faq-item">
            <h3 className="faq-question">What is the Community Forum?</h3>
            <div className="faq-answer">
              Ask English learning questions and get answers from our teaching team. 
              Responses typically come within a few hours (not real-time chat).
            </div>
          </div>
          <div className="faq-item">
            <h3 className="faq-question">Can I get a refund?</h3>
            <div className="faq-answer">
              Absolutely. If you're not satisfied within 14 days of purchase, we'll give you a full refund.
            </div>
          </div>
          <div className="faq-item">
            <h3 className="faq-question">Is my progress saved forever?</h3>
            <div className="faq-answer">
              Yes! All your progress, scores, and achievements are permanently saved to your account.
            </div>
          </div>
        </div>
      </section>

      <footer className="pricing-footer">
        <p>Ready to master the TELC exam?</p>
        <Link to="/telc/b2" className="pricing-footer-cta">
          Start Learning Free →
        </Link>
      </footer>
    </div>
  );
};

export default PricingPage;