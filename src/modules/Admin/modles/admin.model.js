import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    default:"admin@gmail.com",
    unique:true
  },
  password: {
    type: String,
    required: true,
    default:"1234"
  },
  username: {
    type: String,
    default:"admin"
  },
  phone: {
    type: String,
    default:"01205631841",
    unique:true
  },
  role:{
    type: String,
    enum: ["admin", "technical"],
    default:"admin",
  }
},{timestamps:true});

// Create a model from the schema
const adminModel = mongoose.model('admin', adminSchema);

// Export the Admin model
export default adminModel