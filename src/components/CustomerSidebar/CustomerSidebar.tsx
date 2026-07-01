"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './CustomerSidebar.module.css';

export default function CustomerSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Create a quick API endpoint or just clear cookie if done via server action
      // Or simply fetch an endpoint that clears cookie
      await fetch('/api/auth/logout', { method: 'POST' });
      // Clear the local storage cart so the next guest doesn't see the previous user's cart
      localStorage.removeItem('purn_cart');
      // Hard redirect to clear all React state (Navbar, Context, etc.) instantly
      window.location.href = '/account/login';
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.sidebar}>
      <Link href="/account" className={`${styles.link} ${pathname === '/account' ? styles.active : ''}`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
        Dashboard
      </Link>
      <Link href="/account/orders" className={`${styles.link} ${pathname === '/account/orders' ? styles.active : ''}`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        My Orders
      </Link>
      <button onClick={handleLogout} className={styles.logoutBtn}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Logout
      </button>
    </div>
  );
}
