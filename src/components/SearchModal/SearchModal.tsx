"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useUI } from '@/context/UIContext';
import styles from './SearchModal.module.css';

const SearchModal = () => {
  const { isSearchOpen, toggleSearch } = useUI();
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, this would push to /search?q=${searchQuery}
      console.log('Searching for:', searchQuery);
      toggleSearch();
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

        <div className={styles.quickLinks}>
          <h3>Popular Searches</h3>
          <div className={styles.tags}>
            <Link href="/products?category=pure-desi-ghee" onClick={toggleSearch}>Desi Ghee</Link>
            <Link href="/products?category=handground-spices" onClick={toggleSearch}>Turmeric</Link>
            <Link href="/products?category=organic-daals" onClick={toggleSearch}>Organic Daal</Link>
            <Link href="/products?category=cold-pressed-oils" onClick={toggleSearch}>Cold Pressed Oil</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
