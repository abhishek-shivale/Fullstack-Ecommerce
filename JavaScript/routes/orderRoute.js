import  express from "express";
const router = express.Router()
import {isAuthenticatedUser, authorizeRoles} from '../middlewares/auth.js'
import { newOrder, getSingleOrderDetails, myOrders, getAllOrders, updateOrder, deleteOrder  } from "../controllers/orderController.js";

router.route('/order/new').post(isAuthenticatedUser, newOrder)
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrderDetails)
router.route('/order/me').get(isAuthenticatedUser, myOrders)

router.route('/admin/orders').get(isAuthenticatedUser, authorizeRoles('admin'), getAllOrders)

router.route('/admin/order/:id')
    .put(isAuthenticatedUser, authorizeRoles('admin'),updateOrder)
    .delete(isAuthenticatedUser, authorizeRoles('admin'),deleteOrder)

    
export default router
