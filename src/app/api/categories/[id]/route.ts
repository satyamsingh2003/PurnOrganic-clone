import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const categories = await sql`SELECT * FROM categories WHERE id = ${id}`;
    
    if (categories.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    return NextResponse.json(categories[0]);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const { 
      name, slug, description, parentId, image, active, 
      metaTitle, metaDescription, sortOrder 
    } = body;
    
    const result = await sql`
      UPDATE categories 
      SET 
        name = ${name},
        slug = ${slug || null},
        description = ${description || null},
        parent_id = ${parentId || null},
        image = ${image || null},
        active = ${active ?? true},
        meta_title = ${metaTitle || null},
        meta_description = ${metaDescription || null},
        sort_order = ${sortOrder || 0}
      WHERE id = ${id}
      RETURNING *
    `;
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // First check if there are any products in this category
    const products = await sql`SELECT id FROM products WHERE category_id = ${id} LIMIT 1`;
    if (products.length > 0) {
      return NextResponse.json({ error: 'Cannot delete category because it contains products. Reassign or delete the products first.' }, { status: 400 });
    }

    const result = await sql`DELETE FROM categories WHERE id = ${id} RETURNING id`;
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
