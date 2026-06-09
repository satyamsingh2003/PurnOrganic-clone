import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        {/* Brand Details */}
        <div className={styles.brandSection}>
          <h2 className={styles.brandLogo}>purn<span>Organic</span></h2>
          <p className={styles.missionText}>
            100% Organic Commitment. Empowering our local farming community through a farmer-first community.
          </p>
          <div className={styles.companyDetails}>
            <p>CIN: U96907UP2024PTC212593</p>
            <p>GST: 09AAPCP2391B1ZA</p>
            <p>PAN: AAPCP2391B</p>
            <p>Address: Unit No. LGF-67 Krishna Apra D"mall Plot No-1 Shakti Khand-2 Indirapuram Ghaziabad - 201014</p>
            <p>Email: <a href="mailto:support@purnorganic.com">support@purnorganic.com</a></p>
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
          <p>&copy; {new Date().getFullYear()} PurnOrganic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
