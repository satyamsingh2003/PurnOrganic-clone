import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function BlogsPage() {
  const blogsRes = await sql`
    SELECT b.*, c.name as category_name 
    FROM blogs b 
    LEFT JOIN blog_categories c ON b.category_id = c.id 
    WHERE b.published = true 
    ORDER BY b.created_at DESC
  `;

  return (
    <div style={{ backgroundColor: '#fafaf6', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div style={{ padding: '1.5rem 1rem 3rem 1rem', textAlign: 'center', backgroundColor: '#f5f7f2' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '1rem' }}>Blogs</h1>
        <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-light)', fontSize: '1.1rem' }}>
          Read our latest blog posts and stay updated with the newest trends in organic farming and sustainable living.
        </p>
      </div>

      <div style={{ 
        maxWidth: '1200px', 
        margin: '-2rem auto 0', 
        padding: '0 1rem',
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '2rem' 
      }}>
        {blogsRes.map(blog => (
          <div key={blog.id} style={{ 
            background: 'white', 
            borderRadius: '12px', 
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            transition: 'transform 0.2s',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ position: 'relative', width: '100%', height: '220px' }}>
              <Image 
                src={blog.image || 'https://uvb9swoktkk6ztcv.public.blob.vercel-storage.com/hero_background.png'} 
                alt={blog.title} 
                fill 
                style={{ objectFit: 'cover' }} 
              />
              {blog.category_name && (
                <div style={{ 
                  position: 'absolute', 
                  top: '1rem', 
                  left: '1rem', 
                  backgroundColor: 'var(--primary-color)', 
                  color: 'white', 
                  padding: '0.3rem 0.8rem', 
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase'
                }}>
                  {blog.category_name}
                </div>
              )}
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
              </div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dark)', marginBottom: '0.8rem', lineHeight: 1.4 }}>
                {blog.title}
              </h3>
              <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>
                {blog.excerpt || (blog.content ? blog.content.replace(/<[^>]+>/g, '').substring(0, 100) + '...' : '')}
              </p>
              <Link href={`/blog/${blog.slug}`} style={{ 
                color: 'var(--primary-color)', 
                fontWeight: 600, 
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                Read Story <span style={{ fontSize: '1.2em' }}>&rsaquo;</span>
              </Link>
            </div>
          </div>
        ))}

        {blogsRes.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-light)' }}>
            No blog posts published yet.
          </div>
        )}
      </div>
    </div>
  );
}
