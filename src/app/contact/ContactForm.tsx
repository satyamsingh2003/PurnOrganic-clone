"use client";

import React, { useState } from 'react';
import styles from './page.module.css';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setShowSuccessModal(true);
      } else {
        const errorData = await res.json();
        alert(`Failed to send message: ${errorData.error}`);
      }
    } catch (err) {
      alert('An error occurred while sending your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formCard}>
      <h2 className={styles.formTitle}>Send Us a Message</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Full Name</label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input} 
            placeholder="Enter your name" 
            required 
          />
        </div>
        
        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input} 
              placeholder="email@example.com" 
              required 
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Mobile Number</label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={styles.input} 
              placeholder="+91 0000000000" 
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>How can we help?</label>
          <textarea 
            rows={5} 
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={styles.textarea} 
            placeholder="Describe your requirement..." 
            required
          ></textarea>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      {showSuccessModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div style={{
            background: 'white', padding: '2.5rem', borderRadius: '12px', 
            maxWidth: '450px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%', background: '#dcfce7', 
              color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              margin: '0 auto 1.5rem', fontSize: '2rem'
            }}>
              ✓
            </div>
            <h3 style={{ fontSize: '1.5rem', color: '#111827', marginBottom: '1rem', fontWeight: 600 }}>Thank You!</h3>
            <p style={{ color: '#4b5563', marginBottom: '2rem', lineHeight: 1.6 }}>
              We have received your message and will get back to you shortly.
            </p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                background: '#1a4d2e', color: 'white', border: 'none', padding: '0.75rem 2rem', 
                borderRadius: '6px', fontWeight: 600, cursor: 'pointer', width: '100%'
              }}
            >
              Close & Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
