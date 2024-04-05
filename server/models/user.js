const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    match: [/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/i, "Invalid email address"],
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// UserSchema.plugin(passportLocalMongoose, {
//   salt: 0,
//   hash: 0, // Disable automatic hashing
//   usernameField: 'username', // Specify the field to use for username (default is 'username')
//   usernameLowerCase: true,   // Ensure that usernames are always lowercase
//   session: false,              // Disable sessions as we're using JWTs
  
// });


const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;