import React from 'react';

export default function OpportunityPage() {
  return (
    <div className="section-padding">
      <div className="container">
        <h1 className="section-title">Partner With Us</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-light)', maxWidth: '700px', margin: '0 auto 4rem auto' }}>
          Join the PurnOrganic family. Whether you are a farmer looking to transition to organic methods, or an entrepreneur wanting to start a distributorship.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '2rem', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: 'var(--secondary-color)', color: 'var(--primary-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>Farmer Onboarding</h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>Get fair prices for your organic harvest and access to our agricultural experts.</p>
            <button className="btn-outline" style={{ width: '100%' }}>Apply as Farmer</button>
          </div>

          <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '2rem', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: 'var(--secondary-color)', color: 'var(--primary-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>Distributorship</h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>Become an official distributor of our premium organic products in your city.</p>
            <button className="btn-outline" style={{ width: '100%' }}>Apply as Distributor</button>
          </div>

          <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '2rem', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: 'var(--secondary-color)', color: 'var(--primary-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>Export Partner</h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>Help us take Indian organic heritage to international markets globally.</p>
            <button className="btn-outline" style={{ width: '100%' }}>Apply as Exporter</button>
          </div>
        </div>
      </div>
    </div>
  );
}
