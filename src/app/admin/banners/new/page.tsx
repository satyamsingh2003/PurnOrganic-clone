"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function AddBannerPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    buttonText: '',
    buttonUrl: '',
    sortOrder: '0',
    active: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fileInputRef.current?.files?.length) {
      alert("Please select a banner image");
      return;
    }

    setLoading(true);
    
    try {
      const file = fileInputRef.current.files[0];
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      });
      const blob = await res.json();
      const imageUrl = blob.url;

      const response = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          image: imageUrl,
        }),
      });

      if (response.ok) {
        router.push('/admin'); 
      } else {
        const err = await response.json();
        alert('Error: ' + err.error);
      }
    } catch (err) {
      alert('Failed to add banner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Add Banner</h1>
        <Link href="/admin" className={styles.backBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back
        </Link>
      </div>

      <form className={styles.panel} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label>Banner Image *</label>
          <div className={styles.fileInput}>
            <input type="file" ref={fileInputRef} accept="image/jpeg, image/png, image/webp" required />
            <p>Recommended: 1400x600px. Max 2MB.</p>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Banner headline text" />
        </div>

        <div className={styles.inputGroup}>
          <label>Subtitle</label>
          <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} placeholder="Secondary text below the title" />
        </div>

        <div className={styles.row2}>
          <div className={styles.inputGroup}>
            <label>Button Text</label>
            <input type="text" name="buttonText" value={formData.buttonText} onChange={handleChange} placeholder="e.g. Shop Now" />
          </div>
          <div className={styles.inputGroup}>
            <label>Button URL</label>
            <input type="text" name="buttonUrl" value={formData.buttonUrl} onChange={handleChange} placeholder="e.g. /products or full URL" />
          </div>
        </div>

        <div className={styles.row2} style={{ alignItems: 'center' }}>
          <div className={styles.inputGroup}>
            <label>Sort Order</label>
            <input type="number" name="sortOrder" value={formData.sortOrder} onChange={handleChange} />
          </div>
          <div className={styles.toggleGroup}>
            <label className={styles.switch}>
              <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} />
              <span className={styles.slider}></span>
            </label>
            <span>Active</span>
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.saveBtn} disabled={loading}>
            {loading ? 'Adding...' : 'Add Banner'}
          </button>
          <button type="button" className={styles.cancelBtn} onClick={() => router.push('/admin')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
