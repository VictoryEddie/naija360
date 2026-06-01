'use client';

import { useState } from 'react';
import { Reply, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Comment } from '@/types/comment';
import { CommentInput } from './comment-input';
import { useAuth } from '@/lib/auth-context';

interface CommentItemProps {
  comment: Comment;
  onReply: (parentId: string, text: string) => Promise<void>;
  nestingLevel: number;
  onAuthRequired: () => void;
}

export function CommentItem({
  comment,
  onReply,
  nestingLevel,
  onAuthRequired,
}: CommentItemProps) {
  const { user } = useAuth();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const canReply = nestingLevel < 2; // Max 3 levels (0, 1, 2)

  const handleReplyClick = () => {
    if (!user) {
      onAuthRequired();
      return;
    }
    setShowReplyInput(true);
  };

  const handleReplySubmit = async (text: string) => {
    await onReply(comment.id, text);
    setShowReplyInput(false);
  };

  return (
    <div className="space-y-3">
      {/* Comment */}
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {comment.user_avatar ? (
            <img
              src={comment.user_avatar}
              alt={comment.user_name}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-[#008751]/20 flex items-center justify-center">
              <User className="h-4 w-4 text-[#008751]" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-white text-sm">
              {comment.user_name}
            </span>
            <span className="text-xs text-[#737373]">
              {formatDistanceToNow(comment.created_at, { addSuffix: true })}
            </span>
          </div>

          {/* Text */}
          <p className="text-sm text-[#E5E5E5] leading-relaxed whitespace-pre-wrap break-words">
            {comment.text}
          </p>

          {/* Actions */}
          {canReply && (
            <button
              onClick={handleReplyClick}
              className="flex items-center gap-1 mt-2 text-xs font-medium text-[#737373] hover:text-[#008751] active:text-[#008751] transition-colors touch-manipulation"
            >
              <Reply className="h-3 w-3" />
              <span>Reply</span>
            </button>
          )}

          {/* Reply Input */}
          {showReplyInput && (
            <div className="mt-3">
              <CommentInput
                onSubmit={handleReplySubmit}
                placeholder={`Reply to ${comment.user_name}...`}
                autoFocus
                onCancel={() => setShowReplyInput(false)}
                isReply
              />
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-11 space-y-3 border-l-2 border-[#2A2A2A] pl-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              nestingLevel={nestingLevel + 1}
              onAuthRequired={onAuthRequired}
            />
          ))}
        </div>
      )}
    </div>
  );
}
