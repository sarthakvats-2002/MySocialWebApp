const router = require("express").Router();
const User= require("../models/User");
const bcrypt = require("bcrypt");

// router.get("/",(req,res)=>{
//   res.send("Inside UserRoute");
// })

//update user
router.put("/:id",async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
       if(req.body.password){
         try{
            const salt= await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hashSync(req.body.password, salt);
         }catch(err){
           return res.status(500).json(err);
         }
       }
       try{
        const user = await User.findByIdAndUpdate(req.params.id, {
         $set: req.body,
        });
        res.status(200).json("Account has been updated");
       }catch(err){
        return res.status(500).json(err);
       }
    }else{
      return res.status(403).json("You can update only your account!");
    }
});

//get friends
router.get("/friends/:userId", async(req,res)=>{
  try{
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
          user.followings.map(friendId=>{
            return User.findById(friendId);
          })
        )
        let friendList=[];
        friends.map(friend=>{
          const {_id,username,profilePicture}=friend;
          friendList.push({_id,username,profilePicture});
        });
       res.status(200).json(friendList);
  }catch(err)
  {
    res.status(500).json(err);
  }
})

//delete user
router.delete("/:id",async(req,res)=>{
  if(req.body.userId === req.params.id || req.body.isAdmin){
       try{
          await User.findByIdAndDelete(req.params.id);
          res.status(200).json("Account has been deleted successfully");
       }catch(err){
         return res.status(500).json(err);
       }
      }else{
        return res.status(403).json("You can update only your account!");
      }
});

//get a user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//search users
router.get("/search", async (req, res) => {
  const searchQuery = req.query.q;
  try {
    if (!searchQuery || searchQuery.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
      ],
    })
      .select("-password")
      .limit(20);

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error searching users", error: err });
  }
});

//follow a user

router.put("/:id/follow", async(req,res)=>{
  if(req.body.userId !== req.params.id)
  {
    try{
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if(!user.followers.includes(req.body.userId)){
       await user.updateOne({$push:{followers: req.body.userId}});
       await currentUser.updateOne({$push:{followings: req.params.id }});
       res.status(200).json("User has been followed");
      }else{
        res.status(403).json("You already follow this user");
      }
    }catch(err){
        //console.log(err);
       res.status(500).json(err);
    }
  }else{
    res.status(403).json("You can't follow yourself");
  }
});

//Unfollow a user

router.put("/:id/unfollow", async(req,res)=>{
  if(req.body.userId !== req.params.id)
  {
    try{
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if(user.followers.includes(req.body.userId)){
       await user.updateOne({$pull:{followers: req.body.userId}});
       await currentUser.updateOne({$pull:{followings: req.params.id }});
       res.status(200).json("User has been unfollowed");
      }else{
        res.status(403).json("You don't follow follow this user");
      }
    }catch(err){
       res.status(500).json(err);
    }
  }else{
    res.status(403).json("You can't follow yourself");
  }
});

// Get all users (for suggestions)
router.get("/all", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 20;
    const users = await User.find()
      .select("-password")
      .limit(limit)
      .sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

module.exports = router