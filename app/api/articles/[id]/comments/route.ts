import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  Timestamp,
} from 'firebase/firestore';

// GET /api/articles/[id]/comments - Fetch all comments for an article
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: articleId } = await params;

    // Fetch all comments for this article
    const commentsRef = collection(db, 'articles', articleId, 'comments');
    const q = query(commentsRef, orderBy('created_at', 'asc'));
    const snapshot = await getDocs(q);

    const comments = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        article_id: articleId,
        user_id: data.user_id,
        user_name: data.user_name,
        user_avatar: data.user_avatar || null,
        text: data.text,
        parent_comment_id: data.parent_comment_id || null,
        nesting_level: data.nesting_level || 0,
        created_at: data.created_at?.toDate?.() || new Date(),
      };
    });

    // Build comment tree
    const commentTree = buildCommentTree(comments);

    return NextResponse.json({ comments: commentTree });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST /api/articles/[id]/comments - Create a new comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: articleId } = await params;
    const body = await request.json();
    const { text, parent_comment_id, user_id, user_name, user_avatar } = body;

    // Validate input
    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: 'Comment text is required' },
        { status: 400 }
      );
    }

    if (!user_id || !user_name) {
      return NextResponse.json(
        { error: 'User information is required' },
        { status: 401 }
      );
    }

    // Check if article exists, if not create it with default values
    const articleRef = doc(db, 'articles', articleId);
    const articleSnap = await getDoc(articleRef);
    
    if (!articleSnap.exists()) {
      // Article doesn't exist in Firestore yet
      // Initialize it with comment_count: 0
      await setDoc(articleRef, {
        like_count: 0,
        comment_count: 0,
        created_at: new Date(),
      }, { merge: true });
    }

    // Determine nesting level
    let nesting_level = 0;
    if (parent_comment_id) {
      const parentRef = doc(db, 'articles', articleId, 'comments', parent_comment_id);
      const parentSnap = await getDoc(parentRef);
      
      if (parentSnap.exists()) {
        const parentData = parentSnap.data();
        nesting_level = (parentData.nesting_level || 0) + 1;

        // Enforce 3-level nesting limit
        if (nesting_level > 2) {
          return NextResponse.json(
            { error: 'Maximum nesting level reached (3 levels)' },
            { status: 400 }
          );
        }
      } else {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        );
      }
    }

    // Create comment
    const commentsRef = collection(db, 'articles', articleId, 'comments');
    const commentData = {
      article_id: articleId,
      user_id,
      user_name,
      user_avatar: user_avatar || null,
      text: text.trim(),
      parent_comment_id: parent_comment_id || null,
      nesting_level,
      created_at: Timestamp.now(),
    };

    const docRef = await addDoc(commentsRef, commentData);

    // Increment article comment count
    await updateDoc(articleRef, {
      comment_count: increment(1),
    });

    return NextResponse.json({
      id: docRef.id,
      ...commentData,
      created_at: new Date(),
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

// Helper function to build comment tree
function buildCommentTree(comments: any[]): any[] {
  const commentMap = new Map();
  const rootComments: any[] = [];

  // First pass: create map of all comments
  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // Second pass: build tree structure
  comments.forEach((comment) => {
    const commentWithReplies = commentMap.get(comment.id);
    
    if (comment.parent_comment_id) {
      const parent = commentMap.get(comment.parent_comment_id);
      if (parent) {
        parent.replies.push(commentWithReplies);
      }
    } else {
      rootComments.push(commentWithReplies);
    }
  });

  return rootComments;
}
