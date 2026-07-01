import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const blogs = await sql`
      SELECT b.*, c.name as category_name 
      FROM blogs b 
      LEFT JOIN blog_categories c ON b.category_id = c.id 
      ORDER BY b.created_at DESC
    `;
    return NextResponse.json({ blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, content, image, categoryId, author, published, metaTitle, metaDescription } = body;
    
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const result = await sql`
      INSERT INTO blogs (title, slug, excerpt, content, image, category_id, author, published, meta_title, meta_description)
      VALUES (${title}, ${finalSlug}, ${excerpt}, ${content}, ${image}, ${categoryId || null}, ${author}, ${published}, ${metaTitle}, ${metaDescription})
      RETURNING *
    `;
    
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}
