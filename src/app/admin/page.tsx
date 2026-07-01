import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // Fetch real data from DB
  const ordersCountRes = await sql`SELECT COUNT(*) FROM orders`;
  const revenueRes = await sql`SELECT SUM(amount) FROM orders`;
  const customersCountRes = await sql`SELECT COUNT(*) FROM customers`;
  const productsCountRes = await sql`SELECT COUNT(*) FROM products`;
  const recentOrders = await sql`
    SELECT o.id as order_id, u.name as customer, o.amount, o.status, o.created_at 
    FROM orders o
    LEFT JOIN customers u ON o.user_id = u.id
    ORDER BY o.created_at DESC
    LIMIT 10
  `;

  const totalOrders = ordersCountRes[0]?.count || 0;
  const totalRevenue = revenueRes[0]?.sum || 0;
  const totalCustomers = customersCountRes[0]?.count || 0;
  const totalProducts = productsCountRes[0]?.count || 0;

  const pendingOrdersRes = await sql`SELECT COUNT(*) FROM orders WHERE status = 'pending'`;
  const pendingOrdersCount = pendingOrdersRes[0]?.count || 0;

  return (
    <div className={styles.dashboard}>
      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.iconBox} style={{ backgroundColor: '#e8f5e9', color: '#4caf50' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </div>
          <div className={styles.kpiInfo}>
            <h3>{totalOrders}</h3>
            <p>Total Orders</p>
            <span className={styles.kpiSub}>{pendingOrdersCount} pending</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.iconBox} style={{ backgroundColor: '#e3f2fd', color: '#2196f3' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>₹</span>
          </div>
          <div className={styles.kpiInfo}>
            <h3>₹{Number(totalRevenue).toLocaleString()}</h3>
            <p>Total Revenue</p>
            <span className={styles.kpiSub}>All time</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.iconBox} style={{ backgroundColor: '#fff8e1', color: '#ffc107' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div className={styles.kpiInfo}>
            <h3>{totalCustomers}</h3>
            <p>Customers</p>
            <span className={styles.kpiSub}>Registered</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.iconBox} style={{ backgroundColor: '#fce4ec', color: '#e91e63' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          </div>
          <div className={styles.kpiInfo}>
            <h3>{totalProducts}</h3>
            <p>Active Products</p>
            <span className={styles.kpiSub}>In Catalog</span>
          </div>
        </div>
      </div>

      <div className={styles.mainLayout}>
        {/* Left Column - Recent Orders */}
        <div className={styles.leftCol}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Recent Orders
              </div>
              <button className={styles.viewAllBtn}>View All</button>
            </div>
            
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ORDER #</th>
                  <th>CUSTOMER</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                  <th>DATE</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '1rem', color: '#888' }}>
                      No recent orders.
                    </td>
                  </tr>
                )}
                {recentOrders.map((order, i) => (
                  <tr key={i}>
                    <td className={styles.orderId}>{order.order_id}</td>
                    <td>{order.customer || 'Guest'}</td>
                    <td><strong>₹{Number(order.amount).toFixed(2)}</strong></td>
                    <td>
                      <span className={`${styles.status} ${styles[order.status?.toLowerCase()] || styles.pending}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className={styles.dateCell}>
                      {new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td>
                      <button className={styles.actionBtn}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column - Sidebars */}
        <div className={styles.rightCol}>
          {/* Quick Actions */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                Quick Actions
              </div>
            </div>
            <div className={styles.actionList}>
              <Link href="/admin/products/new" className={`${styles.fullActionBtn} ${styles.primary}`} style={{ textDecoration: 'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Product
              </Link>
              <Link href="/admin/blogs/new" className={`${styles.fullActionBtn} ${styles.outline}`} style={{ textDecoration: 'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                Add Blog Post
              </Link>
              <Link href="/admin/banners/new" className={`${styles.fullActionBtn} ${styles.outline}`} style={{ textDecoration: 'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                Add Banner
              </Link>
              <Link href="/admin/orders?status=pending" className={`${styles.fullActionBtn} ${styles.outlineWarning}`} style={{ textDecoration: 'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                View Pending Orders
              </Link>
              <Link href="/admin/settings" className={`${styles.fullActionBtn} ${styles.outline}`} style={{ textDecoration: 'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                Site Settings
              </Link>
            </div>
          </div>

          {/* Overview */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                Overview
              </div>
            </div>
            <div className={styles.overviewList}>
              <div className={styles.overviewItem}>
                <span>Total Orders</span>
                <strong>{totalOrders}</strong>
              </div>
              <div className={styles.overviewItem}>
                <span>Pending Orders</span>
                <strong style={{ color: '#ff9800' }}>{pendingOrdersCount}</strong>
              </div>
              <div className={styles.overviewItem}>
                <span>Total Revenue</span>
                <strong>₹{Number(totalRevenue).toLocaleString()}</strong>
              </div>
              <div className={styles.overviewItem}>
                <span>Customers</span>
                <strong>{totalCustomers}</strong>
              </div>
              <div className={styles.overviewItem}>
                <span>Active Products</span>
                <strong>{totalProducts}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
