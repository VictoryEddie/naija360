/**
 * Multi-Source Nigerian News API Integration
 * Combines GNews, Currents API, and NewsData.io for maximum coverage
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

const GNEWS_KEY = process.env.NEXT_PUBLIC_GNEWS_KEY;
const CURRENTS_KEY = process.env.NEXT_PUBLIC_CURRENTS_KEY;
const NEWSDATA_KEY = process.env.NEXT_PUBLIC_NEWSDATA_KEY;

/**
 * Fetch from GNews API
 */
async function fetchFromGNews(): Promise<NewsArticle[]> {
  if (!GNEWS_KEY) return [];
  
  try {
    const url = `https://gnews.io/api/v4/top-headlines?country=ng&lang=en&apikey=${GNEWS_KEY}&max=20`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn('GNews API error:', response.status);
      return [];
    }
    
    const data = await response.json();
    console.log(`✅ GNews: ${data.articles?.length || 0} articles`);
    
    return (data.articles || []).map((article: any) => ({
      id: `gnews-${generateId(article.url)}`,
      title: article.title,
      source: article.source?.name || 'GNews',
      published_date: new Date(article.publishedAt),
      image_url: cleanImageUrl(article.image),
      excerpt: article.description || 'No description available',
      category: categorizeArticle(article.title + ' ' + article.description),
      external_url: article.url,
      like_count: 0,
      comment_count: 0,
      cached_at: new Date(),
    }));
  } catch (error) {
    console.error('GNews fetch error:', error);
    return [];
  }
}

/**
 * Fetch from Currents API
 */
async function fetchFromCurrents(): Promise<NewsArticle[]> {
  if (!CURRENTS_KEY) return [];
  
  try {
    const url = `https://api.currentsapi.services/v1/latest-news?country=NG&language=en&apiKey=${CURRENTS_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn('Currents API error:', response.status);
      return [];
    }
    
    const data = await response.json();
    console.log(`✅ Currents: ${data.news?.length || 0} articles`);
    
    return (data.news || []).map((article: any) => ({
      id: `currents-${generateId(article.url)}`,
      title: article.title,
      source: article.author || 'Currents',
      published_date: new Date(article.published),
      image_url: cleanImageUrl(article.image),
      excerpt: article.description || 'No description available',
      category: categorizeArticle(article.title + ' ' + article.description),
      external_url: article.url,
      like_count: 0,
      comment_count: 0,
      cached_at: new Date(),
    }));
  } catch (error) {
    console.error('Currents fetch error:', error);
    return [];
  }
}

/**
 * Fetch from NewsData.io
 */
async function fetchFromNewsData(): Promise<NewsArticle[]> {
  if (!NEWSDATA_KEY) return [];
  
  try {
    const url = `https://newsdata.io/api/1/latest?apikey=${NEWSDATA_KEY}&country=ng&language=en`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn('NewsData API error:', response.status);
      return [];
    }
    
    const data = await response.json();
    console.log(`✅ NewsData: ${data.results?.length || 0} articles`);
    
    return (data.results || []).map((article: any) => ({
      id: `newsdata-${generateId(article.link)}`,
      title: article.title,
      source: article.source_name || article.source_id || 'NewsData',
      published_date: new Date(article.pubDate),
      image_url: cleanImageUrl(article.image_url),
      excerpt: article.description || article.content || 'No description available',
      category: categorizeArticle(article.title + ' ' + article.description),
      external_url: article.link,
      like_count: 0,
      comment_count: 0,
      cached_at: new Date(),
    }));
  } catch (error) {
    console.error('NewsData fetch error:', error);
    return [];
  }
}

/**
 * Fetch from all sources and combine
 */
