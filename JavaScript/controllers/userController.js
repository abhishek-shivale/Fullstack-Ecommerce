import userModel from '../models/userModel.js'
import sendEmail from "../utils/sendEmail.js"; 
import ErrorHandler from '../utils/errorHandler.js';
import sendToken from "../utils/sendToken.js";
import asyncErrorHandler from "../middlewares/asyncErrorHandler.js"
import crypto from "crypto"
import cloudinary from 'cloudinary'
 
export const registerUser = asyncErrorHandler(async(req,res,next)=>{
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avater,{
        folder: "avatars",
        width: 150,
        crop: "scale",
    })
    const {name,email,gender,password} = req.body
    const user = new userModel.create({
        name,
        email,
        gender,
        password,
        avater:{
            public_id : myCloud.public_id,
            url : myCloud.url
        }
    })
    sendToken(user,201,res)
})

export const loginUser = asyncErrorHandler(async(req,res,next)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return next(new ErrorHandler("please Enter Email and Password",400))
    }
    const user = await userModel.findOne({email}).select("+password")
    if(!user){
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password",401))
    }
    sendToken(user, 201, res)
})

export const logoutUser = asyncErrorHandler(async(req,res,next)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly: true,
    })
    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
})

export const getUserDetails = asyncErrorHandler(async(req,res,next)=>{
    const user = await userModel.findOne(req.user.id) 
    res.status(200).json({
        success: true,
        user
    })  
})

export const forgotPassword = asyncErrorHandler(async(req,res,next)=>{
    const user = await userModel.findOne({email: req.body.email})
    if(!user){
        return next(new ErrorHandler("User ot Found", 404));
    }
    const resetToken = await user.getResetPasswordToken()

    await user.save({validateBeforeSave: false})
    const resetPasswordUrl = `https://${req.get("host")}/password/reset/${resetToken}`
    try {
        await sendEmail({
            email: user.email,
            templateId: process.env.SENDGRID_RESET_TEMPLATEID,
            data:{
                reset_url: resetPasswordUrl
            }
        })
        res.status(200).json({
            success: true,
            message: `Email set to ${user.email} successfully`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500))
    }
})

export const resetPassword = asyncErrorHandler(async(req,res,next)=>{
    const resetPasswordToken = crypto.createHash("sh256").update(req.params.token).digest("hex")

    const user = await userModel.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    })
    if(!user){
        return next("Invalid password Token",404)
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
})
export const updatePassword = asyncErrorHandler(async(req,res,next)=>{
    const user = await userModel.findById(req.body.id).select("+password");
    const isPasswordMatched = user.comparePassword(req.body.oldPassword)
    if(!isPasswordMatched){
        return next(new ErrorHandler("old password is Invalid",400))
    }
    user.password = req.body.newPassword
    await user.save()
    sendToken(user,201, res)
})

export const updateProfile = asyncErrorHandler(async(req,res,next)=>{
    const newData = {
        name: req.body.name,
        email: req.body.email
    }
    if(req.body.avater !== ''){
        const user = await userModel.findById(req.user.id)
        const imageId = user.avatar.public_id
        await cloudinary.v2.uploader.destroy(imageId)
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder: "avatars",
            width: 150,
            crop: "scale",
        })
        newUserData.avatar = {
            public_id : myCloud.public_id,
            url: myCloud.secure_url
        }
        res.status(200).json({
            success: true,
            user
        })
    }
})

//admin 

export const getAlluser = asyncErrorHandler(async (req,res,next)=>{
    const user = await userModel.find()
    res.status(200).json({
        success: true,
        user
    })
})

export const getSingleUser = asyncErrorHandler(async(req,res,next)=>{
    const user = await userModel.findById(req.params.id)
    if(!user){
        return next(new ErrorHandler(`user dosen't exist with id: ${req.params.id}`))
    }
    res.status(200).json({
        success: true,
        user
    })
})

export const updateUserRole = asyncErrorHandler(async(req,res,next)=>{
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        gender: req.body.gender,
        roles: req.body.role
    }
    await userModel.findByIdAndUpdate(req.params.id,newUserData,{
        new : true,
        runValidators: true,
        useFindAndModify : false
    })
    res.status(200).json({
        success: true,
    })
})

export const deleteUser = asyncErrorHandler(async(req,res,next)=>{
    const user = await userModel.findById()
    if(!user){
        return next(new ErrorHandler(`User doesn't exist with id: ${req.params.id}`, 404));
    }
    await userModel.remove()
    res.status(200).json({
        success: true,
    })
})