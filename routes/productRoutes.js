
import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { createProduct, getAllProducts, getSingleProduct } from '../controllers/productControllers.js';
import { singleUpload } from '../middlewares/multer.js';


const router = express.Router();

router.route('/submit').post(isAuthenticated, singleUpload, createProduct)
router.route('/').get(getAllProducts)
router.route('/:id').get(getSingleProduct)


export default router;