"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import CustomerSidebar from '@/components/CustomerSidebar/CustomerSidebar';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [reviewData, setReviewData] = useState({ rating: 5, text: '' });
  const [reviewImage, setReviewImage] = useState<File | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/customers/orders')
      .then(res => {
        if (res.status === 401) window.location.href = '/account/login';
        return res.json();
      })
      .then(data => {
        if (data.orders) setOrders(data.orders);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleOpenReview = (order: any) => {
    setSelectedOrder(order);
    setReviewData({ rating: 5, text: '' });
    setReviewImage(null);
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewLoading(true);

    try {
      let imageUrl = null;
      if (reviewImage) {
        const res = await fetch(`/api/upload?filename=${encodeURIComponent(reviewImage.name)}`, {
          method: 'POST',
          body: reviewImage,
        });
        const blob = await res.json();
        imageUrl = blob.url;
      }

      const response = await fetch('/api/customers/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: selectedOrder.id,
          rating: reviewData.rating,
          review_text: reviewData.text,
          image_url: imageUrl
        })
      });

      if (response.ok) {
        alert('Review submitted successfully!');
        setReviewModalOpen(false);
      } else {
        alert('Failed to submit review');
      }
    } catch (err) {
      alert('Error submitting review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading orders...</div>;

  return (
    <div style={{ backgroundColor: '#fafaf6', minHeight: '80vh', padding: '1.5rem 1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        
        <aside>
          <CustomerSidebar />
        </aside>

        <main>
          <section style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-dark)', marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
              All Orders
            </h2>

            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
                </div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>No orders yet</h3>
                <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: '0.95rem' }}>You haven&apos;t placed any orders. Start shopping for organic goodness!</p>
                <a href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-color)', color: 'white', padding: '0.8rem 2rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  Shop Now
                </a>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {orders.map((order: any) => (
                  <div key={order.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                      <div style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: '0.3rem' }}>
                        Order {order.id.toString().startsWith('#') ? order.id : `#${order.id.toString().padStart(6, '0')}`}
                      </div>
                      <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.8rem' }}>
                        Placed on {new Date(order.created_at).toLocaleDateString()}
                      </div>
                      <span style={{ 
                        background: order.status === 'Delivered' ? '#dcfce7' : '#fef9c3', 
                        color: order.status === 'Delivered' ? '#15803d' : '#854d0e', 
                        padding: '0.3rem 0.8rem', 
                        borderRadius: '20px', 
                        fontSize: '0.85rem',
                        fontWeight: 500
                      }}>
                        {order.status || 'Processing'}
                      </span>
                      {order.tracking_number && (
                        <div style={{ marginTop: '0.8rem', fontSize: '0.9rem', color: '#4b5563' }}>
                          <span style={{ fontWeight: 600 }}>Tracking #:</span> {order.tracking_number}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '1rem' }}>
                        ₹{order.amount}
                      </div>
                      {order.status === 'Delivered' && (
                        <button 
                          onClick={() => handleOpenReview(order)}
                          style={{ background: 'white', color: 'var(--primary-color)', border: '1px solid var(--primary-color)', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s', display: 'block', width: '100%' }}
                          onMouseOver={(e) => { e.currentTarget.style.background = 'var(--primary-color)'; e.currentTarget.style.color = 'white'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'var(--primary-color)'; }}
                        >
                          Write a Review
                        </button>
                      )}
                      
                      <button 
                        onClick={() => { setSelectedOrder(order); setDetailsModalOpen(true); }}
                        style={{ background: 'transparent', color: 'var(--primary-color)', border: 'none', cursor: 'pointer', fontWeight: 500, marginTop: '0.8rem', textDecoration: 'underline', display: 'block', width: '100%', textAlign: 'right' }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </section>
        </main>
      </div>

      {/* Review Modal */}
      {reviewModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', width: '90%', maxWidth: '500px', borderRadius: '12px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--text-dark)' }}>Rate Your Purchase</h3>
              <button onClick={() => setReviewModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#888' }}>&times;</button>
            </div>
            
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Order {selectedOrder?.id.toString().startsWith('#') ? selectedOrder.id : `#${selectedOrder?.id.toString().padStart(6, '0')}`}</p>

            <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Rating (1-5)</label>
                <input 
                  type="number" 
                  min="1" max="5" 
                  value={reviewData.rating}
                  onChange={e => setReviewData({...reviewData, rating: parseInt(e.target.value)})}
                  style={{ width: '100px', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ddd' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Share your experience</label>
                <textarea 
                  rows={4}
                  value={reviewData.text}
                  onChange={e => setReviewData({...reviewData, text: e.target.value})}
                  placeholder="What did you like about this product?"
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ddd' }}
                  required
                ></textarea>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Add a Photo (Optional)</label>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={e => {
                    if (e.target.files && e.target.files.length > 0) {
                      setReviewImage(e.target.files[0]);
                    }
                  }}
                  style={{ fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setReviewModalOpen(false)} style={{ padding: '0.8rem 1.5rem', background: '#f5f5f5', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                <button type="submit" disabled={reviewLoading} style={{ padding: '0.8rem 1.5rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailsModalOpen && selectedOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', width: '90%', maxWidth: '500px', borderRadius: '12px', padding: '2rem', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--text-dark)' }}>Order Summary</h3>
              <button onClick={() => setDetailsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#888' }}>&times;</button>
            </div>
            
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Order {selectedOrder.id.toString().startsWith('#') ? selectedOrder.id : `#${selectedOrder.id.toString().padStart(6, '0')}`}</p>
            
            {selectedOrder.items && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {selectedOrder.items.map((item: any) => (
                  <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                    <div style={{ width: '64px', height: '64px', position: 'relative', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f9f9f9', border: '1px solid #eee' }}>
                      <Image src={item.product_image || 'https://uvb9swoktkk6ztcv.public.blob.vercel-storage.com/hero_background.png'} alt={item.product_name} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, color: 'var(--text-dark)', marginBottom: '0.2rem' }}>{item.product_name}</div>
                      <div style={{ color: '#666', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        Qty: {item.quantity} × 
                        {item.mrp && Number(item.mrp) > Number(item.price) && (
                          <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.85rem' }}>
                            ₹{Number(item.mrp).toFixed(2)}
                          </span>
                        )}
                        <span>₹{Number(item.price).toFixed(2)}</span>
                      </div>
                    </div>
                    <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>
                      ₹{(Number(item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#666', fontSize: '0.95rem' }}>
                <span>Payment Mode</span>
                <span style={{ fontWeight: 500, color: 'var(--text-dark)' }}>Cash on Delivery (COD)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '1.1rem', marginTop: '0.5rem' }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary-color)' }}>₹{selectedOrder.amount}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
