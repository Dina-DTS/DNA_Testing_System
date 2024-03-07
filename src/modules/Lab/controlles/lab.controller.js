import { AppError } from "../../../../utilies/error.handler.js";
import labModel from "../models/lab.model.js";

//-------------------- add lab ------------------------

export const addLab = async (req, res, next) => {
  // Array to store error messages
  const errorMessages = [];

  // Check if the lab name already exists
  if (req.body.name) {
    const existingLab = await labModel.findOne({ name: req.body.name });
    if (existingLab) {
      errorMessages.push("Lab with this name already exists");
    }
  }

  // Check if the phone number already exists
  if (req.body.phone) {
    const existingPhone = await labModel.findOne({ phone: req.body.phone });
    if (existingPhone) {
      errorMessages.push("Lab with this phone number already exists");
    }
  }

  // If there are any error messages, return them
  if (errorMessages.length > 0) {
    return next(new AppError(errorMessages, 409));
  }

  // Create a new lab using adminId from the request object
  const newLab = new labModel({
    location: req.body.location,
    name: req.body.name,
    phone: req.body.phone,
    admin_id: req.user.id, // Use the adminId from the request object
  });

  // Save the new lab to the database
  await newLab.save();

  return res.status(201).json({ message: "Lab added successfully", lab: newLab });
};

//------------------------- get all labs ------------------------

export const getAllLabs = async (req, res, next) => {
  let labs = await labModel.find().select('-__v');
  if (!labs || labs.length == 0)
    return next(new AppError("No labs found", 404));
  return res.status(200).json({ message: "Labs fetched successfully", labs });
};

//------------------------ search for lab ----------------------

export const searchForLab = async (req, res, next) => {
  const { name, location,phone } = req.query;
  if (!location && !name && !phone) {
    return next(new AppError("Please provide data to be searched for", 404));
  }
  let searchCriteria = {};

  if (name) searchCriteria.name = { $regex: name, $options: "i" };
  if (location) searchCriteria.location = { $regex: location, $options: "i" };
  if (phone) searchCriteria.phone = phone

  let lab = await labModel.find(searchCriteria).select('-__v');

  if (!lab || lab.length == 0)
    return next(
      new AppError("No labs found matching the search criteria", 404)
    );

  return res.status(200).json({ message: "Labs search successful", lab });
};

//-------------------------- delete lab --------------------------

export const deleteLab = async (req, res, next) => {
  const { id } = req.params;

  let lab = await labModel.findByIdAndDelete(id);

  if (!lab || lab.length == 0) return next(new AppError("Lab not found", 404));

  return res.status(200).json({ message: "Lab deleted successfully" });
};

//------------------------- update lab ---------------------------

export const updateLab = async (req, res, next) => {
  const { location, name, phone } = req.body;
  const { id } = req.params;

  if (!location && !name && !phone) {
    return next(new AppError("Please provide data to be updated", 404));
  }

  let lab = await labModel.findById(id);
  if (!lab) return next(new AppError("Lab not found", 404));

  // Array to store error messages
  const errorMessages = [];

  if (name && name !== lab.name) {
    const existingLabName = await labModel.findOne({ name });
    if (existingLabName) {
      errorMessages.push("Lab with this name already exists");
    }
  }
  
  if (phone && phone !== lab.phone) {
    const existingPhone = await labModel.findOne({ phone });
    if (existingPhone) {
      errorMessages.push("Lab with this phone number already exists");
    }
  }

  // If there are any error messages, return them
  if (errorMessages.length > 0) {
    return next(new AppError(errorMessages, 409));
  }

  let updatedLab = await labModel.findByIdAndUpdate(
    id,
    { location, name, phone },
    { new: true }
  ).select('-__v');
  return res.status(200).json({ message: "Lab updated successfully", updatedLab });
};

