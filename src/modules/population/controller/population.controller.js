import CryptoJS from "crypto-js";
import { AppError } from "../../../../utilies/error.handler.js";
import populationModel from "../models/population.model.js";
import dotenv from "dotenv";
//built in in JS//
import crypto from 'crypto';
dotenv.config();

const encryptionKey = process.env.ENCRYPTION_KEY;

////////////////////////////////////////add population final ان شاء الله/////////////////////////////////////

// Encryption key for AES encryption (replace 'ENCRYPTION_KEY' with your actual encryption key)
const ENCRYPTION_KEYy = crypto.createHash('sha256').update(process.env.ENCRYPTION_KEY).digest('base64').substr(0, 32);

// Fixed IV for AES encryption
const IV = Buffer.from('0123456789abcdef'); // Example IV, replace with your own

export const adddPopulation = async (req, res, next) => {
    const { DNA_sequence, name, address, national_id, phone, gender, birthdate, bloodType, status, description } = req.body;

    // Array to store error messages
    const errorMessages = [];

    // Encrypt the entered DNA sequence
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEYy), IV);
    let encryptedSequence = cipher.update(DNA_sequence, 'utf8', 'hex');
    encryptedSequence += cipher.final('hex');

    // Check if the encrypted DNA sequence already exists in the database
    const existingEntry = await populationModel.findOne({ DNA_sequence: encryptedSequence });
    if (existingEntry) {
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
        DNA_sequence: encryptedSequence,
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
    res.status(201).json({ message: 'Population entry added successfully',statusCode:201, person: savedEntry });
};
////////////////////////////////////// test final update////////////////////////////////

export const updatePopulation = async (req, res, next) => {
  const ENCRYPTION_KEYy = crypto.createHash('sha256').update(process.env.ENCRYPTION_KEY).digest('base64').substr(0, 32);
  const IV = Buffer.from('0123456789abcdef');

  const {
      name,
      address,
      national_id,
      phone,
      gender,
      birthdate,
      bloodType,
      status,
      description,
      DNA_sequence
  } = req.body;
  const { id } = req.params;

  // Array to store error messages
  const errorMessages = [];

  if (
      !name &&
      !address &&
      !national_id &&
      !phone &&
      !gender &&
      !birthdate &&
      !bloodType &&
      !status &&
      !description &&
      !DNA_sequence
  ) {
      errorMessages.push("Please provide data to be updated");
  }

  // Check if the person with the provided ID exists
  let person;
  try {
      person = await populationModel.findById(id);
  } catch (error) {
      return next(new AppError("Error finding population record", 500));
  }

  if (!person) {
      errorMessages.push("Person with the provided ID is not found");
  }

  // Check if the provided phone, national_id, or DNA_sequence already exist for other persons
  if (phone && phone !== person.phone) {
      const existingPhone = await populationModel.findOne({ phone });
      if (existingPhone) {
          errorMessages.push('This phone number already exists for another person');
      }
  }

  if (national_id && national_id !== person.national_id) {
      const existingNationalId = await populationModel.findOne({ national_id });
      if (existingNationalId) {
          errorMessages.push('This National ID already exists for another person');
      }
  }

  // If there are any error messages, return them
  if (errorMessages.length > 0) {
      return next(new AppError(errorMessages.join(", "), 404));
  }

  // Validate and update fields if provided
  const updatedFields = {};
  if (name) updatedFields.name = name;
  if (address) updatedFields.address = address;
  if (national_id) updatedFields.national_id = national_id;
  if (phone) updatedFields.phone = phone;
  if (gender) updatedFields.gender = gender;
  if (birthdate) updatedFields.birthdate = birthdate;
  if (bloodType) updatedFields.bloodType = bloodType;
  if (status) updatedFields.status = status;
  if (description) updatedFields.description = description;

  if (DNA_sequence && DNA_sequence !== person.DNA_sequence) {
      // Encrypt the provided DNA sequence for comparison
      const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEYy), IV);
      let encryptedSequence = cipher.update(DNA_sequence, 'utf8', 'hex');
      encryptedSequence += cipher.final('hex');

      // Check if the encrypted DNA sequence already exists for another person
      const existingDNASequence = await populationModel.findOne({ DNA_sequence: encryptedSequence });
      if (existingDNASequence) {
          errorMessages.push('This DNA sequence already exist');
      } else {
          // Update the DNA_sequence only if it's unique
          updatedFields.DNA_sequence = encryptedSequence;
      }
  }

  // If there are any error messages, return them
  if (errorMessages.length > 0) {
      return next(new AppError(errorMessages.join(", "), 409));
  }

  let updated;
  try {
      updated = await populationModel
          .findByIdAndUpdate(
              id,
              updatedFields,
              { new: true }
          )
          .select("-__v");
  } catch (error) {
      return next(new AppError("Error updating population record", 500));
  }

  // Check if updated is null (no document found with the provided ID)
  if (!updated) {
      return next(new AppError(`Person with the provided ID isn't found`, 404));
  }

  return res
      .status(200)
      .json({ message: "Population record updated successfully", statusCode: 200, updated });
};
//---------------------------------- get all population -----------------------------

