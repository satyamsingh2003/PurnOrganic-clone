import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '@/lib/db';
import { verifyJwt } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('customer_token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyJwt(token);
    if (!payload || payload.role !== 'customer') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { order_id, product_id, rating, review_text, image_url } = body;

    // Optional validation
    if (!order_id || !rating) {
      return NextResponse.json({ error: 'Order ID and rating are required' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO product_reviews (customer_id, product_id, order_id, rating, review_text, image_url)
      VALUES (${payload.id}, ${product_id || null}, ${order_id}, ${rating}, ${review_text || null}, ${image_url || null})
      RETURNING *
    `;

    return NextResponse.json({ success: true, review: result[0] });
  } catch (error) {
    console.error('Submit review error:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
