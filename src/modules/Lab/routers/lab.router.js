import { Router } from "express";
import { validate } from "../../../middlewares/validate.middleware.js";
import { addLab, deleteLab, getAllLabs, searchForLab, updateLab } from "../controlles/lab.controller.js";
import { autherize,authenticate } from "../../../middlewares/auth.middleware.js";
import { addLabBodySchema,addLabQuerySchema, deleteLabBodySchema, deleteLabQuerySchema, updateLabBodySchema, updateLabQuerySchema } from "../validations/lab.validation.js";
import { asyncHandler } from "../../../middlewares/asyncHandler.js";


const router=Router()
router.post("/addlab",authenticate,autherize('admin'),validate(addLabBodySchema,addLabQuerySchema),asyncHandler(addLab))
router.get('/labs',authenticate,autherize('admin'),asyncHandler(getAllLabs))
router.get('/lab',authenticate,autherize('admin'),asyncHandler(searchForLab))
router.delete('/deletelab/:id',authenticate,autherize('admin'),validate(deleteLabBodySchema,deleteLabQuerySchema),asyncHandler(deleteLab))
router.put('/updatelab/:id',authenticate,autherize('admin'),validate(updateLabBodySchema,updateLabQuerySchema),asyncHandler(updateLab))

export default router