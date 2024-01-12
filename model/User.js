const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  phoneNumber: String,
  otp: String,
});


module.exports = mongoose.model("users", UserSchema, "users");
