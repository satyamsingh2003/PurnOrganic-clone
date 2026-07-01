import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const products = await sql`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ${id}
    `;

    if (products.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(products[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const { 
      name, slug, categoryId, shortDescription, fullDescription, 
      price, mrp, stockQty, unit, badge, sortOrder, 
      metaTitle, metaDescription, metaKeywords, active, featured,
      image, link 
    } = body;

    const result = await sql`
      UPDATE products SET
        name = ${name},
        slug = ${slug || null},
        category_id = ${categoryId || null},
        short_description = ${shortDescription || null},
        full_description = ${fullDescription || null},
        price = ${price || 0},
        mrp = ${mrp || null},
        stock_qty = ${stockQty || 0},
        unit = ${unit || null},
        badge = ${badge || null},
        sort_order = ${sortOrder || 0},
        meta_title = ${metaTitle || null},
        meta_description = ${metaDescription || null},
        meta_keywords = ${metaKeywords || null},
        active = ${active ?? true},
        featured = ${featured ?? false},
        image = ${image || null},
        link = ${link || null}
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await sql`DELETE FROM products WHERE id = ${id} RETURNING id`;
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
