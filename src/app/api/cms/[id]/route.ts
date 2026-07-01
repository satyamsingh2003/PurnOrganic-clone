import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await sql`
      SELECT * FROM cms_pages WHERE id = ${id}
    `;
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error fetching CMS page:', error);
    return NextResponse.json({ error: 'Failed to fetch CMS page' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, slug, content, status, meta_title, meta_description } = body;
    
    if (!title || !slug) {
      return NextResponse.json({ error: 'Title and Slug are required' }, { status: 400 });
    }
    
    const result = await sql`
      UPDATE cms_pages
      SET 
        title = ${title},
        slug = ${slug},
        content = ${content},
        status = ${status},
        meta_title = ${meta_title},
        meta_description = ${meta_description},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating CMS page:', error);
    return NextResponse.json({ error: 'Failed to update CMS page' }, { status: 500 });
  }
}
