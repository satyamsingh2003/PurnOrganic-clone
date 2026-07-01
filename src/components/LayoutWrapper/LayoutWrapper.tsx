"use client";

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

import FloatingContact from "@/components/FloatingContact/FloatingContact";

export default function LayoutWrapper({ children, settings }: { children: React.ReactNode, settings: Record<string, string> }) {
  const pathname = usePathname();
  const isAuthOrAdminPage = pathname.startsWith('/admin') || pathname === '/login';

  useEffect(() => {
    // Ensure body doesn't scroll when on admin/login pages
    if (isAuthOrAdminPage) {
      document.body.style.overflow = 'hidden';
      document.body.style.margin = '0';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isAuthOrAdminPage]);

  if (isAuthOrAdminPage) {
    return (
      <main style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
        {children}
      </main>
    );
  }

  return (
    <>
      <Navbar settings={settings} />
      <main>{children}</main>
      <Footer settings={settings} />
      <FloatingContact settings={settings} />
    </>
  );
}
