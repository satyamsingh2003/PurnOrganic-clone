import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '@/lib/db';
import { verifyJwt } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('customer_token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyJwt(token);
    if (!payload || payload.role !== 'customer') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : null;

    let orders;
    if (limit) {
      orders = await sql`
        SELECT * FROM orders 
        WHERE user_id = ${payload.id} 
        ORDER BY created_at DESC 
        LIMIT ${limit}
      `;
    } else {
      orders = await sql`
        SELECT * FROM orders 
        WHERE user_id = ${payload.id} 
        ORDER BY created_at DESC
      `;
    }

    if (orders.length > 0) {
      const orderIds = orders.map(o => o.id);
      const items = await sql`
        SELECT oi.*, p.name as product_name, p.image as product_image
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ANY(${orderIds})
      `;

      orders = orders.map(order => ({
        ...order,
        items: items.filter(item => item.order_id === order.id)
      }));
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Customer orders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
