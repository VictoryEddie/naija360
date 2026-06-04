/**
 * Nigerian News API Integration
 * Uses GNews API which has better Nigerian news coverage
 */

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  published_date: Date;
  image_url: string;
  excerpt: string;
  category: 'News' | 'Crypto' | 'Entertainment' | 'Stocks';
  external_url: string;
  like_count: number;
  comment_count: number;
  cached_at: Date;
}

// Using GNews API instead of NewsAPI (better Nigerian coverage)
const GNEWS_API_KEY = process.env.NEXT_PUBLIC_GNEWS_KEY;
const GNEWS_BASE = 'https://gnews.io/api/v4';

/**
 * Fetch Nigerian news articles from GNews
 */
export async function fetchNigerianNews(): Promise<NewsArticle[]> {
  try {
    // Check if API key exists
    if (!GNEWS_API_KEY) {
      console.error('❌ GNEWS_KEY is not set in environment variables');
      console.error('💡 Get a free key from https://gnews.io/ and add to .env.local');
      throw new Error('GNews API key not configured');
    }

    console.log('🔑 API Key found, fetching Nigerian news from GNews...');

    // Fetch from GNews (Nigeria-specific search)
    const url = `${GNEWS_BASE}/top-headlines?country=ng&lang=en&apikey=${GNEWS_API_KEY}&max=20`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error('❌ GNews error:', response.status, response.statusText);
      
      if (response.status === 401 || response.status === 403) {
        console.error('💡 Invalid API key. Get one from https://gnews.io/');
      }
      
      throw new Error(`Failed to fetch news (${response.status})`);
    }

    const data = await response.json();
    console.log(`✅ Fetched ${data.articles?.length || 0} articles from GNews`);

    if (!data.articles || data.articles.length === 0) {
      console.warn('⚠️ GNews returned 0 articles for Nigeria');
    }

    // Transform to our format
    const articles: NewsArticle[] = data.articles.map((article: any) => ({
      id: generateArticleId(article),
      title: article.title || 'Untitled',
      source: article.source?.name || 'Unknown Source',
      published_date: new Date(article.publishedAt),
      image_url: article.image || `https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=400&fit=crop`,
      excerpt: article.description || 'No description available',
      category: categorizeArticle(article),
      external_url: article.url,
      like_count: 0, // Will be fetched from Firestore
      comment_count: 0, // Will be fetched from Firestore
      cached_at: new Date(),
    }));

    return articles;
  } catch (error) {
    console.error('Error fetching Nigerian news:', error);
    // Return empty array on error
    return [];
  }
}

/**
 * Generate consistent article ID from URL
 * This ensures same article always has same ID
 */
function generateArticleId(article: any): string {
  // Use URL as base for ID (most reliable)
  const url = article.url || '';
  // Simple hash: take last part of URL path
  const urlParts = url.split('/').filter(Boolean);
  const lastPart = urlParts[urlParts.length - 1] || '';
  // Remove special characters and take first 20 chars
  const id = lastPart.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 20);
  return id || `article-${Date.now()}`;
}

/**
 * Categorize article based on content
 */
function categorizeArticle(article: any): NewsArticle['category'] {
  const title = article.title?.toLowerCase() || '';
  const description = article.description?.toLowerCase() || '';
  const content = `${title} ${description}`;

  if (
    content.includes('bitcoin') ||
    content.includes('crypto') ||
    content.includes('blockchain') ||
    content.includes('ethereum')
  ) {
    return 'Crypto';
  }

  if (
    content.includes('movie') ||
    content.includes('music') ||
    content.includes('celebrity') ||
    content.includes('entertainment') ||
    content.includes('nollywood') ||
    content.includes('afrobeats')
  ) {
    return 'Entertainment';
  }

  if (
    content.includes('stock') ||
    content.includes('market') ||
    content.includes('shares') ||
    content.includes('nse') ||
    content.includes('investment')
  ) {
    return 'Stocks';
  }

  return 'News';
}

/**
 * Fetch articles with caching (5 minutes)
 */
let cachedArticles: NewsArticle[] = [];
let lastFetch: Date | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getArticles(): Promise<NewsArticle[]> {
  const now = new Date();

  // Return cache if still valid
  if (
    cachedArticles.length > 0 &&
    lastFetch &&
    now.getTime() - lastFetch.getTime() < CACHE_DURATION
  ) {
    console.log('📰 Returning cached articles');
    return cachedArticles;
  }

  // Fetch fresh articles
  console.log('🌐 Fetching fresh articles from NewsAPI...');
  
  try {
    const articles = await fetchNigerianNews();

    if (articles.length > 0) {
      cachedArticles = articles;
      lastFetch = now;
      console.log(`✅ Fetched ${articles.length} articles`);
    } else {
      console.warn('⚠️ No articles returned from API');
    }

    return articles;
  } catch (error) {
    console.error('❌ Failed to fetch articles:', error);
    
    // Return cached articles if available (even if expired)
    if (cachedArticles.length > 0) {
      console.log('📦 Returning stale cached articles due to error');
      return cachedArticles;
    }
    
    // No cache - return mock data as fallback
    console.warn('⚠️ No cached articles, using mock data fallback');
    const { mockArticles } = await import('./mock-data');
    return mockArticles;
  }
}
