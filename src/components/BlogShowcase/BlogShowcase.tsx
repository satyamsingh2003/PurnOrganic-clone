import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './BlogShowcase.module.css';

type Blog = {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  slug: string;
  date: string;
};

const BlogShowcase = ({ blogs }: { blogs: Blog[] }) => {
  if (!blogs || blogs.length === 0) return null;

  return (
    <section className={`section-padding ${styles.blogSection}`}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1rem' }}>The Organic Journal</h2>
            <p className={styles.subtitle}>Discover wellness tips, healthy living ideas, organic lifestyle guides, and inspiring stories to help you live naturally every day.</p>
          </div>
          <Link href="/blogs" className={styles.viewAllBtn}>Explore All Stories</Link>
        </div>
        
        <div className={styles.grid}>
          {blogs.map((blog) => (
            <div key={blog.id} className={styles.card}>
              <Link href={`/blog/${blog.slug}`} className={styles.imageWrapper}>
                <Image 
                  src={blog.image || "https://uvb9swoktkk6ztcv.public.blob.vercel-storage.com/hero_background.png"} 
                  alt={blog.title}
                  fill
                  className={styles.image}
                />
              </Link>
              <div className={styles.content}>
                <span className={styles.date}>{blog.date}</span>
                <Link href={`/blog/${blog.slug}`}>
                  <h3 className={styles.title}>{blog.title}</h3>
                </Link>
                <p className={styles.excerpt}>{blog.excerpt}</p>
                <Link href={`/blog/${blog.slug}`} className={styles.readMore}>
                  Read Story &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogShowcase;
