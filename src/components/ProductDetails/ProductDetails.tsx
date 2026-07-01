"use client";

import React, { useState, useRef, MouseEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import styles from './ProductDetails.module.css';
import Reviews from './Reviews';
import ProductGrid from '@/components/ProductGrid/ProductGrid';

interface Product {
  id: string;
  name: string;
  price: number;
  mrp?: number;
  image: string;
  slug: string;
  short_description?: string;
  full_description?: string;
  category_name?: string;
  category_slug?: string;
  featured?: boolean;
}

interface ProductDetailsProps {
  product: Product;
  relatedProducts: Product[];
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, relatedProducts }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  // Magnifier State
  const imageRef = useRef<HTMLImageElement>(null);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 });
  
  const handleIncrease = () => setQuantity(q => q + 1);
  const handleDecrease = () => setQuantity(q => q > 1 ? q - 1 : 1);
  
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      mrp: product.mrp,
      image: product.image,
      quantity
    });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    setMagnifierPos({ x, y });
  };

  const discountPercent = product.mrp && product.mrp > product.price 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
    : 0;

  // Formatting products for ProductGrid
  const formattedRelatedProducts = relatedProducts.map(p => ({
    ...p,
    link: `/product/${p.slug || p.id}`
  }));

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumbs}>
        <Link href="/">Home</Link>
        <span className={styles.separator}>›</span>
        <Link href="/products">Products</Link>
        <span className={styles.separator}>›</span>
        {product.category_slug && (
          <>
            <Link href={`/products?category=${product.category_slug}`}>{product.category_name}</Link>
            <span className={styles.separator}>›</span>
          </>
        )}
        <span>{product.name}</span>
      </div>

      <div className={styles.productLayout}>
        <div className={styles.imageSection}>
          <div className={styles.imageWrapper} onMouseMove={handleMouseMove}>
            <Image 
              ref={imageRef}
              src={product.image || 'https://uvb9swoktkk6ztcv.public.blob.vercel-storage.com/hero_background.png'} 
              alt={product.name}
              fill
              className={styles.mainImage}
            />
            {/* Magnifier Lens */}
            <div 
              className={styles.magnifier}
              style={{
                width: '150px',
                height: '150px',
                left: `${magnifierPos.x - 75}px`,
                top: `${magnifierPos.y - 75}px`,
                backgroundImage: `url(${product.image || 'https://uvb9swoktkk6ztcv.public.blob.vercel-storage.com/hero_background.png'})`,
                backgroundSize: '1000px 1000px', // Zoom level
                backgroundPosition: `-${magnifierPos.x * (1000/500) - 75}px -${magnifierPos.y * (1000/500) - 75}px`
              }}
            />
          </div>
        </div>

        <div className={styles.detailsSection}>
          {product.featured && <div className={styles.bestsellerTag}>Bestseller</div>}
          
          <h1 className={styles.title}>{product.name}</h1>
          <p className={styles.weight}>500g</p>
          
          <p className={styles.description}>
            {product.short_description || "Farm-fresh organic product, ethically sourced and packed with natural goodness."}
          </p>

          <div className={styles.priceBlock}>
            <span className={styles.price}>₹{product.price.toFixed(2)}</span>
            {product.mrp && product.mrp > product.price && (
              <>
                <span className={styles.mrp}>₹{product.mrp.toFixed(2)}</span>
                <span className={styles.discountBadge}>{discountPercent}% OFF</span>
              </>
            )}
          </div>

          <div className={styles.actionRow}>
            <div className={styles.quantitySelector}>
              <button className={styles.qtyBtn} onClick={handleDecrease}>-</button>
              <input type="text" className={styles.qtyInput} value={quantity} readOnly />
              <button className={styles.qtyBtn} onClick={handleIncrease}>+</button>
            </div>
            
            <button className={styles.addToCartBtn} onClick={handleAddToCart}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              Add to Cart
            </button>
          </div>

          <div className={styles.trustBadges}>
            <div className={styles.badge}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              100% Organic
            </div>
            <div className={styles.badge}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
              Fast Delivery
            </div>
            <div className={styles.badge}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M22 14l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>
              Easy Returns
            </div>
          </div>
        </div>
      </div>

      <Reviews />

      {formattedRelatedProducts.length > 0 && (
        <div style={{ marginTop: '5rem' }}>
          <ProductGrid title="You May Also Like" products={formattedRelatedProducts} />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
