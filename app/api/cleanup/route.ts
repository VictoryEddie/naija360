import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, deleteDoc, writeBatch } from 'firebase/firestore';

/**
 * API route to clean up all likes and reset counts
 * Visit: http://localhost:3000/api/cleanup
 * 
 * WARNING: This deletes ALL likes and resets ALL counts!
 * Only use this in development for testing
 */
export async function GET() {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Cleanup is disabled in production' },
        { status: 403 }
      );
    }

    let totalLikesDeleted = 0;
    let totalArticlesReset = 0;

    // Get all articles
    const articlesRef = collection(db, 'articles');
    const articlesSnap = await getDocs(articlesRef);

    for (const articleDoc of articlesSnap.docs) {
      const articleId = articleDoc.id;
      
      // Delete all likes for this article
      const likesRef = collection(db, 'articles', articleId, 'likes');
      const likesSnap = await getDocs(likesRef);
      
      for (const likeDoc of likesSnap.docs) {
        await deleteDoc(doc(db, 'articles', articleId, 'likes', likeDoc.id));
        totalLikesDeleted++;
      }

      // Reset like_count and comment_count to 0
      const batch = writeBatch(db);
      const articleRef = doc(db, 'articles', articleId);
      batch.update(articleRef, {
        like_count: 0,
        comment_count: 0,
      });
      await batch.commit();
      totalArticlesReset++;
    }

    return NextResponse.json({
      message: 'Cleanup completed successfully',
      likesDeleted: totalLikesDeleted,
      articlesReset: totalArticlesReset,
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { error: 'Failed to cleanup data' },
      { status: 500 }
    );
  }
}
