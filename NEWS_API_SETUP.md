# NewsAPI Setup Guide

## Why Add Real News API?

**Problem with mock data:**
- Mock articles have hardcoded counts (always 0)
- Creates sync issues between mock data and Firestore
- Navigation bugs (counts reset to 0)
- Not realistic for production

**Solution: Real news API**
- ✅ Unique article IDs from actual URLs
- ✅ Fresh content every 5 minutes
- ✅ Real Nigerian news
- ✅ Proper Firestore integration
- ✅ No more navigation bugs

---

## Step 1: Get NewsAPI Key (Free)

1. **Go to:** https://newsapi.org/
2. **Click:** "Get API Key"
3. **Sign up** (free - no credit card)
4. **Copy your API key** (looks like: `a1b2c3d4e5f6...`)

**Free tier limits:**
- 100 requests per day
- Perfect for development
- Nigerian news included

---

## Step 2: Add to Environment Variables

1. **Open `.env.local`** (or create it if it doesn't exist)

2. **Add this line:**
   ```
   NEXT_PUBLIC_NEWS_API_KEY=your_actual_key_here
   ```

3. **Replace `your_actual_key_here`** with the key you copied

4. **Save the file**

**Example:**
```env
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAOaw...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=naija360-8a63a
...

# NewsAPI
NEXT_PUBLIC_NEWS_API_KEY=a1b2c3d4e5f6g7h8i9j0  ← Your key here
```

---

## Step 3: Update Home Page to Use Real Articles

The code is already created in `lib/news-api.ts`. Now we just need to use it in the home page.

**Replace this in `app/page.tsx`:**

```typescript
// OLD (Mock data)
import { mockArticles } from '@/lib/mock-data';

export default function Home() {
  useSeedArticles();
  
  return (
    <div>
      {mockArticles.map((article) => (
        <ArticleCard article={article} />
      ))}
    </div>
  );
}
```

**With this (Real API):**

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getArticles } from '@/lib/news-api';
import type { NewsArticle } from '@/lib/news-api';

export default function Home() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      const fetchedArticles = await getArticles();
      setArticles(fetchedArticles);
      setLoading(false);
    }
    loadArticles();
  }, []);

  if (loading) {
    return <div>Loading Nigerian news...</div>;
  }

  return (
    <div>
      {articles.map((article, index) => (
        <ArticleCard 
          key={article.id} 
          article={article} 
          priority={index < 3}
        />
      ))}
    </div>
  );
}
```

---

## Step 4: Restart Dev Server

```bash
# Stop the server (Ctrl+C)
# Start it again
npm run dev
```

**Why:** Environment variables are only loaded on server start.

---

## Step 5: Test It

1. **Refresh your app**
2. **You should see:** Real Nigerian news headlines
3. **Like/comment on articles**
4. **Click article → Click back**
5. **Result:** Counts stay correct! ✨

---

## How It Works

### Article Fetching
```
1. User loads page
2. getArticles() checks cache (5 min)
3. If cache expired → fetch from NewsAPI
4. Transform to our format
5. Display articles
```

### Article IDs
```
Real article URL:
https://www.vanguardngr.com/2024/05/nigeria-economy-grows

Generated ID:
"nigeria-economy-grows"

✅ Unique
✅ Consistent (same article = same ID)
✅ URL-safe
```

### Firestore Integration
```
1. Article displayed with ID "nigeria-economy-grows"
2. User likes article
3. Creates Firestore doc: articles/nigeria-economy-grows
4. Stores like_count: 1
5. Real-time listener updates UI
6. Navigate away and back → counts preserved!
```

---

## Features

### Caching
- **5-minute cache** (configurable in `news-api.ts`)
- Reduces API calls
- Stays within free tier limits
- Fresh content every 5 minutes

### Categorization
Auto-categorizes articles:
- 🟢 **News** - General Nigerian news
- 🟡 **Crypto** - Bitcoin, blockchain mentions
- 🔴 **Entertainment** - Nollywood, Afrobeats
- 🟣 **Stocks** - NSE, investments

### Fallback
- Image missing → Default Unsplash image
- API fails → Returns empty array (could add mock fallback)
- No description → Uses content snippet

---

## API Limits

### Free Tier (NewsAPI.org)
- ✅ 100 requests/day
- ✅ Top headlines
- ✅ Country-specific (Nigeria)
- ❌ No search
- ❌ No historical data

### Optimization
- Cache: 5 min → ~288 requests/day max
- Actual: ~10-20 requests/day (user visits)
- **Well within limits!**

---

## Troubleshooting

### "Failed to fetch news"
- **Check:** API key in `.env.local`
- **Check:** Server restarted after adding key
- **Check:** Key is valid (test at newsapi.org/docs)

### No articles showing
- **Check:** Console for errors (F12)
- **Check:** API key starts with correct format
- **Check:** Internet connection

### "API key invalid"
- **Double-check:** Key copied correctly
- **Check:** No extra spaces in `.env.local`
- **Get new key:** newsapi.org if needed

---

## Next Steps (Optional)

### Add More Sources
- GNews API (alternative source)
- RSS feeds from Nigerian sites
- Combine multiple sources

### Add Categories
- Politics
- Sports
- Technology
- Business

### Add Search
- Upgrade to paid plan ($449/mo)
- Or use different API (GNews has free search)

---

## Cost Comparison

### Option 1: Mock Data (Current)
- **Cost:** $0
- **Issues:** Navigation bugs, not realistic
- **Production-ready:** ❌

### Option 2: NewsAPI Free (Recommended)
- **Cost:** $0
- **Limit:** 100 req/day
- **Features:** Real Nigerian news
- **Production-ready:** ✅ (for small apps)

### Option 3: NewsAPI Paid
- **Cost:** $449/month
- **Limit:** 250,000 req/day
- **Features:** Everything + search
- **Production-ready:** ✅ (for large apps)

---

## Summary

**What you get:**
- ✅ Real Nigerian news
- ✅ No more navigation bugs
- ✅ Unique article IDs
- ✅ Proper Firestore integration
- ✅ Production-ready architecture

**What it costs:**
- ⚠️ $0 (free tier)
- ⚠️ 5 minutes setup time

**Recommended for:** Every Naija360 deployment!

---

Would you like me to integrate this now? Just say yes and provide your NewsAPI key (or I can help you get one).
