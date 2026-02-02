# 🌱 Seed Data Setup

This will create **10 sample users** with posts and friendships for testing!

## 📦 What Gets Created:

### 👥 10 Users:
1. **alex_wonder** - alex@example.com
2. **emma_smith** - emma@example.com
3. **mike_johnson** - mike@example.com
4. **sophia_lee** - sophia@example.com
5. **david_brown** - david@example.com
6. **olivia_garcia** - olivia@example.com
7. **james_wilson** - james@example.com
8. **ava_martinez** - ava@example.com
9. **ryan_anderson** - ryan@example.com
10. **mia_taylor** - mia@example.com

🔐 **All passwords:** `password123`

### 📝 15+ Posts
- Posts with images and text
- Distributed across all users
- Ready for likes, comments, reactions

### 🤝 Friendships
- Each user follows 3-5 random others
- Mutual friendships created
- Real social network structure

---

## 🚀 How to Run:

### Local (Required First Time):
```bash
cd api
npm run seed
```

### After Running:
1. ✅ 10 users created
2. ✅ 15+ posts created
3. ✅ Friendships established

---

## 🧪 Testing Chat:

1. **Create 2 new accounts** (or use 2 seed accounts)
2. **Login as User 1** → Go to Messenger
3. **Login as User 2** (in incognito/different browser)
4. **Send messages** between them
5. **Test real-time delivery** with Socket.io

### Recommended Test Accounts:
- **Account 1:** alex@example.com (password123)
- **Account 2:** emma@example.com (password123)

---

## 🎨 What You'll See:

### Feed:
- ✅ Posts from multiple users
- ✅ Profile pictures
- ✅ Content variety (text + images)

### Rightbar:
- ✅ Friend suggestions (seed users)
- ✅ Online friends (when they login)

### Chat:
- ✅ Conversation list
- ✅ Real-time messaging
- ✅ Message history

---

## 🔄 Re-seed (Clear & Start Fresh):

```bash
cd api
npm run seed
```

This will:
- Delete old seed users
- Create fresh 10 users
- Create new posts
- Establish new friendships

---

## ⚠️ Important Notes:

1. **Run this ONCE** - Don't run repeatedly unless you want to clear data
2. **Your own account won't be deleted** - Only seed accounts are replaced
3. **Images use placeholders** - pravatar.cc and picsum.photos
4. **Production:** Don't run seed in production! Only for testing.

---

## 🎯 Next Steps:

1. ✅ Run seed script
2. ✅ Login with any seed account
3. ✅ See feed with posts
4. ✅ Make friends
5. ✅ Test chat with 2 accounts
6. ✅ Test real-time features

---

**Enjoy testing your social network! 🎉**

