import React from 'react';
import styles from './Testimonials.module.css';

const testimonials = [
  {
    product: "Best Quality Desi Ghee",
    review: "Reminds me of my grandmother's hand-churned ghee. The aroma fills the kitchen when making dal tadka and parathas. Perfect for sweets during Diwali too.",
    author: "Sneha R.",
    rating: 5
  },
  {
    product: "Pure Forest Honey",
    review: "I take a spoonful every morning with warm lemon water. You can clearly taste the difference from supermarket brands — this is real raw honey from the forest.",
    author: "Rahul V.",
    rating: 5
  },
  {
    product: "Stone-Ground Wheat Flour",
    review: "Switched our entire family from packaged atta. Rotis are softer, taste like home, and we feel lighter after meals. Even my mother-in-law approves!",
    author: "Meera K.",
    rating: 5
  },
  {
    product: "Authentic Turmeric Powder",
    review: "The color and aroma are unmatched. I use it daily in curries and golden milk before bed. My skin has also improved since I started using it in face packs.",
    author: "Priya S.",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className={`section-padding ${styles.testimonialSection}`}>
      <div className="container">
        <h2 className="section-title">Verified Purchase Stories</h2>
        <p className={styles.sectionSubtitle}>Read genuine customer experiences, success stories, and honest feedback from people who trust our organic products every day.</p>
        
        <div className={styles.carouselContainer}>
          <div className={styles.carousel}>
            {testimonials.map((item, index) => (
              <div key={index} className={styles.card}>
                <div className={styles.stars}>
                  {[...Array(item.rating)].map((_, i) => (
                    <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="#FFC107" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  ))}
                </div>
                <h3 className={styles.productName}>{item.product}</h3>
                <p className={styles.review}>"{item.review}"</p>
                <div className={styles.author}>
                  <div className={styles.avatar}>{item.author.charAt(0)}</div>
                  <span className={styles.authorName}>{item.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
