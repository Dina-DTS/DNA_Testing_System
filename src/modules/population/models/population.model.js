import mongoose from "mongoose";


// Define the Population Schema
const populationSchema = new mongoose.Schema({
  lab_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'lab',
    required: true
  },
  technical_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'labTechnical',
    required: true
  },
  DNA_sequence: {
    type: String,
    required: true,
    unique:true
  },
  name: {
    type: String,
  },
  address: {
    type: String,
  },
  national_id: {
    type: String,
  
  },
  phone: {
    type: String,
    unique:true
  },
  gender: {
    type: String,
  },
  birthdate: {
    type: Date,
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  status: {
    type: String, 
    enum: ['crime', 'disaster', 'missing','acknowledged'],
    required:true
  },
  description: {
    type: String,
    required: true
  },

},{timestamps:true});

// Create a model from the schema
const populationModel = mongoose.model('population', populationSchema);

// populationModel.collection.createIndex({ DNA_sequence: 1 }, { unique: true })
   
// Export the Population model
export default populationModel