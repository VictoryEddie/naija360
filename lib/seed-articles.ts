import { db } from './firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { mockArticles } from './mock-data';

/**
 * Seeds Firestore with mock articles
 * Run this once to populate your database
 * Usage: Call this function from a page or API route
 */
export async function seedArticles() {
  try {
    console.log('Starting to seed articles...');
    
    for (const article of mockArticles) {
      const articleRef = doc(db, 'articles', article.id);
      await setDoc(articleRef, {
        title: article.title,
        source: article.source,
        published_date: article.published_date,
        image_url: article.image_url,
        excerpt: article.excerpt,
        category: article.category,
        external_url: article.external_url,
        like_count: article.like_count,
        comment_count: article.comment_count,
        cached_at: article.cached_at,
      });
      console.log(`Seeded article: ${article.title}`);
    }
    
    console.log('✅ All articles seeded successfully!');
    return { success: true, count: mockArticles.length };
  } catch (error) {
    console.error('Error seeding articles:', error);
    throw error;
  }
}
