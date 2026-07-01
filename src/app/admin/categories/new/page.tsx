"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../products/new/page.module.css';

export default function AddCategoryPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [parentCategories, setParentCategories] = useState<{id: number, name: string}[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parentId: '',
    sortOrder: '0',
    metaTitle: '',
    metaDescription: '',
    active: true,
  });

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.categories) {
          setParentCategories(data.categories);
        }
      })
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let imageUrl = '';
      
      if (fileInputRef.current?.files?.length) {
        const file = fileInputRef.current.files[0];
        const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: 'POST',
          body: file,
        });
        const blob = await res.json();
        imageUrl = blob.url;
      }

      const generatedSlug = formData.slug.trim() || formData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slug: generatedSlug,
          image: imageUrl
        }),
      });

      if (response.ok) {
        router.push('/admin/categories');
      } else {
        const err = await response.json();
        alert('Error: ' + err.error);
      }
    } catch (err) {
      alert('Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Add Category</h1>
          <p className={styles.subtitle}>Create a new product category</p>
        </div>
        <Link href="/admin/categories" className={styles.backBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back
        </Link>
      </div>

      <form className={styles.formLayout} onSubmit={handleSubmit} style={{ display: 'block' }}>
        <div className={styles.mainCol} style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Category Details</h2>
            
            <div className={styles.row2}>
              <div className={styles.inputGroup}>
                <label>Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Category name" required />
              </div>
              <div className={styles.inputGroup}>
                <label>Description</label>
                <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Optional short description" />
              </div>
            </div>

            <div className={styles.row2}>
              <div className={styles.inputGroup}>
                <label>Parent Category</label>
                <select name="parentId" value={formData.parentId} onChange={handleChange}>
                  <option value="">None (Top Level)</option>
                  {parentCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>Status</label>
                <select name="active" value={formData.active.toString()} onChange={(e) => setFormData(prev => ({...prev, active: e.target.value === 'true'}))}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>Sort Order</label>
                <input type="number" name="sortOrder" value={formData.sortOrder} onChange={handleChange} />
              </div>
            </div>

            <div className={styles.inputGroup} style={{ marginBottom: '1rem' }}>
              <label>Category Image</label>
              <div className={styles.fileInputContainer} style={{ minHeight: '80px' }}>
                {imagePreview ? (
                  <div className={styles.imagePreviewWrapper} style={{ height: '100px' }}>
                    <img src={imagePreview} alt="Preview" className={styles.imagePreview} style={{ objectFit: 'contain' }} />
                    <button type="button" className={styles.changeImageBtn} onClick={() => fileInputRef.current?.click()}>
                      Change Image
                    </button>
                  </div>
                ) : (
                  <div className={styles.fileInputUpload} onClick={() => fileInputRef.current?.click()} style={{ padding: '1rem' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '4px' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <span>Click to choose file</span>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/jpeg, image/png, image/webp" 
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            <div className={styles.row2}>
              <div className={styles.inputGroup}>
                <label>Meta Title</label>
                <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} />
              </div>
              <div className={styles.inputGroup}>
                <label>Meta Description</label>
                <input type="text" name="metaDescription" value={formData.metaDescription} onChange={handleChange} />
              </div>
            </div>

            <div className={styles.formActions} style={{ marginTop: '2rem', justifyContent: 'flex-start' }}>
              <button type="submit" className={styles.saveBtn} disabled={loading}>
                {loading ? 'Creating...' : 'Create Category'}
              </button>
              <button type="button" className={styles.cancelBtn} onClick={() => router.push('/admin/categories')}>
                Cancel
              </button>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}
