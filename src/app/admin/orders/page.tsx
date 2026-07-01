"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './page.module.css';

type Order = {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  customer_name: string;
  phone: string;
  customer_id: number;
};

function OrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get('status');
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState(statusParam || 'All');
  
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (statusParam) {
      setCurrentStatus(statusParam);
    }
  }, [statusParam]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterStatus = (status: string) => {
    setCurrentStatus(status);
    if (status === 'All') {
      router.push('/admin/orders');
    } else {
      router.push(`/admin/orders?status=${status}`);
    }
  };

  const filteredOrders = currentStatus !== 'All' 
    ? orders.filter(o => o.status.toLowerCase() === currentStatus.toLowerCase())
    : orders;

  const counts = {
    pending: orders.filter(o => o.status.toLowerCase() === 'pending').length,
    processing: orders.filter(o => o.status.toLowerCase() === 'processing').length,
    shipped: orders.filter(o => o.status.toLowerCase() === 'shipped').length,
    delivered: orders.filter(o => o.status.toLowerCase() === 'delivered').length,
    cancelled: orders.filter(o => o.status.toLowerCase() === 'cancelled').length,
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrders(filteredOrders.map(o => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (id: string) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter(oId => oId !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedOrders.length === 0) {
      alert('Please select at least one order to update.');
      return;
    }
    if (!bulkStatus) {
      alert('Please select a status to apply.');
      return;
    }

    setIsUpdating(true);
    try {
      const res = await fetch('/api/orders/bulk', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderIds: selectedOrders, status: bulkStatus })
      });
      
      if (res.ok) {
        setSelectedOrders([]);
        setBulkStatus('');
        await fetchOrders();
      } else {
        alert('Failed to update orders.');
      }
    } catch (err) {
      console.error('Error updating orders:', err);
      alert('An error occurred while updating.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Orders</h1>
          <p className={styles.subtitle}>{orders.length} orders total</p>
        </div>
        <div className={styles.headerActions}>
          <select 
            className={styles.bulkAction} 
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value)}
          >
            <option value="">Bulk Update Status</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button 
            className={styles.applyBtn} 
            onClick={handleBulkUpdate}
            disabled={isUpdating || !bulkStatus || selectedOrders.length === 0}
          >
            {isUpdating ? 'Applying...' : 'Apply'}
          </button>
        </div>
      </div>

      <div className={styles.filterBar}>
        <input type="text" placeholder="Order# or customer name" className={styles.searchInput} />
        <select 
          className={styles.statusSelect} 
          value={currentStatus}
          onChange={(e) => handleFilterStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <input type="date" className={styles.dateInput} />
        <input type="date" className={styles.dateInput} />
        <button className={styles.filterBtn}>Filter</button>
        <button className={styles.resetBtn}>Reset</button>
      </div>

      <div className={styles.statusCards}>
        <div onClick={() => handleFilterStatus('Pending')} className={`${styles.statusCard} ${styles.bgYellow} ${currentStatus.toLowerCase() === 'pending' ? styles.activeCard : ''}`}>
          <h3>{counts.pending}</h3>
          <p>Pending</p>
        </div>
        <div onClick={() => handleFilterStatus('Processing')} className={`${styles.statusCard} ${styles.bgBlue} ${currentStatus.toLowerCase() === 'processing' ? styles.activeCard : ''}`}>
          <h3>{counts.processing}</h3>
          <p>Processing</p>
        </div>
        <div onClick={() => handleFilterStatus('Shipped')} className={`${styles.statusCard} ${styles.bgGreen} ${currentStatus.toLowerCase() === 'shipped' ? styles.activeCard : ''}`}>
          <h3>{counts.shipped}</h3>
          <p>Shipped</p>
        </div>
        <div onClick={() => handleFilterStatus('Delivered')} className={`${styles.statusCard} ${styles.bgLightGreen} ${currentStatus.toLowerCase() === 'delivered' ? styles.activeCard : ''}`}>
          <h3>{counts.delivered}</h3>
          <p>Delivered</p>
        </div>
        <div onClick={() => handleFilterStatus('Cancelled')} className={`${styles.statusCard} ${styles.bgRed} ${currentStatus.toLowerCase() === 'cancelled' ? styles.activeCard : ''}`}>
          <h3>{counts.cancelled}</h3>
          <p>Cancelled</p>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <input 
                  type="checkbox" 
                  checked={filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th>ORDER #</th>
              <th>CUSTOMER</th>
              <th>ITEMS</th>
              <th>TOTAL</th>
              <th>PAYMENT</th>
              <th>STATUS</th>
              <th>DATE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '2rem' }}>Loading orders...</td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '2rem' }}>No orders found.</td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id} className={selectedOrders.includes(order.id) ? styles.selectedRow : ''}>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                    />
                  </td>
                  <td className={styles.orderId}>{order.id.startsWith('#') ? order.id : `#ORD${order.id.toString().padStart(6, '0')}`}</td>
                  <td>
                    <div className={styles.customerInfo}>
                      <strong>{order.customer_name || 'Guest User'}</strong>
                      <span>{order.phone || 'N/A'}</span>
                    </div>
                  </td>
                  <td>—</td>
                  <td>₹{Number(order.total_amount).toFixed(2)}</td>
                  <td><span className={styles.paymentBadge}>COD</span></td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase()] || styles.pending}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.dateInfo}>
                      {new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      <span>{new Date(order.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </td>
                  <td>
                    <Link href={`/admin/orders/${encodeURIComponent(order.id)}`} className={styles.viewBtn}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f9fafb' }}>Loading Orders...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
