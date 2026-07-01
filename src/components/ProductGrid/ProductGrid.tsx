"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './ProductGrid.module.css';

interface Product {
  id: string;
  name: string;
  price: number;
  mrp?: number;
  image: string;
  link: string;
}

interface ProductGridProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ title, products, viewAllLink }) => {
  const { addToCart } = useCart();

  return (
    <section className={`section-padding ${styles.productSection}`}>
      <div className="container">
        <div className={styles.header}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>{title}</h2>
          {viewAllLink && (
            <Link href={viewAllLink} className={styles.viewAllBtn}>
              See All Products
            </Link>
          )}
        </div>
        
        <div className={styles.grid}>
          {products.map((product) => (
            <div key={product.id} className={styles.card}>
              <Link href={product.link} className={styles.imageWrapper}>
                <Image 
                  src={product.image} 
                  alt={product.name}
                  fill
                  className={styles.image}
                />
              </Link>
              <div className={styles.content}>
                <Link href={product.link}>
                  <h3 className={styles.productName}>{product.name}</h3>
                </Link>
                <div className={styles.bottomRow}>
                  <div className={styles.priceContainer}>
                    {product.mrp && product.mrp > product.price && (
                      <span className={styles.mrp}>₹{product.mrp.toFixed(2)}</span>
                    )}
                    <span className={styles.price}>₹{product.price.toFixed(2)}</span>
                  </div>
                  <button 
                    className={styles.addToCartBtn} 
                    aria-label="Add to cart"
                    onClick={() => addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      mrp: product.mrp,
                      image: product.image,
                    })}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
