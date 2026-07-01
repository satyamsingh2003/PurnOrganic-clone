import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '@/lib/db';
import { verifyJwt } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('customer_token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyJwt(token);
    if (!payload || payload.role !== 'customer') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { address_id, items, amount, payment_method } = body;

    if (!address_id || !items || items.length === 0) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }

    // 1. Fetch the selected address to snapshot it
    const addressRes = await sql`SELECT * FROM customer_addresses WHERE id = ${address_id} AND customer_id = ${payload.id}`;
    if (addressRes.length === 0) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }
    const address = addressRes[0];

    // 2. Generate a unique order ID with a database collision check
    let orderId = '';
    let isUnique = false;
    
    while (!isUnique) {
      const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
      orderId = `#ORD${randomHex}`;
      
      const existing = await sql`SELECT id FROM orders WHERE id = ${orderId}`;
      if (existing.length === 0) {
        isUnique = true;
      }
    }

    // 3. Insert into orders table
    await sql`
      INSERT INTO orders (
        id, user_id, amount, status, 
        delivery_name, delivery_phone, delivery_alternate_phone, 
        delivery_address, delivery_city, delivery_state, delivery_pincode,
        notes
      ) VALUES (
        ${orderId}, ${payload.id}, ${amount}, 'Pending',
        ${address.full_name}, ${address.phone}, ${address.alternate_phone || null},
        ${address.address}, ${address.city}, ${address.state}, ${address.pincode},
        ${payment_method || 'COD'}
      )
    `;

    // 4. Insert order items
    for (const item of items) {
      const priceToInsert = item.price;
      const mrpToInsert = item.mrp || item.price;
      
      await sql`
        INSERT INTO order_items (
          order_id, 
          product_id, 
          quantity, 
          price,
          mrp
        ) VALUES (
          ${orderId}, 
          ${item.id}, 
          ${item.quantity}, 
          ${priceToInsert},
          ${mrpToInsert}
        )
      `;
    }

    // 5. Clear the user's cart in DB
    await sql`UPDATE carts SET items = '[]'::jsonb WHERE customer_id = ${payload.id}`;

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error('Order placement error:', error);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}
