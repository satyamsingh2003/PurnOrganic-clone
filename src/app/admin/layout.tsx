"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './layout.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If we are on the login page, don't show the sidebar and header
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const menuItems = [
    { section: 'MAIN', items: [{ name: 'Dashboard', path: '/admin', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }] },
    { section: 'CATALOG', items: [
      { name: 'Products', path: '/admin/products', icon: 'M20 16.28V7.72a2 2 0 0 0-1-1.73l-6-3.46a2 2 0 0 0-2 0l-6 3.46a2 2 0 0 0-1 1.73v8.56a2 2 0 0 0 1 1.73l6 3.46a2 2 0 0 0 2 0l6-3.46a2 2 0 0 0 1-1.73z' },
      { name: 'Categories', path: '/admin/categories', icon: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z' }
    ]},
    { section: 'SALES', items: [
      { name: 'Orders', path: '/admin/orders', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' },
      { name: 'Customers', path: '/admin/customers', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' }
    ]},
    { section: 'CONTENT', items: [
      { name: 'Blogs', path: '/admin/blogs', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' },
      { name: 'CMS Pages', path: '/admin/cms', icon: 'M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4' },
      { name: 'Banners', path: '/admin/banners', icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' },
      { name: 'Enquiries', path: '/admin/enquiries', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' }
    ]},
    { section: 'SYSTEM', items: [
      { name: 'Settings', path: '/admin/settings', icon: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' },
      { name: 'Logout', path: '/admin/logout', icon: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9' }
    ]}
  ];

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <h2>Purn Organic</h2>
          <p>Admin Panel</p>
        </div>
        
        <nav className={styles.nav}>
          {menuItems.map((group, idx) => (
            <div key={idx} className={styles.navGroup}>
              <h3 className={styles.groupTitle}>{group.section}</h3>
              <ul>
                {group.items.map((item, i) => {
                  if (item.name === 'Logout') {
                    return (
                      <li key={i}>
                        <button 
                          onClick={async () => {
                            await fetch('/api/auth/logout', { method: 'POST' });
                            window.location.href = '/login';
                          }} 
                          className={styles.navItem}
                          style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer' }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={item.icon}/></svg>
                          {item.name}
                        </button>
                      </li>
                    );
                  }

                  return (
                    <li key={i}>
                      <Link 
                        href={item.path} 
                        className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={item.icon}/></svg>
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Area */}
      <div className={styles.mainArea}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.pageTitle}>
            Dashboard
          </div>
          <div className={styles.userProfile}>
            <div className={styles.avatar}>S</div>
            <div className={styles.userInfo}>
              <strong>Super Admin</strong>
              <span>Admin</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
