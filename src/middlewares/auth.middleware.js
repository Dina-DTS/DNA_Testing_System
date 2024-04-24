import jwt from "jsonwebtoken";
import { AppError } from "../../utilies/error.handler.js";
import labTechnicalModel from "../modules/Lab_Technical/models/techical.model.js";


export const authenticate = (req, res, next) => {
  const token = req.header("token"); // Assuming the token is sent in the Authorization header
  if (!token) return next(new AppError('Token is required', 401));

  jwt.verify(token, process.env.SECRET, async (err, decoded) => {
    if (err) return next(new AppError(err, 401));

    if (decoded.role === 'admin') {
      // If the user is an admin
      req.user = decoded;
      return next();
    } else if (decoded.role === 'technical') {
      // If the user is a technical user
      try {
        let tech = await labTechnicalModel.findById(decoded.id);
        if (!tech) return next(new AppError('Technical user not found', 404));
        if (tech.isLogout) return next(new AppError('Please log in again because you are logged out now', 401));
        
        req.user = decoded;
        return next();
      } catch (error) {
        return next(new AppError('Error fetching technical user', 500));
      }
    } else {
      // If the user role is neither admin nor technical
      return next(new AppError('Invalid user role', 403));
    }
  });
};

export const autherize = (...roles) => {
  return (req, res, next) => {
    const { role: userRole } = req.user;
    if (!roles.includes(userRole)) {
      throw new AppError('You are not authorized', 403);
    }
    next();
  };
};