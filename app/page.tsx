'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/navigation/header';
import { ArticleCard } from '@/components/feed/article-card';
import { getArticles, type NewsArticle } from '@/lib/multi-source-news';

export default function Home() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadArticles() {
      try {
        const fetchedArticles = await getArticles();
        
        if (fetchedArticles.length === 0) {
          setError('No articles available. Please check your internet connection.');
        } else {
          setArticles(fetchedArticles);
        }
      } catch (err) {
        console.error('Error loading articles:', err);
        setError('Failed to load news. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    loadArticles();
  }, []);

  return (
    <div className="min-h-screen bg-[#000000]">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-[1280px]">
        {/* Hero Section */}
        <div className="mb-16 text-center animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
            Welcome to <span className="text-[#008751]">Naija360</span>
          </h1>
          <p className="text-lg md:text-xl text-[#A3A3A3] max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
            Your 360° view of Nigeria. Get the latest news, crypto updates, entertainment, and stock market insights - all in one place.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-12 w-12 border-4 border-[#008751]/30 border-t-[#008751] rounded-full animate-spin mb-4" />
            <p className="text-[#A3A3A3] text-lg">Loading Nigerian news...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[#EF4444]/10 mb-4">
              <span className="text-[#EF4444] text-2xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
            <p className="text-[#A3A3A3] mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#008751] text-white font-semibold rounded-lg hover:bg-[#006B3F] transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Feed Grid */}
        {!loading && !error && articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <div 
                key={article.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ArticleCard article={article} priority={index < 3} />
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {!loading && !error && articles.length > 0 && (
          <div className="mt-16 text-center">
            <p className="text-[#737373] text-sm mb-4">
              Showing {articles.length} latest Nigerian news articles
            </p>
            <p className="text-[#737373] text-xs">
              Articles refresh every 5 minutes
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-[#2A2A2A] py-12">
        <div className="container mx-auto px-4 max-w-[1280px]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[#008751] flex items-center justify-center">
                <span className="text-white font-bold text-lg">360</span>
              </div>
              <span className="text-xl font-bold text-white">
                Naija
              </span>
            </div>

            {/* Links */}
            <div className="flex gap-8 text-sm">
              <a href="#" className="text-[#A3A3A3] hover:text-[#008751] transition-colors">About</a>
              <a href="#" className="text-[#A3A3A3] hover:text-[#008751] transition-colors">Privacy</a>
              <a href="#" className="text-[#A3A3A3] hover:text-[#008751] transition-colors">Terms</a>
              <a href="#" className="text-[#A3A3A3] hover:text-[#008751] transition-colors">Contact</a>
            </div>

            {/* Copyright */}
            <p className="text-[#737373] text-sm">
              © 2026 Naija360. Your 360° View of Nigeria.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
