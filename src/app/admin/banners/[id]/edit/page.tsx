"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../../new/page.module.css';

export default function EditBannerPage() {
  const router = useRouter();
  const params = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [previewImage, setPreviewImage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    buttonText: '',
    buttonUrl: '',
    sortOrder: '0',
    active: true,
  });

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch(`/api/banners/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            title: data.title || '',
            subtitle: data.subtitle || '',
            buttonText: data.button_text || '',
            buttonUrl: data.button_url || '',
            sortOrder: data.sort_order.toString(),
            active: data.active,
          });
          setPreviewImage(data.image || '');
        } else {
          alert('Failed to load banner');
          router.push('/admin/banners');
        }
      } catch (err) {
        alert('Error loading banner');
      } finally {
        setFetching(false);
      }
    };
    
    if (params.id) {
      fetchBanner();
    }
  }, [params.id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let imageUrl = previewImage;
      
      // If a new file is selected, upload it first
      if (fileInputRef.current?.files?.length) {
        const file = fileInputRef.current.files[0];
        const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: 'POST',
          body: file,
        });
        const blob = await res.json();
        imageUrl = blob.url;
      }

      const response = await fetch(`/api/banners/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          image: imageUrl,
        }),
      });

      if (response.ok) {
        router.push('/admin/banners'); 
      } else {
        const err = await response.json();
        alert('Error: ' + err.error);
      }
    } catch (err) {
      alert('Failed to update banner');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className={styles.page}>Loading...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Edit Banner</h1>
        <Link href="/admin/banners" className={styles.backBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back
        </Link>
      </div>

      <form className={styles.panel} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label>Banner Image *</label>
          {previewImage && (
            <div style={{ position: 'relative', width: '100%', height: '200px', marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden' }}>
              <Image src={previewImage} alt="Preview" fill style={{ objectFit: 'cover' }} />
            </div>
          )}
          <div className={styles.fileInput}>
            <input type="file" ref={fileInputRef} accept="image/jpeg, image/png, image/webp" />
            <p>Leave empty to keep current image. Recommended: 1400x600px. Max 2MB.</p>
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
            <input type="text" name="buttonUrl" value={formData.buttonUrl} onChange={handleChange} placeholder="e.g. /products or #categories" />
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
          <button type="submit" className={styles.saveBtn} disabled={loading} style={{ backgroundColor: '#1a4d2e' }}>
            {loading ? 'Updating...' : 'Update Banner'}
          </button>
          <button type="button" className={styles.cancelBtn} onClick={() => router.push('/admin/banners')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
