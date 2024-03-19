import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from "dotenv"

import labTechnicalModel from "../models/techical.model.js";
import {
  AppError
} from "../../../../utilies/error.handler.js";
import { asyncHandler } from "../../../middlewares/asyncHandler.js";
import labModel from '../../Lab/models/lab.model.js';

dotenv.config()
//////////////////////////// add technical /////////////////////////////
export const addTechnical = asyncHandler(async (req, res, next) => {
  // Array to store error messages
  const errorMessages = [];

  if (req.body.email) {
      const existingEmail = await labTechnicalModel.findOne({
          email: req.body.email,
      });
      if (existingEmail) {
          errorMessages.push("Technical with this Email already exists");
      }
  }

  if (req.body.nationalId) {
      const existingTechnical = await labTechnicalModel.findOne({
          nationalId: req.body.nationalId,
      });
      if (existingTechnical) {
          errorMessages.push("Technical with this national ID already exists");
      }
  }

  if (req.body.lab_id) {
      const existingLabTechnical = await labTechnicalModel.findOne({
          lab_id: req.body.lab_id,
      });
      if (existingLabTechnical) {
          errorMessages.push("This lab already has a technical associated with it");
      }
  }

  if (req.body.phone) {
      const existingPhone = await labTechnicalModel.findOne({
          phone: req.body.phone,
      });
      if (existingPhone) {
          errorMessages.push("Technical with this phone number already exists");
      }
  }

  const existingLab = await labModel.findById(req.body.lab_id);
  if (!existingLab) {
      errorMessages.push("Lab with this specified lab_id not found");
  }

  // If there are any error messages, throw an AppError containing all the error messages
  if (errorMessages.length > 0) {
      throw new AppError(errorMessages,409);
  }

  // Hash the password
 
  const hashedPassword = await bcrypt.hash(req.body.password, +process.env.SALT); // 10 is the salt rounds

  // Create a new technical personnel using attributes from the request body
  const newTechnical = new labTechnicalModel({
      email: req.body.email,
      password: hashedPassword,
      username: req.body.username,
      phone: req.body.phone,
      nationalId: req.body.nationalId,
      admin_id: req.user.id,
      lab_id: req.body.lab_id,
     
  });

  // Save the new technical personnel to the database
  await newTechnical.save();

  res.status(201).json({
      message: 'Technical added successfully',
      technical: newTechnical,
  });
});

///////////////////////////////////////update technical //////////////////////////////////
export const updatetechnical = asyncHandler(async (req, res) => {

  const { id } = req.params; 
  const existingTechnical = await labTechnicalModel.findById(id);
  if (!existingTechnical) {
    throw new AppError('Technical not found', 404);
  }
  if(!req.body.nationalId && !req.body.lab_id && !req.body.phone && !req.body.email && !req.body.username && !req.body.password && !req.body.role){
    throw new AppError('Please provide data to be updated', 400);
  }
  if (req.body.email && req.body.email !== existingTechnical.email) {
    const existingEmail = await labTechnicalModel.findOne({ email: req.body.email });
    if (existingEmail) {
      throw new AppError('Technical with this Email already exists', 409);
    }
  }
  // Check if the national ID already exists for another technical personnel
  if (req.body.nationalId && req.body.nationalId !== existingTechnical.nationalId) {
    const existingNationalId = await labTechnicalModel.findOne({ nationalId: req.body.nationalId });
    if (existingNationalId) {
      throw new AppError('Technical with this national ID already exists', 409);
    }
  }

  // Check if the lab already has a technical personnel associated with it
  if (req.body.lab_id && req.body.lab_id !== existingTechnical.lab_id) {
    const existingLabTechnical = await labTechnicalModel.findOne({ lab_id: req.body.lab_id });
    if (existingLabTechnical) {
      throw new AppError('This lab already has a technical associated with it', 409);
    }
  }

  // Check if the phone number already exists for another technical personnel
  if (req.body.phone && req.body.phone !== existingTechnical.phone) {
    const existingPhone = await labTechnicalModel.findOne({ phone: req.body.phone });
    if (existingPhone) {
      throw new AppError('Technical with this phone number already exists', 409);
    }
  }

  // Hash the password if provided
  if (req.body.password) {
    let hashed = bcrypt.hashSync(req.body.password, +process.env.SALT);
    req.body.password = hashed;
  }

  // Update the user account
  const updatedtechnical = await labTechnicalModel.findByIdAndUpdate(
    id,
    req.body,
    { new: true }
  ).select('-__v');
  res.status(200).json({ message: "Technical updated successfully", technical: updatedtechnical });
});


                                          //////  3- Delete Technical //////


export const deletetechnical =asyncHandler( async (req, res, next) => {
  const { id } = req.params;

  const technical  = await labTechnicalModel.findByIdAndDelete(id).select('-__v');

  if (!technical || technical.length == 0){
   throw new AppError("Technical Not Found", 404);
  }

  return res.status(200).json({ message: "Technical deleted successfully" });
});

                                           //////  4- get All Technicals //////


export const getAllTechnicals =asyncHandler( async (req, res, next) => {
  const technicals = await labTechnicalModel.find().select('-__v');
  if (!technicals || technicals.length == 0){
    throw new AppError("No Technical found", 404)
  }
  return res.status(200).json({ message: "Technicals fetched successfully", technicals });
});


                                           //////  5- Search For Technical //////

export const searchTechnical = asyncHandler(async (req, res) => {
  const { email,phone,nationalId,lab_id,username } = req.query;
  if (!email && !nationalId && !phone && !lab_id &&!username) {
    return next(new AppError("Please provide data to be searched for", 404));
}

// Create a search schema based on the provided query parameters
let searchSchema = {};
if (email) searchSchema.email = email;
if (lab_id) searchSchema.lab_id = lab_id;
if (phone) searchSchema.phone = phone;
if (username) searchSchema.username = { $regex: username, $options: 'i' };
if (nationalId) searchSchema.nationalId = nationalId;
  // Search for technical personnel with the provided id
  const technicalPersonnel = await labTechnicalModel.find( searchSchema ).select('-__v');

  if (!technicalPersonnel||technicalPersonnel.length === 0) {
    throw new AppError("No technical found matching your search criteria", 404);
  }

  return res.status(200).json({
    message: 'Technical found successfully',
    technical: technicalPersonnel,
  });
});

                                           //////  6- Sign In  //////

export const signInTechnical = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate request body
  if (!email || !password ) {
    throw new AppError("Email and password are required", 400);
  }

  // Check if the technical personnel exists with the provided email
  const technicalPersonnel = await labTechnicalModel.findOne({ email }).select('-__v');
  if (!technicalPersonnel) {
    throw new AppError("Invalid email or password", 401);
  }

  // Verify password
  if(password){
  const passwordMatch = await bcrypt.compare(password, technicalPersonnel.password);
  if (!passwordMatch) {
    throw new AppError("Invalid email or password", 401);
  }}

  // Generate JWT token
  const token = jwt.sign( { email: technicalPersonnel.email, id: technicalPersonnel._id, role: technicalPersonnel.role, lab_id:technicalPersonnel.lab_id },
    process.env.SECRET,{ expiresIn: '12h' });

  return res.status(200).json({
    message: 'Sign in successfully',
    statusCode:200,
    token,
    technical:technicalPersonnel
  });
});
