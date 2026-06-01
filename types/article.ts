export type ArticleCategory = 'News' | 'Crypto' | 'Entertainment' | 'Stocks';

export interface Article {
  id: string;
  title: string;
  source: string;
  published_date: Date;
  image_url: string;
  excerpt: string;
  category: ArticleCategory;
  external_url: string;
  like_count: number;
  comment_count: number;
  cached_at: Date;
}
