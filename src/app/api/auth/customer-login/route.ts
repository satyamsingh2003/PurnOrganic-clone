import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '@/lib/db';
import { signJwt } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone || phone.length < 9) {
      return NextResponse.json({ error: 'Valid mobile number is required' }, { status: 400 });
    }

    // Check if customer exists by phone
    let customers = await sql`SELECT * FROM customers WHERE phone = ${phone}`;
    let customer;
    
    if (customers.length === 0) {
      // For mobile login simulation, auto-register if they don't exist
      // In a real flow, you'd send an OTP to the phone first.
      const insertRes = await sql`
        INSERT INTO customers (phone, name) 
        VALUES (${phone}, 'Guest User') 
        RETURNING *
      `;
      customer = insertRes[0];
    } else {
      customer = customers[0];
    }

    // Generate JWT
    const token = await signJwt({
      id: customer.id,
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
    console.error('Customer login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
