import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './HeroCarousel.module.css';

const HeroCarousel = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.imageWrapper}>
        <Image 
          src="/hero_background.png" 
          alt="Lush green organic farm at sunrise" 
          fill
          priority
          className={styles.heroImage}
        />
        <div className={styles.overlay}></div>
      </div>
      
      <div className={`container ${styles.content}`}>
        <h1 className={styles.title}>Pure Grains for a Healthier Everyday Life</h1>
        <p className={styles.subtitle}>
          From naturally grown rice to stone-ground flours, bring home wholesome nutrition, authentic taste, and the goodness of chemical-free farming.
        </p>
        <div className={styles.actions}>
          <Link href="/products" className="btn-primary">
            SHOP NOW
          </Link>
          <Link href="/about" className="btn-outline">
            LEARN MORE
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
