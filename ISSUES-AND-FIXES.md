# Issues and Fixes Log

This document tracks common issues encountered during development and their solutions. Use this as a reference to quickly resolve recurring problems.

---

## Table of Contents
- [Firebase & Firestore Issues](#firebase--firestore-issues)
- [Next.js & API Route Issues](#nextjs--api-route-issues)
- [React & State Management Issues](#react--state-management-issues)
- [UI/UX Issues](#uiux-issues)
- [Performance Issues](#performance-issues)

---

## Firebase & Firestore Issues

### Issue: Cannot use Firebase Client SDK in API Routes
**Symptoms:**
- 500 Internal Server Error from API routes
- Errors like "window is not defined" or "document is not defined"
- Firebase operations failing on server side

**Root Cause:**
- Firebase client SDK (`firebase/firestore`, `firebase/auth`) is designed for browsers
- Next.js API routes run on Node.js server (no browser APIs)
- Client SDK uses browser-specific APIs (localStorage, window, etc.)

**Solution:**
Either use Firebase Admin SDK OR move operations to client-side

**Option 1: Use Firebase Admin SDK (Recommended for production)**
```typescript
// lib/firebase-admin.ts
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const adminDb = getFirestore();
```

**Option 2: Client-Side Operations (Simpler for development)**
```typescript
// Instead of API route, do this in component:
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const handleLike = async () => {
  const likeRef = doc(db, 'articles', articleId, 'likes', userId);
  await setDoc(likeRef, {
    user_id: userId,
    created_at: serverTimestamp(),
  });
};
```

**When to use which:**
- **Client-side**: Simple CRUD, real-time updates, user-specific data
- **Admin SDK**: Complex validation, server-side logic, sensitive operations

---

### Issue: Firestore "Missing or Insufficient Permissions"
**Symptoms:**
- Error: "Missing or insufficient permissions"
- Operations fail even when user is authenticated

**Root Cause:**
- Firestore security rules are blocking the operation
- User doesn't have permission for the specific operation

**Solution:**
Check and update `firestore.rules`

**Common Fixes:**
```javascript
// Allow authenticated users to create comments
allow create: if isAuthenticated()
  && request.resource.data.user_id == request.auth.uid

// Allow users to read their own data
allow read: if isAuthenticated() 
  && resource.data.user_id == request.auth.uid

// Allow anyone to read public data
allow read: if true;
```

**Debugging Steps:**
1. Check Firebase Console → Firestore → Rules tab
2. Make sure rules are deployed
3. Check if `request.auth.uid` matches the user_id in the data
4. Use Rules Playground in Firebase Console to test

---

### Issue: Firestore "The query requires an index"
**Symptoms:**
- Error: "The query requires an index"
- Console shows link to create index
- Queries with multiple conditions fail

**Root Cause:**
- Firestore requires composite indexes for queries with:
  - Multiple where clauses
  - where + orderBy on different fields
  - Collection group queries

**Solution:**
Create the composite index

**Quick Fix:**
1. Look at error message in console
2. Click the link provided (e.g., `https://console.firebase.google.com/...?create_composite_index...`)
3. Click "Create Index" button
4. Wait 2-5 minutes for index to build

**Manual Creation:**
1. Go to Firebase Console → Firestore → Indexes
2. Click "Create Index"
3. Configure fields that match your query
4. Example: For `where('user_id', '==', uid).orderBy('created_at', 'desc')`
   - Field 1: `user_id` - Ascending
   - Field 2: `created_at` - Descending

**Temporary Workaround:**
```typescript
// If index doesn't exist yet, catch the error
try {
  const results = await getDocs(query);
  // Use results
} catch (error) {
  if (error.code === 'failed-precondition') {
    console.warn('Index not created yet');
    // Fallback behavior
  }
}
```

---

## Next.js & API Route Issues

### Issue: API Routes Not Working After Move to Client-Side
**Symptoms:**
- API routes exist but aren't being used
- Code still references `/api/...` endpoints
- Duplicate code in API routes and client components

**Root Cause:**
- Code was refactored to use client-side Firebase
- Old API routes weren't removed
- Routes are dead code taking up space

**Solution:**
Clean up unused API routes

**Steps:**
1. Search for API route imports: `grepSearch` for `/api/articles/`
2. If no imports found, delete the route files
3. Update any documentation referencing the API routes

**Files to Check:**
- `app/api/articles/[id]/like/route.ts` - If likes are client-side
- `app/api/articles/[id]/comments/route.ts` - If comments are client-side
- Update README or API documentation

---

### Issue: Next.js Image LCP Warning
**Symptoms:**
- Warning: "Image detected as LCP. Please add `loading="eager"`"
- Performance warnings in console

**Root Cause:**
- Next.js detects image as Largest Contentful Paint element
- Image is above the fold but loading lazily

**Solution:**
Add `priority` prop to above-the-fold images

**Implementation:**
```typescript
// For first 3 articles in feed (above the fold)
<ArticleCard article={article} priority={index < 3} />

// In ArticleCard component
interface ArticleCardProps {
  article: Article;
  priority?: boolean;
}

<Image
  src={article.image_url}
  alt={article.title}
  fill
  priority={priority} // Pass through
  sizes="(max-width: 768px) 100vw, 33vw"
/>
```

**When to use `priority`:**
- ✅ Hero images
- ✅ First 1-3 items in a list/grid
- ✅ Above-the-fold content
- ❌ Images below the fold
- ❌ Images in modals/accordions

---

## React & State Management Issues

### Issue: Initial State Shows Wrong Value (Flashing)
**Symptoms:**
- UI briefly shows "0 comments" then updates to correct count
- "Be the first to comment" flashes even when comments exist
- State starts at default value before real-time listener updates
- **Especially noticeable when using back button**

**Root Cause:**
- State initialized with default value (e.g., `useState(0)`)
- Real-time listener takes time to fetch and update
- Creates brief "flash" of wrong content
- Component unmounts on navigation, remounts on back with stale mock data

**Solution:**
**Primary:** Enable Firestore offline persistence (cache)

```typescript
// lib/firebase.ts
import { enableIndexedDbPersistence } from 'firebase/firestore';

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open');
  } else if (err.code === 'unimplemented') {
    console.warn('Browser doesn't support persistence');
  }
});
```

**Benefits:**
- ✅ Firestore returns cached data instantly (no network delay)
- ✅ No flash of incorrect values
- ✅ Works offline
- ✅ Better performance
- ✅ One line of code

**Secondary:** Initialize state with prop value, not default

```typescript
// Wrong
const [commentCount, setCommentCount] = useState(0);

// Right
const [commentCount, setCommentCount] = useState(article.comment_count);
```

**See:** `FIRESTORE-CACHE-SETUP.md` for complete guide

---

### Issue: Props Changes Not Reflected in Child Component
**Symptoms:**
- Parent passes new props but child doesn't update
- Changes in parent state don't flow to child

**Root Cause:**
- Child component controls its own state
- Parent can only set initial value
- Need to pass both state and setState, or use controlled component pattern

**Solution:**
Use controlled component pattern

**Before (Uncontrolled):**
```typescript
// Parent
<CommentSection initialIsOpen={false} />

// Child
const [isOpen, setIsOpen] = useState(initialIsOpen);
// Parent can't control isOpen after initial render
```

**After (Controlled):**
```typescript
// Parent
const [isOpen, setIsOpen] = useState(false);
<CommentSection isOpen={isOpen} onClose={() => setIsOpen(false)} />

// Child
export function CommentSection({ isOpen, onClose }: Props) {
  // Use isOpen directly, call onClose to update
}
```

---

## UI/UX Issues

### Issue: "Be the first to comment" Showing on Posts with Comments
**Symptoms:**
- Toggle button shows "Be the first to comment" when comments exist
- Comment count in button doesn't match actual count

**Root Causes:**
1. State initialized to 0 (see "Initial State Shows Wrong Value" above)
2. Comment count from Firestore not matching actual comment collection
3. Toggle button relies on potentially stale data

**Solutions:**

**Option 1: Fix State Initialization**
```typescript
const [commentCount, setCommentCount] = useState(article.comment_count);
```

**Option 2: Remove Toggle Button (Better UX)**
- Make comment icon in actions bar clickable
- Remove separate toggle button
- Simpler, cleaner interface
- No confusion about comment count

**Implementation:**
```typescript
// In actions bar
<button onClick={handleToggle}>
  <MessageCircle className="h-5 w-5" />
  <span>{commentCount}</span>
</button>

// Remove the separate "Be the first to comment" button entirely
```

---

### Issue: Modal/Overlay Not Preventing Body Scroll
**Symptoms:**
- Modal is open but page scrolls behind it
- Poor mobile UX

**Root Cause:**
- Body scroll not disabled when modal opens

**Solution:**
Use effect to control body scroll

```typescript
useEffect(() => {
  if (showModal) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }
  return () => {
    document.body.style.overflow = 'unset';
  };
}, [showModal]);
```

---

## Performance Issues

### Issue: Too Many Real-Time Listeners
**Symptoms:**
- Console warns about too many listeners
- App feels slow
- High Firebase quota usage

**Root Cause:**
- Creating listeners without cleanup
- Listeners in components that re-render frequently
- Multiple listeners for same data

**Solution:**
Proper cleanup and listener management

**Pattern:**
```typescript
useEffect(() => {
  // Create listener
  const unsubscribe = onSnapshot(ref, (snapshot) => {
    // Handle data
  });

  // Cleanup function
  return () => unsubscribe();
}, [dependencies]); // Only recreate when needed
```

**Best Practices:**
- ✅ Return cleanup function from useEffect
- ✅ Store unsubscribe function
- ✅ Minimize dependencies array
- ❌ Don't create listeners on every render
- ❌ Don't forget cleanup

---

## Common Error Patterns

### Pattern: "X is not defined" in API Routes
**Likely Cause:** Using browser APIs in server-side code  
**Quick Fix:** Move to client-side or use Node.js equivalents

### Pattern: Data Not Updating in Real-Time
**Likely Cause:** Forgot to call unsubscribe or missing dependency  
**Quick Fix:** Check useEffect cleanup and dependencies

### Pattern: Duplicate Comments/Likes Getting Through
**Likely Cause:** Missing Firestore composite index  
**Quick Fix:** Click the index creation link in console error

### Pattern: State Shows Old Value
**Likely Cause:** State initialized with default instead of prop  
**Quick Fix:** `useState(propValue)` instead of `useState(0)`

---

## Debugging Checklist

When encountering an issue:

1. **Check Console Errors**
   - Browser console (F12)
   - Server terminal
   - Look for error stack traces

2. **Check Firebase Console**
   - Firestore Rules
   - Indexes tab
   - Usage metrics

3. **Verify Environment**
   - `.env.local` file exists
   - Firebase config is correct
   - All required variables set

4. **Check This Document**
   - Search for similar symptoms
   - Apply known solutions
   - Add new issues if not found

---

## Project-Specific Notes

### This Project (Naija360)

**Architecture Decisions:**
- ✅ Client-side Firebase operations (not API routes)
- ✅ Real-time listeners for all data
- ✅ Firestore rules for security
- ✅ No Firebase Admin SDK (development simplicity)

**Key Files:**
- `lib/firebase.ts` - Firebase client initialization
- `firestore.rules` - Security rules
- `components/comments/comment-section.tsx` - Comment logic
- `components/feed/article-card.tsx` - Article card with likes/comments

**Known Limitations:**
- No server-side validation (relies on Firestore rules)
- No rate limiting (consider adding in production)
- Mock articles not synced with Firestore (by design)

---

## Contributing to This Document

When you encounter a new issue:

1. **Document the symptom** - What error/behavior did you see?
2. **Explain the root cause** - Why did it happen?
3. **Provide the solution** - How did you fix it?
4. **Include code examples** - Show before/after
5. **Add to appropriate section** - Keep it organized

This creates a knowledge base that saves time on future projects!
