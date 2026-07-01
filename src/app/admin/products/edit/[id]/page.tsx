"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../new/page.module.css';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    categoryId: '',
    shortDescription: '',
    fullDescription: '',
    price: '',
    mrp: '',
    stockQty: '',
    unit: '',
    badge: '',
    sortOrder: '0',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    active: true,
    featured: false,
    image: '',
    link: ''
  });

  useEffect(() => {
    // Fetch categories
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.categories) {
          setCategories(data.categories);
        }
      })
      .catch(err => console.error('Failed to fetch categories:', err));

    // Fetch product data
    fetch(`/api/products/${unwrappedParams.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch product');
        return res.json();
      })
      .then(product => {
        setFormData({
          name: product.name || '',
          slug: product.slug || '',
          categoryId: product.category_id ? String(product.category_id) : '',
          shortDescription: product.short_description || '',
          fullDescription: product.full_description || '',
          price: product.price ? String(product.price) : '',
          mrp: product.mrp ? String(product.mrp) : '',
          stockQty: product.stock_qty ? String(product.stock_qty) : '0',
          unit: product.unit || '',
          badge: product.badge || '',
          sortOrder: product.sort_order ? String(product.sort_order) : '0',
          metaTitle: product.meta_title || '',
          metaDescription: product.meta_description || '',
          metaKeywords: product.meta_keywords || '',
          active: product.active ?? true,
          featured: product.featured ?? false,
          image: product.image || '',
          link: product.link || ''
        });
        if (product.image) {
          setImagePreview(product.image);
        }
        setFetching(false);
      })
      .catch(err => {
        console.error(err);
        alert('Failed to load product');
        router.push('/admin/products');
      });
  }, [unwrappedParams.id, router]);

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
      // Revert to existing image if user cancels selection
      setImagePreview(formData.image || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let imageUrl = formData.image;
      
      // Upload new image to Vercel Blob if selected
      if (fileInputRef.current?.files?.length) {
        const file = fileInputRef.current.files[0];
        const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: 'POST',
          body: file,
        });
        const blob = await res.json();
        imageUrl = blob.url;
      }

      // Auto-generate slug if empty
      const generatedSlug = formData.slug.trim() || formData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

      // Update product in DB
      const response = await fetch(`/api/products/${unwrappedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slug: generatedSlug,
          image: imageUrl,
          link: `/products/${generatedSlug}`
        }),
      });

      if (response.ok) {
        router.push('/admin/products');
      } else {
        const err = await response.json();
        alert('Error: ' + err.error);
      }
    } catch (err) {
      alert('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div style={{ padding: '2rem' }}>Loading product details...</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Edit Product</h1>
          <p className={styles.subtitle}>Update product details</p>
        </div>
        <Link href="/admin/products" className={styles.backBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back
        </Link>
      </div>

      <form className={styles.formLayout} onSubmit={handleSubmit}>
        <div className={styles.mainCol}>
          {/* Product Information */}
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Product Information</h2>
            
            <div className={styles.inputGroup}>
              <label>Product Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Organic Cold-Pressed Coconut Oil" required />
            </div>

            <div className={styles.row2}>
              <div className={styles.inputGroup}>
                <label>Slug (URL)</label>
                <input type="text" name="slug" value={formData.slug} onChange={handleChange} placeholder="auto-generated if empty" />
              </div>
              <div className={styles.inputGroup}>
                <label>Category *</label>
                <select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Short Description</label>
              <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} placeholder="Brief product summary (shown on listing page)" />
            </div>

            <div className={styles.inputGroup}>
              <label>Full Description</label>
              <textarea name="fullDescription" value={formData.fullDescription} onChange={handleChange} rows={5} placeholder="Detailed product description (HTML allowed)"></textarea>
            </div>
          </section>

          {/* Pricing & Inventory */}
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Pricing & Inventory</h2>
            
            <div className={styles.row3}>
              <div className={styles.inputGroup}>
                <label>Selling Price (₹) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required />
              </div>
              <div className={styles.inputGroup}>
                <label>MRP (₹)</label>
                <input type="number" name="mrp" value={formData.mrp} onChange={handleChange} />
              </div>
              <div className={styles.inputGroup}>
                <label>Stock Qty</label>
                <input type="number" name="stockQty" value={formData.stockQty} onChange={handleChange} />
              </div>
            </div>

            <div className={styles.row3}>
              <div className={styles.inputGroup}>
                <label>Unit</label>
                <input type="text" name="unit" value={formData.unit} onChange={handleChange} placeholder="e.g. 500g, 1kg, 250ml" />
              </div>
              <div className={styles.inputGroup}>
                <label>Badge / Tag</label>
                <input type="text" name="badge" value={formData.badge} onChange={handleChange} placeholder="e.g. New, Bestseller, Organic" />
              </div>
              <div className={styles.inputGroup}>
                <label>Sort Order</label>
                <input type="number" name="sortOrder" value={formData.sortOrder} onChange={handleChange} />
              </div>
            </div>
          </section>

          {/* SEO */}
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>SEO</h2>
            
            <div className={styles.inputGroup}>
              <label>Meta Title</label>
              <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} />
            </div>

            <div className={styles.inputGroup}>
              <label>Meta Description</label>
              <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} rows={3}></textarea>
            </div>

            <div className={styles.inputGroup}>
              <label>Meta Keywords</label>
              <input type="text" name="metaKeywords" value={formData.metaKeywords} onChange={handleChange} placeholder="keyword1, keyword2, keyword3" />
            </div>
          </section>

          <div className={styles.formActions}>
            <button type="submit" className={styles.saveBtn} disabled={loading}>
              {loading ? 'Saving...' : 'Update Product'}
            </button>
            <button type="button" className={styles.cancelBtn} onClick={() => router.push('/admin/products')}>
              Cancel
            </button>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className={styles.sideCol}>
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Main Image</h2>
            <div className={styles.fileInputContainer}>
              {imagePreview ? (
                <div className={styles.imagePreviewWrapper}>
                  <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                  <button type="button" className={styles.changeImageBtn} onClick={() => fileInputRef.current?.click()}>
                    Change Image
                  </button>
                </div>
              ) : (
                <div className={styles.fileInputUpload} onClick={() => fileInputRef.current?.click()}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '8px' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <span>Click to choose file</span>
                  <p>JPG, PNG, WebP — max 2MB</p>
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
          </section>

          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Settings</h2>
            
            <div className={styles.toggleGroup}>
              <label className={styles.switch}>
                <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} />
                <span className={styles.slider}></span>
              </label>
              <span>Active (visible on site)</span>
            </div>

            <div className={styles.toggleGroup}>
              <label className={styles.switch}>
                <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
                <span className={styles.slider}></span>
              </label>
              <span>Featured Product</span>
            </div>
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle} style={{ margin: 0 }}>Variants (Size/Weight)</h2>
              <button type="button" className={styles.addVariantBtn}>+ Add</button>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}
