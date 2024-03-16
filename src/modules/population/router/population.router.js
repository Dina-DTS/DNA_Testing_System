import { Router } from "express";
import { validate } from "../../../middlewares/validate.middleware.js";
import { autherize,authenticate } from "../../../middlewares/auth.middleware.js";
import { AddPopulationSchema, AddPopulationlQuery, updatePopulationQuery, updatePopulationSchema} from "../validation/population.validation.js";
// import {  updatePopulationQuery, updatePopulationSchema} from "../validation/population.validation.js";
import { asyncHandler } from "../../../middlewares/asyncHandler.js";
import { addPopulation, getAllPopulation, identification, identificationByDNA, updatePopulation } from "../controller/population.controller.js";
import getTextFileUploadMiddleware from "../../../middlewares/upload.js";
const router=Router()

router.post("/addpopulation",authenticate,autherize('technical'),getTextFileUploadMiddleware(),validate(AddPopulationSchema,AddPopulationlQuery),asyncHandler(addPopulation))

// import upload from "../../../middlewares/fileUpload.middleware.js";


// router.post('/add',authenticate,autherize('technical'),validate(AddPopulationSchema,AddPopulationlQuery), upload.single('file'),asyncHandler(addPopulation));

router.get('/getAllPopulation',authenticate,autherize('admin'),asyncHandler(getAllPopulation))
router.get('/identification',authenticate,autherize('admin','technical'),asyncHandler(identification))
router.post('/identificationByDNA',authenticate,autherize('admin','technical'),getTextFileUploadMiddleware(),asyncHandler(identificationByDNA))
router.put('/updatePopulation/:id',authenticate,autherize('admin'),getTextFileUploadMiddleware(),validate(updatePopulationSchema,updatePopulationQuery),asyncHandler(updatePopulation))
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// router.post('/addpopulationn',authenticate,autherize('technical'),getTextFileUploadMiddleware(),validate(AddPopulationnSchema,AddPopulationnlQuery), asyncHandler(addPopulationn));
// router.put('/updatePopulationn/:id',authenticate,autherize('admin'),getTextFileUploadMiddleware(),validate(updatePopulationSchema,updatePopulationQuery), asyncHandler(updatePopulationn));
// router.post('/identificationByDNAA',authenticate,autherize('admin','technical'),getTextFileUploadMiddleware(),asyncHandler(identificationByDNAA))




export default router