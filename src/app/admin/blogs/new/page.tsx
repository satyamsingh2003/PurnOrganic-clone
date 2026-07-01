"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function AddBlogPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    categoryId: '',
    author: '',
    published: true,
    metaTitle: '',
    metaDescription: '',
  });

  useEffect(() => {
    fetch('/api/blog-categories')
      .then(res => res.json())
      .then(data => setCategories(data.categories || []))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
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

      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          image: imageUrl || 'https://uvb9swoktkk6ztcv.public.blob.vercel-storage.com/hero_background.png',
        }),
      });

      if (response.ok) {
        router.push('/admin/blogs'); 
      } else {
        const err = await response.json();
        alert('Error: ' + err.error);
      }
    } catch (err) {
      alert('Failed to create blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Add Blog Post</h1>
        </div>
        <Link href="/admin/blogs" className={styles.backBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back
        </Link>
      </div>

      <form className={styles.formLayout} onSubmit={handleSubmit}>
        <div className={styles.mainCol}>
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Post Content</h2>
            
            <div className={styles.inputGroup}>
              <label>Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Blog post title" required />
            </div>

            <div className={styles.inputGroup}>
              <label>Slug</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} placeholder="auto-generated if empty" />
            </div>

            <div className={styles.inputGroup}>
              <label>Excerpt (short summary)</label>
              <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={2} placeholder="Brief summary shown on blog listing"></textarea>
            </div>

            <div className={styles.inputGroup}>
              <label>Content *</label>
              <textarea name="content" value={formData.content} onChange={handleChange} rows={10} placeholder="Full blog content (HTML supported)" required></textarea>
            </div>
          </section>

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
          </section>

          <div className={styles.formActions}>
            <button type="submit" className={styles.saveBtn} disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Post'}
            </button>
            <button type="button" className={styles.cancelBtn} onClick={() => router.push('/admin/blogs')}>
              Cancel
            </button>
          </div>
        </div>

        <div className={styles.sideCol}>
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Featured Image</h2>
            <div className={styles.fileInput}>
              <input type="file" ref={fileInputRef} accept="image/jpeg, image/png, image/webp" />
              <p>Recommended: 1200x630px</p>
            </div>
          </section>

          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Post Settings</h2>
            
            <div className={styles.inputGroup}>
              <label>Category</label>
              <select name="categoryId" value={formData.categoryId} onChange={handleChange}>
                <option value="">No Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Author</label>
              <input type="text" name="author" value={formData.author} onChange={handleChange} />
            </div>

            <div className={styles.toggleGroup}>
              <label className={styles.switch}>
                <input type="checkbox" name="published" checked={formData.published} onChange={handleChange} />
                <span className={styles.slider}></span>
              </label>
              <span>Published</span>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}
