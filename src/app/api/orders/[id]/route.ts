import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    
    // Fetch main order
    const orderRes = await sql`
      SELECT o.id, o.amount as total_amount, o.status, o.created_at, o.user_id as customer_id, o.notes, o.tracking_number
      FROM orders o
      WHERE o.id = ${id}
    `;
    
    if (orderRes.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    const order = orderRes[0];
    
    // Fetch items
    const items = await sql`
      SELECT oi.id, oi.quantity, oi.price, oi.mrp, p.name as product_name, p.image as product_image
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${id}
    `;
    
    // Fetch customer info
    const customerRes = await sql`
      SELECT id, name, email, phone, address, city, state, pincode
      FROM customers
      WHERE id = ${order.customer_id}
    `;
    
    const customer = customerRes.length > 0 ? customerRes[0] : null;

    return NextResponse.json({
      ...order,
      items,
      customer
    });
  } catch (error) {
    console.error('Failed to fetch order details:', error);
    return NextResponse.json({ error: 'Failed to fetch order details' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const { status, tracking_number } = await request.json();
    
    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }
    
    await sql`
      UPDATE orders
      SET 
        status = ${status},
        tracking_number = ${tracking_number || null}
      WHERE id = ${id}
    `;
    
    return NextResponse.json({ success: true, status, tracking_number });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
