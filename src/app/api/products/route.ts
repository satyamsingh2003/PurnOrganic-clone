import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const products = await sql`
      SELECT p.*, c.slug as category_slug, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.sort_order ASC, p.id DESC
    `;
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, slug, categoryId, shortDescription, fullDescription, 
      price, mrp, stockQty, unit, badge, sortOrder, 
      metaTitle, metaDescription, metaKeywords, active, featured,
      image, link 
    } = body;
    
    const result = await sql`
      INSERT INTO products (
        name, slug, category_id, short_description, full_description,
        price, mrp, stock_qty, unit, badge, sort_order,
        meta_title, meta_description, meta_keywords, active, featured,
        image, link
      )
      VALUES (
        ${name}, ${slug || null}, ${categoryId || null}, ${shortDescription || null}, ${fullDescription || null},
        ${price || 0}, ${mrp || null}, ${stockQty || 0}, ${unit || null}, ${badge || null}, ${sortOrder || 0},
        ${metaTitle || null}, ${metaDescription || null}, ${metaKeywords || null}, ${active ?? true}, ${featured ?? false},
        ${image || null}, ${link || null}
      )
      RETURNING *
    `;
    
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
