"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../../products/page.module.css';

export default function BlogCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Add Category form state
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '', active: true });

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/blog-categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const generatedSlug = formData.slug.trim() || formData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
      
      const res = await fetch('/api/blog-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, slug: generatedSlug })
      });
      
      if (res.ok) {
        setFormData({ name: '', slug: '', active: true });
        fetchCategories();
      } else {
        const err = await res.json();
        alert('Error: ' + err.error);
      }
    } catch (err) {
      alert('Failed to add category');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete blog category "${name}"?`)) {
      try {
        const res = await fetch(`/api/blog-categories/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchCategories();
        } else {
          const err = await res.json();
          alert('Failed to delete: ' + err.error);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Blog Categories</h1>
        </div>
        <Link href="/admin/blogs" className={styles.resetBtn} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to Blogs
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', marginTop: '2rem' }}>
        
        {/* Left Side: Add Form */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', alignSelf: 'start' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', color: 'var(--text-dark)' }}>Add Category</h3>
          <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-dark)', fontWeight: 500 }}>Name *</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
                placeholder="Category name"
                style={{ width: '100%', padding: '0.6rem 1rem', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.9rem' }}
              />
            </div>
            
            {/* Keeping Slug hidden normally to match user request style on normal categories */}
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-dark)', fontWeight: 500 }}>Status</label>
              <select 
                value={formData.active.toString()}
                onChange={e => setFormData({...formData, active: e.target.value === 'true'})}
                style={{ width: '100%', padding: '0.6rem 1rem', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.9rem' }}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              disabled={isAdding}
              style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.8rem', borderRadius: '6px', fontWeight: 500, cursor: 'pointer', marginTop: '0.5rem' }}
            >
              {isAdding ? 'Saving...' : 'Save Category'}
            </button>
          </form>
        </div>

        {/* Right Side: Data Table */}
        <div className={styles.tableContainer} style={{ marginTop: 0 }}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Loading categories...</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>NAME</th>
                  <th>SLUG</th>
                  <th>POSTS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c, i) => (
                  <tr key={c.id}>
                    <td style={{ color: '#888' }}>{i + 1}</td>
                    <td><strong>{c.name}</strong></td>
                    <td style={{ color: '#888' }}>{c.slug}</td>
                    <td>{c.post_count || 0}</td>
                    <td>
                      <button onClick={() => handleDelete(c.id, c.name)} className={styles.deleteBtn}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}
