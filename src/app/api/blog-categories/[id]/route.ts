import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const categories = await sql`SELECT * FROM blog_categories WHERE id = ${id}`;
    
    if (categories.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    return NextResponse.json(categories[0]);
  } catch (error) {
    console.error('Error fetching blog category:', error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, active } = body;
    
    const result = await sql`
      UPDATE blog_categories 
      SET name = ${name}, slug = ${slug}, active = ${active ?? true}
      WHERE id = ${id}
      RETURNING *
    `;
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating blog category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const blogs = await sql`SELECT id FROM blogs WHERE category_id = ${id} LIMIT 1`;
    if (blogs.length > 0) {
      return NextResponse.json({ error: 'Cannot delete category because it contains blogs.' }, { status: 400 });
    }

    const result = await sql`DELETE FROM blog_categories WHERE id = ${id} RETURNING id`;
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
