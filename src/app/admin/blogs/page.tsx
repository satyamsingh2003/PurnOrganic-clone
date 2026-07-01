"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../products/page.module.css';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs');
      const data = await res.json();
      setBlogs(data.blogs || []);
    } catch (err) {
      console.error('Failed to fetch blogs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete blog "${title}"?`)) {
      try {
        const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchBlogs();
        } else {
          const err = await res.json();
          alert('Failed to delete blog: ' + err.error);
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
          <h1 className={styles.title}>Blog Posts</h1>
          <p className={styles.subtitle}>{blogs.length} posts</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/admin/blogs/categories" className={styles.resetBtn} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            Categories
          </Link>
          <Link href="/admin/blogs/new" className={styles.addBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Post
          </Link>
        </div>
      </div>

      <div className={styles.tableContainer} style={{ marginTop: '2rem' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading blogs...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>TITLE</th>
                <th>CATEGORY</th>
                <th>AUTHOR</th>
                <th>STATUS</th>
                <th>DATE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((b, i) => (
                <tr key={b.id}>
                  <td style={{ color: '#888' }}>{i + 1}</td>
                  <td>
                    <div className={styles.productInfo}>
                      <div className={styles.imageWrapper} style={{ width: '50px', height: '40px' }}>
                        <Image 
                          src={b.image || "https://uvb9swoktkk6ztcv.public.blob.vercel-storage.com/hero_background.png"} 
                          alt={b.title} 
                          fill 
                          className={styles.image} 
                        />
                      </div>
                      <div>
                        <strong>{b.title}</strong>
                        <div className={styles.unit}>{b.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td>{b.category_name || <span style={{color:'#ccc'}}>—</span>}</td>
                  <td>{b.author || 'Purn Organic Team'}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${b.published ? styles.active : styles.inactive}`}>
                      {b.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>{new Date(b.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td>
                    <div className={styles.actions}>
                      <Link href={`/admin/blogs/edit/${b.id}`} className={styles.editBtn}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </Link>
                      <button onClick={() => handleDelete(b.id, b.title)} className={styles.deleteBtn}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                    No blog posts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
