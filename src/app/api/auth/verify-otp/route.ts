import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '@/lib/db';
import { signJwt } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, phone, otp, bypassOtp } = await request.json();

    if ((!email && !phone) || (!otp && !bypassOtp)) {
      return NextResponse.json({ error: 'Target (Email/Phone) and OTP are required' }, { status: 400 });
    }

    if (!bypassOtp) {
      // Check OTP in database
      const otpRecords = email 
        ? await sql`SELECT otp, expires_at, attempts FROM otps WHERE email = ${email}`
        : await sql`SELECT otp, expires_at, attempts FROM otps WHERE phone = ${phone}`;

      if (otpRecords.length === 0) {
        return NextResponse.json({ error: 'No OTP requested for this contact' }, { status: 400 });
      }

      const record = otpRecords[0];

      // Check if locked out due to too many attempts (Max 3 attempts)
      if (record.attempts >= 3) {
        if (email) {
          await sql`DELETE FROM otps WHERE email = ${email}`;
        } else {
          await sql`DELETE FROM otps WHERE phone = ${phone}`;
        }
        return NextResponse.json({ error: 'Too many failed attempts. Please request a new OTP.' }, { status: 429 });
      }

      if (new Date() > new Date(record.expires_at)) {
        return NextResponse.json({ error: 'OTP has expired' }, { status: 401 });
      }

      if (record.otp !== otp) {
        // Increment attempts
        if (email) {
          await sql`UPDATE otps SET attempts = attempts + 1 WHERE email = ${email}`;
        } else {
          await sql`UPDATE otps SET attempts = attempts + 1 WHERE phone = ${phone}`;
        }
        const attemptsLeft = 3 - (record.attempts + 1);
        return NextResponse.json({ error: `Invalid OTP. You have ${attemptsLeft} attempt(s) left.` }, { status: 401 });
      }

      // OTP is valid! Delete it so it can't be reused
      if (email) {
        await sql`DELETE FROM otps WHERE email = ${email}`;
      } else {
        await sql`DELETE FROM otps WHERE phone = ${phone}`;
      }
    }

    // Check if customer exists
    let customers = email
      ? await sql`SELECT * FROM customers WHERE email = ${email}`
      : await sql`SELECT * FROM customers WHERE phone = ${phone}`;
      
    let customer;
    
    if (customers.length === 0) {
      // Register the new user
      let insertRes;
      if (email) {
        insertRes = await sql`INSERT INTO customers (email, name) VALUES (${email}, 'Guest User') RETURNING *`;
      } else {
        insertRes = await sql`INSERT INTO customers (phone, name) VALUES (${phone}, 'Guest User') RETURNING *`;
      }
      customer = insertRes[0];
    } else {
      customer = customers[0];
    }

    // Generate JWT
    const token = await signJwt({
      id: customer.id,
      email: customer.email,
      phone: customer.phone,
      role: 'customer'
    });

    // Set secure HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('customer_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return NextResponse.json({ success: true, user: customer });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