export async function fetchAllNews(): Promise<NewsArticle[]> {
  console.log('🌐 Fetching from multiple news sources...');
  
  // Fetch from all APIs in parallel
  const [gnewsArticles, currentsArticles, newsdataArticles] = await Promise.all([
    fetchFromGNews(),
    fetchFromCurrents(),
    fetchFromNewsData(),
  ]);
  
  // Combine all articles
  const allArticles = [
    ...gnewsArticles,
    ...currentsArticles,
    ...newsdataArticles,
  ];
  
  // Remove duplicates (same URL)
  const uniqueArticles = removeDuplicates(allArticles);
  
  // Sort by date (newest first)
  uniqueArticles.sort((a, b) => b.published_date.getTime() - a.published_date.getTime());
  
  console.log(`✨ Total: ${uniqueArticles.length} unique articles`);
  
  return uniqueArticles;
}

/**
 * Remove duplicate articles (same URL)
 */
function removeDuplicates(articles: NewsArticle[]): NewsArticle[] {
  const seen = new Set<string>();
  return articles.filter(article => {
    const normalized = article.external_url.toLowerCase().replace(/^https?:\/\/(www\.)?/, '');
    if (seen.has(normalized)) {
      return false;
    }
    seen.add(normalized);
    return true;
  });
}

/**
 * Generate consistent ID from URL with timestamp to ensure uniqueness
 */
function generateId(url: string): string {
  if (!url) return `article-${Date.now()}-${Math.random()}`;
  
  const urlParts = url.split('/').filter(Boolean);
  const lastPart = urlParts[urlParts.length - 1] || '';
  const cleanId = lastPart.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 30);
  
  // Add timestamp suffix to ensure uniqueness
  return `${cleanId}-${Date.now()}`;
}

/**
 * Categorize article based on content
 */
function categorizeArticle(content: string): NewsArticle['category'] {
  const text = content.toLowerCase();
  
  if (
    text.includes('bitcoin') ||
    text.includes('crypto') ||
    text.includes('blockchain') ||
    text.includes('ethereum')
  ) {
    return 'Crypto';
  }
  
  if (
    text.includes('movie') ||
    text.includes('music') ||
    text.includes('celebrity') ||
    text.includes('entertainment') ||
    text.includes('nollywood') ||
    text.includes('afrobeats')
  ) {
    return 'Entertainment';
  }
  
  if (
    text.includes('stock') ||
    text.includes('market') ||
    text.includes('shares') ||
    text.includes('nse') ||
    text.includes('investment')
  ) {
    return 'Stocks';
  }
  
  return 'News';
}

/**
 * Get default image
 */
function getDefaultImage(): string {
  return 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=400&fit=crop';
}

/**
 * Validate and clean image URL
 */
function cleanImageUrl(url: any): string {
  // Handle null, undefined, "None", empty string
  if (!url || url === 'None' || url === 'null' || url === 'undefined') {
    return getDefaultImage();
  }
  
  // Convert to string and check if valid URL
  const urlString = String(url).trim();
  
  // Must start with http:// or https://
  if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
    return getDefaultImage();
  }
  
  // Try to validate URL
  try {
    new URL(urlString);
    return urlString;
  } catch {
    return getDefaultImage();
  }
}

/**
 * Cached articles with 5-minute expiry
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
    console.log(`📰 Returning ${cachedArticles.length} cached articles`);
    return cachedArticles;
  }
  
  // Fetch fresh articles
  try {
    const articles = await fetchAllNews();
    
    if (articles.length > 0) {
      cachedArticles = articles;
      lastFetch = now;
    } else {
      console.warn('⚠️ No articles from any source, using mock fallback');
      const { mockArticles } = await import('./mock-data');
      return mockArticles;
    }
    
    return articles;
  } catch (error) {
    console.error('❌ Failed to fetch articles:', error);
    
    // Return cached if available
    if (cachedArticles.length > 0) {
      console.log('📦 Returning stale cache');
      return cachedArticles;
    }
    
    // Fallback to mock
    const { mockArticles } = await import('./mock-data');
    return mockArticles;
  }
}
