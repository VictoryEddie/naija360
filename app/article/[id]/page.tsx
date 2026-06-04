'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share2, ExternalLink, Calendar, Tag } from 'lucide-react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Article } from '@/types/article';
import { mockArticles } from '@/lib/mock-data';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { 
  doc, 
  getDoc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  increment, 
  serverTimestamp 
} from 'firebase/firestore';
import { CommentSection } from '@/components/comments/comment-section';
import { Portal } from '@/components/ui/portal';

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const articleId = params.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(true); // Always open on article page

  // Load article data
  useEffect(() => {
    const foundArticle = mockArticles.find((a) => a.id === articleId);
    if (foundArticle) {
      setArticle(foundArticle);
    }
  }, [articleId]);

  // Real-time listener for article data (like count, comment count)
  useEffect(() => {
    const articleRef = doc(db, 'articles', articleId);

    const unsubscribe = onSnapshot(
      articleRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setLikeCount(data.like_count || 0);
          setCommentCount(data.comment_count || 0);
        } else if (article) {
          setLikeCount(article.like_count);
          setCommentCount(article.comment_count);
        }
      },
      (error) => {
        console.error('Error listening to article updates:', error);
        if (article) {
          setLikeCount(article.like_count);
          setCommentCount(article.comment_count);
        }
      }
    );

    return () => unsubscribe();
  }, [articleId, article]);

  // Real-time listener for user's like status
  useEffect(() => {
    if (!user) {
      setIsLiked(false);
      return;
    }

    const likeRef = doc(db, 'articles', articleId, 'likes', user.uid);

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
  }, [user, articleId]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showAuthPrompt) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAuthPrompt]);

  const handleLike = async () => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }

    if (isLiking) return;

    setIsLiking(true);

    try {
      const articleRef = doc(db, 'articles', articleId);
      const likeRef = doc(db, 'articles', articleId, 'likes', user.uid);

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
      alert(error instanceof Error ? error.message : 'Failed to update like. Please try again.');
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: article?.title || 'Naija360 Article',
      text: article?.excerpt || 'Check out this article on Naija360',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const categoryColors = {
    News: '#008751',
    Crypto: '#F59E0B',
    Entertainment: '#EC4899',
    Stocks: '#8B5CF6',
  };

  return (
    <>
      <div className="min-h-screen bg-[#000000]">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#2A2A2A]">
          <div className="container mx-auto px-4 py-4 max-w-[1280px]">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[#A3A3A3] hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back</span>
            </button>
          </div>
        </header>

        {/* Article Content */}
        <main className="container mx-auto px-4 py-8 max-w-[800px]">
          {/* Category Badge */}
          <div className="mb-4">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold uppercase tracking-wider text-white"
              style={{ backgroundColor: categoryColors[article.category] }}
            >
              <Tag className="h-3.5 w-3.5" />
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}>
            {article.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-[#737373] mb-8 pb-8 border-b border-[#2A2A2A]">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDistanceToNow(article.published_date, { addSuffix: true })}</span>
            </div>
            <span>•</span>
            <span className="font-medium text-[#008751]">{article.source}</span>
          </div>

          {/* Featured Image */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-8">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-invert max-w-none mb-12">
            <p className="text-lg text-[#E5E5E5] leading-relaxed mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              {article.excerpt}
            </p>

            {/* External Link */}
            <div className="mt-8 p-6 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl">
              <p className="text-sm text-[#A3A3A3] mb-4">
                This article is hosted externally. Click below to read the full story on {article.source}.
              </p>
              <a
                href={article.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#008751] text-white font-semibold rounded-lg hover:bg-[#006B3F] transition-all hover:shadow-[0_4px_12px_rgba(0,135,81,0.3)]"
              >
                <span>Read Full Article</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="sticky bottom-0 bg-[#0A0A0A]/95 backdrop-blur-md border-t border-[#2A2A2A] py-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Like */}
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isLiked
                      ? 'bg-[#EF4444]/10 text-[#EF4444]'
                      : 'bg-[#1A1A1A] text-[#737373] hover:bg-[#2A2A2A] hover:text-white'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="font-medium">{likeCount}</span>
                </button>

                {/* Comment */}
                <div className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] rounded-lg text-[#737373]">
                  <MessageCircle className="h-5 w-5" />
                  <span className="font-medium">{commentCount}</span>
                </div>
              </div>

              {/* Share */}
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-[#737373] hover:bg-[#2A2A2A] hover:text-[#F59E0B] rounded-lg transition-all"
              >
                <Share2 className="h-5 w-5" />
                <span className="font-medium">Share</span>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Comments</h2>
            <CommentSection
              articleId={articleId}
              initialCommentCount={commentCount}
              onAuthRequired={() => setShowAuthPrompt(true)}
              isOpen={commentsOpen}
              onClose={() => setCommentsOpen(false)}
            />
          </div>
        </main>
      </div>

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
