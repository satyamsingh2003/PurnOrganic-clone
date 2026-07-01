import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email, phone } = await request.json();

    if (!email && !phone) {
      return NextResponse.json({ error: 'Valid email or phone is required' }, { status: 400 });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Expires in 10 minutes
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Save to DB (upsert based on email or phone)
    if (email) {
      const existing = await sql`SELECT id FROM otps WHERE email = ${email}`;
      if (existing.length > 0) {
        await sql`UPDATE otps SET otp = ${otp}, expires_at = ${expiresAt}, attempts = 0 WHERE email = ${email}`;
      } else {
        await sql`INSERT INTO otps (email, otp, expires_at, attempts) VALUES (${email}, ${otp}, ${expiresAt}, 0)`;
      }
    } else if (phone) {
      const existing = await sql`SELECT id FROM otps WHERE phone = ${phone}`;
      if (existing.length > 0) {
        await sql`UPDATE otps SET otp = ${otp}, expires_at = ${expiresAt}, attempts = 0 WHERE phone = ${phone}`;
      } else {
        await sql`INSERT INTO otps (phone, otp, expires_at, attempts) VALUES (${phone}, ${otp}, ${expiresAt}, 0)`;
      }
    }

    // Send OTP via appropriate channel
    if (email) {
      // Configure Nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
        await transporter.sendMail({
          from: `"PurnOrganic" <${process.env.SMTP_EMAIL}>`,
          to: email,
          subject: 'Your Login OTP for PurnOrganic',
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2>PurnOrganic Login</h2>
              <p>Your One-Time Password (OTP) to login is:</p>
              <h1 style="color: #2e7d32; letter-spacing: 2px;">${otp}</h1>
              <p>This code will expire in 10 minutes.</p>
              <p>If you didn't request this, you can safely ignore this email.</p>
            </div>
          `
        });
      } else {
        console.warn("SMTP_EMAIL or SMTP_PASSWORD not set in .env. Falling back to console logging OTP.");
        console.log(`\n\n=== [SIMULATED EMAIL] To: ${email} | OTP: ${otp} ===\n\n`);
      }
    } else if (phone) {
      // Simulate SMS logic
      console.log(`\n\n=== [SIMULATED SMS] To: ${phone} | OTP: ${otp} ===\n\n`);
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
