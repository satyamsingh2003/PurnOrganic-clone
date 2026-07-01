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

    const addresses = await sql`
      SELECT * FROM customer_addresses 
      WHERE customer_id = ${payload.id} 
      ORDER BY is_default DESC, created_at DESC
    `;

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error('Addresses GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('customer_token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyJwt(token);
    if (!payload || payload.role !== 'customer') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { full_name, phone, alternate_phone, address, city, state, pincode, is_default } = body;

    // If setting as default, unset others
    if (is_default) {
      await sql`UPDATE customer_addresses SET is_default = false WHERE customer_id = ${payload.id}`;
    }

    const result = await sql`
      INSERT INTO customer_addresses (
        customer_id, full_name, phone, alternate_phone, address, city, state, pincode, is_default
      ) VALUES (
        ${payload.id}, ${full_name}, ${phone}, ${alternate_phone || null}, ${address}, ${city}, ${state}, ${pincode}, ${is_default ? true : false}
      )
      RETURNING *
    `;

    return NextResponse.json({ success: true, address: result[0] });
  } catch (error) {
    console.error('Addresses POST error:', error);
    return NextResponse.json({ error: 'Failed to add address' }, { status: 500 });
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
    const { id, full_name, phone, alternate_phone, address, city, state, pincode, is_default } = body;

    if (is_default) {
      await sql`UPDATE customer_addresses SET is_default = false WHERE customer_id = ${payload.id}`;
    }

    const result = await sql`
      UPDATE customer_addresses SET
        full_name = ${full_name},
        phone = ${phone},
        alternate_phone = ${alternate_phone || null},
        address = ${address},
        city = ${city},
        state = ${state},
        pincode = ${pincode},
        is_default = ${is_default ? true : false}
      WHERE id = ${id} AND customer_id = ${payload.id}
      RETURNING *
    `;

    if (result.length === 0) return NextResponse.json({ error: 'Address not found' }, { status: 404 });

    return NextResponse.json({ success: true, address: result[0] });
  } catch (error) {
    console.error('Addresses PUT error:', error);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('customer_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyJwt(token);
    if (!payload || payload.role !== 'customer') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Address ID required' }, { status: 400 });

    await sql`DELETE FROM customer_addresses WHERE id = ${id} AND customer_id = ${payload.id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Addresses DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
