import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, MapPin, Clock, Send } from 'lucide-react';
import SEO from '../SEO';
import { routeMeta } from '../../seo/routes';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will respond soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      <SEO
        {...routeMeta('/contact')}
      />
    <div className="contact-page">
      <header className="contact-header">
        <Link to="/" className="back-link">
          <ArrowLeft size={20} /> Back to Home
        </Link>
        <h1>Contact Us</h1>
        <p className="contact-subtitle">
          Have a question about TELC exam preparation? We typically respond within 24-48 hours.
        </p>
      </header>

      <div className="contact-content">
        <section className="contact-details">
          <h2>Get in Touch</h2>
          <div className="contact-grid">
            <div className="contact-item">
              <Mail size={24} color="var(--primary)" />
              <div>
                <h3>Email</h3>
                <a href="mailto:hello@englishexamexercises.com">hello@englishexamexercises.com</a>
              </div>
            </div>
            <div className="contact-item">
              <MapPin size={24} color="var(--primary)" />
              <div>
                <h3>Based in</h3>
                <p>Budapest, Hungary</p>
              </div>
            </div>
            <div className="contact-item">
              <Clock size={24} color="var(--primary)" />
              <div>
                <h3>Response Time</h3>
                <p>Mon–Fri, within 24 hours</p>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-form-section">
          <h2>Send a Message</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your message..."
              rows="6"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button type="submit" className="btn-send">
              <Send size={18} /> Send Message
            </button>
          </form>
        </section>
      </div>
    </div>
    </>
  );
};

export default ContactPage;