export const getAllPopulation = async (req, res, next) => {

  let population = await populationModel
    .find()
    .select("-__v");

  if (!population || population.length == 0)
    return next(new AppError("No population found", 404));
  return res
    .status(200)
    .json({ message: "Population fetched successfully",statusCode:200,population });
};

//--------------------------------- search with normal data for population ---------------------------

export const identification = async (req, res, next) => {
  const {
  
    phone,
    status,
    description,
    national_id,
    address,
    lab_id,
    technical_id,
  } = req.query;

  if (
    !address &&
    !national_id &&
    !phone &&
    !status &&
    !description &&
    !lab_id &&
    !technical_id
  ) {
    return next(new AppError("Please provide data to be searched for", 404));
  }

  // Create a search schema based on the provided query parameters
  let searchSchema = {};
  if (technical_id) searchSchema.technical_id = technical_id;
  if (lab_id) searchSchema.lab_id = lab_id;
  if (phone) searchSchema.phone = phone;
  if (status) searchSchema.status = { $regex: status, $options: "i" };
  if (address) searchSchema.address = { $regex: address, $options: "i" };
  if (description)
    searchSchema.description = { $regex: description, $options: "i" };
  if (national_id) searchSchema.national_id = national_id;

  // Determine which fields to exclude based on the user's role
  let fieldsToExclude = {};
  if (req.user.role === "technical") {
    // If the user is a technical user, exclude lab_id and technical_id
    fieldsToExclude = { lab_id: 0, technical_id: 0 };
  }

  // Fetch population data based on the search schema and excluded fields
  let population = await populationModel
    .find(searchSchema, fieldsToExclude)
    .select("-__v");

  if (!population || population.length === 0) {
    return next(
      new AppError("No population found matching your search criteria", 404)
    );
  }

  return res
    .status(200)
    .json({ message: "Population fetched successfully",statusCode:200, population });
};


////////////////////////// final search by dna ///////////////////////////////////

export const identificationByDNA = async (req, res, next) => {
const ENCRYPTION_KEYy = crypto.createHash('sha256').update(process.env.ENCRYPTION_KEY).digest('base64').substr(0, 32);
const IV = Buffer.from('0123456789abcdef');

  const { DNA_sequence } = req.body;

  if (!DNA_sequence) {
    return next(
      new AppError("Please provide DNA sequence to be searched for", 404)
    );
  }

  // Encrypt the entered DNA sequence for comparison
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEYy), IV);
  let encryptedSequence = cipher.update(DNA_sequence, 'utf8', 'hex');
  encryptedSequence += cipher.final('hex');

  const existingEntries = await populationModel
    .find({ DNA_sequence: { $ne: null, $exists: true } })
    .select("-__v");

  // Check if any existing DNA sequence matches the entered DNA sequence
  const duplicateEntry = existingEntries.find((existingEntry) => {
    return existingEntry.DNA_sequence === encryptedSequence;
  });

  if (!duplicateEntry) {
    return next(
      new AppError("No population found matching your search criteria", 404)
    );
  }

  // Assuming role information is accessible via req.user.role
  const { role } = req.user;

  if (role === "admin") {
    // Admin can access all data
    const { DNA_sequence, ...personData } = duplicateEntry.toObject();
    return res
      .status(200)
      .json({ message: "Population fetched successfully",statusCode:200, personData });
  } else if (role === "technical") {
    // Technical role excludes lab_id, technical_id, and DNA_sequence
    const { lab_id, technical_id, DNA_sequence, ...personData } =
      duplicateEntry.toObject();
    return res
      .status(200)
      .json({ message: "Population fetched successfully",statusCode:200, personData });
  } else {
    // Other roles don't have access
    return next(
      new AppError("You don't have permission to access this data", 403)
    );
  }
};

////////////////////////// eisa api /////////////////

export const getAllPopulationDecrypted = async (req, res, next) => {
  try {
    // Ensure encryption key is exactly 32 byte
    const ENCRYPTION_KEY = crypto.createHash('sha256').update(process.env.ENCRYPTION_KEY).digest('base64').substr(0, 32);
    const IV = Buffer.from('0123456789abcdef');
    // Fetch all population data
    let population = await populationModel.find({}, '-__v');

    if (!population || population.length === 0) {
      return next(new AppError('No population found', 404));
    }

    // Decrypt the DNA sequence for each population entry
    population.forEach((entry) => {
      try {
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), IV);
        let decryptedSequence = decipher.update(entry.DNA_sequence, 'hex', 'utf8');
        decryptedSequence += decipher.final('utf8');
        entry.DNA_sequence = decryptedSequence;
      } catch (decryptionError) {
        console.error(`Error decrypting DNA sequence for entry ID ${entry._id}:, decryptionError.message`);
        entry.DNA_sequence = 'Decryption failed';
      }
    });
    res.status(200).json({ message: 'Population fetched successfully', statusCode: 200, population });
  } catch (error) {
    console.error('Error fetching population data:', error);
    next(new AppError('Error fetching population data', 500));
  }
};