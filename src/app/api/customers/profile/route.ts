import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '@/lib/db';
import { verifyJwt } from '@/lib/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('customer_token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyJwt(token);
    if (!payload || payload.role !== 'customer') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const customers = await sql`SELECT * FROM customers WHERE id = ${payload.id}`;
    if (customers.length === 0) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });

    return NextResponse.json({ user: customers[0] });
  } catch (error) {
    console.error('Profile GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('customer_token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyJwt(token);
    if (!payload || payload.role !== 'customer') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { name, email, address, city, state, pincode, phone } = body;

    const result = await sql`
      UPDATE customers 
      SET 
        name = ${name}, 
        email = ${email},
        address = ${address}, 
        city = ${city}, 
        state = ${state}, 
        pincode = ${pincode},
        phone = ${phone}
      WHERE id = ${payload.id}
      RETURNING *
    `;

    return NextResponse.json({ success: true, user: result[0] });
  } catch (error) {
    console.error('Profile PUT error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
