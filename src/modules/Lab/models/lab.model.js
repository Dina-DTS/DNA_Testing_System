import mongoose from "mongoose";
// Define the Lab Schema
const labSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique:true
  },

  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },

},{timestamps:true});


// Create a model from the schema
const labModel = mongoose.model('lab', labSchema);

// Export the Lab model
export default labModel