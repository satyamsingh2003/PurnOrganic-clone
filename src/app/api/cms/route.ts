import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const pages = await sql`
      SELECT id, title, slug, status, updated_at
      FROM cms_pages
      ORDER BY id ASC
    `;
    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error fetching CMS pages:', error);
    return NextResponse.json({ error: 'Failed to fetch CMS pages' }, { status: 500 });
  }
}
