import CryptoJS from "crypto-js";
import { AppError } from "../../../../utilies/error.handler.js";
import populationModel from "../models/population.model.js";
import dotenv from "dotenv"
dotenv.config()

const encryptionKey = process.env.ENCRYPTION_KEY;

//------------------------- add population -------------------------

// export const addPopulation = async (req, res, next) => {
//     const { DNA_sequence, name, address, national_id, phone, gender, birthdate, bloodType, status, description } = req.body;

//     // Array to store error messages
//     const errorMessages = [];

//     // Retrieve all existing entries with a non-null DNA sequence
//     const existingEntries = await populationModel.find({ DNA_sequence: { $ne: null, $exists: true } });

//     // Check if any existing DNA sequence matches the entered DNA sequence
//     const isDuplicateDNA = existingEntries.some(existingEntry => {
//         const decryptedSequence = CryptoJS.AES.decrypt(existingEntry.DNA_sequence, encryptionKey).toString(CryptoJS.enc.Utf8);
//         return decryptedSequence === DNA_sequence;
//     });

//     if (isDuplicateDNA) {
//         errorMessages.push('DNA sequence already exists in the database');
//     }

//     if (national_id) {
//         const existingPopulationNational_id = await populationModel.findOne({ national_id });
//         if (existingPopulationNational_id) {
//             errorMessages.push('This National ID already exists in the database');
//         }
//     }

//     if (phone) {
//         const existingPopulationPhone = await populationModel.findOne({ phone });
//         if (existingPopulationPhone) {
//             errorMessages.push('This phone number already exists in the database');
//         }
//     }

//     // If there are any error messages, return them
//     if (errorMessages.length > 0) {
//         return next(new AppError(errorMessages, 409));
//     }

//     // Encrypt the DNA sequence before storing
//     const encryptedSequence = CryptoJS.AES.encrypt(DNA_sequence, encryptionKey).toString();

//     // Create a new population entry
//     const populationEntry = new populationModel({
//         lab_id: req.user.lab_id,
//         technical_id: req.user.id,
//         DNA_sequence: encryptedSequence,
//         name,
//         address,
//         national_id,
//         phone,
//         gender,
//         birthdate,
//         bloodType,
//         status,
//         description
//     });

//     // Save the new population entry to the database
//     const savedEntry = await populationEntry.save();

//     // Respond with the saved entry
//     res.status(201).json({ message: 'Population entry added successfully', person: savedEntry });
// };


//////////////////////////////////////////////////////////////////////////////////////////////////////////
export const addPopulation = async (req, res, next) => {
  const { DNA_sequence, name, address, national_id, phone, gender, birthdate, bloodType, status, description } = req.body;

  // Array to store error messages
  const errorMessages = [];

  // Retrieve all existing entries with a non-null DNA sequence
  const existingEntries = await populationModel.find({ DNA_sequence: { $ne: null, $exists: true } });

  // Check if any existing DNA sequence matches the entered DNA sequence
  const isDuplicateDNA = existingEntries.some(existingEntry => existingEntry.DNA_sequence === DNA_sequence);

  if (isDuplicateDNA) {
      errorMessages.push('DNA sequence already exists in the database');
  }

  if (national_id) {
      const existingPopulationNational_id = await populationModel.findOne({ national_id });
      if (existingPopulationNational_id) {
          errorMessages.push('This National ID already exists in the database');
      }
  }

  if (phone) {
      const existingPopulationPhone = await populationModel.findOne({ phone });
      if (existingPopulationPhone) {
          errorMessages.push('This phone number already exists in the database');
      }
  }

  // If there are any error messages, return them
  if (errorMessages.length > 0) {
      return next(new AppError(errorMessages, 409));
  }

  // Create a new population entry
  const populationEntry = new populationModel({
      lab_id: req.user.lab_id,
      technical_id: req.user.id,
      DNA_sequence,
      name,
      address,
      national_id,
      phone,
      gender,
      birthdate,
      bloodType,
      status,
      description
  });

  // Save the new population entry to the database
  const savedEntry = await populationEntry.save();

  // Respond with the saved entry
  res.status(201).json({ message: 'Population entry added successfully', person: savedEntry });
};


//---------------------------------- get all population -----------------------------

 export const getAllPopulation=async(req,res,next)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Assuming you're using Mongoose to interact with MongoDB

let population = await populationModel.find().skip(skip).limit(limit).select('-__v');

     if(!population||population.length==0) return next(new AppError('No population found',404))
     return res.status(200).json({message:"Population fetched successfully",population})
 } 

//--------------------------------- search for population ---------------------------

