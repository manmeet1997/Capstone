const User = require("../models/user");
const config = require("../config.js");
const jwt = require("jwt-simple");
const bcrypt = require("bcrypt");

exports.login = async function (req, res) {
  console.log("entering login");


  try {
    const user = await User.findOne( {
      $or: [
        { email: req.body.email },
        {  username : req.body.username}
      ]
    } );
    console.log("User found:", user); // Add this line for debugging
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }


    // if (req.body.email != user.email) {
    //   return res.status(401).json({ error: "Invalid email entered" });
    // }

    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
   // if (req.body.password != user.password) {
    if(!passwordMatch){
      return res.status(401).json({ error: "Invalid password" });
    }

    const payload = { 
      id: user.id, 
      expire: Date.now() + 1000 * 60 * 60 * 24 * 7 
    };

    const token = jwt.encode(payload, config.jwtSecret);
    res.json({ 
      user: user,
      token: token });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.register = async function (req, res) {
  console.log("entering registration");
  console.log(req.body.username);

  
  const existingUser = await User.findOne({
    $or: [
      { email: req.body.email },
      {  username : req.body.username}
    ]
  });
  if (existingUser) {
    return res.status(400).json({ error: "Username or Email id already exists. Please try again !" });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10); // Salt rounds: 10

  User.register(
    new User({ 
      email: req.body.email, 
      username: req.body.username,
      password: hashedPassword
    }), req.body.password, function (error, msg) {
      if (error) {
        if (error instanceof mongoose.Error.ValidationError) {
          let errorList = [];
          for (let e in error.errors) {
            errorList.push(error.errors[e].message);
          }
          console.log(errorList);
          return res.json({ message: errorList });
        } else {
          return res.json({ message: ["Unable to register user."] });
        }



      } else {
        res.send({ message: "Registered successfully" });
      }
    }
  );
};

exports.profile = function(req, res) {
  res.json({
    message: 'You made it to the secured profile',
    user: req.user,
    token: req.query.secret_token
  })
}