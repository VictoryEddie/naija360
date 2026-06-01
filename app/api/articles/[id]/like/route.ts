import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  increment,
} from 'firebase/firestore';

// POST /api/articles/[id]/like - Add a like
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: articleId } = await params;
    const body = await request.json();
    const { user_id } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    // Check if article exists, if not create it with default values
    const articleRef = doc(db, 'articles', articleId);
    const articleSnap = await getDoc(articleRef);
    
    if (!articleSnap.exists()) {
      // Article doesn't exist in Firestore yet
      // Initialize it with like_count: 0
      await setDoc(articleRef, {
        like_count: 0,
        comment_count: 0,
        created_at: new Date(),
      }, { merge: true });
    }

    // Check if like already exists
    const likeRef = doc(db, 'articles', articleId, 'likes', user_id);
    const likeSnap = await getDoc(likeRef);

    if (likeSnap.exists()) {
      return NextResponse.json(
        { error: 'Already liked' },
        { status: 400 }
      );
    }

    // Add like
    await setDoc(likeRef, {
      user_id,
      created_at: new Date(),
    });

    // Increment article like count
    await updateDoc(articleRef, {
      like_count: increment(1),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding like:', error);
    return NextResponse.json(
      { error: 'Failed to add like' },
      { status: 500 }
    );
  }
}

// DELETE /api/articles/[id]/like - Remove a like
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: articleId } = await params;
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    // Check if like exists
    const likeRef = doc(db, 'articles', articleId, 'likes', user_id);
    const likeSnap = await getDoc(likeRef);

    if (!likeSnap.exists()) {
      return NextResponse.json(
        { error: 'Like not found' },
        { status: 404 }
      );
    }

    // Remove like
    await deleteDoc(likeRef);

    // Decrement article like count
    const articleRef = doc(db, 'articles', articleId);
    await updateDoc(articleRef, {
      like_count: increment(-1),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing like:', error);
    return NextResponse.json(
      { error: 'Failed to remove like' },
      { status: 500 }
    );
  }
}
