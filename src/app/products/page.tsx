import React, { Suspense } from 'react';
import ProductsContent from './ProductsContent';

export default function ProductsPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '80vh' }}>
      <div className="section-padding container">
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '4rem 0' }}>Loading products...</div>}>
          <ProductsContent />
        </Suspense>
      </div>
    </div>
  );
}
