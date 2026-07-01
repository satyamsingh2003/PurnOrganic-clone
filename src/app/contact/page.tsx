import React from 'react';
import styles from './page.module.css';
import { sql } from '@/lib/db';
import ContactForm from './ContactForm';

export default async function ContactPage() {
  const settingsRows = await sql`SELECT key, value FROM settings`;
  
  const settings = settingsRows.reduce((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {} as Record<string, string>);

  const address = settings.full_address || "Unit No. LGF-67 Krishna Apra D'mall\nPlot No-1 Shakti Khand-2 Indirapuram\nGhaziabad - 201014";
  const phone = settings.contact_phone || "+91 9410333577";
  const email = settings.contact_email || "support@purnorganic.com";
  
  const whatsappUrl = settings.whatsapp_number ? `https://wa.me/${settings.whatsapp_number}` : "#";
  const facebookUrl = settings.facebook_url || "#";
  const instagramUrl = settings.instagram_url || "#";
  const twitterUrl = settings.twitter_url || "#";
  // Assuming youtube_url or linkedin_url can be used. Mockup shows LinkedIn, so we'll fallback to # if not present.
  const linkedinUrl = settings.linkedin_url || "#";
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.headerWrapper}>
        <h1 className={styles.title}>Contact Our Team</h1>
        <p className={styles.subtitle}>
          Have questions about our organic products or farming model? We're here to help.
        </p>
      </div>

      <div className={styles.mainContainer}>
        {/* Form Card */}
        <ContactForm />

        {/* Info Card & Socials */}
        <div className={styles.infoCardWrapper}>
          <div className={styles.infoCard}>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div>
                <h3 className={styles.contactLabel}>Visit Us</h3>
                <p className={styles.contactValue}>
                  {address.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br/>
                    </React.Fragment>
                  ))}
                </p>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <div>
                <h3 className={styles.contactLabel}>Call Us</h3>
                <p className={styles.contactValue}>{phone}</p>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <div>
                <h3 className={styles.contactLabel}>Email Us</h3>
                <p className={styles.contactValue}>{email}</p>
              </div>
            </div>
          </div>

          <div className={styles.socialSection}>
            <h4 className={styles.socialTitle}>Follow Our Journey</h4>
            <div className={styles.socialIcons}>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </a>
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.73 15h5L9 4H4z"></path><path d="M4 20l6.76-8.87M20 4l-6.76 8.87"></path></svg>
              </a>
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
