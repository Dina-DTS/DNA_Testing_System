
import mongoose from "mongoose";


// Define the LabTechnical Schema
const labTechnicalSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }, 
  username: {
    type: String,
  },
  phone: {
    type: String,
    required: true
  },
  nationalId: {
    type: String,
    required: true,
    unique: true
  },
  role:{
    type: String,
    required: true,
    default:"technical"
  },
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'admin', required: true },
  lab_id: { type: mongoose.Schema.Types.ObjectId, ref: 'lab', required: true },

},{timestamps:true});

// Create a model from the schema
const labTechnicalModel = mongoose.model('labTechnical', labTechnicalSchema);


// Export the LabTechnical model
 export default labTechnicalModel