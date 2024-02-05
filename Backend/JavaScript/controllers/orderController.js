import asyncErrorHandler from  '../middlewares/asyncErrorHandler.js'
import { orderModel } from '../models/orderModel.js'
import  productModel  from '../models/productModel.js'
import ErrorHandler from '../utils/errorHandler.js'
import sendEmail from '../utils/sendEmail.js'

export const newOrder = asyncErrorHandler(async(req,res,next)=>{
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        totalPrice
    } = req.body
    const orderExist = await orderModel.findOne({paymentInfo});
    if(orderExist){
        return next(new ErrorHandler("order already placed ", 400))
    }
    const order = await orderModel.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        totalPrice,
        paidAt : Date.now(),
        user: req.user._id
    })
    await sendEmail ({
        email: req.user.email,
        templateId: process.env.SENDGRID_ORDER_TEMPLATEID,
        data: {
            name: req.user.name,
            shippingInfo,
            orderItems,
            totalPrice,
            oid: order._id,
        }
    })
    res.status(201).json({
        success: true,
        order,
    });
})

export const getSingleOrderDetails = asyncErrorHandler(async(req,res,next)=>{
    const order = await orderModel.findById(req.parms.id).populate("user","name email")
    if (!order) {
        return next(new ErrorHandler("Order Not Found", 404));
    }

    res.status(200).json({
        success: true,
        order,
    });
})

export const myOrders = asyncErrorHandler(async(req,res,next)=>{
    const order = await orderModel.find({users: req.params._id}) 
    if(!order){
        return next(new ErrorHandler("Order Not Found", 404));
    }
    res.status(200).json({
        success: true,
        order,
    });
})

export const getAllOrders = asyncErrorHandler(async(req,res,next)=>{
    const orders = await orderModel.find()
    if(!orders){
        return next(new ErrorHandler("Order Not Found"))
    }
    let totalAmount = 0;
    orders.forEach((order)=>{
        totalAmount += order.totalPrice
    })
    res.status(200).json({
        success: true,
        orders,
        totalAmount,
    });
})

export const updateOrder = asyncErrorHandler(async(req,res,next)=>{
    const order = await orderModel.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("order Not found", 404))
    }
    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("order is Delivered", 400))
    }
    if(req.body.status === "Shipped"){
        order.shippedAt = Date.now()
        order.orderItems.forEach(async(i)=>{
            await updateStock(i.product, i.quantity)
        })
    }
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true
    })
})

async function updateStock(id, quantity){
    const product = await productModel.findById(id);
    product.stock -= quantity;
    await product.save({validateBeforeSave: false})
}

export const deleteOrder = asyncErrorHandler(async(req,res,next)=>{
    const order = await orderModel.findById(req.params.id)
    if(!order){
        return next(new ErrorHandler("order Not found", 404))
    }
    await order.remove()

    res.status(200).json({
        success: true
    })
})


