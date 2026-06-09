"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/ProductGrid/ProductGrid';

const allProducts = [
  { id: '1', name: 'Red Chilli Powder', price: 139.00, image: '/category_spices.png', link: '/product/red-chilli-powder', category: 'handground-spices' },
  { id: '2', name: 'Organic Basmati Rice', price: 249.00, image: '/hero_background.png', link: '/product/organic-basmati-rice', category: 'grains-flours' },
  { id: '3', name: 'Stone Ground Wheat', price: 69.00, image: '/category_daal.png', link: '/product/stone-ground-wheat', category: 'grains-flours' },
  { id: '4', name: 'Turmeric Powder', price: 149.00, image: '/category_spices.png', link: '/product/turmeric-powder', category: 'handground-spices' },
  { id: '5', name: 'Ginger Powder', price: 169.00, image: '/category_spices.png', link: '/product/ginger-powder', category: 'handground-spices' },
  { id: '6', name: 'Organic Masoor Daal', price: 99.00, image: '/category_daal.png', link: '/product/organic-masoor-daal', category: 'organic-daals' },
  { id: '7', name: 'Pure Bilona Ghee', price: 899.00, image: '/category_daal.png', link: '/product/pure-bilona-ghee', category: 'pure-desi-ghee' },
  { id: '8', name: 'Mustard Oil', price: 299.00, image: '/hero_background.png', link: '/product/mustard-oil', category: 'cold-pressed-oils' },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const filteredProducts = categoryParam 
    ? allProducts.filter(p => p.category === categoryParam)
    : allProducts;

  const pageTitle = categoryParam 
    ? categoryParam.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'All Products';

  return (
    <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '80vh' }}>
      <div className="section-padding container">
        <h1 className="section-title" style={{ textAlign: 'left' }}>{pageTitle}</h1>
        <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
          Showing {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}
        </p>
        
        {filteredProducts.length > 0 ? (
          <div style={{ marginTop: '-4rem' }}>
            {/* Reusing ProductGrid without the section title */}
            <ProductGrid title="" products={filteredProducts} />
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h3>No products found in this category.</h3>
          </div>
        )}
      </div>
    </div>
  );
}
