const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema =mongoose.Schema({
  // _id:{
  //   type:String
  // },
  name: {
    type: String,
    require:true
  },
  userName:{
    type:String,
    required:true,trim:true,unique:true,index:true,
    // lowercase:true
  },
  email: {
    type: String,
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    select: false,
  },
  active:{
    type:String,
    default:true
  },
 userProfile: {
    type:String,required:true,
  },
  address:{
    type:String,required:true
  },
phoneNumber:{
  type:Number,
  // required:true
},

  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // resetPasswordToken: String,
  // resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN

  userSchema.methods.generateAuthToken = function (id) {
try {
 let token= jwt.sign({ id}, process.env.JWT_SECRET, {

  expiresIn:'15d'
})
  return token; 
} catch (error) {
  console.log(error);
}
  };



// Compare Password

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
