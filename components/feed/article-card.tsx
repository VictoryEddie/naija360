'use client';

import { Heart, MessageCircle, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { Article } from '@/types/article';
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Portal } from '@/components/ui/portal';
import { CommentSection } from '@/components/comments/comment-section';
import { db } from '@/lib/firebase';
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  getDoc, 
  deleteDoc, 
  updateDoc, 
  increment, 
  serverTimestamp 
} from 'firebase/firestore';

interface ArticleCardProps {
  article: Article;
  priority?: boolean;
}

export function ArticleCard({ article, priority = false }: ArticleCardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(article.like_count);
  const [commentCount, setCommentCount] = useState(article.comment_count);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Real-time listener for article data (like count, comment count)
  useEffect(() => {
    const articleRef = doc(db, 'articles', article.id);
    
    const unsubscribe = onSnapshot(
      articleRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setLikeCount(data.like_count || 0);
          setCommentCount(data.comment_count || 0);
        } else {
          // Article doesn't exist in Firestore yet, use mock data
          setLikeCount(article.like_count);
          setCommentCount(article.comment_count);
        }
      },
      (error) => {
        console.error('Error listening to article updates:', error);
        // Fallback to mock data on error
        setLikeCount(article.like_count);
        setCommentCount(article.comment_count);
      }
    );

    return () => unsubscribe();
  }, [article.id, article.like_count, article.comment_count]);

  // Real-time listener for user's like status
  useEffect(() => {
    if (!user) {
      setIsLiked(false);
      return;
    }

    const likeRef = doc(db, 'articles', article.id, 'likes', user.uid);
    
    const unsubscribe = onSnapshot(
      likeRef,
      (snapshot) => {
        setIsLiked(snapshot.exists());
      },
      (error) => {
        console.error('Error listening to like status:', error);
      }
    );

    return () => unsubscribe();
  }, [user, article.id]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showAuthPrompt) {
      document.body.style.overflow = 'hidden';
      console.log('Modal opened - showAuthPrompt:', showAuthPrompt);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAuthPrompt]);

  const categoryColors = {
    News: '#008751',
    Crypto: '#F59E0B',
    Entertainment: '#EC4899',
    Stocks: '#8B5CF6',
  };

  const handleLike = async () => {
    console.log('Like button clicked, user:', user ? 'logged in' : 'not logged in');
    if (!user) {
      setShowAuthPrompt(true);
      console.log('Setting showAuthPrompt to true');
      return;
    }

    if (isLiking) return; // Prevent double-clicks

    setIsLiking(true);

    try {
      const articleRef = doc(db, 'articles', article.id);
      const likeRef = doc(db, 'articles', article.id, 'likes', user.uid);

      if (isLiked) {
        // Unlike - remove the like document
        await deleteDoc(likeRef);

        // Decrement like count
        const articleSnap = await getDoc(articleRef);
        if (articleSnap.exists()) {
          await updateDoc(articleRef, {
            like_count: increment(-1),
          });
        }
      } else {
        // Like - create the like document
        await setDoc(likeRef, {
          user_id: user.uid,
          created_at: serverTimestamp(),
        });

        // Increment like count (create article if doesn't exist)
        const articleSnap = await getDoc(articleRef);
        if (!articleSnap.exists()) {
          await setDoc(articleRef, {
            like_count: 1,
            comment_count: 0,
            created_at: serverTimestamp(),
          }, { merge: true });
        } else {
          await updateDoc(articleRef, {
            like_count: increment(1),
          });
        }
      }
      // Real-time listener will update the UI automatically
    } catch (error) {
      console.error('Error toggling like:', error);
      
      // Show user-friendly error
      alert(error instanceof Error ? error.message : 'Failed to update like. Please try again.');
    } finally {
      setIsLiking(false);
    }
  };

  const handleToggle = () => {
    if (!isOpen && !user) {
      setShowAuthPrompt(true);
      return;
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <article className="group bg-[#0A0A0A] rounded-xl overflow-hidden border border-[#2A2A2A] transition-all duration-200 md:hover:border-[#008751] md:hover:-translate-y-0.5 md:hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
        {/* Image */}
        <div className="relative aspect-video w-full overflow-hidden bg-[#1A1A1A]">
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            priority={priority}
            className="object-cover md:group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Category Badge */}
          <div className="absolute top-3 left-3 pointer-events-none">
            <span 
              className="px-2 py-1 rounded text-[11px] font-semibold uppercase tracking-wider text-white"
              style={{ backgroundColor: categoryColors[article.category] }}
            >
              {article.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Source & Date */}
          <div className="flex items-center gap-2 text-[13px] text-[#737373] pointer-events-none">
            <span className="font-medium text-[#008751]">{article.source}</span>
            <span>•</span>
            <span>{formatDistanceToNow(article.published_date, { addSuffix: true })}</span>
          </div>

          {/* Title */}
          <h3 className="text-[20px] font-bold text-white leading-tight line-clamp-2 md:group-hover:text-[#008751] transition-colors pointer-events-none" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em' }}>
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-[14px] text-[#A3A3A3] leading-relaxed line-clamp-2 pointer-events-none" style={{ fontFamily: 'Georgia, serif' }}>
            {article.excerpt}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[#2A2A2A]">
            <div className="flex items-center gap-2 md:gap-4">
              {/* Like */}
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleLike();
                }}
                className={`flex items-center gap-1.5 p-3 -m-2 transition-colors group/like touch-manipulation relative z-10 ${
                  isLiked ? 'text-[#EF4444]' : 'text-[#737373] active:text-[#EF4444]'
                }`}
                type="button"
                style={{ WebkitTapHighlightColor: 'rgba(0, 135, 81, 0.2)' }}
              >
                <Heart className={`h-5 w-5 transition-transform pointer-events-none ${isLiked ? 'fill-current scale-110' : 'group-hover/like:scale-110'}`} />
                <span className="text-[13px] font-medium pointer-events-none">{likeCount}</span>
              </button>

              {/* Comment - clickable to open comment section */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleToggle();
                }}
                className="flex items-center gap-1.5 p-3 -m-2 text-[#737373] hover:text-white active:text-white transition-colors group/comment touch-manipulation relative z-10"
                type="button"
                style={{ WebkitTapHighlightColor: 'rgba(0, 135, 81, 0.2)' }}
              >
                <MessageCircle className="h-5 w-5 group-hover/comment:scale-110 transition-transform pointer-events-none" />
                <span className="text-[13px] font-medium pointer-events-none">{commentCount}</span>
              </button>
            </div>

            {/* Read More */}
            <a
              href={`/article/${article.id}`}
              className="flex items-center gap-1 text-[13px] font-semibold text-[#008751] hover:text-[#006B3F] active:text-[#006B3F] transition-colors p-3 -m-2 touch-manipulation relative z-10"
            >
              <span className="pointer-events-none">Read More</span>
              <ExternalLink className="h-4 w-4 pointer-events-none" />
            </a>
          </div>

          {/* Comment Section - no toggle button, just the section */}
          <CommentSection
            articleId={article.id}
            initialCommentCount={commentCount}
            onAuthRequired={() => setShowAuthPrompt(true)}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />
        </div>
      </article>

      {/* Auth Prompt Modal */}
      {showAuthPrompt && (
        <Portal>
          <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            onClick={() => setShowAuthPrompt(false)}
          >
            <div 
              className="bg-[#1A1A1A] rounded-2xl p-6 md:p-8 w-full max-w-md border border-[#2A2A2A] shadow-[0_20px_60px_rgba(0,0,0,0.6)] animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-[#008751]/20 flex items-center justify-center mx-auto">
                  <Heart className="h-8 w-8 text-[#008751]" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white">Join the Conversation</h3>
                <p className="text-sm md:text-base text-[#A3A3A3]">
                  Sign in to like, comment, and engage with Nigerian news
                </p>
                <div className="flex flex-col gap-3 pt-4">
                  <button
                    onClick={() => router.push('/signup')}
                    className="w-full py-3 bg-[#008751] text-white font-semibold rounded-lg hover:bg-[#006B3F] active:bg-[#006B3F] transition-all hover:shadow-[0_4px_12px_rgba(0,135,81,0.3)] touch-manipulation"
                    type="button"
                  >
                    Create Account
                  </button>
                  <button
                    onClick={() => router.push('/login')}
                    className="w-full py-3 border border-[#2A2A2A] text-white font-medium rounded-lg hover:bg-[#0A0A0A] active:bg-[#0A0A0A] transition-colors touch-manipulation"
                    type="button"
                  >
                    Sign In
                  </button>
                </div>
                <button
                  onClick={() => setShowAuthPrompt(false)}
                  className="text-[#737373] text-sm hover:text-white active:text-white transition-colors mt-2 touch-manipulation"
                  type="button"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
