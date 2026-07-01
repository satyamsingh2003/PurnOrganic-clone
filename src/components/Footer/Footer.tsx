import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = ({ settings = {} }: { settings?: Record<string, string> }) => {
  const address = settings.full_address || 'Unit No. LGF-67 Krishna Apra D"mall Plot No-1 Shakti Khand-2 Indirapuram Ghaziabad - 201014';
  const email = settings.contact_email || 'support@purnorganic.com';
  const phone = settings.contact_phone || '+91 9410333577';
  const cin = settings.cin_number || 'U96907UP2024PTC212593';
  const gst = settings.gst_number || '09AAPCP2391B1ZA';
  const footerAbout = settings.footer_about || '100% Organic Commitment. Empowering our local farming community through a farmer-first community.';

  return (
    <footer className={styles.footer}>
      <div className={styles.waveContainer}>
        <svg viewBox="0 0 1440 120" className={styles.waveSvg} preserveAspectRatio="none">
          <path fill="#fcfdfc" d="M0,0L48,16C96,32,192,64,288,74.7C384,85,480,75,576,64C672,53,768,43,864,48C960,53,1056,75,1152,74.7C1248,75,1344,53,1392,42.7L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>
      <div className={`container ${styles.footerGrid}`}>
        {/* Brand Details */}
        <div className={styles.brandSection}>
          <Link href="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ textDecoration: 'none', display: 'block', marginBottom: '1.5rem' }}>
            {settings.site_logo ? (
              <img 
                src={settings.site_logo} 
                alt={settings.site_name || "PurnOrganic"} 
                style={{ 
                  maxHeight: '100px', 
                  maxWidth: '350px', 
                  width: 'auto', 
                  height: 'auto', 
                  objectFit: 'contain', 
                  display: 'block',
                  filter: 'brightness(0) invert(1)' 
                }} 
              />
            ) : (
              <h2 className={styles.brandLogo} style={{ margin: 0 }}>{settings.site_name ? settings.site_name.replace('Organic', '') : 'purn'}<span>Organic</span></h2>
            )}
          </Link>
          <p className={styles.missionText}>
            {footerAbout}
          </p>
          <div className={styles.companyDetails}>
            <p>CIN: {cin}</p>
            <p>GST: {gst}</p>
            <p>PAN: AAPCP2391B</p>
            <p style={{ marginTop: '0.5rem', lineHeight: '1.4' }}>{address}</p>
            <p style={{ marginTop: '0.5rem' }}>Email: <a href={`mailto:${email}`}>{email}</a></p>
            <p>Phone: <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`}>{phone}</a></p>
          </div>
        </div>

        {/* Company Links */}
        <div className={styles.linkColumn}>
          <h3>Company</h3>
          <ul>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/products">Products</Link></li>
            <li><Link href="/wholesale-order">Wholesale Order</Link></li>
            <li><Link href="/opportunity">Opportunities</Link></li>
          </ul>
        </div>

        {/* Support Links */}
        <div className={styles.linkColumn}>
          <h3>Support</h3>
          <ul>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/blogs">Blogs</Link></li>
            <li><Link href="/faq">FAQs</Link></li>
            <li><Link href="/account/login">Login / Sign Up</Link></li>
          </ul>
        </div>

        {/* Legal Links */}
        <div className={styles.linkColumn}>
          <h3>Legal & Compliance</h3>
          <ul>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
            <li><Link href="/refund">Refund & Cancellation Policy</Link></li>
            <li><Link href="/seller-agreement">Seller Agreement</Link></li>
            <li><Link href="/supplier-policy">Supplier Onboarding</Link></li>
            <li><Link href="/b2b-terms">B2B Wholesale Terms</Link></li>
            <li><Link href="/data-protection">Data Protection Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <div className={`container ${styles.bottomContent}`}>
          <p>&copy; {new Date().getFullYear()} Purnkaya Technologies Pvt. Ltd. All rights reserved.</p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontWeight: 500, fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="M9 12l2 2 4-4"></path>
              </svg>
              <span>Payments Secured</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <span>Farmer-first Community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
