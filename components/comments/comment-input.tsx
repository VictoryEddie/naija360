'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

interface CommentInputProps {
  onSubmit: (text: string) => Promise<void>;
  placeholder?: string;
  autoFocus?: boolean;
  onCancel?: () => void;
  isReply?: boolean;
}

export function CommentInput({
  onSubmit,
  placeholder = 'Write a comment...',
  autoFocus = false,
  onCancel,
  isReply = false,
}: CommentInputProps) {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit(text.trim());
      setText('');
    } catch (err) {
      setError('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError('');
          }}
          placeholder={placeholder}
          autoFocus={autoFocus}
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white placeholder-[#737373] focus:outline-none focus:border-[#008751] focus:ring-1 focus:ring-[#008751] resize-none transition-colors disabled:opacity-50"
          rows={isReply ? 2 : 3}
          maxLength={500}
        />
        {text.length > 0 && (
          <div className="absolute bottom-2 right-2 text-xs text-[#737373]">
            {text.length}/500
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-[#EF4444]">{error}</p>
      )}

      <div className="flex items-center gap-2 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-[#A3A3A3] hover:text-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !text.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-[#008751] text-white font-semibold rounded-lg hover:bg-[#006B3F] active:bg-[#006B3F] transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Posting...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>{isReply ? 'Reply' : 'Comment'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
