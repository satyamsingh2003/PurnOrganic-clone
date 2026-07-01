import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const orders = await sql`
      SELECT o.id, o.amount as total_amount, o.status, o.created_at, c.name as customer_name, c.phone, c.id as customer_id
      FROM orders o
      LEFT JOIN customers c ON o.user_id = c.id
      ORDER BY o.created_at DESC
    `;
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
