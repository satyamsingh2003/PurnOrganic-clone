"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useUI } from '@/context/UIContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { cartCount, toggleCart } = useCart();
  const { toggleMobileMenu, toggleSearch } = useUI();
  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        <div className={styles.mobileLeft}>
          <button className={styles.hamburgerBtn} onClick={toggleMobileMenu} aria-label="Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <div className={styles.logo}>
            <Link href="/">
              purn<span>Organic</span>
            </Link>
          </div>
        </div>

        <nav className={styles.navigation}>
          <ul className={styles.navLinks}>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li className={styles.dropdown}>
              <Link href="/products" className={styles.dropdownTrigger}>
                Products
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.chevron}><polyline points="6 9 12 15 18 9"></polyline></svg>
              </Link>
              <div className={styles.dropdownMenu}>
                <Link href="/products?category=organic-daals">Organic Daals</Link>
                <Link href="/products?category=grains-flours">Grains & Flours</Link>
                <Link href="/products?category=handground-spices">Handground Spices</Link>
                <Link href="/products?category=pure-desi-ghee">Pure Desi Ghee</Link>
                <Link href="/products?category=assam-tea">Assam Tea</Link>
                <Link href="/products?category=cold-pressed-oils">Cold Pressed Oils</Link>
              </div>
            </li>
            <li><Link href="/wholesale-order">Wholesale Order</Link></li>
            <li><Link href="/opportunity">Opportunity</Link></li>
            <li><Link href="/blogs">Blogs</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </nav>

        <div className={styles.actions}>
          <div className={styles.searchBar}>
            <input type="text" placeholder="Search..." onFocus={toggleSearch} readOnly />
            <button aria-label="Search" onClick={toggleSearch}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
          </div>
          <button className={styles.iconBtnMobileSearch} aria-label="Search" onClick={toggleSearch}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
          <Link href="/account/login" className={styles.iconBtn} aria-label="Login">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </Link>
          <button className={styles.iconBtn} aria-label="Cart" onClick={toggleCart}>
            <span className={styles.cartCount}>{cartCount}</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
