import Joi from 'joi';

export const addLabBodySchema = Joi.object({
  body: {
  location: Joi.string().trim().required().min(2).max(100).lowercase(),
  name: Joi.string().trim().required().min(2).max(100).lowercase(),
  phone: Joi.string().trim().required().regex(/^(010|011|012|015)[0-9]{8}$/), 
  },
  params: {},

});

export const updateLabBodySchema = Joi.object({
  body: {
    location: Joi.string().trim().min(2).max(100).lowercase(),
    name: Joi.string().trim().min(2).max(100).lowercase(),
    phone: Joi.string().trim().regex(/^(010|011|012|015)[0-9]{8}$/),
  },
  params:{id: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/)},
});
  

export const deleteLabBodySchema = Joi.object({
  body: {
    
  },
  params:{ id: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/)}
 
});

export const addLabQuerySchema = Joi.object({});
export const updateLabQuerySchema = Joi.object({});
export const deleteLabQuerySchema=Joi.object({});


