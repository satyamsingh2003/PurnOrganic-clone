import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const customers = await sql`
      SELECT 
        c.id, 
        c.name, 
        c.email, 
        c.phone, 
        c.created_at, 
        c.status,
        COUNT(o.id) as orders_count,
        COALESCE(SUM(o.amount), 0) as total_spent
      FROM customers c
      LEFT JOIN orders o ON c.id = o.user_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `;
    return NextResponse.json(customers);
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}
