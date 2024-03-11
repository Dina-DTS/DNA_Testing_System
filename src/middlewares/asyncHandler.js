import { AppError } from "../../utilies/error.handler.js"

export const asyncHandler=(fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(err=>{
            return next(new AppError(err,401))
        })
        }
    }


export const globalErrorHandling=(err, req, res, next)=>{
        const { message, statusCode, stack } = err
        res.status(statusCode || 500).json({
            message,
            statusCode,
            ...(process.env.MODE === 'development'),
        }) 
}
