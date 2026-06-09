"use client";

import React from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import styles from './CartDrawer.module.css';

const CartDrawer = () => {
  const { isCartOpen, toggleCart, cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

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
                    <p className={styles.itemPrice}>₹{item.price.toFixed(2)}</p>
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
            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <span className={styles.totalPrice}>₹{cartTotal.toFixed(2)}</span>
            </div>
            <p className={styles.taxNote}>Taxes and shipping calculated at checkout</p>
            <button className={`btn-primary ${styles.checkoutBtn}`}>Proceed to Checkout</button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
