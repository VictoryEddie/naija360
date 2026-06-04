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
  deleteDoc,
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

    console.log('POST /api/articles/[id]/comments - Request received:', {
      articleId,
      text: text?.substring(0, 50),
      user_id,
      user_name,
      parent_comment_id,
    });

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

    // Validate minimum comment length (3 characters) - moved up before DB operations
    if (text.trim().length < 3) {
      return NextResponse.json(
        { error: 'Comment must be at least 3 characters long' },
        { status: 400 }
      );
    }

    // Check if article exists, if not create it with default values
    const articleRef = doc(db, 'articles', articleId);
    let articleSnap;
    
    try {
      articleSnap = await getDoc(articleRef);
    } catch (dbError) {
      console.error('Firestore getDoc error:', dbError);
      return NextResponse.json(
        { error: 'Database connection error. Please check Firebase configuration.' },
        { status: 500 }
      );
    }
    
    if (!articleSnap.exists()) {
      // Article doesn't exist in Firestore yet
      // Initialize it with comment_count: 1 (this comment is being created)
      try {
        await setDoc(articleRef, {
          like_count: 0,
          comment_count: 1,
          created_at: Timestamp.now(),
        }, { merge: true });
      } catch (dbError) {
        console.error('Firestore setDoc error:', dbError);
        return NextResponse.json(
          { error: 'Failed to initialize article in database' },
          { status: 500 }
        );
      }
    } else {
      // Article exists, increment comment count
      try {
        await updateDoc(articleRef, {
          comment_count: increment(1),
        });
      } catch (dbError) {
        console.error('Firestore updateDoc error:', dbError);
        return NextResponse.json(
          { error: 'Failed to update article comment count' },
          { status: 500 }
        );
      }
    }

    // Determine nesting level
    let nesting_level = 0;
    if (parent_comment_id) {
      const parentRef = doc(db, 'articles', articleId, 'comments', parent_comment_id);
      let parentSnap;
      
      try {
        parentSnap = await getDoc(parentRef);
      } catch (dbError) {
        console.error('Firestore getDoc (parent) error:', dbError);
        return NextResponse.json(
          { error: 'Failed to fetch parent comment' },
          { status: 500 }
        );
      }
      
      if (!parentSnap.exists()) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        );
      }
      
      const parentData = parentSnap.data();
      nesting_level = (parentData.nesting_level || 0) + 1;

      // Enforce 3-level nesting limit
      if (nesting_level > 2) {
        return NextResponse.json(
          { error: 'Maximum nesting level reached (3 levels)' },
          { status: 400 }
        );
      }
    }

    // Check for duplicate consecutive comments (prevent spam)
    const recentCommentsRef = collection(db, 'articles', articleId, 'comments');
    const recentQuery = query(
      recentCommentsRef,
      where('user_id', '==', user_id),
      orderBy('created_at', 'desc')
    );
    
    let recentSnap;
    try {
      recentSnap = await getDocs(recentQuery);
    } catch (dbError) {
      // If the query fails (e.g., missing index), log but don't block the comment
      console.warn('Could not check for duplicate comments (missing index?):', dbError);
      recentSnap = { empty: true, docs: [] };
    }
    
    if (!recentSnap.empty && recentSnap.docs && recentSnap.docs.length > 0) {
      const lastComment = recentSnap.docs[0].data();
      if (lastComment.text === text.trim()) {
        return NextResponse.json(
          { error: 'Cannot post duplicate comments' },
          { status: 400 }
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

    let docRef;
    try {
      docRef = await addDoc(commentsRef, commentData);
      console.log('Comment created successfully:', docRef.id);
    } catch (dbError) {
      console.error('Firestore addDoc error:', dbError);
      return NextResponse.json(
        { error: 'Failed to create comment in database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: docRef.id,
      ...commentData,
      created_at: new Date(),
    });
  } catch (error: any) {
    console.error('Error creating comment:', error);
    console.error('Error stack:', error?.stack);
    return NextResponse.json(
      { error: error?.message || 'Failed to create comment' },
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

// DELETE /api/articles/[id]/comments - Delete a comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: articleId } = await params;
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('comment_id');
    const userId = searchParams.get('user_id');

    if (!commentId || !userId) {
      return NextResponse.json(
        { error: 'Comment ID and User ID are required' },
        { status: 400 }
      );
    }

    // Get the comment
    const commentRef = doc(db, 'articles', articleId, 'comments', commentId);
    const commentSnap = await getDoc(commentRef);

    if (!commentSnap.exists()) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    const commentData = commentSnap.data();

    // Verify ownership
    if (commentData.user_id !== userId) {
      return NextResponse.json(
        { error: 'You can only delete your own comments' },
        { status: 403 }
      );
    }

    // Check if comment has replies (prevent deleting comments with replies)
    const repliesRef = collection(db, 'articles', articleId, 'comments');
    const repliesQuery = query(
      repliesRef,
      where('parent_comment_id', '==', commentId)
    );
    const repliesSnap = await getDocs(repliesQuery);

    if (!repliesSnap.empty) {
      return NextResponse.json(
        { error: 'Cannot delete comments with replies' },
        { status: 400 }
      );
    }

    // Check if comment was created within 5 minutes (time-based restriction)
    const createdAt = commentData.created_at?.toDate?.() || new Date(0);
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    if (createdAt < fiveMinutesAgo) {
      return NextResponse.json(
        { error: 'Comments can only be deleted within 5 minutes of creation' },
        { status: 400 }
      );
    }

    // Delete the comment
    await deleteDoc(commentRef);

    // Decrement article comment count
    const articleRef = doc(db, 'articles', articleId);
    await updateDoc(articleRef, {
      comment_count: increment(-1),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
