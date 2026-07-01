import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SingleBlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const blogsRes = await sql`
    SELECT b.*, c.name as category_name 
    FROM blogs b 
    LEFT JOIN blog_categories c ON b.category_id = c.id 
    WHERE b.slug = ${slug} AND b.published = true
  `;
  
  if (blogsRes.length === 0) {
    notFound();
  }
  const blog = blogsRes[0];

  // Fetch all categories for sidebar
  const categories = await sql`
    SELECT c.*, COUNT(b.id) as post_count 
    FROM blog_categories c 
    LEFT JOIN blogs b ON c.id = b.category_id AND b.published = true
    GROUP BY c.id 
    HAVING COUNT(b.id) > 0
    ORDER BY c.id ASC
  `;

  // Fetch recent stories for sidebar
  const recentStories = await sql`
    SELECT id, title, slug, image, created_at 
    FROM blogs 
    WHERE published = true AND id != ${blog.id} 
    ORDER BY created_at DESC 
    LIMIT 3
  `;

  return (
    <div style={{ backgroundColor: '#fafaf6', minHeight: '100vh' }}>
      
      {/* Blog Header */}
      <div style={{ backgroundColor: '#f5f7f2', padding: '3rem 1rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-dark)', maxWidth: '800px', margin: '0 auto 1rem' }}>
          {blog.title}
        </h1>
        <div style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>
          By <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{blog.author || 'Purn Organic Team'}</span>
          <span style={{ margin: '0 0.8rem', color: '#ccc' }}>|</span>
          {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
          <span style={{ margin: '0 0.8rem', color: '#ccc' }}>|</span>
          {blog.category_name || 'Uncategorized'}
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1rem', display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3rem' }}>
        
        {/* Left Col: Article Content */}
        <article>
          <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem' }}>
            <Image 
              src={blog.image || 'https://uvb9swoktkk6ztcv.public.blob.vercel-storage.com/hero_background.png'} 
              alt={blog.title} 
              fill 
              style={{ objectFit: 'cover' }} 
            />
          </div>

          <div 
            style={{ 
              fontSize: '1.1rem', 
              lineHeight: '1.8', 
              color: 'var(--text-dark)' 
            }}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #eee', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontWeight: 600 }}>Share this story:</span>
            {/* Simple share icons placeholders */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>X</div>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>f</div>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>in</div>
            </div>
          </div>
        </article>

        {/* Right Col: Sidebar */}
        <aside>
          
          {/* Categories Widget */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--text-dark)', borderBottom: '2px solid var(--primary-color)', display: 'inline-block', paddingBottom: '0.3rem' }}>
              Categories
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {categories.map((cat: any) => (
                <li key={cat.id} style={{ marginBottom: '1rem' }}>
                  <Link href={`/blogs?category=${cat.slug}`} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dark)', textDecoration: 'none' }}>
                    <span style={{ transition: 'color 0.2s' }}>{cat.name}</span>
                    <span style={{ color: 'var(--text-light)', background: '#f5f5f5', padding: '0.1rem 0.6rem', borderRadius: '20px', fontSize: '0.85rem' }}>
                      {cat.post_count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Stories Widget */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--text-dark)', borderBottom: '2px solid var(--primary-color)', display: 'inline-block', paddingBottom: '0.3rem' }}>
              Recent Stories
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {recentStories.map((story: any) => (
                <Link key={story.id} href={`/blog/${story.slug}`} style={{ display: 'flex', gap: '1rem', textDecoration: 'none' }}>
                  <div style={{ position: 'relative', width: '80px', height: '60px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                    <Image src={story.image || 'https://uvb9swoktkk6ztcv.public.blob.vercel-storage.com/hero_background.png'} alt={story.title} fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.3rem 0', fontSize: '0.95rem', color: 'var(--text-dark)', lineHeight: 1.3 }}>{story.title}</h4>
                    <span style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>
                      {new Date(story.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}
