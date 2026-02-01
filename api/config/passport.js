const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const bcrypt = require("bcrypt");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:8800/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // User exists, return user
            return done(null, user);
          }

          // User doesn't exist, create new user
          const newUser = new User({
            username: profile.emails[0].value.split("@")[0] + "_" + profile.id.slice(0, 6),
            email: profile.emails[0].value,
            password: await bcrypt.hash(profile.id + process.env.JWT_SECRET, 10), // Random password
            profilePicture: profile.photos[0]?.value || "",
            isGoogleUser: true,
            googleId: profile.id,
          });

          user = await newUser.save();
          done(null, user);
        } catch (err) {
          console.error("Google Auth Error:", err);
          done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};

