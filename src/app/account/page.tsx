"use client";

import React, { useState, useEffect } from 'react';
import CustomerSidebar from '@/components/CustomerSidebar/CustomerSidebar';

export default function AccountDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    // Fetch profile
    fetch('/api/customers/profile')
      .then(res => {
        if (!res.ok) {
          if (res.status === 401) window.location.href = '/account/login';
          throw new Error('Failed to fetch profile');
        }
        return res.json();
      })
      .then(data => {
        if (data.user) {
          setProfile({
            name: data.user.name || '',
            email: data.user.email || '',
            address: data.user.address || '',
            city: data.user.city || '',
            state: data.user.state || '',
            pincode: data.user.pincode || '',
            phone: data.user.phone || ''
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // Fetch recent orders
    fetch('/api/customers/orders?limit=3')
      .then(res => res.json())
      .then(data => {
        if (data.orders) setRecentOrders(data.orders);
      })
      .catch(console.error);
  }, []);

  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const pin = e.target.value;
    setProfile({ ...profile, pincode: pin });

    if (pin.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await res.json();
        
        if (data && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          setProfile(prev => ({
            ...prev,
            city: postOffice.District,
            state: postOffice.State
          }));
        }
      } catch (err) {
        console.error('Failed to fetch pincode details', err);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ text: '', type: '' });

    try {
      const res = await fetch('/api/customers/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      
      if (res.ok) {
        setMsg({ text: 'Profile updated successfully!', type: 'success' });
      } else {
        setMsg({ text: 'Failed to update profile.', type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'Something went wrong.', type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    }
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading your dashboard...</div>;

  return (
    <div style={{ backgroundColor: '#fafaf6', minHeight: '80vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '250px 1fr', gap: '1.5rem' }}>
        
        <aside>
          <CustomerSidebar />
        </aside>

        <main style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Profile Details */}
          <section style={{ 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '16px', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.06)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)'; }}
          >
            <h2 style={{ fontSize: '1.2rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Profile Details
            </h2>

            {msg.text && (
              <div style={{ padding: '1rem', borderRadius: '8px', marginBottom: '1rem', backgroundColor: msg.type === 'success' ? '#dcfce7' : '#fee2e2', color: msg.type === 'success' ? '#15803d' : '#b91c1c' }}>
                {msg.text}
              </div>
            )}

            <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Full Name *</label>
                <input 
                  type="text" 
                  value={profile.name} 
                  onChange={e => setProfile({...profile, name: e.target.value})} 
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Email Address</label>
                <input 
                  type="email" 
                  value={profile.email} 
                  onChange={e => setProfile({...profile, email: e.target.value})} 
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px' }}
                />
                <span style={{ fontSize: '0.8rem', color: '#aaa' }}>Optional. Valid email format.</span>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Delivery Address</label>
                <input 
                  type="text" 
                  value={profile.address} 
                  onChange={e => setProfile({...profile, address: e.target.value})} 
                  placeholder="House no, Street, Locality"
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Pincode</label>
                <input 
                  type="text" 
                  value={profile.pincode} 
                  onChange={handlePincodeChange} 
                  placeholder="6-digit PIN"
                  maxLength={6}
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Phone</label>
                <input 
                  type="text" 
                  value={profile.phone} 
                  onChange={e => setProfile({...profile, phone: e.target.value})} 
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>City</label>
                <input 
                  type="text" 
                  value={profile.city} 
                  onChange={e => setProfile({...profile, city: e.target.value})} 
                  placeholder="e.g. Mumbai"
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#f9f9f9' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>State</label>
                <input 
                  type="text" 
                  value={profile.state} 
                  onChange={e => setProfile({...profile, state: e.target.value})} 
                  placeholder="e.g. Maharashtra"
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#f9f9f9' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                <button type="submit" disabled={saving} style={{ background: 'var(--primary-color)', color: 'white', padding: '0.8rem 1.5rem', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'transform 0.2s ease', transform: 'scale(1)' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </section>

          {/* Recent Orders */}
          <section style={{ 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '16px', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.06)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                Recent Orders
              </h2>
              <a href="/account/orders" style={{ color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none' }}>
                View all &rarr;
              </a>
            </div>

            {recentOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
                </div>
                <p style={{ color: '#888', marginBottom: '1.5rem' }}>You haven&apos;t placed any orders yet.</p>
                <a href="/products" style={{ display: 'inline-block', background: 'var(--primary-color)', color: 'white', padding: '0.8rem 1.5rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>
                  Start Shopping
                </a>
              </div>
            ) : (
              <div>
                {/* Simplified list of recent orders */}
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left', color: '#888', fontSize: '0.9rem' }}>
                      <th style={{ paddingBottom: '1rem' }}>Order ID</th>
                      <th style={{ paddingBottom: '1rem' }}>Date</th>
                      <th style={{ paddingBottom: '1rem' }}>Status</th>
                      <th style={{ paddingBottom: '1rem' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order: any) => (
                      <tr key={order.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                        <td style={{ padding: '1rem 0', fontWeight: 500 }}>{order.id.toString().startsWith('#') ? order.id : `#${order.id.toString().padStart(6, '0')}`}</td>
                        <td style={{ padding: '1rem 0', color: '#666' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                        <td style={{ padding: '1rem 0' }}>
                          <span style={{ 
                            background: order.status === 'Delivered' ? '#dcfce7' : '#fef9c3', 
                            color: order.status === 'Delivered' ? '#15803d' : '#854d0e', 
                            padding: '0.3rem 0.6rem', 
                            borderRadius: '20px', 
                            fontSize: '0.8rem' 
                          }}>
                            {order.status || 'Processing'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 0', fontWeight: 600 }}>₹{order.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

        </main>
      </div>
    </div>
  );
}
