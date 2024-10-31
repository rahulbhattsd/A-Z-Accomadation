const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensures email uniqueness
  },
  username: {
    type: String,
    required: true,
    unique: true, // Ensures username uniqueness
  },
});

// Adding the passportLocalMongoose plugin, with options to enforce unique username
userSchema.plugin(passportLocalMongoose, { usernameField: "username" });

module.exports = mongoose.model("User", userSchema);
