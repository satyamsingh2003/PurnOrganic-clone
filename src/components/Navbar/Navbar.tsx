"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useUI } from '@/context/UIContext';
import styles from './Navbar.module.css';

const Navbar = ({ settings = {} }: { settings?: Record<string, string> }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');
  const { cartCount, toggleCart } = useCart();
  const { toggleMobileMenu, toggleSearch } = useUI();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    fetch('/api/customers/profile')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Not logged in');
      })
      .then(data => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className={styles.header}>
      
      {/* Single Tier Navbar */}
      <div className={styles.mainNav}>
        <div className={`container ${styles.navContainer}`}>
          
          <div className={styles.mobileLeft}>
            <button className={styles.hamburgerBtn} onClick={toggleMobileMenu} aria-label="Menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <div className={styles.logo}>
              <Link href="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={styles.logoLink}>
                {settings.site_logo ? (
                  <img src={settings.site_logo} alt={settings.site_name || "PurnOrganic"} style={{ maxHeight: '50px', maxWidth: '200px', width: 'auto', height: 'auto', objectFit: 'contain' }} />
                ) : (
                  <>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--primary-color)" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 7H13V13H11V7ZM11 15H13V17H11V15Z" fill="none"/>
                      <path d="M17.5 10.5C17.5 7.46 15.04 5 12 5C8.96 5 6.5 7.46 6.5 10.5C6.5 11.8 7 13 7.85 13.92L12 18.5L16.15 13.92C17 13 17.5 11.8 17.5 10.5ZM12 16.27L9.27 13.27C8.78 12.73 8.5 12 8.5 11.27C8.5 9.34 10.07 7.77 12 7.77C13.93 7.77 15.5 9.34 15.5 11.27C15.5 12 15.22 12.73 14.73 13.27L12 16.27Z"/>
                    </svg>
                    <span>{settings.site_name ? settings.site_name.replace('Organic', '') : 'पूर्ण'}<span className={styles.logoAccent}>Organic</span></span>
                  </>
                )}
              </Link>
            </div>
          </div>

          <nav className={styles.navigation}>
            <ul className={styles.navLinks}>
              <li><Link href="/" className={`${styles.navLinkItem} ${isActive('/') ? styles.activeLink : ''}`}>Home</Link></li>
              <li><Link href="/about" className={`${styles.navLinkItem} ${isActive('/about') ? styles.activeLink : ''}`}>About</Link></li>
              <li className={styles.dropdown}>
                <Link href="/products" className={`${styles.navLinkItem} ${isActive('/products') ? styles.activeLink : ''} ${styles.dropdownTrigger}`}>
                  Products
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.chevron}><polyline points="6 9 12 15 18 9"></polyline></svg>
                </Link>
                <div className={styles.dropdownMenu}>
                  <Link href="/products?category=organic-daals" className={currentCategory === 'organic-daals' ? styles.activeDropdownItem : ''}>Organic Daals</Link>
                  <Link href="/products?category=grains-flours" className={currentCategory === 'grains-flours' ? styles.activeDropdownItem : ''}>Grains & Flours</Link>
                  <Link href="/products?category=handground-spices" className={currentCategory === 'handground-spices' ? styles.activeDropdownItem : ''}>Handground Spices</Link>
                  <Link href="/products?category=pure-desi-ghee" className={currentCategory === 'pure-desi-ghee' ? styles.activeDropdownItem : ''}>Pure Desi Ghee</Link>
                  <Link href="/products?category=assam-tea" className={currentCategory === 'assam-tea' ? styles.activeDropdownItem : ''}>Assam Tea</Link>
                  <Link href="/products?category=cold-pressed-oils" className={currentCategory === 'cold-pressed-oils' ? styles.activeDropdownItem : ''}>Cold Pressed Oils</Link>
                </div>
              </li>
              <li><Link href="/wholesale-order" className={`${styles.navLinkItem} ${isActive('/wholesale-order') ? styles.activeLink : ''}`}>Wholesale Order</Link></li>
              <li><Link href="/opportunity" className={`${styles.navLinkItem} ${isActive('/opportunity') ? styles.activeLink : ''}`}>Opportunity</Link></li>
              <li><Link href="/blogs" className={`${styles.navLinkItem} ${isActive('/blogs') ? styles.activeLink : ''}`}>Blogs</Link></li>
              <li><Link href="/faq" className={`${styles.navLinkItem} ${isActive('/faq') ? styles.activeLink : ''}`}>Faq</Link></li>
              <li><Link href="/contact" className={`${styles.navLinkItem} ${isActive('/contact') ? styles.activeLink : ''}`}>Contact</Link></li>
            </ul>
          </nav>

          <div className={styles.actions}>
            {/* Search Icon */}
            <button className={styles.iconBtn} aria-label="Search" onClick={toggleSearch}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
            
            {/* Outline Account Button */}
            <Link href={user ? "/account" : "/account/login"} className={styles.accountBtn} aria-label="Account">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span className={styles.accountText}>{user && user.name ? user.name.split(' ')[0] : 'Sign In'}</span>
            </Link>
            
            {/* Solid Cart Button */}
            <button className={styles.cartBtn} aria-label="Cart" onClick={toggleCart}>
              {cartCount > 0 && <span className={styles.cartCount}>{cartCount}</span>}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            </button>
          </div>
        </div>
      </div>

    </header>
  );
};

