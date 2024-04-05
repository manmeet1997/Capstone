// var User = require("../models/user");
// var passport = require("passport");
// var passportJWT = require("passport-jwt");
// var config = require("../config.js");
// var ExtractJwt = passportJWT.ExtractJwt;
// var Strategy = passportJWT.Strategy;

// var params = {
//   secretOrKey: config.jwtSecret,
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
// };

// module.exports = function() {
//   var strategy = new Strategy(params, async function(payload, done) {
//     try {
//       const user = await User.findById(payload.id);
//       if (!user) {
//         return done(new Error("UserNotFound"), null);
//       } else if (payload.expire <= Date.now()) {
//         return done(new Error("TokenExpired"), null);
//       } else {
//         return done(null, user);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       return done(error, null);
//     }
//   });

//   passport.use(strategy);

//   return { initialize: function() { return passport.initialize() }};
// };

const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jwt-simple");
const config = require("../config.js");

const User = require("../models/user");
const { login } = require("../controllers/accountController.js");

// router.post("/register", async (req, res) => {
//     try {
//         const { username, email, password } = req.body;
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ error: "Email already exists" });
//         }
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new User({ username, email, password: hashedPassword });
//         await newUser.save();
//         res.status(201).json({ message: "User registered successfully" });
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

// router.post("/login", async (req, res, next) => {
  
//     passport.authenticate("local", function(err, user, info) {
//         if (err) {
//             return res.status(400).json({ errors: err });
//         }
//         if (!user) {
//             return res.status(400).json({ errors: "No user found" });
//         }
//         req.logIn(user, function(err) {
//             if (err) {
//                 return res.status(400).json({ errors: err });
//             }
//             return res.status(200).json({ success: `Logged in as ${user.username}` });
//         });
//     })(req, res, next);
// });

router.post("/login", login);


router.post("/register", async (req, res) => {
  try {
      const { username, email, password } = req.body;

      // Check if username already exists
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
          return res.status(400).json({ error: "Username already exists" });
      }

      // Check if email already exists
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
          return res.status(400).json({ error: "Email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();

      res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});



module.exports = router;
