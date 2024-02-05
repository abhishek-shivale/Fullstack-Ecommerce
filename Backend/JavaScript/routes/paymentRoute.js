import  express from "express";
const router = express.Router()
import { processPayment, paytmResponse, getPaymentStatus} from "../controllers/paymentController.js";
import {isAuthenticatedUser, authorizeRoles} from '../middlewares/auth.js'

router.route('/payment/process').post(processPayment)

router.route('/callback').post(paytmResponse)

router.route('/payment/status/:id').get(isAuthenticatedUser,getPaymentStatus)

export default router
