"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useUI } from '@/context/UIContext';
import styles from './MobileMenu.module.css';

const MobileMenu = () => {
  const { isMobileMenuOpen, toggleMobileMenu } = useUI();
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  if (!isMobileMenuOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={toggleMobileMenu}></div>
      <div className={styles.menu}>
        <div className={styles.header}>
          <h2>Menu</h2>
          <button className={styles.closeBtn} onClick={toggleMobileMenu}>&times;</button>
        </div>

        <nav className={styles.navigation}>
          <ul className={styles.navLinks}>
            <li><Link href="/" onClick={toggleMobileMenu}>Home</Link></li>
            <li><Link href="/about" onClick={toggleMobileMenu}>About</Link></li>
            <li>
              <div 
                className={styles.accordionHeader} 
                onClick={() => setIsProductsOpen(!isProductsOpen)}
              >
                Products
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isProductsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              <div className={`${styles.accordionContent} ${isProductsOpen ? styles.open : ''}`}>
                <Link href="/products" onClick={toggleMobileMenu} className={styles.allProductsLink}>All Products</Link>
                <Link href="/products?category=organic-daals" onClick={toggleMobileMenu}>Organic Daals</Link>
                <Link href="/products?category=grains-flours" onClick={toggleMobileMenu}>Grains & Flours</Link>
                <Link href="/products?category=handground-spices" onClick={toggleMobileMenu}>Handground Spices</Link>
                <Link href="/products?category=pure-desi-ghee" onClick={toggleMobileMenu}>Pure Desi Ghee</Link>
                <Link href="/products?category=assam-tea" onClick={toggleMobileMenu}>Assam Tea</Link>
                <Link href="/products?category=cold-pressed-oils" onClick={toggleMobileMenu}>Cold Pressed Oils</Link>
              </div>
            </li>
            <li><Link href="/wholesale-order" onClick={toggleMobileMenu}>Wholesale Order</Link></li>
            <li><Link href="/opportunity" onClick={toggleMobileMenu}>Opportunity</Link></li>
            <li><Link href="/blogs" onClick={toggleMobileMenu}>Blogs</Link></li>
            <li><Link href="/faq" onClick={toggleMobileMenu}>FAQ</Link></li>
            <li><Link href="/contact" onClick={toggleMobileMenu}>Contact</Link></li>
          </ul>
        </nav>

        <div className={styles.footer}>
          <Link href="/account/login" className="btn-outline" onClick={toggleMobileMenu}>
            Login / Sign Up
          </Link>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
