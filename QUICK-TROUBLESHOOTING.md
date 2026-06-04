# Quick Troubleshooting Guide

**Use this when something breaks. Find your symptom, apply the fix.**

---

## 🔥 Emergency Fixes (Most Common)

### "500 Internal Server Error" from API routes
```bash
➜ Move operation to client-side (see ISSUES-AND-FIXES.md → Firebase Client SDK)
➜ Don't use firebase/firestore in API routes
➜ Use client-side Firestore or Firebase Admin SDK
```

### "The query requires an index"
```bash
➜ Click the link in the error message
➜ Click "Create Index" in Firebase Console
➜ Wait 2-5 minutes
```

### State shows wrong initial value (0 instead of actual)
```typescript
// ❌ Wrong
const [count, setCount] = useState(0);

// ✅ Right
const [count, setCount] = useState(initialCount);
```

### "Missing or insufficient permissions"
```bash
➜ Check firestore.rules
➜ Verify user is authenticated
➜ Ensure user_id matches request.auth.uid
```

---

## 🎯 By Error Type

### Firebase Errors
| Error | Fix |
|-------|-----|
| `window is not defined` | Move to client-side |
| `failed-precondition` | Create Firestore index |
| `permission-denied` | Check firestore.rules |
| `not-found` | Document doesn't exist, handle gracefully |

### React Errors
| Error | Fix |
|-------|-----|
| Props not updating | Use controlled component pattern |
| Stale state | Check useEffect dependencies |
| Infinite loop | Missing dependency or cleanup |
| Flash of wrong content | Initialize state with prop value |

### Next.js Errors
| Error | Fix |
|-------|-----|
| LCP warning | Add `priority` to images |
| API route 500 | Don't use client SDK on server |
| Hydration mismatch | Match server/client rendering |

---

## 🔍 Quick Diagnostics

### Something not working? Check these in order:

1. **Browser Console** (F12)
   - Any red errors?
   - Look at full error message
   - Check Network tab for failed requests

2. **Server Terminal**
   - Any errors when page loads?
   - Check for stack traces

3. **Firebase Console**
   - Firestore → Data: Does the document exist?
   - Firestore → Rules: Are rules deployed?
   - Firestore → Indexes: Any building or failed?

4. **Environment**
   ```bash
   # Check these exist:
   .env.local
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   ```

---

## 📋 Common Issue Checklist

**Comments not posting?**
- [ ] User authenticated?
- [ ] Comment between 3-500 characters?
- [ ] Check browser console for errors
- [ ] Firestore rules allow creation?

**Likes not working?**
- [ ] User authenticated?
- [ ] Check browser console for errors
- [ ] Using client-side Firestore (not API route)?
- [ ] Real-time listener set up?

**Real-time updates not working?**
- [ ] Unsubscribe function called in cleanup?
- [ ] Dependencies array correct?
- [ ] Listener created in useEffect?

**Wrong initial state showing?**
- [ ] State initialized with prop value?
- [ ] Not using hardcoded default (0, false, etc.)?

---

## 🚀 Performance Issues

**App feels slow?**
- Check number of real-time listeners (should be minimal)
- Check Network tab in DevTools
- Look for infinite loops in useEffect

**Too many Firestore reads?**
- Cache data in state
- Use real-time listeners instead of repeated getDocs
- Consider pagination

---

## 📚 Full Documentation

For detailed explanations and code examples:
- **ISSUES-AND-FIXES.md** - Complete issue database
- **FIRESTORE_SETUP.md** - Firestore configuration
- **CREATE_FIRESTORE_INDEX.md** - Index creation guide

---

## 🆘 Still Stuck?

1. Search ISSUES-AND-FIXES.md for keywords
2. Check Firebase Console for clues
3. Add new issue to ISSUES-AND-FIXES.md for future reference
4. Copy exact error message and search online

---

**Remember:** Most issues fall into these categories:
1. Client SDK on server (move to client)
2. Missing Firestore index (click the link)
3. Wrong initial state (use prop value)
4. Permission denied (check rules)
5. Missing cleanup (return unsubscribe)
