"use client";

import React, { useState } from 'react';
import styles from './FAQ.module.css';

const faqs = [
  {
    question: "How is your Desi Ghee prepared?",
    answer: "Our Desi Ghee is prepared using the traditional Bilona method, where curd is churned to extract butter. This ensures the Ghee retains its natural aroma, nutrients, and medicinal properties without any additives."
  },
  {
    question: "Are your cold-pressed oils chemical-free?",
    answer: "Yes, our Sarso (Mustard) and Olive oils are extracted at room temperature without the use of heat or chemicals, preserving the natural fatty acids and flavors."
  },
  {
    question: "How do you ensure your products are 100% organic?",
    answer: "We work directly with certified organic farms. Every batch of our Organic Daals, Red Rice, and Wheat undergoes strict quality checks to ensure no synthetic pesticides were used during cultivation."
  },
  {
    question: "What is your typical delivery time?",
    answer: "Typically, orders are processed within 24 hours. Depending on your location, you can expect your fresh organic harvest at your doorstep within 3 to 5 business days."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={`section-padding ${styles.faqSection}`}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.leftColumn}>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1rem' }}>Common Inquiries</h2>
            <p className={styles.subtitle}>Find answers to frequently asked questions about our products, orders, delivery process, and organic lifestyle recommendations.</p>
          </div>
          
          <div className={styles.rightColumn}>
            <div className={styles.accordion}>
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`${styles.faqItem} ${openIndex === index ? styles.active : ''}`}
                >
                  <button 
                    className={styles.faqQuestion} 
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={openIndex === index}
                  >
                    <span>{faq.question}</span>
                    <span className={styles.icon}>
                      {openIndex === index ? '−' : '+'}
                    </span>
                  </button>
                  <div 
                    className={styles.faqAnswer}
                    style={{ 
                      maxHeight: openIndex === index ? '200px' : '0',
                      opacity: openIndex === index ? 1 : 0
                    }}
                  >
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
