"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

type CmsPage = {
  id: number;
  title: string;
  slug: string;
  status: string;
  updated_at: string;
};

export default function CmsAdminPage() {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await fetch('/api/cms');
        if (res.ok) {
          const data = await res.json();
          setPages(data);
        }
      } catch (err) {
        console.error('Failed to load CMS pages', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>CMS Pages</h1>
          <p className={styles.subtitle}>Manage static content pages</p>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>PAGE TITLE</th>
              <th>SLUG / URL</th>
              <th>STATUS</th>
              <th>LAST UPDATED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className={styles.emptyState}>Loading pages...</td>
              </tr>
            ) : pages.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.emptyState}>No CMS pages found.</td>
              </tr>
            ) : (
              pages.map((page, index) => (
                <tr key={page.id}>
                  <td className={styles.lightText}>{index + 1}</td>
                  <td className={styles.bold}>{page.title}</td>
                  <td className={styles.lightText}>
                    <Link href={`/${page.slug}`} target="_blank" className={styles.slugLink}>
                      /{page.slug}
                      <svg className={styles.linkIcon} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </Link>
                  </td>
                  <td>
                    <span className={page.status === 'Published' ? styles.statusPublished : styles.statusDraft}>
                      {page.status}
                    </span>
                  </td>
                  <td className={styles.lightText}>{formatDate(page.updated_at)}</td>
                  <td>
                    <Link href={`/admin/cms/${page.id}/edit`} className={styles.editBtn}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
