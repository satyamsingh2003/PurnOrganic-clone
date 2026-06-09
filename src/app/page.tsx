import HeroCarousel from '@/components/HeroCarousel/HeroCarousel';
import Strengths from '@/components/Strengths/Strengths';
import CategoryGrid from '@/components/CategoryGrid/CategoryGrid';
import ProductGrid from '@/components/ProductGrid/ProductGrid';
import Testimonials from '@/components/Testimonials/Testimonials';
import BlogShowcase from '@/components/BlogShowcase/BlogShowcase';
import FAQ from '@/components/FAQ/FAQ';

const mostLovedProducts = [
  {
    id: '1',
    name: 'Red Chilli Powder',
    price: 139.00,
    image: '/category_spices.png',
    link: '/product/red-chilli-powder'
  },
  {
    id: '2',
    name: 'Organic Basmati Rice',
    price: 249.00,
    image: '/hero_background.png',
    link: '/product/organic-basmati-rice'
  },
  {
    id: '3',
    name: 'Stone Ground Wheat',
    price: 69.00,
    image: '/category_daal.png',
    link: '/product/stone-ground-wheat'
  },
  {
    id: '4',
    name: 'Turmeric Powder',
    price: 149.00,
    image: '/category_spices.png',
    link: '/product/turmeric-powder'
  }
];

const organicMasalaProducts = [
  {
    id: '5',
    name: 'Ginger Powder',
    price: 169.00,
    image: '/category_spices.png',
    link: '/product/ginger-powder'
  },
  {
    id: '6',
    name: 'Black Pepper Powder',
    price: 199.00,
    image: '/category_spices.png',
    link: '/product/black-pepper-powder'
  },
  {
    id: '7',
    name: 'Red Chilli Powder',
    price: 139.00,
    image: '/category_spices.png',
    link: '/product/red-chilli-powder'
  },
  {
    id: '8',
    name: 'Turmeric Powder',
    price: 149.00,
    image: '/category_spices.png',
    link: '/product/turmeric-powder'
  }
];

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <Strengths />
      <ProductGrid 
        title="Most Loved Products" 
        products={mostLovedProducts} 
        viewAllLink="/products"
      />
      <CategoryGrid />
      <ProductGrid 
        title="Organic Masala" 
        products={organicMasalaProducts} 
        viewAllLink="/products?category=handground-spices"
      />
      <BlogShowcase />
      <Testimonials />
      <FAQ />
    </>
  );
}
