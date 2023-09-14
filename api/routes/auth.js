const router = require("express").Router();
const User = require("../models/User");
const bcrypt= require("bcrypt");

//REGISTER
router.post("/register", async(req,res)=>{
  try{
    //generate new passwordword
    const salt = await bcrypt.genSalt(10);
    const hashedPassword= bcrypt.hashSync(req.body.password, salt);
    
    //Create new User 
    const newUser = new User({
      username:req.body.username,
      email:req.body.email,
      password:hashedPassword,
      profilePicture:req.body.profilePicture,
      coverPicture:req.body.coverPicture,
      followers:req.body.followers,
      followings:req.body.followings,
      isAdmin:req.body.isAdmin,
      desc:req.body.desc,
      city:req.body.city,
      from:req.body.from,
      relationship:req.body.relationship
    });
    //Save User and respond
    const user= await newUser.save();
    res.status(200).json(user);
  }catch(err)
  {
    console.log(err);
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
          return res.status(404).json("User not found");
      }

      console.log(req.body.password);
      console.log(user.password);

      // bcrypt.compare(password, user.hash, (err, res) => {
      //   if (err) return callback(err);
      //   if (!res) return callback(new Error('Invalid password'));
      // })    
      
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) {
          // console.log("sara");
          return res.status(400).json("Wrong password");
      }
      
      res.status(200).json(user);

  } catch (err) {
      console.log(err);
      res.status(500).json(err);
  }
});


module.exports = router