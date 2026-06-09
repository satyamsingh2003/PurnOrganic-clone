import React from 'react';

export default function ContactPage() {
  return (
    <div className="section-padding">
      <div className="container">
        <h1 className="section-title">Contact Us</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--bg-light)', borderRadius: '8px' }}>
              <div style={{ color: 'var(--primary-color)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <h3 style={{ marginBottom: '0.5rem' }}>Phone</h3>
              <p style={{ color: 'var(--text-light)' }}>+91 98765 43210</p>
              <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Mon-Sat: 9AM - 6PM</p>
            </div>
            
            <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--bg-light)', borderRadius: '8px' }}>
              <div style={{ color: 'var(--primary-color)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <h3 style={{ marginBottom: '0.5rem' }}>Email</h3>
              <p style={{ color: 'var(--text-light)' }}>support@purnorganic.com</p>
              <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>We reply within 24 hours</p>
            </div>

            <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--bg-light)', borderRadius: '8px' }}>
              <div style={{ color: 'var(--primary-color)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <h3 style={{ marginBottom: '0.5rem' }}>Office</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Unit No. LGF-67 Krishna Apra D"mall Plot No-1 Shakti Khand-2 Indirapuram Ghaziabad - 201014</p>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--white)', padding: '3rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>Send us a Message</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Name</label>
                  <input type="text" style={{ padding: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '6px' }} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Email</label>
                  <input type="email" style={{ padding: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '6px' }} required />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Message</label>
                <textarea rows={6} style={{ padding: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '6px', resize: 'vertical' }} required></textarea>
              </div>

              <button type="button" className="btn-primary" style={{ marginTop: '1rem', width: '100%' }}>Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
