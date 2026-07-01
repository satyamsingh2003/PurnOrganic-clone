"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  mrp?: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleCart: () => void;
  cartTotal: number;
  cartCount: number;
  shippingCharge: number;
  finalTotal: number;
  freeShippingThreshold: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children, settings = {} }: { children: ReactNode, settings?: Record<string, string> }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Settings
  const freeShippingThreshold = Number(settings.free_shipping_threshold) || 500;
  const standardShippingCharge = Number(settings.standard_shipping_charge) || 50;

  // 1. Initial Load from LocalStorage & Cloud Merge
  useEffect(() => {
    const localCartStr = localStorage.getItem('purn_cart');
    let localCart: CartItem[] = [];
    if (localCartStr) {
      try { localCart = JSON.parse(localCartStr); } catch (e) {}
    }
    
    setCartItems(localCart);

    fetch('/api/customers/cart')
      .then(res => {
        if (res.ok) {
          setIsLoggedIn(true);
          return res.json();
        }
        return { cart: [] };
      })
      .then(data => {
        const cloudCart = data.cart || [];
        if (cloudCart.length > 0 || localCart.length > 0) {
          const merged = [...cloudCart];
          localCart.forEach(localItem => {
            const existingIndex = merged.findIndex(c => c.id === localItem.id);
            if (existingIndex > -1) {
              merged[existingIndex].quantity = Math.max(merged[existingIndex].quantity, localItem.quantity);
            } else {
              merged.push(localItem);
            }
          });
          setCartItems(merged);
          localStorage.setItem('purn_cart', JSON.stringify(merged));
          
          if (localCart.length > 0) {
            fetch('/api/customers/cart', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ items: merged })
            }).catch(console.error);
          }
        }
        setIsInitialized(true);
      })
      .catch(() => setIsInitialized(true));
  }, []);

  const syncToCloud = (items: CartItem[]) => {
    if (!isLoggedIn) return;
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      fetch('/api/customers/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      }).catch(console.error);
    }, 500);
  };

  const updateStateAndSync = (newItems: CartItem[]) => {
    setCartItems(newItems);
    localStorage.setItem('purn_cart', JSON.stringify(newItems));
    if (isInitialized) {
      syncToCloud(newItems);
    }
  };

  const addToCart = (product: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const qtyToAdd = product.quantity || 1;
    let newItems;
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      newItems = cartItems.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + qtyToAdd } : item
      );
    } else {
      // Remove quantity from the destructured product since we explicitly set it
      const { quantity, ...prodWithoutQty } = product as any;
      newItems = [...cartItems, { ...prodWithoutQty, quantity: qtyToAdd }];
    }
    updateStateAndSync(newItems);
    
    // Show toast message instead of opening cart
    setToastMessage("Product added to cart!");
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const removeFromCart = (id: string) => {
    const newItems = cartItems.filter(item => item.id !== id);
    updateStateAndSync(newItems);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    const newItems = cartItems.map(item => item.id === id ? { ...item, quantity } : item);
    updateStateAndSync(newItems);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  
  const shippingCharge = cartTotal > 0 && cartTotal < freeShippingThreshold ? standardShippingCharge : 0;
  const finalTotal = cartTotal + shippingCharge;

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleCart,
      cartTotal,
      cartCount,
      shippingCharge,
      finalTotal,
      freeShippingThreshold
    }}>
      {children}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          backgroundColor: '#10b981', // modern emerald green
          color: '#fff',
          padding: '14px 24px',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3), 0 4px 6px -4px rgba(16, 185, 129, 0.3)',
          zIndex: 9999,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontFamily: 'var(--font-inter), sans-serif',
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          {toastMessage}
          <style>{`
            @keyframes slideInRight {
              from { transform: translateX(120%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
