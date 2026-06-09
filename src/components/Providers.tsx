"use client";

import React, { ReactNode } from 'react';
import { CartProvider } from '@/context/CartContext';
import { UIProvider } from '@/context/UIContext';
import CartDrawer from '@/components/CartDrawer/CartDrawer';
import SearchModal from '@/components/SearchModal/SearchModal';
import MobileMenu from '@/components/MobileMenu/MobileMenu';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <UIProvider>
        {children}
        <CartDrawer />
        <SearchModal />
        <MobileMenu />
      </UIProvider>
    </CartProvider>
  );
}
