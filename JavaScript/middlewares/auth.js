import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'
import ErrorHandler from '../utils/errorHandler.js'
import asyncErrorHandler from './asyncErrorHandler.js`'

export const isAuthenticatedUser = asyncErrorHandler(async(req,res,next) => {
    const {token} = req.cookies
    if(!token){
        return next(new ErrorHandler("Token Not Found", 402))
    }
    const decodeData = jwt.verify(token, process.env.JWT_SECREATE)
    req.user = userModel.findById(decodeData.id) 
    next()
})

export const authorizeRoles = (...roles) =>{
    return (req,res,next) =>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed`, 403));
        }
    }
}