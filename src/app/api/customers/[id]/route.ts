import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    
    // Fetch customer info
    const customerRes = await sql`
      SELECT id, name, email, phone, address, city, state, pincode, created_at, status
      FROM customers
      WHERE id = ${id}
    `;
    
    if (customerRes.length === 0) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    
    const customer = customerRes[0];
    
    // Fetch customer's orders
    const orders = await sql`
      SELECT o.id, o.amount as total_amount, o.status, o.created_at, COUNT(oi.id) as items_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ${id}
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;
    
    // Calculate summary stats
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);

    return NextResponse.json({
      ...customer,
      summary: {
        totalOrders,
        totalSpent
      },
      orders
    });
  } catch (error) {
    console.error('Failed to fetch customer details:', error);
    return NextResponse.json({ error: 'Failed to fetch customer details' }, { status: 500 });
  }
}
