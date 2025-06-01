
import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { createProduct } from '../controllers/productControllers.js';
import { singleUpload } from '../middlewares/multer.js';


const router = express.Router();

router.route('/submit').post(isAuthenticated, singleUpload, createProduct)


export default router;