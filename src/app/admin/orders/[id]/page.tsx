"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

type OrderItem = {
  id: number;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
};

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

type OrderDetails = {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  customer_id: number;
  items: OrderItem[];
  customer: Customer | null;
  notes: string | null;
  tracking_number: string | null;
};

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { id } = await params;
        const res = await fetch(`/api/orders/${id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
          setStatus(data.status);
          setTrackingNumber(data.tracking_number || '');
        } else {
          alert('Order not found');
          router.push('/admin/orders');
        }
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [params, router]);

  const handleUpdateStatus = async () => {
    if (!order) return;
    setUpdating(true);
    try {
      const { id } = await params;
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, tracking_number: trackingNumber })
      });
      if (res.ok) {
        alert('Order updated successfully');
        setOrder({ ...order, status, tracking_number: trackingNumber });
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      alert('Error updating status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className={styles.loadingState}>Loading order details...</div>;
  }

  if (!order) return null;

  const subtotal = order.items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  const grandTotal = Number(order.total_amount); // amount column from DB
  const shipping = Math.max(0, grandTotal - subtotal);
  const orderDate = new Date(order.created_at);

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.topHeader}>
        <h2 className={styles.breadcrumb}>Order {order.id.startsWith('#') ? order.id : `#ORD${order.id.padStart(6, '0')}`}</h2>
      </div>
      
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Order {order.id.startsWith('#') ? order.id : `#ORD${order.id.padStart(6, '0')}`}</h1>
          <p className={styles.subtitle}>
            Placed on {orderDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, {orderDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <Link href="/admin/orders" className={styles.backBtn}>
          ← Back to Orders
        </Link>
      </div>

      <div className={styles.mainGrid}>
        {/* Left Column */}
        <div className={styles.leftCol}>
          {/* Order Notes */}
          {order.notes && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Order Notes</h3>
              <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.5' }}>
                {order.notes}
              </p>
            </div>
          )}

          {/* Order Items */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Order Items ({order.items.length})</h3>
            <table className={styles.itemsTable}>
              <thead>
                <tr>
                  <th>PRODUCT</th>
                  <th>VARIANT</th>
                  <th>QTY</th>
                  <th>PRICE</th>
                  <th>SUBTOTAL</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className={styles.productInfo}>
                        <div className={styles.imageWrapper}>
                          <Image src={item.product_image || 'https://uvb9swoktkk6ztcv.public.blob.vercel-storage.com/hero_background.png'} alt={item.product_name} fill style={{objectFit: 'cover'}} />
                        </div>
                        <span className={styles.productName}>{item.product_name}</span>
                      </div>
                    </td>
                    <td>—</td>
                    <td>{item.quantity}</td>
                    <td>₹{Number(item.price).toFixed(2)}</td>
                    <td className={styles.fwBold}>₹{(Number(item.price) * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className={styles.totalsContainer}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span className={styles.fwBold}>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Shipping</span>
                <span className={shipping === 0 ? styles.freeShipping : ''}>
                  {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                <span>Grand Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              Delivery Address
            </h3>
            {order.customer ? (
              <div className={styles.addressInfo}>
                <h4>Customer</h4>
                <p>{order.customer.address}</p>
                <p>{order.customer.city}, {order.customer.state} — {order.customer.pincode}</p>
                <p className={styles.contactIcon}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  {order.customer.phone}
                </p>
                <p className={styles.contactIcon}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  {order.customer.email}
                </p>
              </div>
            ) : (
              <p className={styles.noAddress}>No address details available.</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightCol}>
          {/* Order Status */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Order Status</h3>
            <div className={styles.inputGroup}>
              <label>Update Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={styles.select}>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label>Tracking Number</label>
              <input 
                type="text" 
                placeholder="Optional tracking #" 
                className={styles.input} 
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
            <button 
              className={styles.updateBtn} 
              onClick={handleUpdateStatus}
              disabled={updating || (status === order.status && trackingNumber === (order.tracking_number || ''))}
            >
              {updating ? 'Updating...' : 'Update Status'}
            </button>
          </div>

          {/* Payment Info */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Payment Information</h3>
            <div className={styles.paymentRow}>
              <span className={styles.lightText}>Method</span>
              <strong className={styles.fwBold}>COD</strong>
            </div>
            <div className={styles.paymentRow}>
              <span className={styles.lightText}>Status</span>
              <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase()] || styles.pending}`}>
                {order.status === 'Delivered' ? 'Paid' : 'Pending'}
              </span>
            </div>
          </div>

          {/* Customer Profile Link */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              Customer
            </h3>
            <div className={styles.customerSummary}>
              <p className={styles.fwBold}>Customer</p>
              <p className={styles.lightText}>{order.customer?.phone || 'N/A'}</p>
              <Link href={`/admin/customers/${order.customer_id}`} className={styles.profileBtn}>
                View Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
