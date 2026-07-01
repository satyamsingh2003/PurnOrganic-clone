"use client";

import React, { useState } from 'react';
import styles from './Reviews.module.css';

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
}

const dummyReviews: Review[] = [];

const renderStars = (rating: number) => {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
};

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(dummyReviews);
  const [name, setName] = useState('');
  const [rating, setRating] = useState('5');
  const [reviewText, setReviewText] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !reviewText.trim()) return;

    const newReview = {
      id: Date.now().toString(),
      name,
      rating: parseInt(rating),
      text: reviewText
    };

    setReviews([newReview, ...reviews]);
    setName('');
    setRating('5');
    setReviewText('');
    
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className={styles.reviewsContainer}>
      <h2 className={styles.sectionTitle}>Customer Reviews</h2>
      
      <div className={styles.reviewList}>
        {reviews.map(review => (
          <div key={review.id} className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <span className={styles.reviewerName}>{review.name}</span>
              <span className={styles.stars}>{renderStars(review.rating)}</span>
            </div>
            <p className={styles.reviewText}>{review.text}</p>
          </div>
        ))}
      </div>

      <div className={styles.formContainer}>
        <h3 className={styles.formTitle}>Write a Review</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="reviewerName" className={styles.label}>Name *</label>
              <input 
                id="reviewerName"
                type="text" 
                className={styles.input} 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="reviewerRating" className={styles.label}>Rating *</label>
              <select 
                id="reviewerRating"
                className={styles.select} 
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="5">★★★★★ Excellent</option>
                <option value="4">★★★★☆ Good</option>
                <option value="3">★★★☆☆ Average</option>
                <option value="2">★★☆☆☆ Poor</option>
                <option value="1">★☆☆☆☆ Terrible</option>
              </select>
            </div>
          </div>
          
          <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="reviewerText" className={styles.label}>Review *</label>
            <textarea 
              id="reviewerText"
              className={styles.textarea} 
              required
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </div>
          
          <button type="submit" className={styles.submitBtn}>Submit Review</button>
          
          {showToast && (
            <div className={styles.toast}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              Thank you! Your review has been submitted.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Reviews;
