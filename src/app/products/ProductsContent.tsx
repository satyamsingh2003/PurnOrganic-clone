"use client";

import React, { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductGrid from '@/components/ProductGrid/ProductGrid';

interface Product {
  id: string;
  name: string;
  price: number;
  mrp?: number;
  image: string;
  link: string;
  category?: string;
  category_slug?: string;
  category_name?: string;
}

export default function ProductsContent({ allProducts, hideHeader = false }: { allProducts: Product[], hideHeader?: boolean }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlCategory = searchParams.get('category') || 'all';

  const [sortBy, setSortBy] = useState('default');
  const [searchTerm, setSearchTerm] = useState('');

  // Derive unique categories from available products
  const categories = useMemo(() => {
    const cats = new Map<string, string>();
    allProducts.forEach(p => {
      if (p.category_slug && p.category_name) {
        cats.set(p.category_slug, p.category_name);
      }
    });
    return Array.from(cats.entries()).map(([slug, name]) => ({ slug, name }));
  }, [allProducts]);

  // Filter and Sort
  const processedProducts = useMemo(() => {
    // 1. Filter by category
    let filtered = urlCategory === 'all' 
      ? allProducts 
      : allProducts.filter(p => p.category_slug === urlCategory);

    // 2. Filter by search term
    if (searchTerm.trim()) {
      const lowerQuery = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        (p.category_name && p.category_name.toLowerCase().includes(lowerQuery)) ||
        (p.short_description && p.short_description.toLowerCase().includes(lowerQuery))
      );
    }

    // 3. Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0; // Default: maintain DB order
    });

    return filtered;
  }, [allProducts, urlCategory, sortBy, searchTerm]);

  // Group by category name
  const groupedProducts = useMemo(() => {
    const groups = new Map<string, Product[]>();
    processedProducts.forEach(p => {
      const catName = p.category_name || 'Uncategorized';
      if (!groups.has(catName)) {
        groups.set(catName, []);
      }
      groups.get(catName)!.push(p);
    });
    return Array.from(groups.entries());
  }, [processedProducts]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCat = e.target.value;
    if (newCat === 'all') {
      router.push('/products');
    } else {
      router.push(`/products?category=${newCat}`);
    }
  };

  return (
    <>
      {/* Header Banner */}
      {!hideHeader && (
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '1.5rem', 
          marginTop: '-2rem',
          background: 'linear-gradient(135deg, var(--secondary-color) 0%, rgba(245, 255, 245, 0.8) 100%)',
          padding: '2rem 1.5rem',
          borderBottom: '1px solid rgba(26, 77, 46, 0.08)',
          width: '100vw',
          position: 'relative',
          left: '50%',
          transform: 'translateX(-50%)'
        }}>
          <h1 className="section-title" style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }}>Products</h1>
          <p style={{ color: 'var(--text-dark)', fontSize: '1.15rem', margin: '0 auto', opacity: 0.9, maxWidth: '100%', padding: '0 1rem', lineHeight: '1.5' }}>
            Explore our range of organic products and discover the difference that natural ingredients can make.
          </p>
        </div>
      )}

      {/* Controls Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '0',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid var(--border-color)',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <p style={{ color: 'var(--text-light)', fontWeight: 500, fontSize: '0.95rem' }}>
          Showing {processedProducts.length} result{processedProducts.length !== 1 ? 's' : ''}
        </p>
        
        {/* Local Search Bar */}
        <div style={{ flex: '1', minWidth: '200px', maxWidth: '400px', margin: '0 1rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: 'var(--white)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '8px',
            padding: '0.4rem 1rem',
            transition: 'border-color 0.2s',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '0.95rem',
                color: 'var(--text-dark)',
                backgroundColor: 'transparent'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label htmlFor="category-select" style={{ fontSize: '0.9rem', color: 'var(--text-light)', fontWeight: 600 }}>Category</label>
            <select 
              id="category-select"
              value={urlCategory} 
              onChange={handleCategoryChange}
              style={{
                padding: '0.5rem 2rem 0.5rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--white)',
                color: 'var(--text-dark)',
                fontSize: '0.95rem',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1em'
              }}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.slug} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label htmlFor="sort-select" style={{ fontSize: '0.9rem', color: 'var(--text-light)', fontWeight: 600 }}>Sort by</label>
            <select 
              id="sort-select"
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '0.5rem 2rem 0.5rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--white)',
                color: 'var(--text-dark)',
                fontSize: '0.95rem',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1em'
              }}
            >
              <option value="default">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetical: A-Z</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Grouped Category Rendering */}
      {groupedProducts.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginTop: '-1rem' }}>
          {groupedProducts.map(([catName, products]) => (
            <div key={catName}>
              <ProductGrid title={catName} products={products} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '6rem 0' }}>
          <h3 style={{ color: 'var(--text-dark)', fontSize: '1.5rem', marginBottom: '1rem' }}>No products found.</h3>
          <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Try selecting a different category or clearing your search.</p>
          <button 
            onClick={() => { setSearchTerm(''); router.push('/products'); }} 
            className="btn-primary"
            style={{ borderRadius: '50px' }}
          >
            View All Products
          </button>
        </div>
      )}
    </>
  );
}
