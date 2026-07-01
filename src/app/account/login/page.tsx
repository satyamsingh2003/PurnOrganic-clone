"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get('redirect') || '/account';

  const [activeTab, setActiveTab] = useState<'mobile' | 'email'>('mobile');
  
  // States
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'initial' | 'otp'>('initial');
  const [mobile, setMobile] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  
  // Timer State
  const [timer, setTimer] = useState(0);

  // Logo State
  const [logoUrl, setLogoUrl] = useState('');

  // Fetch settings for logo
  React.useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings && Array.isArray(data.settings)) {
          const settingsObj = data.settings.reduce((acc: any, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
          }, {});
          if (settingsObj.site_logo) setLogoUrl(settingsObj.site_logo);
        }
      })
      .catch(console.error);
  }, []);

  // Countdown effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMsg('OTP sent to your email!');
        setStep('otp');
        setTimer(30);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const payload = activeTab === 'email' ? { email, otp } : { phone: mobile, otp };
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (res.ok) {
        window.location.href = redirectUrl;
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleMobileLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate Indian Mobile Number (10 digits, starts with 6-9)
    const cleanMobile = mobile.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setError("Please enter a valid 10-digit Indian mobile number ");
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TEMPORARY BYPASS: Directly verify the mobile number without sending/requiring an OTP
      // We are passing bypassOtp: true to the verify endpoint
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanMobile, otp: 'bypass', bypassOtp: true })
      });
      const data = await res.json();
      
      if (res.ok) {
        window.location.href = redirectUrl;
      } else {
        setError(data.error);
      }

      /* 
      // FUTURE IMPLEMENTATION: Uncomment this when you have an SMS provider to show the OTP screen
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanMobile })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMsg('OTP sent to your mobile number!');
        setStep('otp');
        setTimer(30);
      } else {
        setError(data.error);
      }
      */
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (activeTab === 'email') {
      handleSendOtp(new Event('submit') as any);
    } else {
      handleMobileLogin(new Event('submit') as any);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.splitCard}>
        
        {/* Left Side: Branding / Image */}
        <div className={styles.leftPane}>
          <div className={styles.leftContent}>
            <div className={styles.badge}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              100% CERTIFIED ORGANIC
            </div>
            <h1 className={styles.heroTitle}>Straight from the Farm to Your Soul.</h1>
            <p className={styles.heroSubtitle}>Join thousands of families choosing a chemical-free lifestyle. Log in to manage your <b>Family Kitchen Subscriptions</b> and support local farmers.</p>
            
            <div className={styles.statsRow}>
              <div>
                <h3 className={styles.statNumber}>500+</h3>
                <p className={styles.statLabel}>Natural Products</p>
              </div>
              <div>
                <h3 className={styles.statNumber}>10k+</h3>
                <p className={styles.statLabel}>Happy Families</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className={styles.rightPane}>
          <div className={styles.formWrapper}>
            <div className={styles.logoContainer}>
              <Link href="/" style={{ textDecoration: 'none', display: 'block' }}>
                {logoUrl ? (
                  <img src={logoUrl} alt="PurnOrganic" style={{ maxHeight: '80px', maxWidth: '300px', width: 'auto', height: 'auto', objectFit: 'contain', margin: '0 auto', display: 'block' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '2rem', fontWeight: 800, color: 'var(--primary-color)', justifyContent: 'center' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--primary-color)" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 7H13V13H11V7ZM11 15H13V17H11V15Z" fill="none"/>
                      <path d="M17.5 10.5C17.5 7.46 15.04 5 12 5C8.96 5 6.5 7.46 6.5 10.5C6.5 11.8 7 13 7.85 13.92L12 18.5L16.15 13.92C17 13 17.5 11.8 17.5 10.5ZM12 16.27L9.27 13.27C8.78 12.73 8.5 12 8.5 11.27C8.5 9.34 10.07 7.77 12 7.77C13.93 7.77 15.5 9.34 15.5 11.27C15.5 12 15.22 12.73 14.73 13.27L12 16.27Z"/>
                    </svg>
                    <span>पूर्ण<span style={{color: '#15803d'}}>Organic</span></span>
                  </div>
                )}
              </Link>
            </div>
            <h2 className={styles.formTitle}>Login / Sign Up</h2>
            <p className={styles.formSubtitle}>Enter your details to continue</p>

            {error && <div className={styles.error}>{error}</div>}
            {msg && <div className={styles.success}>{msg}</div>}

            {step === 'initial' && (
              <div className={styles.tabs}>
                <button 
                  className={`${styles.tab} ${activeTab === 'mobile' ? styles.activeTab : ''}`}
                  onClick={() => { setActiveTab('mobile'); setError(''); setMsg(''); }}
                >
                  Mobile Number
                </button>
                <button 
                  className={`${styles.tab} ${activeTab === 'email' ? styles.activeTab : ''}`}
                  onClick={() => { setActiveTab('email'); setError(''); setMsg(''); }}
                >
                  Email ID
                </button>
              </div>
            )}

            {activeTab === 'mobile' && step === 'initial' && (
              <div className={styles.formContainer}>
                  <form onSubmit={handleMobileLogin} className={styles.form}>
                    <div className={styles.inputWrapper}>
                      <div className={styles.inputPrefix}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                        +91
                      </div>
                      <input 
                        type="text" 
                        value={mobile} 
                        onChange={e => setMobile(e.target.value)} 
                        placeholder="00000 00000" 
                        className={styles.groupedInput}
                        required 
                      />
                      <button type="submit" className={styles.inlineBtn} disabled={loading}>
                        {loading ? '...' : 'Get OTP'}
                      </button>
                    </div>
                    <p className={styles.helperText}>
                      New to PurnOrganic? <b>Just enter your number</b> — we'll create your account automatically.
                    </p>
                  </form>
                </div>
            )}

            {activeTab === 'email' && step === 'initial' && (
              <div className={styles.formContainer}>
                  <form onSubmit={handleSendOtp} className={styles.form}>
                    <div className={styles.inputWrapper}>
                      <div className={styles.inputPrefix}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      </div>
                      <input 
                        type="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        placeholder="you@example.com" 
                        className={styles.groupedInput}
                        required 
                      />
                      <button type="submit" className={styles.inlineBtn} disabled={loading}>
                        {loading ? '...' : 'Get OTP'}
                      </button>
                    </div>
                    <p className={styles.helperText}>
                      New to PurnOrganic? <b>Just enter your email</b> — we'll create your account automatically.
                    </p>
                  </form>
              </div>
            )}

            {step === 'otp' && (
              <div className={styles.formContainer}>
                  <form onSubmit={handleVerifyOtp} className={styles.form}>
                    
                    {/* Mockup Style: OTP Sent Box */}
                    <div className={styles.otpSentBox}>
                      <div className={styles.otpSentDetails}>
                        <span className={styles.otpSentLabel}>OTP sent to</span>
                        <span className={styles.otpSentTarget}>{activeTab === 'email' ? email : `+91 ${mobile}`}</span>
                      </div>
                      <button type="button" className={styles.changeBtn} onClick={() => setStep('initial')}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        Change
                      </button>
                    </div>

                    {/* Enter OTP Field */}
                    <div className={styles.inputGroup}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#333', marginBottom: '0.5rem', display: 'block' }}>Enter OTP</label>
                      <div className={styles.otpInputWrapper}>
                        <div className={styles.otpIconPrefix}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"></path><circle cx="16.5" cy="7.5" r=".5" fill="#2e7d32"></circle></svg>
                        </div>
                        <input 
                          type="text" 
                          value={otp} 
                          onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ''))} 
                          placeholder="• • • • • •" 
                          maxLength={6}
                          className={styles.otpInputBox}
                          required 
                        />
                      </div>
                    </div>
                    
                    <button type="submit" className={styles.verifyBtn} disabled={loading}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
                      {loading ? 'Verifying...' : 'Verify & Login'}
                    </button>
                    
                    <p className={styles.helperText} style={{ marginTop: '0.5rem' }}>
                      {timer > 0 ? (
                        <>Didn't receive? <span style={{ color: '#888' }}>(resend in {timer}s)</span></>
                      ) : (
                        <button 
                          type="button" 
                          onClick={handleResendOtp}
                          style={{ background: 'none', border: 'none', color: '#16a34a', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}
                        >
                          Resend OTP
                        </button>
                      )}
                    </p>
                    
                  </form>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