export const identification = async (req, res, next) => {
    const { phone, status, description, national_id, address, lab_id, technical_id } = req.query;

    if (!address && !national_id && !phone && !status && !description && !lab_id && !technical_id) {
        return next(new AppError("Please provide data to be searched for", 404));
    }

    // Create a search schema based on the provided query parameters
    let searchSchema = {};
    if (technical_id) searchSchema.technical_id = technical_id;
    if (lab_id) searchSchema.lab_id = lab_id;
    if (phone) searchSchema.phone = phone;
    if (status) searchSchema.status = { $regex: status, $options: 'i' };
    if (address) searchSchema.address = { $regex: address, $options: 'i' };
    if (description) searchSchema.description = { $regex: description, $options: 'i' };
    if (national_id) searchSchema.national_id = national_id;

    // Determine which fields to exclude based on the user's role
    let fieldsToExclude = {};
    if (req.user.role === 'technical') {
        // If the user is a technical user, exclude lab_id and technical_id
        fieldsToExclude = { lab_id: 0, technical_id: 0 };
    }

    // Fetch population data based on the search schema and excluded fields
    let population = await populationModel.find(searchSchema, fieldsToExclude).select('-__v');

    if (!population || population.length === 0) {
        return next(new AppError("No population found matching your search criteria", 404));
    }

    return res.status(200).json({ message: "Population fetched successfully", population });
};

//--------------------------------- identification by DNA ---------------------------

export const identificationByDNA = async (req, res, next) => {
  const { DNA_sequence } = req.body;

  if (!DNA_sequence) {
    return next(new AppError("Please provide DNA sequence to be searched for", 404));
  }

  const existingEntries = await populationModel.find({ DNA_sequence: { $ne: null, $exists: true } }).select('-__v');

  // Check if any existing DNA sequence matches the entered DNA sequence
  const duplicateEntry = existingEntries.find(existingEntry => {
    const decryptedSequence = CryptoJS.AES.decrypt(existingEntry.DNA_sequence, encryptionKey).toString(CryptoJS.enc.Utf8);
    return decryptedSequence === DNA_sequence;
  });

  if (!duplicateEntry) {
    return next(new AppError("No population found matching your search criteria", 404));
  }

  // Assuming role information is accessible via req.user.role
  const { role } = req.user;

  if (role === "admin") {
    // Admin can access all data
    const { DNA_sequence, ...personData } = duplicateEntry.toObject();
    return res.status(200).json({ message: "Population fetched successfully", personData });
  } else if (role === "technical") {
    // Technical role excludes lab_id, technical_id, and DNA_sequence
    const { lab_id, technical_id, DNA_sequence, ...personData } = duplicateEntry.toObject();
    return res.status(200).json({ message: "Population fetched successfully", personData });
  } else {
    // Other roles don't have access
    return next(new AppError("You don't have permission to access this data", 403));
  }}
//-------------------------------- update population ------------------------------

export const updatePopulation = async (req, res, next) => {
    const { name, address, national_id, phone, gender, birthdate, bloodType, status, description, DNA_sequence } = req.body;
    const { id } = req.params;
  
    // Array to store error messages
    const errorMessages = [];
  
    if (!name && !address && !national_id && !phone && !gender && !birthdate && !bloodType && !status && !description && !DNA_sequence) {
      errorMessages.push("Please provide data to be updated");
    }
  
    // Check if the person with the provided ID exists
    let person = await populationModel.findById(id);
    if (!person) {
      errorMessages.push("Person with the provided ID is not found");
    }
  
    // If there are any error messages, return them
    if (errorMessages.length > 0) {
      return next(new AppError(errorMessages.join(', '), 404));
    }
  
    if (national_id && national_id !== person.national_id) {
      let existingNationalID = await populationModel.findOne({ national_id });
      if (existingNationalID) {
        errorMessages.push('This national id already exists');
      }
    }
  
    if (phone && phone !== person.phone) {
      let existingPhone = await populationModel.findOne({ phone });
      if (existingPhone) {
        errorMessages.push('This phone number already exists');
      }
    }
  
    if (DNA_sequence && DNA_sequence !== person.DNA_sequence) {
      // Retrieve all existing entries with a non-null DNA sequence
      const existingEntries = await populationModel.find({ DNA_sequence: { $ne: null, $exists: true } });
  
      // Check if any existing DNA sequence matches the entered DNA sequence
      const isDuplicateDNA = existingEntries.some(existingEntry => {
        const decryptedSequence = CryptoJS.AES.decrypt(existingEntry.DNA_sequence, encryptionKey).toString(CryptoJS.enc.Utf8);
        return decryptedSequence === DNA_sequence;
      });
  
      if (isDuplicateDNA) {
        errorMessages.push('DNA sequence already exists in the database');
      }
    }
  
    // If there are any error messages, return them
    if (errorMessages.length > 0) {
      return next(new AppError(errorMessages.join(', '), 409));
    }
  
    // Encrypt the DNA sequence before storing
    const encryptedSequence = CryptoJS.AES.encrypt(DNA_sequence, encryptionKey).toString();
  
    let updated;
    try {
      updated = await populationModel.findByIdAndUpdate(
        id,
        { name, address, national_id, phone, gender, birthdate, bloodType, status, description, DNA_sequence: encryptedSequence },
        { new: true }
      ).select('-__v');
    } catch (error) {
      return next(new AppError("Error updating population record", 500));
    }
  
    // Check if updated is null (no document found with the provided ID)
    if (!updated) {
      return next(new AppError(`Person with the provided ID isn't found`, 404));
    }
  
    return res.status(200).json({ message: "Population record updated successfully", updated });
  };
 