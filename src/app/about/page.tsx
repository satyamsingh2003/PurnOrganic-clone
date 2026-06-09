import React from 'react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="section-padding">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 className="section-title">Our Story</h1>
          <p style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--text-light)', fontSize: '1.1rem', lineHeight: 1.6 }}>
            From Soil to Soul. We are on a mission to bring 100% pure, unadulterated organic products to every Indian household while empowering local farmers.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', height: '400px', borderRadius: '12px', overflow: 'hidden' }}>
            <Image src="/hero_background.png" alt="Organic Farm" fill style={{ objectFit: 'cover' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>Empowering Local Farmers</h2>
            <p style={{ color: 'var(--text-light)', lineHeight: 1.6, marginBottom: '1rem' }}>
              We started with a simple belief: the food we eat should nourish us, not harm us with chemicals. We bypass the middlemen to source directly from sustainable, ethical farmers who use traditional farming methods.
            </p>
            <p style={{ color: 'var(--text-light)', lineHeight: 1.6 }}>
              Every purchase you make directly supports rural communities and promotes ecological balance. We ensure a fair price for their hard work and a pure product for your family.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
