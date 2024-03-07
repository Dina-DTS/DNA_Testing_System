import Joi from "joi";

export const addtechnicalBodySchema = Joi.object({
  body: {
    email: Joi.string().email().trim().required().lowercase(),
    password: Joi.string().required().trim().min(3).max(10),
    username: Joi.string().required().trim().min(2).max(30).lowercase(),
    phone: Joi.string().required().regex(/^(010|011|012|015)[0-9]{8}$/).trim(),
    nationalId: Joi.string().required()
    .pattern(/^[0-9]{14}$/).trim()
    .message('National ID must be a 14-digit number'),
    lab_id: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/),
   
  },
  params:{},
});

export const addtechnicalQuerySchema=Joi.object({});

export const updatetechnicalSchema = Joi.object({
  body: {
    email: Joi.string().email().trim().lowercase(),
    password: Joi.string().trim().min(3).max(10),
    username: Joi.string().trim().min(2).max(30).lowercase(),
    phone: Joi.string().regex(/^(010|011|012|015)[0-9]{8}$/).trim(),
    nationalId: Joi.string()
    .pattern(/^[0-9]{14}$/).trim()
    .message('National ID must be a 14-digit number'),
    lab_id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  },
  params:{id: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/)},
});

export const updatetechnicalQuery=Joi.object({});



export const deletetechnicalSchema = Joi.object({
  body: {
    
  },
  params:{ id: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/)}
 
});

export const deletetechnicalQuery=Joi.object({});




export const signintechnicalSchema = Joi.object({
	body: {
    email: Joi.string().email().trim().required().lowercase(),
    password: Joi.string().required().trim().min(3).max(10),
	},
	params: {},
})
export const signintechnicalQuery = Joi.object({});


