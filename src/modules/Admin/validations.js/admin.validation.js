import Joi from 'joi'

export const signinSchema = Joi.object({
	body:{
	email: Joi.string().email().trim().required().lowercase(),
	password: Joi.string().required().trim().min(3).max(10),},
	params:{}

})
export const signinQuery = Joi.object({});
