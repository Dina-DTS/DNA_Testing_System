import Joi from "joi";
export const AddPopulationSchema = Joi.object({
  body: {
    DNA_sequence: Joi.string().trim().required(),
    name: Joi.string().trim().max(30).lowercase(),
    address: Joi.string().trim().max(255).lowercase(),
    national_id: Joi.string()
      .trim()
      .pattern(/^[0-9]{14}$/)
      .message("National ID must be a 14-digit number"),
    phone: Joi.string()
      .trim()
      .regex(/^(010|011|012|015)[0-9]{8}$/)
      .trim(),
    gender: Joi.string().trim().valid("male", "female").lowercase(),
    birthdate: Joi.date(),
    bloodType: Joi.string()
      .valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
      .trim(),
    status: Joi.string()
      .valid("crime", "disaster", "missing", "acknowledged")
      .required()
      .lowercase(),
    description: Joi.string().trim().required().max(1000).lowercase(),
  },
  params: {},
});
export const AddPopulationlQuery = Joi.object({});

export const updatePopulationSchema = Joi.object({
  body: {
    DNA_sequence: Joi.string().trim(),
    name: Joi.string().trim().max(30).lowercase(),
    address: Joi.string().trim().max(255).lowercase(),
    national_id: Joi.string()
      .trim()
      .pattern(/^[0-9]{14}$/)
      .message("National ID must be a 14-digit number"),
    phone: Joi.string()
      .trim()
      .regex(/^(010|011|012|015)[0-9]{8}$/)
      .trim(),
    gender: Joi.string().trim().valid("male", "female").lowercase(),
    birthdate: Joi.date(),
    bloodType: Joi.string()
      .valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
      .trim(),
    status: Joi.string()
      .valid("crime", "disaster", "missing", "acknowledged")
      .lowercase(),
    description: Joi.string().trim().max(1000).lowercase(),
  },
  params: {
    id: Joi.string()
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/),
  },
});

export const updatePopulationQuery = Joi.object({});

// Updated Schema



//////////////////////////////////////////////////////////////////////////////////////////////////////////
export const AddPopulationnSchema = Joi.object({
  body: {
    DNA_sequence:Joi.string(),
    name: Joi.string().trim().max(30).lowercase(),
    address: Joi.string().trim().max(255).lowercase(),
    national_id: Joi.string()
      .trim()
      .pattern(/^[0-9]{14}$/)
      .message("National ID must be a 14-digit number"),
    phone: Joi.string()
      .trim()
      .regex(/^(010|011|012|015)[0-9]{8}$/),
    gender: Joi.string().trim().valid("male", "female").lowercase(),
    birthdate: Joi.date(),
    bloodType: Joi.string()
      .valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
      .trim(),
    status: Joi.string()
      .valid("crime", "disaster", "missing", "acknowledged")
      .required()
      .lowercase(),
    description: Joi.string().trim().required().max(1000).lowercase(),
  },
  params: {},
});

export const AddPopulationnlQuery = Joi.object({});
