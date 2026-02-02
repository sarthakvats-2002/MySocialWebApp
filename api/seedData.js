const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const User = require("./models/User");
const Post = require("./models/Post");

dotenv.config();

// Sample users
const sampleUsers = [
  {
    username: "alex_wonder",
    email: "alex@example.com",
    password: "password123",
    desc: "Adventure seeker and coffee lover ☕",
    city: "San Francisco",
    from: "California",
    profilePicture: "https://i.pravatar.cc/150?img=1",
    coverPicture: "https://picsum.photos/seed/alex/800/400",
  },
  {
    username: "emma_smith",
    email: "emma@example.com",
    password: "password123",
    desc: "Digital artist & designer 🎨",
    city: "New York",
    from: "New York",
    profilePicture: "https://i.pravatar.cc/150?img=5",
    coverPicture: "https://picsum.photos/seed/emma/800/400",
  },
  {
    username: "mike_johnson",
    email: "mike@example.com",
    password: "password123",
    desc: "Tech enthusiast | Gamer 🎮",
    city: "Austin",
    from: "Texas",
    profilePicture: "https://i.pravatar.cc/150?img=12",
    coverPicture: "https://picsum.photos/seed/mike/800/400",
  },
  {
    username: "sophia_lee",
    email: "sophia@example.com",
    password: "password123",
    desc: "Foodie & Travel blogger ✈️",
    city: "Los Angeles",
    from: "California",
    profilePicture: "https://i.pravatar.cc/150?img=9",
    coverPicture: "https://picsum.photos/seed/sophia/800/400",
  },
  {
    username: "david_brown",
    email: "david@example.com",
    password: "password123",
    desc: "Fitness coach & nutritionist 💪",
    city: "Miami",
    from: "Florida",
    profilePicture: "https://i.pravatar.cc/150?img=13",
    coverPicture: "https://picsum.photos/seed/david/800/400",
  },
  {
    username: "olivia_garcia",
    email: "olivia@example.com",
    password: "password123",
    desc: "Fashion & lifestyle blogger 👗",
    city: "Chicago",
    from: "Illinois",
    profilePicture: "https://i.pravatar.cc/150?img=10",
    coverPicture: "https://picsum.photos/seed/olivia/800/400",
  },
  {
    username: "james_wilson",
    email: "james@example.com",
    password: "password123",
    desc: "Music producer & DJ 🎧",
    city: "Nashville",
    from: "Tennessee",
    profilePicture: "https://i.pravatar.cc/150?img=14",
    coverPicture: "https://picsum.photos/seed/james/800/400",
  },
  {
    username: "ava_martinez",
    email: "ava@example.com",
    password: "password123",
    desc: "Photographer & videographer 📸",
    city: "Seattle",
    from: "Washington",
    profilePicture: "https://i.pravatar.cc/150?img=16",
    coverPicture: "https://picsum.photos/seed/ava/800/400",
  },
  {
    username: "ryan_anderson",
    email: "ryan@example.com",
    password: "password123",
    desc: "Entrepreneur & startup founder 🚀",
    city: "Boston",
    from: "Massachusetts",
    profilePicture: "https://i.pravatar.cc/150?img=15",
    coverPicture: "https://picsum.photos/seed/ryan/800/400",
  },
  {
    username: "mia_taylor",
    email: "mia@example.com",
    password: "password123",
    desc: "Yoga instructor & wellness coach 🧘",
    city: "Denver",
    from: "Colorado",
    profilePicture: "https://i.pravatar.cc/150?img=20",
    coverPicture: "https://picsum.photos/seed/mia/800/400",
  },
];

