import  express from "express";
const router = express.Router()
import {isAuthenticatedUser, authorizeRoles} from '../middlewares/auth.js'
import { getAllProducts, getProducts, getProductDetails, getAdminProducts, createProduct, updateProduct, deleteProduct, createProductReview, getProductReviews, deleteReview } from "../controllers/productController.js";

router.route('/products').get(getAllProducts);
router.route('/products/all').get(getProducts);

router.route('/admin/products').get(isAuthenticatedUser, authorizeRoles('admin'), getAdminProducts);
router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles('admin'), createProduct);

router.route('/admin/product/:id')
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);

router.route('/product/:id').get(getProductDetails);

router.route('/reviews').put(isAuthenticatedUser, createProductReview);


router.route('/admin/reviews')
    .get(getProductReviews)
    .put(isAuthenticatedUser, deleteReview);


export default router
