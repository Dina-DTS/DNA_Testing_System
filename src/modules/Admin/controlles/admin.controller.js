import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import adminModel from "../modles/admin.model.js"
import { AppError } from '../../../../utilies/error.handler.js'


export const addadmin=async(req,res,next)=>{
    const{email}=req.body
    let ExistingAdmin= await adminModel.findOne({email})
    
    if(ExistingAdmin) return next(new AppError("Admin with this email already exists",409))

	const hashed = bcrypt.hashSync(req.body.password, +process.env.SALT)
    req.body.password=hashed

    let admin= await adminModel.insertMany(req.body)
    return res.status(201).json({message:'Admin added successfully',admin})

}

///////////////////////////////////////////////////////////////////

export const signin = async (req, res,next) => {
    const { email, password } = req.body;
  
    // Validate request body
    if (!email || !password ) {
     return next(new AppError("Email and password are required", 400));
    }
  
    // Check if the technical personnel exists with the provided email
   
    const user = await adminModel.findOne({ email });
    if (!user) {
      return next( new AppError("Invalid email or password", 401));
    }
    
    // Verify password
    if(password){
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return next(new AppError("Invalid email or password", 401)) ;
    }}
  
    // Generate JWT token
    const token = jwt.sign( { email: user.email, id: user._id, role: user.role},
      process.env.SECRET,{ expiresIn: '5h' });
  
    return res.status(200).json({
      message: 'Sign in successfully',
      token,
    });
  };
  