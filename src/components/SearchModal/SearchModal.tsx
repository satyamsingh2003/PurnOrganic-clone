"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUI } from '@/context/UIContext';
import styles from './SearchModal.module.css';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
}

const SearchModal = () => {
  const { isSearchOpen, toggleSearch } = useUI();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      // Reset when closed
      setSearchQuery('');
      setResults([]);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (error) {
        console.error("Error searching:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchResults();
    }, 800); // 800ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isSearchOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toggleSearch();
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className={styles.searchOverlay}>
      <div className={styles.searchContainer}>
        <div className={styles.searchHeader}>
          <button className={styles.closeBtn} onClick={toggleSearch}>&times;</button>
        </div>
        
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for products, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.submitBtn} aria-label="Search">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
        </form>

        {/* Live Search Results */}
        {searchQuery.trim() !== '' && (
          <div className={styles.liveResultsBox}>
            {isLoading ? (
              <div className={styles.loadingText}>Searching...</div>
            ) : results.length > 0 ? (
              <>
                <div className={styles.liveResultsList}>
                  {results.slice(0, 5).map(product => (
                    <Link 
                      key={product.id} 
                      href={`/product/${product.slug || product.id}`} 
                      className={styles.liveResultItem}
                      onClick={toggleSearch}
                    >
                      <div className={styles.resultImageWrapper}>
                        <Image src={product.image || 'https://uvb9swoktkk6ztcv.public.blob.vercel-storage.com/hero_background.png'} alt={product.name} width={50} height={50} className={styles.resultImage} />
                      </div>
                      <div className={styles.resultInfo}>
                        <div className={styles.resultName}>{product.name}</div>
                        <div className={styles.resultPrice}>₹{Number(product.price).toFixed(2)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
                {results.length > 5 && (
                  <button className={styles.viewAllResultsBtn} onClick={handleSearch}>
                    View all {results.length} results
                  </button>
                )}
              </>
            ) : (
              <div className={styles.noResultsText}>No products found for "{searchQuery}"</div>
            )}
          </div>
        )}

        {searchQuery.trim() === '' && (
          <div className={styles.quickLinks}>
            <h3>Popular Searches</h3>
            <div className={styles.tags}>
              <Link href="/products?category=pure-desi-ghee" onClick={toggleSearch}>Desi Ghee</Link>
              <Link href="/products?category=handground-spices" onClick={toggleSearch}>Turmeric</Link>
              <Link href="/products?category=organic-daals" onClick={toggleSearch}>Organic Daal</Link>
              <Link href="/products?category=cold-pressed-oils" onClick={toggleSearch}>Cold Pressed Oil</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
