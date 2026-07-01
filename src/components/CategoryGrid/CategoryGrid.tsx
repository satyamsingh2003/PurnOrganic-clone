import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './CategoryGrid.module.css';

const categories = [
  {
    title: 'Organic Daals',
    subtitle: 'Protein-rich farm fresh pulses',
    link: '/products?category=organic-daals',
    image: 'https://uvb9swoktkk6ztcv.public.blob.vercel-storage.com/category_daal.png'
  },
  {
    title: 'Grains & Flours',
    subtitle: 'Traditional Red Rice & Whole Wheat',
    link: '/products?category=grains-flours',
    image: 'https://uvb9swoktkk6ztcv.public.blob.vercel-storage.com/category_spices.png' 
  },
  {
    title: 'Handground Spices',
    subtitle: 'Turmeric, Chilli & Black Pepper',
    link: '/products?category=handground-spices',
    image: 'https://uvb9swoktkk6ztcv.public.blob.vercel-storage.com/category_spices.png'
  },
  {
    title: 'Pure Desi Ghee',
    subtitle: 'Traditional Bilona Method Ghee',
    link: '/products?category=pure-desi-ghee',
    image: 'https://uvb9swoktkk6ztcv.public.blob.vercel-storage.com/category_daal.png' 
  },
  {
    title: 'Assam Tea',
    subtitle: 'Premium Single-Origin Leaves',
    link: '/products?category=assam-tea',
    image: 'https://uvb9swoktkk6ztcv.public.blob.vercel-storage.com/category_spices.png' 
  },
  {
    title: 'Cold Pressed Oils',
    subtitle: 'Pure Mustard & Olive Oils',
    link: '/products?category=cold-pressed-oils',
    image: 'https://uvb9swoktkk6ztcv.public.blob.vercel-storage.com/hero_background.png' // Reusing hero image for demo
  }
];

const CategoryGrid = () => {
  return (
    <section id="categories" className={`section-padding ${styles.categorySection}`}>
      <div className="container">
        <h2 className="section-title">Shop By Categories</h2>
        
        <div className={styles.grid}>
          {categories.map((category, index) => (
            <Link href={category.link} key={index} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image 
                  src={category.image} 
                  alt={category.title}
                  fill
                  className={styles.image}
                />
                <div className={styles.overlay}></div>
              </div>
              <div className={styles.content}>
                <h3 className={styles.cardTitle}>{category.title}</h3>
                <p className={styles.cardSubtitle}>{category.subtitle}</p>
                <span className={styles.exploreLink}>Explore Collection &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
