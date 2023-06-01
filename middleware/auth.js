const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

exports.auth = catchAsyncErrors(async (req, res, next) => {
  let token;

  // console.log(token);
if(req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
try {
  token=req.headers.authorization.split(" ")[1];
  // console.log(token);
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  // console.log(decodedData,'ddata');
  req.user = await User.findById(decodedData.id);
  next();
} catch (error) {
  console.log(error);
  res.status(401);
  throw new Error('token failed');
}
if(!token){
  res.status(401);
  throw new Error('token not found');
}

  
  // req.user = await User.findById(decodedData.id);

 
});
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHander("Please Login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);

  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHander(
          `Role: ${req.user.role} is not allowed to access this resouce `,
          403
        )
      );
    }

    next();
  };
};
