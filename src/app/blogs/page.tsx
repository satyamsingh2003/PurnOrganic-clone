import React from 'react';
import BlogShowcase from '@/components/BlogShowcase/BlogShowcase';

export default function BlogsPage() {
  return (
    <div>
      <div style={{ backgroundColor: 'var(--primary-color)', color: 'var(--white)', padding: '4rem 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>The Organic Journal</h1>
        <p style={{ maxWidth: '600px', margin: '0 auto', color: '#e0e0e0' }}>
          Discover wellness tips, healthy living ideas, organic lifestyle guides, and inspiring stories to help you live naturally every day.
        </p>
      </div>
      
      {/* We reuse the BlogShowcase component but we can hide its internal title via CSS or just let it render */}
      <div style={{ marginTop: '-4rem' }}>
        <BlogShowcase />
      </div>
    </div>
  );
}
