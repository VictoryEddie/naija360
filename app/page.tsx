import { Header } from '@/components/navigation/header';
import { ArticleCard } from '@/components/feed/article-card';
import { mockArticles } from '@/lib/mock-data';

export default function Home() {
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

        {/* Feed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockArticles.map((article, index) => (
            <div 
              key={article.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ArticleCard article={article} />
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-16 text-center">
          <button className="px-8 py-3 rounded-lg bg-[#008751] text-white font-semibold hover:bg-[#006B3F] transition-all hover:shadow-[0_4px_12px_rgba(0,135,81,0.3)] hover:-translate-y-0.5 active:translate-y-0">
            Load More Articles
          </button>
        </div>
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
