# 🔒 Security Quick Reference Card

## 🚀 Deploy in 3 Steps

1. **Firebase Console** → Firestore Database → Rules
2. **Copy** `firestore.rules` content
3. **Paste** and click **"Publish"**

✅ Done! Security is now active.

---

## 🎯 What's Protected

| Action | Anonymous | Authenticated | Owner Only |
|--------|-----------|---------------|------------|
| Read articles | ✅ | ✅ | ✅ |
| Read comments | ✅ | ✅ | ✅ |
| Like article | ❌ | ✅ | - |
| Unlike article | ❌ | ✅ | ✅ |
| Post comment | ❌ | ✅ | - |
| Edit comment | ❌ | ❌ | ✅ (5 min) |
| Delete comment | ❌ | ❌ | ✅ (5 min, no replies) |

---

## ⚠️ User-Facing Restrictions

### Comments:
- ✅ Minimum 3 characters
- ✅ Maximum 500 characters
- ✅ Can edit within 5 minutes
- ✅ Can delete within 5 minutes (if no replies)
- ❌ Cannot post duplicate comments
- ❌ Cannot delete comments with replies

### Likes:
- ✅ One like per article per user
- ✅ Can unlike anytime
- ⚠️ Basic rate limiting (1 action per 2 seconds)

---

## 🔍 Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| "Permission denied" | Firestore rules blocked action | Check auth, ownership, time limits |
| "Parent comment not found" | Replying to non-existent comment | Refresh and try again |
| "Comment must be at least 3 characters" | Comment too short | Write longer comment |
| "Cannot post duplicate comments" | Same text as last comment | Edit previous or write different text |
| "Cannot delete comments with replies" | Comment has child replies | Delete replies first |
| "Maximum nesting level reached" | Already at 3 levels deep | Reply to parent instead |

---

## 🧪 Quick Test

```bash
# 1. Sign in
# 2. Like an article → ✅ Works
# 3. Post "ok" → ❌ "Must be at least 3 characters"
# 4. Post "Great article!" → ✅ Works
# 5. Post "Great article!" again → ❌ "Cannot post duplicate"
```

---

## 📊 Security Features

### ✅ Implemented (10/10)
1. Validate comment parent exists
2. Prevent editing after 5 minutes
3. Prevent deleting with replies
4. Validate count increments (±1)
5. Basic rate limiting
6. Minimum comment length (3 chars)
7. Prevent duplicate comments
8. Stricter field validation
9. Prevent tampering immutable fields
10. Validate required fields

### ⏳ Coming Later (Task 17)
- Advanced rate limiting (Redis)
- Content moderation
- Audit logging
- Anomaly detection

---

## 🛠️ Troubleshooting

### Issue: Can't like/comment
**Check:** Are you signed in?

### Issue: Can't edit comment
**Check:** Was it posted more than 5 minutes ago?

### Issue: Can't delete comment
**Check:** Does it have replies? Was it posted more than 5 minutes ago?

### Issue: "Permission denied"
**Check:** Firebase Console → Rules → Verify published

---

## 📁 Key Files

- `firestore.rules` - Security rules (deploy this!)
- `SECURITY_RULES_GUIDE.md` - Full documentation
- `SECURITY_DEPLOYMENT_CHECKLIST.md` - Deployment steps
- `app/api/articles/[id]/comments/route.ts` - API validations

---

## 🎯 Success Criteria

✅ Users can like/comment when signed in  
✅ Anonymous users can only read  
✅ Spam prevention works  
✅ Data integrity maintained  
✅ Clear error messages  

---

**Status:** Ready to deploy! 🚀

**Next:** Deploy rules to Firebase Console (5 minutes)
