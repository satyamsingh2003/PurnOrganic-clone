"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './CartDrawer.module.css';

const CartDrawer = () => {
  const { isCartOpen, toggleCart, cartItems, removeFromCart, updateQuantity, cartTotal, shippingCharge, finalTotal, freeShippingThreshold } = useCart();

  const totalDiscount = cartItems.reduce((acc, item) => {
    if (item.mrp && item.mrp > item.price) {
      return acc + ((item.mrp - item.price) * item.quantity);
    }
    return acc;
  }, 0);

  if (!isCartOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={toggleCart}></div>
      <div className={styles.drawer}>
        <div className={styles.header}>
          <h2>Your Cart ({cartItems.length})</h2>
          <button className={styles.closeBtn} onClick={toggleCart}>&times;</button>
        </div>

        <div className={styles.content}>
          {cartItems.length === 0 ? (
            <div className={styles.emptyCart}>
              <p>Your cart is currently empty.</p>
              <button className="btn-primary" onClick={toggleCart}>Continue Shopping</button>
            </div>
          ) : (
            <div className={styles.itemsList}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImageWrapper}>
                    <Image src={item.image} alt={item.name} fill className={styles.itemImage} />
                  </div>
                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemName}>{item.name}</h3>
                    <div className={styles.priceContainer}>
                      {item.mrp && item.mrp > item.price && (
                        <span className={styles.mrpPrice}>₹{item.mrp.toFixed(2)}</span>
                      )}
                      <p className={styles.itemPrice}>₹{item.price.toFixed(2)}</p>
                    </div>
                    <div className={styles.quantityControl}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalRow} style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem', fontWeight: 'normal' }}>
              <span>Subtotal</span>
              <span>₹{(cartTotal + totalDiscount).toFixed(2)}</span>
            </div>
            {totalDiscount > 0 && (
              <div className={styles.totalRow} style={{ fontSize: '0.85rem', color: '#16a34a', marginBottom: '0.25rem', fontWeight: '500' }}>
                <span>Discount</span>
                <span>-₹{totalDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className={styles.totalRow} style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.75rem', fontWeight: 'normal' }}>
              <span>Shipping</span>
              <span>{shippingCharge === 0 ? 'Free' : `₹${shippingCharge.toFixed(2)}`}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Total</span>
              <span className={styles.totalPrice}>₹{finalTotal.toFixed(2)}</span>
            </div>
            {shippingCharge > 0 && freeShippingThreshold > 0 && (
              <p className={styles.taxNote} style={{ color: 'var(--primary-color)', fontWeight: '500', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                Add ₹{(freeShippingThreshold - cartTotal).toFixed(2)} more for free shipping!
              </p>
            )}
            <Link href="/checkout" onClick={toggleCart} style={{ display: 'block', width: '100%', textDecoration: 'none' }}>
              <button className={`btn-primary ${styles.checkoutBtn}`} style={{ width: '100%' }}>Proceed to Checkout</button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
