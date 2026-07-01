import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';
import ProductDetails from '@/components/ProductDetails/ProductDetails';

export const dynamic = 'force-dynamic';

export default async function ProductPage({
  params
}: {
  params: Promise<{ identifier: string }>
}) {
  const resolvedParams = await params;
  const identifier = resolvedParams.identifier;

  if (!identifier) {
    notFound();
  }

  // Fetch the specific product by slug or id
  const products = await sql`
    SELECT p.*, c.slug as category_slug, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE (p.slug = ${identifier} OR p.id::text = ${identifier})
      AND p.active IS NOT FALSE
    LIMIT 1
  `;

  if (products.length === 0) {
    notFound();
  }

  const rawProduct = products[0];
  const product: any = {
    ...rawProduct,
    id: String(rawProduct.id),
    price: Number(rawProduct.price),
    mrp: rawProduct.mrp ? Number(rawProduct.mrp) : undefined,
  };

  // Fetch related products (same category, excluding current product)
  let relatedProducts: any[] = [];
  if (product.category_id) {
    const relatedRes = await sql`
      SELECT p.*, c.slug as category_slug, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = ${product.category_id}
        AND p.id != ${product.id}
        AND p.active IS NOT FALSE
      ORDER BY p.sort_order ASC, p.id DESC
      LIMIT 4
    `;
    
    relatedProducts = relatedRes.map(p => ({
      ...p,
      id: String(p.id),
      price: Number(p.price),
      mrp: p.mrp ? Number(p.mrp) : undefined,
    }));
  }

  return (
    <div style={{ backgroundColor: 'var(--white)', minHeight: '80vh' }}>
      <ProductDetails product={product} relatedProducts={relatedProducts} />
    </div>
  );
}
