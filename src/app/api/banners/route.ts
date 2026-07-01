import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const banners = await sql`
      SELECT * FROM banners
      ORDER BY sort_order ASC, created_at DESC
    `;
    return NextResponse.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, subtitle, image, buttonText, buttonUrl, sortOrder, active } = body;
    
    const result = await sql`
      INSERT INTO banners (title, subtitle, image, button_text, button_url, sort_order, active)
      VALUES (${title}, ${subtitle}, ${image}, ${buttonText}, ${buttonUrl}, ${sortOrder}, ${active})
      RETURNING *
    `;
    
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 });
  }
}
