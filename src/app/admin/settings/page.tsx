"use client";

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Contact');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    site_name: '',
    tagline: '',
    cin_number: '',
    gst_number: '',
    currency_symbol: '',
    contact_email: '',
    contact_phone: '',
    whatsapp_number: '',
    full_address: '',
    footer_about: '',
    facebook_pixel_id: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    google_analytics_id: '',
    instagram_url: '',
    facebook_url: '',
    youtube_url: '',
    twitter_url: '',
    free_shipping_threshold: '',
    standard_shipping_charge: '',
    site_logo: '',
    favicon: '',
    msg91_auth_key: '',
    msg91_template_id: '',
    razorpay_key_id: '',
    razorpay_key_secret: '',
    razorpay_mode: 'Test Mode'
  });

  const tabs = [
    { name: 'General', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { name: 'Appearance', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Contact', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
    { name: 'Footer', icon: 'M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z' },
    { name: 'SEO', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { name: 'Social', icon: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z' },
    { name: 'Shipping', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
    { name: 'Integrations', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  ];

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          const map: any = {};
          data.settings.forEach((s: any) => map[s.key] = s.value);
          setSettings(prev => ({ ...prev, ...map }));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldName);
    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const blob = await response.json();
      setSettings(prev => ({ ...prev, [fieldName]: blob.url }));
    } catch (error) {
      console.error(`Error uploading ${fieldName}:`, error);
      alert(`Failed to upload image. Please try again.`);
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        alert('Settings saved successfully!');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Site Settings</h1>
      </div>

      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button 
            key={tab.name} 
            className={`${styles.tab} ${activeTab === tab.name ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab.name)}
          >
            <svg className={styles.tabIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
            </svg>
            {tab.name}
          </button>
        ))}
      </div>

      {activeTab === 'Contact' && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Contact Details</h2>
          
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Contact Email</label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <input type="email" name="contact_email" value={settings.contact_email} onChange={handleChange} className={styles.input} placeholder="support@purnorganic.com" />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Contact Phone</label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <input type="text" name="contact_phone" value={settings.contact_phone} onChange={handleChange} className={styles.input} placeholder="+91 9410333577" />
                </div>
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>WhatsApp Number (digits only, with country code)</label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4-12h-8v2h8v-2zm0 4h-8v2h8v-2z" /></svg>
                  <input type="text" name="whatsapp_number" value={settings.whatsapp_number} onChange={handleChange} className={styles.input} placeholder="919410333577" />
                </div>
                <p className={styles.helpText}>Example: 919876543210 (no +, no spaces)</p>
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Full Address</label>
                <textarea name="full_address" value={settings.full_address} onChange={handleChange} className={styles.textarea} placeholder="Unit No. LGF-67 Krishna Apra D'mall..."></textarea>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'General' && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>General Information</h2>
          
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Site Name <span style={{color: 'red'}}>*</span></label>
                <div className={styles.inputWrapper}>
                  <input type="text" name="site_name" value={settings.site_name || ''} onChange={handleChange} className={styles.inputNoIcon} placeholder="Purn Organic" />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Tagline</label>
                <div className={styles.inputWrapper}>
                  <input type="text" name="tagline" value={settings.tagline || ''} onChange={handleChange} className={styles.inputNoIcon} placeholder="Your Digitally Owned Community Farm" />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>CIN Number</label>
                <div className={styles.inputWrapper}>
                  <input type="text" name="cin_number" value={settings.cin_number || ''} onChange={handleChange} className={styles.inputNoIcon} placeholder="U96907UP2024PTC212593" />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>GST Number</label>
                <div className={styles.inputWrapper}>
                  <input type="text" name="gst_number" value={settings.gst_number || ''} onChange={handleChange} className={styles.inputNoIcon} placeholder="09AAPCP2391B1ZA" />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Currency Symbol</label>
                <div className={styles.inputWrapper}>
                  <input type="text" name="currency_symbol" value={settings.currency_symbol || ''} onChange={handleChange} className={styles.inputNoIcon} placeholder="₹" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'Footer' && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Footer Content</h2>
          
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Footer About / Tagline</label>
                <textarea 
                  name="footer_about" 
                  value={settings.footer_about || ''} 
                  onChange={handleChange} 
                  className={styles.textarea} 
                  placeholder="100% Organic Commitment. Empowering our local farming community through a farmer-first community."
                ></textarea>
                <p className={styles.helpText}>Shown under the logo in the footer.</p>
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Facebook Pixel ID</label>
                <div className={styles.inputWrapper}>
                  <input 
                    type="text" 
                    name="facebook_pixel_id" 
                    value={settings.facebook_pixel_id || ''} 
                    onChange={handleChange} 
                    className={styles.inputNoIcon} 
                    placeholder="123456789012345" 
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'SEO' && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>SEO Settings</h2>
          
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Default Meta Title</label>
                <div className={styles.inputWrapper}>
                  <input 
                    type="text" 
                    name="meta_title" 
                    value={settings.meta_title || ''} 
                    onChange={handleChange} 
                    className={styles.inputNoIcon} 
                    placeholder="Purn Organic - 100% Organic Farm Products" 
                  />
                </div>
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Meta Description</label>
                <textarea 
                  name="meta_description" 
                  value={settings.meta_description || ''} 
                  onChange={handleChange} 
                  className={styles.textarea} 
                  placeholder="Buy 100% organic farm products online. Chemical-free grains, spices, desi ghee..."
                ></textarea>
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Meta Keywords</label>
                <div className={styles.inputWrapper}>
                  <input 
                    type="text" 
                    name="meta_keywords" 
                    value={settings.meta_keywords || ''} 
                    onChange={handleChange} 
                    className={styles.inputNoIcon} 
                    placeholder="organic, farm products, desi ghee, organic spices..." 
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Google Analytics ID</label>
                <div className={styles.inputWrapper}>
                  <input 
                    type="text" 
                    name="google_analytics_id" 
                    value={settings.google_analytics_id || ''} 
                    onChange={handleChange} 
                    className={styles.inputNoIcon} 
                    placeholder="G-XXXXXXXXXX" 
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'Social' && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Social Media Links</h2>
          
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  Instagram URL
                </label>
                <div className={styles.inputWrapper}>
                  <input type="text" name="instagram_url" value={settings.instagram_url || ''} onChange={handleChange} className={styles.inputNoIcon} placeholder="https://instagram.com/purnorganic" />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1877F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  Facebook URL
                </label>
                <div className={styles.inputWrapper}>
                  <input type="text" name="facebook_url" value={settings.facebook_url || ''} onChange={handleChange} className={styles.inputNoIcon} placeholder="https://facebook.com/purnorganic" />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                  YouTube URL
                </label>
                <div className={styles.inputWrapper}>
                  <input type="text" name="youtube_url" value={settings.youtube_url || ''} onChange={handleChange} className={styles.inputNoIcon} placeholder="https://youtube.com/@purnorganic" />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.73 16h5L9 4z"></path><path d="M4 20l6.76-6.76"></path><path d="M20 4l-5.73 5.73"></path></svg>
                  X / Twitter URL
                </label>
                <div className={styles.inputWrapper}>
                  <input type="text" name="twitter_url" value={settings.twitter_url || ''} onChange={handleChange} className={styles.inputNoIcon} placeholder="https://twitter.com/purnorganic" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'Shipping' && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Shipping Settings</h2>
          
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Free Shipping Above (₹)</label>
                <div className={styles.inputWrapper}>
                  <input type="number" name="free_shipping_threshold" value={settings.free_shipping_threshold || ''} onChange={handleChange} className={styles.inputNoIcon} placeholder="500" />
                </div>
                <p className={styles.helpText}>Set 0 to always charge shipping.</p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Standard Shipping Charge (₹)</label>
                <div className={styles.inputWrapper}>
                  <input type="number" name="standard_shipping_charge" value={settings.standard_shipping_charge || ''} onChange={handleChange} className={styles.inputNoIcon} placeholder="50" />
                </div>
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <div style={{ backgroundColor: '#e0f7fa', padding: '1rem', borderRadius: '6px', border: '1px solid #b2ebf2', color: '#006064', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  <span>Currently <strong>COD only</strong>. Payment gateway settings will be available in a future update.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'Appearance' && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Logo & Favicon</h2>
          
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Site Logo</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                  {settings.site_logo && (
                    <div style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px', background: '#f9f9f9', display: 'inline-block', alignSelf: 'flex-start' }}>
                      <img src={settings.site_logo} alt="Site Logo Preview" style={{ maxHeight: '60px', maxWidth: '100%', objectFit: 'contain' }} />
                    </div>
                  )}
                  <div className={styles.inputWrapper}>
                    <input type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={(e) => handleFileUpload(e, 'site_logo')} className={styles.inputNoIcon} style={{ padding: '0.5rem 1rem' }} />
                  </div>
                  {uploadingField === 'site_logo' && <p style={{ color: 'var(--primary-color)', fontSize: '0.85rem' }}>Uploading...</p>}
                  <p className={styles.helpText}>PNG or SVG with transparent background recommended.</p>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Favicon</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                  {settings.favicon && (
                    <div style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px', background: '#f9f9f9', display: 'inline-block', alignSelf: 'flex-start' }}>
                      <img src={settings.favicon} alt="Favicon Preview" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                    </div>
                  )}
                  <div className={styles.inputWrapper}>
                    <input type="file" accept="image/x-icon, image/png" onChange={(e) => handleFileUpload(e, 'favicon')} className={styles.inputNoIcon} style={{ padding: '0.5rem 1rem' }} />
                  </div>
                  {uploadingField === 'favicon' && <p style={{ color: 'var(--primary-color)', fontSize: '0.85rem' }}>Uploading...</p>}
                  <p className={styles.helpText}>32x32px ICO or PNG recommended.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'Integrations' && (
        <div className={styles.formGrid}>
          {/* MSG91 Section */}
          <div className={styles.card} style={{ gridColumn: '1 / -1' }}>
            <h2 className={styles.cardTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              MSG91 — OTP / SMS
            </h2>
            <div style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              Get your Template ID and Auth Key from the MSG91 Dashboard.
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>MSG91 Auth Key</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="password"
                    name="msg91_auth_key"
                    value={settings.msg91_auth_key || ''}
                    onChange={handleChange}
                    className={styles.inputNoIcon}
                    placeholder="Enter MSG91 Auth Key"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>MSG91 OTP Template ID *</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    name="msg91_template_id"
                    value={settings.msg91_template_id || ''}
                    onChange={handleChange}
                    className={styles.inputNoIcon}
                    placeholder="e.g. 69f9c38168e03459a3081b04"
                  />
                </div>
                <p className={styles.helpText}>Required to send real OTPs. Leave blank to disable SMS (OTP still works via Email).</p>
              </div>
            </div>
          </div>

          {/* Razorpay Section */}
          <div className={styles.card} style={{ gridColumn: '1 / -1' }}>
            <h2 className={styles.cardTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#023e8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
              Razorpay — Online Payment
            </h2>
            <div style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              Use test keys during development. Switch to live keys before going live. Get keys from Razorpay Dashboard → Settings → API Keys.
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Razorpay Key ID</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    name="razorpay_key_id"
                    value={settings.razorpay_key_id || ''}
                    onChange={handleChange}
                    className={styles.inputNoIcon}
                    placeholder="rzp_test_..."
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Razorpay Key Secret</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="password"
                    name="razorpay_key_secret"
                    value={settings.razorpay_key_secret || ''}
                    onChange={handleChange}
                    className={styles.inputNoIcon}
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Mode</label>
                <div className={styles.inputWrapper}>
                  <select
                    name="razorpay_mode"
                    value={settings.razorpay_mode || 'Test Mode'}
                    onChange={handleChange as any}
                    className={styles.inputNoIcon}
                    style={{ backgroundColor: 'white' }}
                  >
                    <option value="Test Mode">Test Mode</option>
                    <option value="Live Mode">Live Mode</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab !== 'Contact' && activeTab !== 'General' && activeTab !== 'Footer' && activeTab !== 'SEO' && activeTab !== 'Social' && activeTab !== 'Shipping' && activeTab !== 'Appearance' && activeTab !== 'Integrations' && (
        <div className={styles.card}>
          <p style={{ color: '#666' }}>Settings for {activeTab} are coming soon.</p>
        </div>
      )}

      <div className={styles.actions}>
        <button onClick={handleSave} disabled={saving} className={styles.saveBtn}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
        <button className={styles.cancelBtn}>Cancel</button>
      </div>

    </div>
  );
}
