import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const categories = await sql`
      SELECT c.*, COUNT(p.id) as product_count 
      FROM categories c 
      LEFT JOIN products p ON c.id = p.category_id 
      GROUP BY c.id 
      ORDER BY c.sort_order ASC, c.id DESC
    `;
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, slug, description, parentId, image, active, 
      metaTitle, metaDescription, sortOrder 
    } = body;
    
    const result = await sql`
      INSERT INTO categories (
        name, slug, description, parent_id, image, active,
        meta_title, meta_description, sort_order
      )
      VALUES (
        ${name}, ${slug || null}, ${description || null}, ${parentId || null}, ${image || null}, ${active ?? true},
        ${metaTitle || null}, ${metaDescription || null}, ${sortOrder || 0}
      )
      RETURNING *
    `;
    
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