export default Navbar;

/*
// === PREVIOUS TWO-TIER NAVBAR STYLE (UNCOMMENT THIS AND REPLACE THE <header> CONTENTS TO REVERT) ===
      <div className={styles.topRow}>
        <div className={`container ${styles.topRowContainer}`}>
          
          <div className={styles.mobileLeft}>
            <button className={styles.hamburgerBtn} onClick={toggleMobileMenu} aria-label="Menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <div className={styles.logo}>
              <Link href="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={styles.logoLink}>
                {settings.site_logo ? (
                  <img src={settings.site_logo} alt={settings.site_name || "PurnOrganic"} style={{ maxHeight: '70px', maxWidth: '300px', width: 'auto', height: 'auto', objectFit: 'contain' }} />
                ) : (
                  <>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--primary-color)" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 7H13V13H11V7ZM11 15H13V17H11V15Z" fill="none"/>
                      <path d="M17.5 10.5C17.5 7.46 15.04 5 12 5C8.96 5 6.5 7.46 6.5 10.5C6.5 11.8 7 13 7.85 13.92L12 18.5L16.15 13.92C17 13 17.5 11.8 17.5 10.5ZM12 16.27L9.27 13.27C8.78 12.73 8.5 12 8.5 11.27C8.5 9.34 10.07 7.77 12 7.77C13.93 7.77 15.5 9.34 15.5 11.27C15.5 12 15.22 12.73 14.73 13.27L12 16.27Z"/>
                    </svg>
                    <span>{settings.site_name ? settings.site_name.replace('Organic', '') : 'पूर्ण'}<span className={styles.logoAccent}>Organic</span></span>
                  </>
                )}
              </Link>
            </div>
          </div>

          <div className={styles.actions}>
            <div className={styles.searchContainer}>
              <div className={styles.searchBar}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.searchIcon}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" placeholder="Search here for products..." onFocus={toggleSearch} readOnly className={styles.searchInput} />
              </div>
            </div>

            <button className={styles.iconBtnMobileSearch} aria-label="Search" onClick={toggleSearch}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
            
            <Link href={user ? "/account" : "/account/login"} className={styles.accountBtn} aria-label="Account">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>{user && user.name ? user.name.split(' ')[0] : 'Login / Sign Up'}</span>
            </Link>
            
            <button className={styles.cartBtn} aria-label="Cart" onClick={toggleCart}>
              {cartCount > 0 && <span className={styles.cartCount}>{cartCount}</span>}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.bottomRow}>
        <div className={`container ${styles.bottomRowContainer}`}>
          <nav className={styles.navigation}>
            <ul className={styles.navLinks}>
              <li><Link href="/" className={`${styles.navLinkItem} ${isActive('/') ? styles.activeLink : ''}`}>Home</Link></li>
              <li><Link href="/about" className={`${styles.navLinkItem} ${isActive('/about') ? styles.activeLink : ''}`}>About</Link></li>
              <li className={styles.dropdown}>
                <Link href="/products" className={`${styles.navLinkItem} ${isActive('/products') ? styles.activeLink : ''} ${styles.dropdownTrigger}`}>
                  Products
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.chevron}><polyline points="6 9 12 15 18 9"></polyline></svg>
                </Link>
                <div className={styles.dropdownMenu}>
                  <Link href="/products?category=organic-daals" className={currentCategory === 'organic-daals' ? styles.activeDropdownItem : ''}>Organic Daals</Link>
                  <Link href="/products?category=grains-flours" className={currentCategory === 'grains-flours' ? styles.activeDropdownItem : ''}>Grains & Flours</Link>
                  <Link href="/products?category=handground-spices" className={currentCategory === 'handground-spices' ? styles.activeDropdownItem : ''}>Handground Spices</Link>
                  <Link href="/products?category=pure-desi-ghee" className={currentCategory === 'pure-desi-ghee' ? styles.activeDropdownItem : ''}>Pure Desi Ghee</Link>
                  <Link href="/products?category=assam-tea" className={currentCategory === 'assam-tea' ? styles.activeDropdownItem : ''}>Assam Tea</Link>
                  <Link href="/products?category=cold-pressed-oils" className={currentCategory === 'cold-pressed-oils' ? styles.activeDropdownItem : ''}>Cold Pressed Oils</Link>
                </div>
              </li>
              <li><Link href="/wholesale-order" className={`${styles.navLinkItem} ${isActive('/wholesale-order') ? styles.activeLink : ''}`}>Wholesale Order</Link></li>
              <li><Link href="/opportunity" className={`${styles.navLinkItem} ${isActive('/opportunity') ? styles.activeLink : ''}`}>Opportunity</Link></li>
              <li><Link href="/blogs" className={`${styles.navLinkItem} ${isActive('/blogs') ? styles.activeLink : ''}`}>Blogs</Link></li>
              <li><Link href="/faq" className={`${styles.navLinkItem} ${isActive('/faq') ? styles.activeLink : ''}`}>Faq</Link></li>
              <li><Link href="/contact" className={`${styles.navLinkItem} ${isActive('/contact') ? styles.activeLink : ''}`}>Contact</Link></li>
            </ul>
          </nav>
        </div>
      </div>
*/
