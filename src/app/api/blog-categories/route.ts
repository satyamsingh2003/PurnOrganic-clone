import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const categories = await sql`
      SELECT c.*, COUNT(b.id) as post_count 
      FROM blog_categories c 
      LEFT JOIN blogs b ON c.id = b.category_id 
      GROUP BY c.id 
      ORDER BY c.id ASC
    `;
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, active } = body;
    
    const result = await sql`
      INSERT INTO blog_categories (name, slug, active)
      VALUES (${name}, ${slug}, ${active ?? true})
      RETURNING *
    `;
    
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating blog category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