// Sample posts
const samplePosts = [
  {
    desc: "Just finished an amazing hike! The views were breathtaking 🏔️ #nature #adventure",
    img: "https://picsum.photos/seed/post1/600/400",
  },
  {
    desc: "New art project coming soon! Stay tuned 🎨✨",
    img: "https://picsum.photos/seed/post2/600/400",
  },
  {
    desc: "Finally beat that boss level! Gaming all night 🎮💯",
    img: "https://picsum.photos/seed/post3/600/400",
  },
  {
    desc: "Best pasta I've ever had! 🍝 Recipe coming to the blog soon!",
    img: "https://picsum.photos/seed/post4/600/400",
  },
  {
    desc: "Morning workout done! Who else is crushing their fitness goals? 💪",
    img: "https://picsum.photos/seed/post5/600/400",
  },
  {
    desc: "New collection dropping next week! Can't wait to share 👗✨",
    img: "https://picsum.photos/seed/post6/600/400",
  },
  {
    desc: "Studio session with some amazing artists today 🎵🎧",
    img: "https://picsum.photos/seed/post7/600/400",
  },
  {
    desc: "Golden hour shots are always the best 📸🌅",
    img: "https://picsum.photos/seed/post8/600/400",
  },
  {
    desc: "Excited to announce our startup just raised Series A! 🚀🎉",
    img: "https://picsum.photos/seed/post9/600/400",
  },
  {
    desc: "Morning yoga session by the beach 🧘‍♀️☀️ #wellness #balance",
    img: "https://picsum.photos/seed/post10/600/400",
  },
  {
    desc: "Coffee and coding - the perfect morning ☕💻",
    img: "",
  },
  {
    desc: "Sunset vibes 🌇 Sometimes you just need to stop and appreciate the moment",
    img: "https://picsum.photos/seed/post11/600/400",
  },
  {
    desc: "New blog post is live! Check out my top 10 travel destinations for 2026 ✈️",
    img: "",
  },
  {
    desc: "Family time is the best time ❤️👨‍👩‍👧‍👦",
    img: "https://picsum.photos/seed/post12/600/400",
  },
  {
    desc: "Weekend brunch goals 🥞🍳 Who's joining me?",
    img: "https://picsum.photos/seed/post13/600/400",
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Clear existing data (optional - comment out if you want to keep existing data)
    await User.deleteMany({ email: { $in: sampleUsers.map(u => u.email) } });
    await Post.deleteMany({});
    console.log("🗑️  Cleared existing seed data");

    // Create users
    console.log("👥 Creating users...");
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const user = new User({
        ...userData,
        password: hashedPassword,
      });
      
      const savedUser = await user.save();
      createdUsers.push(savedUser);
      console.log(`   ✓ Created: ${userData.username}`);
    }

    // Create friendships (each user follows 3-5 random others)
    console.log("\n🤝 Creating friendships...");
    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i];
      const numFriends = Math.floor(Math.random() * 3) + 3; // 3-5 friends
      
      const potentialFriends = createdUsers.filter((_, idx) => idx !== i);
      const shuffled = potentialFriends.sort(() => 0.5 - Math.random());
      const friends = shuffled.slice(0, numFriends);
      
      for (const friend of friends) {
        if (!user.followings.includes(friend._id)) {
          user.followings.push(friend._id);
          friend.followers.push(user._id);
        }
      }
      
      await user.save();
      console.log(`   ✓ ${user.username} now follows ${friends.length} users`);
    }

    // Save all friend updates
    for (const user of createdUsers) {
      await user.save();
    }

    // Create posts
    console.log("\n📝 Creating posts...");
    for (let i = 0; i < samplePosts.length; i++) {
      const postData = samplePosts[i];
      const randomUser = createdUsers[i % createdUsers.length];
      
      const post = new Post({
        userId: randomUser._id,
        desc: postData.desc,
        img: postData.img,
        likes: [],
        reactions: {
          like: [],
          love: [],
          haha: [],
          wow: [],
          sad: [],
          angry: [],
        },
      });
      
      await post.save();
      console.log(`   ✓ Created post by ${randomUser.username}`);
    }

    console.log("\n🎉 SEED DATA CREATED SUCCESSFULLY!");
    console.log("\n📊 Summary:");
    console.log(`   • ${createdUsers.length} users created`);
    console.log(`   • ${samplePosts.length} posts created`);
    console.log(`   • Multiple friendships established`);
    console.log("\n🔐 All users have password: password123");
    console.log("\n💡 You can now login with any of these emails:");
    sampleUsers.forEach(u => console.log(`   • ${u.email}`));

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seedDatabase();

