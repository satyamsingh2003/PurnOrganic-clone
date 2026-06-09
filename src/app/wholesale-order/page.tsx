import React from 'react';

export default function WholesaleOrderPage() {
  return (
    <div className="section-padding" style={{ backgroundColor: 'var(--bg-light)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ backgroundColor: 'var(--white)', padding: '3rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <h1 className="section-title">Wholesale Inquiry</h1>
          <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '3rem' }}>
            Interested in stocking PurnOrganic products in your store, restaurant, or hotel? Fill out the form below and our B2B team will get back to you within 24 hours.
          </p>

          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>First Name</label>
                <input type="text" style={{ padding: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '6px' }} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Last Name</label>
                <input type="text" style={{ padding: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '6px' }} required />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Business Name</label>
              <input type="text" style={{ padding: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '6px' }} required />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Business Type</label>
              <select style={{ padding: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: 'var(--white)' }}>
                <option>Retail Store</option>
                <option>Restaurant/Cafe</option>
                <option>Hotel</option>
                <option>Distributor</option>
                <option>Other</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Message / Requirements</label>
              <textarea rows={5} style={{ padding: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '6px', resize: 'vertical' }} required></textarea>
            </div>

            <button type="button" className="btn-primary" style={{ marginTop: '1rem' }}>Submit Inquiry</button>
          </form>
        </div>
      </div>
    </div>
  );
}
