import React from 'react';
import styles from './Strengths.module.css';

const strengthsData = [
  {
    title: 'Ethically Sourced',
    description: 'Straight from sustainable local farms to your doorstep.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
    )
  },
  {
    title: 'Pure Integrity',
    description: 'Transparent processes you can trust, every single time.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
    )
  },
  {
    title: 'Community First',
    description: 'Empowering rural growers and supporting local economy.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
    )
  },
  {
    title: 'Curated Organic',
    description: 'A handpicked selection of 500+ premium organic goods.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
    )
  },
  {
    title: 'Gold Standard',
    description: 'Triple-certified quality checks for maximum nutrient density.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
    )
  },
  {
    title: 'Ancient Harvest',
    description: 'Preserving heritage grains with modern safety standards.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
    )
  }
];

const Strengths = () => {
  return (
    <section className={`section-padding ${styles.strengthsSection}`}>
      <div className="container">
        <h2 className="section-title">Why Choose PurnOrganic</h2>
        <p className={styles.sectionSubtitle}>Discover what makes us different and why we're the best choice for your organic needs.</p>
        
        <div className={styles.grid}>
          {strengthsData.map((item, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.iconWrapper}>
                {item.icon}
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDescription}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Strengths;
