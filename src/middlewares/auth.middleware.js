import jwt from "jsonwebtoken";
import { AppError } from "../../utilies/error.handler.js";


export const authenticate = (req, res, next) => {
  const token = req.header("token"); // Assuming the token is sent in the Authorization header
  if (!token) return next(new AppError('Token is required',401))

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if(err) return next(new AppError(err,401))
    req.user = decoded; // Attach admin ID to the request object
    next();
  });
}

export const autherize = (...roles) => {
  return (req, res, next) => {
    const { role: userRole } = req.user;
    if (!roles.includes(userRole)) {
      throw new AppError('You are not authorized', 403);
    }
    next();
  };
};