"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './HeroCarousel.module.css';

type Banner = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  button_text: string;
  button_url: string;
};

const HeroCarousel = ({ banners }: { banners: Banner[] }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000); // Change banner every 5 seconds
    return () => clearInterval(timer);
  }, [banners]);

  if (!banners || banners.length === 0) return null;

  return (
    <section className={styles.heroSection}>
      {banners.map((b, index) => (
        <div key={b.id} className={`${styles.slide} ${index === current ? styles.activeSlide : ''}`}>
          <div className={styles.imageWrapper}>
            <Image 
              src={b.image || "https://uvb9swoktkk6ztcv.public.blob.vercel-storage.com/hero_background.png"} 
              alt={b.title || "Hero Background"} 
              fill
              priority={index === 0}
              className={styles.heroImage}
            />
            <div className={styles.overlay}></div>
          </div>
          
          <div className={`container ${styles.content}`}>
            <h1 className={styles.title}>{b.title}</h1>
            <p className={styles.subtitle}>{b.subtitle}</p>
            <div className={styles.actions}>
              {b.button_text && (
                <Link href={b.button_url || '#categories'} className="btn-primary">
                  {b.button_text}
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
      
      {banners.length > 1 && (
        <div className={styles.dots}>
          {banners.map((_, index) => (
            <button 
              key={index} 
              className={`${styles.dot} ${index === current ? styles.activeDot : ''}`}
              onClick={() => setCurrent(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroCarousel;
