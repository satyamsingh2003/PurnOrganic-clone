"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

type CustomerOrder = {
  id: string;
  items_count: number;
  total_amount: number;
  status: string;
  created_at: string;
};

type CustomerProfile = {
  id: number;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  status: string;
  summary: {
    totalOrders: number;
    totalSpent: number;
  };
  orders: CustomerOrder[];
};

export default function CustomerProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const { id } = await params;
        const res = await fetch(`/api/customers/${id}`);
        if (res.ok) {
          const data = await res.json();
          setCustomer(data);
        } else {
          alert('Customer not found');
          router.push('/admin/orders'); // Assuming we came from orders
        }
      } catch (err) {
        console.error('Failed to load customer', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [params, router]);

  if (loading) {
    return <div className={styles.loadingState}>Loading customer profile...</div>;
  }

  if (!customer) return null;

  const toggleStatus = async () => {
    if (!customer) return;
    const newStatus = customer.status === 'Active' ? 'Blocked' : 'Active';
    
    if (!window.confirm(`Are you sure you want to change this customer's status to ${newStatus}?`)) {
      return;
    }
    
    try {
      const res = await fetch(`/api/customers/${customer.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setCustomer({ ...customer, status: newStatus });
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  const joinDate = new Date(customer.created_at);
  const initial = customer.name ? customer.name.charAt(0).toUpperCase() : 'C';

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.topHeader}>
        <h2 className={styles.breadcrumb}>Customer</h2>
      </div>
      
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Customer Profile</h1>
          <p className={styles.subtitle}>{customer.name || 'Guest Customer'}</p>
        </div>
        <button onClick={() => router.back()} className={styles.backBtn}>
          ← Back
        </button>
      </div>

      <div className={styles.mainGrid}>
        {/* Left Column */}
        <div className={styles.leftCol}>
          {/* Profile Card */}
          <div className={styles.card}>
            <div className={styles.profileHeader}>
              <div className={styles.avatar}>{initial}</div>
              <h2 className={styles.profileName}>{customer.name || 'Guest'}</h2>
              <p className={styles.profilePhone}>{customer.phone || 'No phone'}</p>
              <div className={styles.statusBadgeWrapper}>
                <span className={customer.status === 'Active' ? styles.activeBadge : styles.blockedBadge}>
                  {customer.status}
                </span>
              </div>
            </div>
            
            <div className={styles.profileActions}>
              <button className={styles.blockBtn} onClick={toggleStatus}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
                {customer.status === 'Active' ? 'Block Customer' : 'Unblock Customer'}
              </button>
            </div>
          </div>

          {/* Summary Card */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Summary</h3>
            <div className={styles.summaryList}>
              <div className={styles.summaryItem}>
                <span className={styles.lightText}>Total Orders</span>
                <span className={styles.fwBold}>{customer.summary.totalOrders}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.lightText}>Total Spent</span>
                <span className={styles.fwBold}>₹{customer.summary.totalSpent.toFixed(2)}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.lightText}>Joined</span>
                <span className={styles.fwBold}>{joinDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightCol}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Order History</h3>
            
            {customer.orders.length === 0 ? (
              <p className={styles.emptyState}>This customer has no orders yet.</p>
            ) : (
              <div className={styles.tableContainer}>
                <table className={styles.ordersTable}>
                  <thead>
                    <tr>
                      <th>ORDER #</th>
                      <th>ITEMS</th>
                      <th>TOTAL</th>
                      <th>STATUS</th>
                      <th>DATE</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.orders.map(order => (
                      <tr key={order.id}>
                        <td className={styles.orderId}>{order.id.toString().startsWith('#') ? order.id : `#ORD${order.id.toString().padStart(6, '0')}`}</td>
                        <td>{order.items_count || 1}</td>
                        <td className={styles.fwBold}>₹{Number(order.total_amount).toFixed(2)}</td>
                        <td>
                          <span className={styles.statusText}>{order.status}</span>
                        </td>
                        <td className={styles.lightText}>
                          {new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td>
                          <Link href={`/admin/orders/${order.id}`} className={styles.viewBtn}>
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
