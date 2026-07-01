"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';

interface Address {
  id: number;
  full_name: string;
  phone: string;
  alternate_phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, shippingCharge, finalTotal, clearCart, updateQuantity } = useCart();
  
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [notes, setNotes] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);

  // New Address Form State
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    alternate_phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    // 1. Check auth
    fetch('/api/customers/profile')
      .then(res => {
        if (!res.ok) {
          router.push('/account/login?redirect=/checkout');
          throw new Error('Not logged in');
        }
        return res.json();
      })
      .then(data => {
        const fetchedProfile = data.user;
        setUserProfile(fetchedProfile);
        // 2. Fetch addresses
        return fetch('/api/customers/addresses').then(r => r.json()).then(addrData => ({ fetchedProfile, addrData }));
      })
      .then(({ fetchedProfile, addrData }) => {
        if (addrData.addresses && addrData.addresses.length > 0) {
          setAddresses(addrData.addresses);
          setSelectedAddressId(addrData.addresses[0].id);
        } else if (fetchedProfile) {
          setIsAddingAddress(true);
          setFormData({
            full_name: fetchedProfile.name || '',
            phone: fetchedProfile.phone || '',
            alternate_phone: '',
            address: fetchedProfile.address || '',
            city: fetchedProfile.city || '',
            state: fetchedProfile.state || '',
            pincode: fetchedProfile.pincode || ''
          });
        } else {
          setIsAddingAddress(true);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const pin = e.target.value;
    setFormData({ ...formData, pincode: pin });

    if (pin.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await res.json();
        
        if (data && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          setFormData(prev => ({
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert("Please enter a valid 10-digit Indian mobile number for Phone.");
      return;
    }
    if (formData.alternate_phone && !phoneRegex.test(formData.alternate_phone)) {
      alert("Please enter a valid 10-digit Indian mobile number for Alternate Phone.");
      return;
    }

    try {
      const isEdit = editingAddressId !== null;
      const url = '/api/customers/addresses';
      const method = isEdit ? 'PUT' : 'POST';
      const body = { ...formData, id: editingAddressId, is_default: addresses.length === 0 };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      
      if (res.ok) {
        if (isEdit) {
          setAddresses(addresses.map(a => a.id === data.address.id ? data.address : a));
        } else {
          setAddresses([data.address, ...addresses]);
        }
        setSelectedAddressId(data.address.id);
        setIsAddingAddress(false);
        setEditingAddressId(null);
        setFormData({ full_name: '', phone: '', alternate_phone: '', address: '', city: '', state: '', pincode: '' });
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Failed to save address");
    }
  };

  const handleEditAddress = (addr: Address, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData({
      full_name: addr.full_name,
      phone: addr.phone,
      alternate_phone: addr.alternate_phone || '',
      address: addr.address,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode
    });
    setEditingAddressId(addr.id);
    setIsAddingAddress(true);
  };

  const handleDeleteAddress = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      const res = await fetch(`/api/customers/addresses?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAddresses(addresses.filter(a => a.id !== id));
        if (selectedAddressId === id) {
          setSelectedAddressId(null);
        }
      } else {
        alert("Failed to delete address");
      }
    } catch (err) {
      alert("Failed to delete address");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert("Please select a delivery address.");
      return;
    }
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setPlacingOrder(true);
    try {
      const res = await fetch('/api/orders/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address_id: selectedAddressId,
          items: cartItems,
          amount: finalTotal,
          payment_method: notes // using notes as payment_method field in DB temporarily based on our migration
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        // Clear local cart context manually or via a new function
        if (clearCart) {
            clearCart();
        } else {
            localStorage.removeItem('purn_cart');
        }
        router.push(`/account/orders`);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Failed to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading Checkout...</div>;
  }

  // Calculate discount
  const totalDiscount = cartItems.reduce((acc, item) => {
    if (item.mrp && item.mrp > item.price) {
      return acc + ((item.mrp - item.price) * item.quantity);
    }
    return acc;
  }, 0);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.layout}>
        
        {/* Left Column: Details */}
        <div className={styles.leftCol}>
          
          {/* Delivery Details Block */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <h2>Delivery Details</h2>
            </div>
            
            <p className={styles.note}>
              Please ensure correct address and phone number to ensure early and hassle-free delivery.
            </p>

            {!isAddingAddress && addresses.length > 0 && (
              <div className={styles.addressList}>
                {addresses.map(addr => (
                  <div 
                    key={addr.id} 
                    className={`${styles.addressCard} ${selectedAddressId === addr.id ? styles.selectedAddress : ''}`}
                    onClick={() => setSelectedAddressId(addr.id)}
                  >
                    <div className={styles.radioIndicator}>
                      <div className={styles.radioInner} />
                    </div>
                    <div className={styles.addressDetails}>
                      <strong>{addr.full_name}</strong>
                      <p>{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                      <p>Phone: {addr.phone} {addr.alternate_phone ? `| Alt: ${addr.alternate_phone}` : ''}</p>
                    </div>
                    <div className={styles.addressActions}>
                      <button onClick={(e) => handleEditAddress(addr, e)}>Edit</button>
                      <button onClick={(e) => handleDeleteAddress(addr.id, e)} className={styles.deleteBtn}>Delete</button>
                    </div>
                  </div>
                ))}
                
                <button 
                  className={styles.addAddressToggleBtn}
                  onClick={() => {
                    setFormData({ full_name: '', phone: '', alternate_phone: '', address: '', city: '', state: '', pincode: '' });
                    setEditingAddressId(null);
                    setIsAddingAddress(true);
                  }}
                >
                  + Add New Address
                </button>
              </div>
            )}

            {(isAddingAddress || addresses.length === 0) && (
              <form onSubmit={handleSaveAddress} className={styles.form}>
                <div className={styles.row}>
                  <div className={styles.formGroup}>
                    <label>Full Name *</label>
                    <input type="text" name="full_name" required value={formData.full_name} onChange={handleInputChange} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Phone *</label>
                    <input type="text" name="phone" required value={formData.phone} onChange={handleInputChange} />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.formGroup}>
                    <label>Alternate Phone (Optional)</label>
                    <input type="text" name="alternate_phone" value={formData.alternate_phone} onChange={handleInputChange} />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Address *</label>
                  <textarea name="address" required rows={3} value={formData.address} onChange={handleInputChange} />
                </div>

                <div className={styles.row}>
                  <div className={styles.formGroup}>
                    <label>Pincode *</label>
                    <input type="text" name="pincode" maxLength={6} required value={formData.pincode} onChange={handlePincodeChange} />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.formGroup}>
                    <label>State *</label>
                    <input type="text" name="state" required value={formData.state} onChange={handleInputChange} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>City *</label>
                    <input type="text" name="city" required value={formData.city} onChange={handleInputChange} />
                  </div>
                </div>

                <div className={styles.formActions}>
                  {addresses.length > 0 && (
                    <button type="button" className={styles.cancelBtn} onClick={() => { setIsAddingAddress(false); setEditingAddressId(null); }}>Cancel</button>
                  )}
                  <button type="submit" className={styles.saveBtn}>{editingAddressId ? 'Update Address' : 'Save Address'}</button>
                </div>
              </form>
            )}

            {!isAddingAddress && (
              <div className={styles.orderNotesSection}>
                <label>Order Notes</label>
                <textarea 
                  rows={2} 
                  placeholder="Special instructions for delivery..." 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                />
              </div>
            )}
          </div>

          {/* Payment Method Block */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
              <h2>Payment Method</h2>
            </div>
            
            <div className={styles.paymentMethods}>
              <div className={`${styles.paymentOption} ${styles.activePayment}`}>
                <div className={styles.paymentIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><path d="M12 18V6"></path></svg>
                </div>
                <div className={styles.paymentText}>
                  <strong>Cash on Delivery</strong>
                  <p>Pay when your order arrives at your doorstep</p>
                </div>
              </div>

              <div className={`${styles.paymentOption} ${styles.disabledPayment}`}>
                <div className={styles.paymentIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                </div>
                <div className={styles.paymentText}>
                  <strong>Applied for Payment Gateway</strong>
                  <p>Coming soon</p>
                </div>
              </div>
            </div>
            
            <p className={styles.secureNote}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#059669" stroke="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              All payments are 100% secure & encrypted
            </p>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className={styles.rightCol}>
          <div className={styles.summaryCard}>
            <h2>Order Summary</h2>
            
            <div className={styles.summaryItems}>
              {cartItems.map(item => (
                <div key={item.id} className={styles.summaryItem}>
                  <div className={styles.itemImageWrapper}>
                    <Image src={item.image} alt={item.name} fill className={styles.itemImage} />
                  </div>
                  <div className={styles.itemInfo}>
                    <h4>{item.name}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.5rem' }}>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{ background: '#f3f4f6', border: 'none', width: '24px', height: '24px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >-</button>
                      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{ background: '#f3f4f6', border: 'none', width: '24px', height: '24px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >+</button>
                    </div>
                  </div>
                  <div className={styles.itemPrice} style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toFixed(2)}</div>
                    {item.mrp && item.mrp > item.price && (
                      <div style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                        ₹{(item.mrp * item.quantity).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.totals}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>₹{(cartTotal + totalDiscount).toFixed(2)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className={styles.totalRow} style={{ color: '#16a34a', fontWeight: '500' }}>
                  <span>Discount</span>
                  <span>-₹{totalDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className={styles.totalRow}>
                <span>Shipping</span>
                <span>{shippingCharge === 0 ? 'FREE' : `₹${shippingCharge.toFixed(2)}`}</span>
              </div>
              <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                <span>Total</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              className={styles.placeOrderBtn} 
              onClick={handlePlaceOrder}
              disabled={placingOrder || !selectedAddressId || cartItems.length === 0}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              {placingOrder ? 'Placing Order...' : 'Place Order (COD)'}
            </button>
            
            <div className={styles.trustBadges}>
              <span>✓ Secure</span>
              <span>✓ Fast Delivery</span>
              <span>✓ Easy Returns</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
