"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

type Banner = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  button_text: string;
  button_url: string;
  sort_order: number;
  active: boolean;
};

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/banners');
      if (res.ok) {
        const data = await res.json();
        setBanners(data);
      } else {
        setError('Failed to fetch banners');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    
    try {
      const res = await fetch(`/api/banners/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBanners(banners.filter(b => b.id !== id));
      } else {
        alert('Failed to delete banner');
      }
    } catch (err) {
      alert('Error deleting banner');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Banners</h1>
          <p className={styles.subtitle}>Homepage hero slider banners</p>
        </div>
        <Link href="/admin/banners/new" className={styles.addBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add Banner
        </Link>
      </div>

      {loading ? (
        <p>Loading banners...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : banners.length === 0 ? (
        <p>No banners found. Create one to get started!</p>
      ) : (
        <div className={styles.grid}>
          {banners.map(banner => (
            <div key={banner.id} className={styles.card}>
              <div className={styles.imageContainer}>
                <Image src={banner.image || '/hero_background.png'} alt={banner.title} fill className={styles.image} />
                <div className={styles.overlay}>
                  <div className={styles.statusPill} style={{ backgroundColor: banner.active ? '#dcfce7' : '#fee2e2', color: banner.active ? '#166534' : '#991b1b' }}>
                    {banner.active ? 'Active' : 'Inactive'}
                  </div>
                  <div className={styles.textContent}>
                    <h3 className={styles.bannerTitle}>{banner.title}</h3>
                    <p className={styles.bannerSubtitle}>{banner.subtitle}</p>
                  </div>
                </div>
              </div>
              
              <div className={styles.cardFooter}>
                <div className={styles.meta}>
                  <span>Sort: {banner.sort_order}</span>
                  <span> - </span>
                  <span>{banner.button_text ? banner.button_text : 'No button'}</span>
                </div>
                <div className={styles.actions}>
                  <Link href={`/admin/banners/${banner.id}/edit`} className={styles.actionBtn} style={{ color: '#3b82f6', borderColor: '#bfdbfe' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </Link>
                  <button onClick={() => handleDelete(banner.id)} className={styles.actionBtn} style={{ color: '#ef4444', borderColor: '#fecaca' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
