import { notFound } from 'next/navigation';
import { sql } from '@/lib/db';
import styles from './page.module.css';

// Revalidate every hour, or use dynamic
export const revalidate = 60; 

export default async function CmsFrontendPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  // We skip slugs that are definitely not CMS pages (like 'api', 'admin', 'images')
  if (['api', 'admin', '_next'].includes(slug)) {
    notFound();
  }

  const result = await sql`
    SELECT * FROM cms_pages 
    WHERE slug = ${slug} 
    AND status = 'Published'
    LIMIT 1
  `;

  if (result.length === 0) {
    notFound();
  }

  const page = result[0];

  return (
    <div className={styles.pageWrapper}>
      <div className={`container ${styles.paper}`}>
        <h1 className={styles.pageTitle}>{page.title}</h1>
        <div className={styles.contentArea} dangerouslySetInnerHTML={{ __html: page.content }} />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  
  try {
    const result = await sql`SELECT meta_title, meta_description, title FROM cms_pages WHERE slug = ${slug} AND status = 'Published' LIMIT 1`;
    
    if (result.length > 0) {
      const page = result[0];
      return {
        title: page.meta_title || `${page.title} | Purn Organic`,
        description: page.meta_description || `Read the ${page.title} for Purn Organic.`,
      };
    }
  } catch (err) {
    // Ignore db errors for metadata
  }
  
  return {
    title: 'Purn Organic',
  };
}
