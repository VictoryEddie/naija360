import { db } from './firebase';
import { doc, setDoc, getDoc, serverTimestamp, collection, query, getCountFromServer } from 'firebase/firestore';
import { mockArticles } from './mock-data';
import { useEffect, useState } from 'react';

/**
 * Seeds Firestore with article documents for all mock articles.
 * This ensures every article has a Firestore document with counts,
 * preventing the "0 counts on back navigation" issue.
 * 
 * SAFE: Only creates documents that don't exist.
 * SMART: Counts actual likes and comments from subcollections.
 */
export async function seedArticleDocuments() {
  console.log('🌱 Seeding article documents...');
  
  let created = 0;
  let existing = 0;
  let errors = 0;
  
  for (const article of mockArticles) {
    const articleRef = doc(db, 'articles', article.id);
    
    try {
      const articleSnap = await getDoc(articleRef);
      
      if (!articleSnap.exists()) {
        // Document doesn't exist - count actual likes and comments
        const likesRef = collection(db, 'articles', article.id, 'likes');
        const commentsRef = collection(db, 'articles', article.id, 'comments');
        
        // Count actual documents in subcollections
        const [likesSnapshot, commentsSnapshot] = await Promise.all([
          getCountFromServer(query(likesRef)),
          getCountFromServer(query(commentsRef)),
        ]);
        
        const actualLikeCount = likesSnapshot.data().count;
        const actualCommentCount = commentsSnapshot.data().count;
        
        // Create document with ACTUAL counts
        await setDoc(articleRef, {
          like_count: actualLikeCount,
          comment_count: actualCommentCount,
          created_at: serverTimestamp(),
          // Optional: store article metadata for future use
          title: article.title,
          source: article.source,
          category: article.category,
        });
        
        created++;
        console.log(`✅ Created document for article ${article.id} (${actualLikeCount} likes, ${actualCommentCount} comments)`);
      } else {
        existing++;
        const data = articleSnap.data();
        console.log(`ℹ️ Article ${article.id} already exists (${data.like_count} likes, ${data.comment_count} comments)`);
      }
    } catch (error) {
      console.error(`❌ Error seeding article ${article.id}:`, error);
      errors++;
    }
  }
  
  console.log(`✨ Seeding complete: ${created} created, ${existing} existing, ${errors} errors`);
  return { created, existing, errors };
}

/**
 * Hook to seed articles on app mount.
 * Call this once in your root layout or page.
 */
export function useSeedArticles() {
  const [isSeeded, setIsSeeded] = useState(false);
  
  useEffect(() => {
    if (!isSeeded) {
      seedArticleDocuments().then(() => {
        setIsSeeded(true);
      });
    }
  }, [isSeeded]);
  
  return isSeeded;
}
