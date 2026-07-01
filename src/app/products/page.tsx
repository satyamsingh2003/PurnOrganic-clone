import React, { Suspense } from 'react';
import ProductsContent from './ProductsContent';
import { sql } from '@/lib/db';

// Force dynamic since we might eventually read search parameters or DB updates frequently
export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await sql`
    SELECT p.*, c.slug as category_slug, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.active IS NOT FALSE
    ORDER BY p.sort_order ASC, p.id DESC
  `;
  
  const formattedProducts = products.map(p => ({
    ...p,
    id: String(p.id),
    price: Number(p.price),
    mrp: p.mrp ? Number(p.mrp) : undefined,
    link: `/product/${p.slug || p.id}`
  }));
  return (
    <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '80vh' }}>
      <div className="container" style={{ padding: '1rem 1rem' }}>
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '4rem 0' }}>Loading products...</div>}>
          <ProductsContent allProducts={formattedProducts} />
        </Suspense>
      </div>
    </div>
  );
}
