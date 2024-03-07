import { Router } from "express";
import { validate } from "../../../middlewares/validate.middleware.js";
import { autherize,authenticate } from "../../../middlewares/auth.middleware.js";
import { addTechnical, deletetechnical, getAllTechnicals, searchTechnical, signInTechnical, updatetechnical } from "../controllers/technical.controller.js";
import { addtechnicalBodySchema,addtechnicalQuerySchema, deletetechnicalQuery, deletetechnicalSchema, signintechnicalQuery, signintechnicalSchema, updatetechnicalQuery, updatetechnicalSchema } from "../validations/technical.validation.js";



const router=Router()
router.post("/addtechnical",authenticate,autherize('admin'),validate(addtechnicalBodySchema,addtechnicalQuerySchema),addTechnical)
router.put("/updatetechnical/:id",authenticate,autherize('admin'),validate(updatetechnicalSchema,updatetechnicalQuery),updatetechnical)
router.delete("/deletetechnical/:id",authenticate,autherize('admin'),validate(deletetechnicalSchema,deletetechnicalQuery),deletetechnical)
router.get("/getTechnicals",authenticate,autherize('admin'),getAllTechnicals)
router.get("/getTechnical",authenticate,autherize('admin'),searchTechnical)
router.post("/signintechnical",validate(signintechnicalSchema,signintechnicalQuery),signInTechnical)

export default router