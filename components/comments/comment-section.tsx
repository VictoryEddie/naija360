'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Comment } from '@/types/comment';
import { CommentInput } from './comment-input';
import { CommentItem } from './comment-item';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

interface CommentSectionProps {
  articleId: string;
  initialCommentCount: number;
  onAuthRequired: () => void;
}

export function CommentSection({
  articleId,
  initialCommentCount,
  onAuthRequired,
}: CommentSectionProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
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

    const response = await fetch(`/api/articles/${articleId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        user_id: user.uid,
        user_name: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        user_avatar: user.photoURL,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to post comment');
    }
  };

  const handleReply = async (parentId: string, text: string) => {
    if (!user) {
      onAuthRequired();
      return;
    }

    const response = await fetch(`/api/articles/${articleId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        parent_comment_id: parentId,
        user_id: user.uid,
        user_name: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        user_avatar: user.photoURL,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to post reply');
    }
  };

  const handleToggle = () => {
    if (!isOpen && !user) {
      onAuthRequired();
      return;
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-t border-[#2A2A2A] pt-4">
      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 text-sm font-medium text-[#A3A3A3] hover:text-white transition-colors touch-manipulation"
      >
        {isOpen ? (
          <>
            <X className="h-4 w-4" />
            <span>Hide Comments</span>
          </>
        ) : (
          <>
            <MessageCircle className="h-4 w-4" />
            <span>
              {commentCount === 0
                ? 'Be the first to comment'
                : `View ${commentCount} ${commentCount === 1 ? 'comment' : 'comments'}`}
            </span>
          </>
        )}
      </button>

      {/* Comment Section */}
      {isOpen && (
        <div className="mt-4 space-y-6 animate-fade-in">
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
    </div>
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
