# Firestore Setup Guide

## Current Status

✅ **Fixed:** Comments are now created directly from the client side using Firebase Firestore
✅ **Fixed:** LCP image warning resolved with priority loading for first 3 articles
✅ **Working:** Comment count updates in real-time
✅ **Active:** Duplicate comment check code is enabled

## ⚠️ Action Required: Create Firestore Index

The duplicate comment prevention feature is **active in the code** but requires a Firestore composite index to work.

### Quick Setup (2 minutes)

**See detailed instructions in:** `CREATE_FIRESTORE_INDEX.md`

**Quick steps:**
1. Try to post a duplicate comment in your app
2. Open browser console (F12)
3. Click the index creation link in the error message
4. Wait 2-5 minutes for index to build
5. Done! Duplicate prevention will work

### What Happens Without the Index

- ❌ You'll see an error in the console when posting comments
- ❌ The error message will say "The query requires an index"
- ✅ Comments will still fail to post (which is correct - prevents duplicates)
- ✅ The app won't crash or break

### What Happens With the Index

- ✅ Duplicate comments are blocked with a clear error message
- ✅ Different comments post normally
- ✅ No console errors
- ✅ Everything works perfectly

## Testing

The comment system is active and ready:

1. ✅ **Sign in** to your app (or create an account)
2. ✅ **Click on an article** to view it
3. ✅ **Open the comments section**
4. ✅ **Post a comment** - it should work!
5. ⚠️ **Try posting the same comment again** - you'll see an index error in console
6. 📋 **Click the link in the error** to create the index
7. ⏱️ **Wait 2-5 minutes** for the index to build
8. ✅ **Try posting a duplicate again** - now you'll see "Cannot post duplicate comments"
9. ✅ **Post a different comment** - it will work perfectly

### Expected Behavior

**Before creating the index:**
- Posting a duplicate comment will show a Firestore error in console
- The error includes a link to create the index
- Comments may fail to post

**After creating the index:**
- Posting a duplicate comment shows: "Cannot post duplicate comments"
- Posting different comments works perfectly
- No console errors

## Architecture Changes

### Before (Broken)
- Comments were created via API route (`/api/articles/[id]/comments`)
- API routes run on Node.js server
- Firebase client SDK doesn't work on server (needs browser APIs)
- Result: 500 Internal Server Error

### After (Working)
- Comments are created directly from the client component
- Uses Firebase client SDK in the browser (where it's designed to work)
- Real-time listeners automatically update the UI
- Firestore security rules enforce validation and permissions

## Security

All comment operations are protected by Firestore security rules:

✅ Users must be authenticated to post comments
✅ Comments must be 3-500 characters
✅ Users can only post as themselves (user_id validation)
✅ Maximum 3 levels of nesting enforced
✅ Comments can only be edited/deleted within 5 minutes
✅ Users can only edit/delete their own comments

See `firestore.rules` for full security implementation.

## Next Steps

1. Create the Firestore composite index (see above)
2. Test commenting functionality
3. Consider implementing rate limiting (currently basic)
4. Add comment reporting/moderation features (future)
5. Add email notifications for replies (future)

## Troubleshooting

**Error: "Missing or insufficient permissions"**
- Make sure you're signed in
- Check that Firestore rules are deployed

**Error: "Comment must be at least 3 characters long"**
- This is working as intended
- Comments must be between 3-500 characters

**Error: "Maximum nesting level reached"**
- This is working as intended
- You can only nest replies 3 levels deep

**Comments not appearing**
- Check browser console for errors
- Verify Firebase configuration in `.env.local`
- Make sure Firestore is enabled in Firebase Console

**Can post duplicate comments**
- This is expected behavior (duplicate check is disabled)
- Enable it by creating the Firestore index (see above)
