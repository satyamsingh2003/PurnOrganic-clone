import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const result = await sql`SELECT * FROM banners WHERE id = ${id}`;
    if (result.length === 0) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error fetching banner:', error);
    return NextResponse.json({ error: 'Failed to fetch banner' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, subtitle, image, buttonText, buttonUrl, sortOrder, active } = body;
    
    const result = await sql`
      UPDATE banners 
      SET 
        title = ${title}, 
        subtitle = ${subtitle}, 
        image = ${image}, 
        button_text = ${buttonText}, 
        button_url = ${buttonUrl}, 
        sort_order = ${sortOrder}, 
        active = ${active}
      WHERE id = ${id}
      RETURNING *
    `;
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const result = await sql`DELETE FROM banners WHERE id = ${id} RETURNING *`;
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, deleted: result[0] });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
  }
}
