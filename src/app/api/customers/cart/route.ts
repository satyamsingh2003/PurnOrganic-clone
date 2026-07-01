import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '@/lib/db';
import { verifyJwt } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('customer_token')?.value;

    if (!token) return NextResponse.json({ cart: [] });

    const payload = await verifyJwt(token);
    if (!payload || payload.role !== 'customer') return NextResponse.json({ cart: [] });

    const carts = await sql`SELECT items FROM carts WHERE customer_id = ${payload.id}`;
    
    if (carts.length === 0) return NextResponse.json({ cart: [] });

    let items = carts[0].items || [];
    if (items.length > 0) {
      // Fetch live prices from DB to ensure they are always up to date
      const productIds = items.map((i: any) => parseInt(i.id)).filter((id: number) => !isNaN(id));
      if (productIds.length > 0) {
        const liveProducts = await sql`SELECT id, price, mrp FROM products WHERE id = ANY(${productIds})`;
        items = items.map((item: any) => {
          const liveProduct = liveProducts.find((p: any) => p.id === parseInt(item.id));
          if (liveProduct) {
            return {
              ...item,
              price: Number(liveProduct.price),
              mrp: liveProduct.mrp ? Number(liveProduct.mrp) : undefined
            };
          }
          return item;
        });
      }
    }
    
    return NextResponse.json({ cart: items });
  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('customer_token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyJwt(token);
    if (!payload || payload.role !== 'customer') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { items } = await request.json();

    await sql`
      INSERT INTO carts (customer_id, items, updated_at)
      VALUES (${payload.id}, ${JSON.stringify(items)}, CURRENT_TIMESTAMP)
      ON CONFLICT (customer_id) 
      DO UPDATE SET items = ${JSON.stringify(items)}, updated_at = CURRENT_TIMESTAMP
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cart PUT error:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}
