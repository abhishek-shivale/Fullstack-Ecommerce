import  express from "express";
const router = express.Router()
import { registerUser, loginUser, logoutUser, getUserDetails, forgotPassword, resetPassword, updatePassword, updateProfile, getAlluser, getSingleUser, updateUserRole, deleteUser} from "../controllers/userController.js";

import {isAuthenticatedUser, authorizeRoles} from '../middlewares/auth.js'


router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').post(logoutUser)

router.route('/me').get(isAuthenticatedUser, getUserDetails)

router.route('/password/forgot/').post(forgotPassword)
router.route('/password/forgot/:token').put(resetPassword)

router.route('/password/update').put(isAuthenticatedUser, updatePassword)

router.route('/me/update').put(isAuthenticatedUser, updateProfile)

router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles("admin"), getAlluser )

router.route('/admin/user/:id')
    .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
    .post(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
    .put(isAuthenticatedUser, authorizeRoles("admin"), deleteUser)

export default router