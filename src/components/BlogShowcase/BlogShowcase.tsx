import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './BlogShowcase.module.css';

const blogs = [
  {
    date: 'Apr 28, 2026',
    title: 'From Soil to Soul: Our commitment to direct farming',
    excerpt: 'A deep dive into our ethical sourcing process and how we support our local farming community by cutting...',
    link: '/blog/from-soil-to-soul-our-commitment-to-direct-farming',
    image: '/hero_background.png' // Using hero background as placeholder
  },
  {
    date: 'May 05, 2026',
    title: 'Healing Spices: More than just flavor for your food',
    excerpt: 'From anti-inflammatory turmeric to metabolic-boosting black pepper, learn the science of spices and...',
    link: '/blog/healing-spices-more-than-just-flavor',
    image: '/category_spices.png' // Using spices image
  },
  {
    date: 'May 10, 2026',
    title: 'The Golden Elixir: Why Desi Ghee belongs in your kitchen',
    excerpt: 'Discover the ancient Ayurvedic benefits of traditional Bilona ghee and how it boosts immunity, aids...',
    link: '/blog/why-desi-ghee-belongs-in-your-kitchen',
    image: '/category_daal.png' // Using daal image
  }
];

const BlogShowcase = () => {
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
          {blogs.map((blog, index) => (
            <div key={index} className={styles.card}>
              <Link href={blog.link} className={styles.imageWrapper}>
                <Image 
                  src={blog.image} 
                  alt={blog.title}
                  fill
                  className={styles.image}
                />
              </Link>
              <div className={styles.content}>
                <span className={styles.date}>{blog.date}</span>
                <Link href={blog.link}>
                  <h3 className={styles.title}>{blog.title}</h3>
                </Link>
                <p className={styles.excerpt}>{blog.excerpt}</p>
                <Link href={blog.link} className={styles.readMore}>
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
