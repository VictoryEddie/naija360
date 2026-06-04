'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { Comment } from '@/types/comment';
import { CommentInput } from './comment-input';
import { CommentItem } from './comment-item';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  addDoc, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment, 
  serverTimestamp,
  where,
  getDocs
} from 'firebase/firestore';

interface CommentSectionProps {
  articleId: string;
  initialCommentCount: number;
  onAuthRequired: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function CommentSection({
  articleId,
  initialCommentCount,
  onAuthRequired,
  isOpen,
  onClose,
}: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Real-time listener for comments
  useEffect(() => {
    if (!isOpen) return;

    setIsLoading(true);
    const commentsRef = collection(db, 'articles', articleId, 'comments');
    const q = query(commentsRef, orderBy('created_at', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedComments = snapshot.docs.map((doc) => {
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

        const commentTree = buildCommentTree(fetchedComments);
        setComments(commentTree);
        // Count ALL comments including replies (total documents in collection)
        setCommentCount(fetchedComments.length);
        setIsLoading(false);
      },
      (err) => {
        console.error('Error fetching comments:', err);
        setError('Failed to load comments');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [articleId, isOpen]);

  const handleCommentSubmit = async (text: string) => {
    if (!user) {
      onAuthRequired();
      return;
    }

    try {
      // Validate minimum comment length
      if (text.trim().length < 3) {
        throw new Error('Comment must be at least 3 characters long');
      }

      // Check for duplicate consecutive comments
      const recentCommentsRef = collection(db, 'articles', articleId, 'comments');
      const recentQuery = query(
        recentCommentsRef,
        where('user_id', '==', user.uid),
        orderBy('created_at', 'desc')
      );
      
      const recentSnap = await getDocs(recentQuery);
      if (!recentSnap.empty) {
        const lastComment = recentSnap.docs[0].data();
        if (lastComment.text === text.trim()) {
          throw new Error('Cannot post duplicate comments');
        }
      }

      // Get or create article document
      const articleRef = doc(db, 'articles', articleId);
      const articleSnap = await getDoc(articleRef);
      
      if (!articleSnap.exists()) {
        // Initialize article with comment_count: 1
        await setDoc(articleRef, {
          like_count: 0,
          comment_count: 1,
          created_at: serverTimestamp(),
        }, { merge: true });
      } else {
        // Increment comment count
        await updateDoc(articleRef, {
          comment_count: increment(1),
        });
      }

      // Create comment
      const commentsRef = collection(db, 'articles', articleId, 'comments');
      await addDoc(commentsRef, {
        article_id: articleId,
        user_id: user.uid,
        user_name: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        user_avatar: user.photoURL || null,
        text: text.trim(),
        parent_comment_id: null,
        nesting_level: 0,
        created_at: serverTimestamp(),
      });
    } catch (error: any) {
      console.error('Error posting comment:', error);
      throw new Error(error.message || 'Failed to post comment');
    }
  };

  const handleReply = async (parentId: string, text: string) => {
    if (!user) {
      onAuthRequired();
      return;
    }

    try {
      // Validate minimum comment length
      if (text.trim().length < 3) {
        throw new Error('Reply must be at least 3 characters long');
      }

      // Get parent comment to determine nesting level
      const parentRef = doc(db, 'articles', articleId, 'comments', parentId);
      const parentSnap = await getDoc(parentRef);
      
      if (!parentSnap.exists()) {
        throw new Error('Parent comment not found');
      }
      
      const parentData = parentSnap.data();
      const nesting_level = (parentData.nesting_level || 0) + 1;

      // Enforce 3-level nesting limit
      if (nesting_level > 2) {
        throw new Error('Maximum nesting level reached (3 levels)');
      }

      // Check for duplicate consecutive comments
      const recentCommentsRef = collection(db, 'articles', articleId, 'comments');
      const recentQuery = query(
        recentCommentsRef,
        where('user_id', '==', user.uid),
        orderBy('created_at', 'desc')
      );
      
      const recentSnap = await getDocs(recentQuery);
      if (!recentSnap.empty) {
        const lastComment = recentSnap.docs[0].data();
        if (lastComment.text === text.trim()) {
          throw new Error('Cannot post duplicate comments');
        }
      }

      // Increment article comment count
      const articleRef = doc(db, 'articles', articleId);
      const articleSnap = await getDoc(articleRef);
      
      if (!articleSnap.exists()) {
        await setDoc(articleRef, {
          like_count: 0,
          comment_count: 1,
          created_at: serverTimestamp(),
        }, { merge: true });
      } else {
        await updateDoc(articleRef, {
          comment_count: increment(1),
        });
      }

      // Create reply
      const commentsRef = collection(db, 'articles', articleId, 'comments');
      await addDoc(commentsRef, {
        article_id: articleId,
        user_id: user.uid,
        user_name: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        user_avatar: user.photoURL || null,
        text: text.trim(),
        parent_comment_id: parentId,
        nesting_level,
        created_at: serverTimestamp(),
      });
    } catch (error: any) {
      console.error('Error posting reply:', error);
      throw new Error(error.message || 'Failed to post reply');
    }
  };

  return (
    <>
      {isOpen && (
        <div className="border-t border-[#2A2A2A] pt-4 mt-4 space-y-6 animate-fade-in">
          {/* Comment Input */}
          {user && (
            <CommentInput onSubmit={handleCommentSubmit} />
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 border-2 border-[#008751]/30 border-t-[#008751] rounded-full animate-spin" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <p className="text-sm text-[#EF4444]">{error}</p>
            </div>
          )}

          {/* Comments List */}
          {!isLoading && !error && (
            <>
              {comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-[#2A2A2A] mx-auto mb-3" />
                  <p className="text-sm text-[#737373]">
                    No comments yet. Start the conversation!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      onReply={handleReply}
                      nestingLevel={0}
                      onAuthRequired={onAuthRequired}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}

// Helper function to build comment tree
function buildCommentTree(comments: Comment[]): Comment[] {
  const commentMap = new Map<string, Comment>();
  const rootComments: Comment[] = [];

  // First pass: create map of all comments
  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // Second pass: build tree structure
  comments.forEach((comment) => {
    const commentWithReplies = commentMap.get(comment.id)!;

    if (comment.parent_comment_id) {
      const parent = commentMap.get(comment.parent_comment_id);
      if (parent) {
        parent.replies = parent.replies || [];
        parent.replies.push(commentWithReplies);
      }
    } else {
      rootComments.push(commentWithReplies);
    }
  });

  return rootComments;
}
