"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

type CmsPage = {
  id: number;
  title: string;
  slug: string;
  content: string;
  status: string;
  meta_title: string;
  meta_description: string;
};

export default function CmsEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [page, setPage] = useState<CmsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const { id } = await params;
        const res = await fetch(`/api/cms/${id}`);
        if (res.ok) {
          const data = await res.json();
          setPage(data);
        } else {
          alert('Page not found');
          router.push('/admin/cms');
        }
      } catch (err) {
        console.error('Failed to load page', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [params, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (page) {
      setPage({ ...page, [e.target.name]: e.target.value });
    }
  };

  const handleStatusToggle = () => {
    if (page) {
      setPage({ ...page, status: page.status === 'Published' ? 'Draft' : 'Published' });
    }
  };

  const handleSave = async () => {
    if (!page) return;
    setSaving(true);
    try {
      const { id } = await params;
      const res = await fetch(`/api/cms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(page),
      });
      if (res.ok) {
        alert('Page saved successfully!');
      } else {
        alert('Failed to save page');
      }
    } catch (err) {
      alert('Error saving page');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.loadingState}>Loading editor...</div>;
  }

  if (!page) return null;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Edit CMS Page</h1>
          <p className={styles.subtitle}>
            {page.title} — <span className={styles.slugHighlight}>/{page.slug}</span>
          </p>
        </div>
        <Link href="/admin/cms" className={styles.backBtn}>
          ← Back
        </Link>
      </div>

      <div className={styles.mainGrid}>
        {/* Left Column: Content */}
        <div className={styles.leftCol}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Page Content</h2>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Page Title *</label>
              <input 
                type="text" 
                name="title" 
                value={page.title} 
                onChange={handleChange} 
                className={styles.input} 
                required 
              />
            </div>
            
            <div className={styles.inputGroup} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <label className={styles.label}>Content *</label>
              <textarea 
                name="content" 
                value={page.content || ''} 
                onChange={handleChange} 
                className={styles.textarea} 
                placeholder="<p>HTML is supported. Use <p>, <h2>, <ul>, <strong> etc.</p>"
                required
              />
              <p className={styles.helpText}>HTML is supported. Use &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;strong&gt; etc.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Settings */}
        <div className={styles.rightCol}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Page Settings</h2>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Slug (URL)</label>
              <div className={styles.slugInputWrapper}>
                <span className={styles.slugPrefix}>/</span>
                <input 
                  type="text" 
                  name="slug" 
                  value={page.slug} 
                  onChange={handleChange} 
                  className={styles.slugInput} 
                />
              </div>
            </div>
            
            <div className={styles.statusToggleGroup}>
              <div 
                className={`${styles.toggleSwitch} ${page.status === 'Published' ? styles.toggleOn : styles.toggleOff}`}
                onClick={handleStatusToggle}
              >
                <div className={styles.toggleKnob}></div>
              </div>
              <span className={styles.statusLabel}>
                {page.status === 'Published' ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>SEO</h2>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Meta Title</label>
              <input 
                type="text" 
                name="meta_title" 
                value={page.meta_title || ''} 
                onChange={handleChange} 
                className={styles.input} 
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Meta Description</label>
              <textarea 
                name="meta_description" 
                value={page.meta_description || ''} 
                onChange={handleChange} 
                className={styles.textareaSmall} 
                rows={3}
              />
            </div>
          </div>

          <div className={styles.actionsCard}>
            <button 
              className={styles.saveBtn} 
              onClick={handleSave}
              disabled={saving}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button className={styles.previewBtn} onClick={() => alert('Preview mode not implemented yet.')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              Preview Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
