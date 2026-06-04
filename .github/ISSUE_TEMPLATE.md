# Issue Template

Use this template when adding a new issue to ISSUES-AND-FIXES.md

---

## Issue: [Brief descriptive title]

### Symptoms
- What error message appears?
- What unexpected behavior occurs?
- When does it happen?

Example:
```
- Error: "500 Internal Server Error"
- API route /api/articles/[id]/like returns empty object
- Happens when clicking unlike button
```

### Root Cause
Explain WHY this happens (not just what happens)

Example:
```
The API route tries to use Firebase client SDK on the server side.
Firebase client SDK requires browser APIs (window, localStorage) which
don't exist in Node.js where API routes run.
```

### Solution
Provide the fix with code examples

**Before (Broken):**
```typescript
// Show the problematic code
```

**After (Fixed):**
```typescript
// Show the working code
```

### When to Use This Fix
- Specific scenarios where this solution applies
- Edge cases to be aware of
- Alternative approaches if any

### Related Issues
- Link to similar problems
- Common variations of this issue

---

## Checklist Before Adding

- [ ] Clear symptom description
- [ ] Root cause explained
- [ ] Working solution provided
- [ ] Code examples included
- [ ] Added to correct section in ISSUES-AND-FIXES.md
- [ ] Updated table of contents if needed

---

## Example of a Well-Documented Issue

### Issue: React State Shows Stale Value on Initial Render

**Symptoms:**
- UI briefly displays "0 comments" before updating to correct count
- "Be the first to comment" button flashes even when comments exist
- State starts at default value (0) before real-time listener updates

**Root Cause:**
State is initialized with a hardcoded default value instead of the prop value. When the component first renders, it shows the default (0), then after the real-time listener fetches data, it updates to the correct value. This creates a brief "flash" of incorrect content.

**Solution:**

Before (Broken):
```typescript
const [commentCount, setCommentCount] = useState(0);
// Always starts at 0, even if article.comment_count is 5
```

After (Fixed):
```typescript
const [commentCount, setCommentCount] = useState(article.comment_count);
// Starts with correct value from props
```

**When to Use:**
- Any time state should match an initial prop value
- When using real-time listeners that update state
- To prevent "flash of incorrect content"

**Related Issues:**
- "Props not reflected in child component" - Use controlled component pattern
- "Infinite re-render loop" - Check useEffect dependencies
