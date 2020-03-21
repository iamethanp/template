const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const viewportSchema = mongoose.Schema({
  x: Number,
  y: Number
},{_id:false});

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  rank: {type: Number, default: 4},
  x: {type: Number, default: 200},
  y: {type: Number, default: 200},
  viewport: {type: viewportSchema, default: {x: 0, y: 0}},
  direction: {type: Number, default: 0},
  isBanned: {type: Boolean, default: false},
  isMuted: {type: Boolean, default: false},
})

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model("User", userSchema);
