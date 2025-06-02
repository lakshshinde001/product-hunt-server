import express from 'express';
import { addComment, getAllComments } from '../controllers/commentController.js';
import isAuthenticated from "../middlewares/isAuthenticated.js"


const router = express.Router();

router.route('/:id/add').post(isAuthenticated, addComment)
router.route('/:id').get( getAllComments)


export default router;