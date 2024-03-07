import { Router } from "express";
import {  addadmin ,signin } from "../controlles/admin.controller.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import { signinSchema,signinQuery } from "../validations.js/admin.validation.js";
import { asyncHandler } from "../../../middlewares/asyncHandler.js";


const router=Router()

router.post("/addadmin",asyncHandler(addadmin))
router.post("/signin",validate(signinSchema,signinQuery),asyncHandler(signin))


export default router