import HeroCarousel from '@/components/HeroCarousel/HeroCarousel';
import Strengths from '@/components/Strengths/Strengths';
import CategoryGrid from '@/components/CategoryGrid/CategoryGrid';
import ProductGrid from '@/components/ProductGrid/ProductGrid';
import Testimonials from '@/components/Testimonials/Testimonials';
import BlogShowcase from '@/components/BlogShowcase/BlogShowcase';
import FAQ from '@/components/FAQ/FAQ';
import RevealOnScroll from '@/components/RevealOnScroll/RevealOnScroll';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch active banners
  const bannersRes = await sql`SELECT * FROM banners WHERE active = true ORDER BY sort_order ASC`;
  const banners = bannersRes.map(b => ({
    id: String(b.id),
    title: b.title || '',
    subtitle: b.subtitle || '',
    image: b.image || '',
    button_text: b.button_text || '',
    button_url: b.button_url || ''
  }));

  // Fetch published blogs
  const blogsRes = await sql`SELECT * FROM blogs WHERE published = true ORDER BY created_at DESC LIMIT 3`;
  const blogs = blogsRes.map(b => ({
    id: String(b.id),
    title: b.title || '',
    excerpt: b.excerpt || '',
    image: b.image || '',
    slug: b.slug || String(b.id),
    date: new Date(b.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  }));

  // Fetch most Loved products
  const mostLovedRes = await sql`SELECT * FROM products WHERE active IS NOT FALSE AND featured = true ORDER BY sort_order ASC, id DESC LIMIT 4`;
  const mostLovedProducts = mostLovedRes.map(p => ({
    id: String(p.id),
    name: p.name || '',
    image: p.image || '',
    price: Number(p.price) || 0,
    mrp: p.mrp ? Number(p.mrp) : undefined,
    link: `/product/${p.slug || p.id}`
  }));

  // Fetch Organic Masala products
  const masalaRes = await sql`
    SELECT p.*, c.slug as category_slug, c.name as category_name 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id 
    WHERE c.slug = 'handground-spices' AND p.active IS NOT FALSE
    ORDER BY p.sort_order ASC, p.id DESC
    LIMIT 4
  `;
  const organicMasalaProducts = masalaRes.map(p => ({
    id: String(p.id),
    name: p.name || '',
    image: p.image || '',
    price: Number(p.price) || 0,
    mrp: p.mrp ? Number(p.mrp) : undefined,
    link: `/product/${p.slug || p.id}`
  }));

  return (
    <>
      <HeroCarousel banners={banners} />
      
      <RevealOnScroll>
        <CategoryGrid />
      </RevealOnScroll>
      
      <RevealOnScroll>
        <ProductGrid 
          title="Most Loved Products" 
          products={mostLovedProducts} 
          viewAllLink="/products"
        />
      </RevealOnScroll>
      
      <RevealOnScroll>
        <ProductGrid 
          title="Organic Masala" 
          products={organicMasalaProducts} 
          viewAllLink="/products?category=handground-spices"
        />
      </RevealOnScroll>
      
      <RevealOnScroll>
        <BlogShowcase blogs={blogs} />
      </RevealOnScroll>
      
      <RevealOnScroll>
        <Strengths />
      </RevealOnScroll>
      
      <RevealOnScroll>
        <Testimonials />
      </RevealOnScroll>
      
      <RevealOnScroll>
        <FAQ />
      </RevealOnScroll>
    </>
  );
}
