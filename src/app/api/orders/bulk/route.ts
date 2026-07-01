import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { orderIds, status } = body;
    
    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0 || !status) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    
    await sql`
      UPDATE orders
      SET status = ${status}
      WHERE id = ANY(${orderIds})
    `;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in bulk order update:', error);
    return NextResponse.json({ error: 'Failed to update orders' }, { status: 500 });
  }
}
