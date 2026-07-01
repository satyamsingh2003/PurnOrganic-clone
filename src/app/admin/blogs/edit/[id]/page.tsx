"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../../new/page.module.css';

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
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
    image: ''
  });

  useEffect(() => {
    fetch('/api/blog-categories')
      .then(res => res.json())
      .then(data => setCategories(data.categories || []))
      .catch(err => console.error(err));

    fetch(`/api/blogs/${unwrappedParams.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load blog');
        return res.json();
      })
      .then(blog => {
        setFormData({
          title: blog.title || '',
          slug: blog.slug || '',
          excerpt: blog.excerpt || '',
          content: blog.content || '',
          categoryId: blog.category_id ? String(blog.category_id) : '',
          author: blog.author || '',
          published: blog.published ?? true,
          metaTitle: blog.meta_title || '',
          metaDescription: blog.meta_description || '',
          image: blog.image || ''
        });
        if (blog.image) setImagePreview(blog.image);
        setFetching(false);
      })
      .catch(err => {
        console.error(err);
        alert('Failed to load blog post');
        router.push('/admin/blogs');
      });
  }, [unwrappedParams.id, router]);

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
      let imageUrl = formData.image;
      
      if (fileInputRef.current?.files?.length) {
        const file = fileInputRef.current.files[0];
        const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: 'POST',
          body: file,
        });
        const blob = await res.json();
        imageUrl = blob.url;
      }

      const response = await fetch(`/api/blogs/${unwrappedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          image: imageUrl,
        }),
      });

      if (response.ok) {
        router.push('/admin/blogs'); 
      } else {
        const err = await response.json();
        alert('Error: ' + err.error);
      }
    } catch (err) {
      alert('Failed to update blog post');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={{ padding: '2rem' }}>Loading blog details...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Edit Blog Post</h1>
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
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} />
            </div>

            <div className={styles.inputGroup}>
              <label>Excerpt (short summary)</label>
              <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={2}></textarea>
            </div>

            <div className={styles.inputGroup}>
              <label>Content *</label>
              <textarea name="content" value={formData.content} onChange={handleChange} rows={10} required></textarea>
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
              {loading ? 'Updating...' : 'Update Post'}
            </button>
            <button type="button" className={styles.cancelBtn} onClick={() => router.push('/admin/blogs')}>
              Cancel
            </button>
          </div>
        </div>

        <div className={styles.sideCol}>
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Featured Image</h2>
            {imagePreview && (
              <div style={{ position: 'relative', width: '100%', height: '150px', marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden' }}>
                <Image src={imagePreview} alt="Preview" fill style={{ objectFit: 'cover' }} />
              </div>
            )}
            <div className={styles.fileInput}>
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/jpeg, image/png, image/webp" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setImagePreview(URL.createObjectURL(file));
                }}
              />
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
