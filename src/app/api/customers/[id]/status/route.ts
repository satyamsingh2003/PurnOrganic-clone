import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;
    
    if (!status || (status !== 'Active' && status !== 'Blocked')) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    
    await sql`
      UPDATE customers
      SET status = ${status}
      WHERE id = ${id}
    `;
    
    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error('Error updating customer status:', error);
    return NextResponse.json({ error: 'Failed to update customer status' }, { status: 500 });
  }
}
