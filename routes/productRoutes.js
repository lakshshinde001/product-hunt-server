
import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { createProduct, getAllProducts, getSingleProduct, unvoteProduct, upvoteProduct } from '../controllers/productControllers.js';
import { singleUpload } from '../middlewares/multer.js';


const router = express.Router();

router.route('/submit').post(isAuthenticated, singleUpload, createProduct)
router.route('/').get(getAllProducts)
router.route('/:id').get(getSingleProduct)
router.route('/:id/upvote').post(isAuthenticated, upvoteProduct)
router.route('/:id/unvote').post(isAuthenticated, unvoteProduct)


export default router;