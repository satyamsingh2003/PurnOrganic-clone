import React, { Suspense } from 'react';
import ProductsContent from '@/app/products/ProductsContent';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';
  const dbQuery = `%${query}%`;
  
  const products = await sql`
    SELECT p.*, c.slug as category_slug, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.active IS NOT FALSE 
      AND (p.name ILIKE ${dbQuery} OR p.short_description ILIKE ${dbQuery} OR p.full_description ILIKE ${dbQuery})
    ORDER BY p.sort_order ASC, p.id DESC
  `;
  
  // Convert decimal to number for price
  const formattedProducts = products.map(p => ({
    ...p,
    id: String(p.id),
    name: p.name || '',
    image: p.image || '',
    price: Number(p.price) || 0,
    mrp: p.mrp ? Number(p.mrp) : undefined,
    link: `/product/${p.slug || p.id}`
  }));

  return (
    <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '80vh' }}>
      <div className="container" style={{ padding: '1rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '2rem' }}>
          <h1 className="section-title">Search Results</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
            Showing results for <strong style={{ color: 'var(--text-dark)' }}>"{query}"</strong>
          </p>
        </div>
        
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '4rem 0' }}>Loading products...</div>}>
          {formattedProducts.length > 0 ? (
            <ProductsContent allProducts={formattedProducts} hideHeader={true} />
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <h3 style={{ color: 'var(--text-dark)', fontSize: '1.5rem', marginBottom: '1rem' }}>No products found.</h3>
              <p style={{ color: 'var(--text-light)' }}>We couldn't find anything matching your search. Please try different keywords.</p>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}
