import express from "express";
import { getCommentedProducts, getUpvotedProducts, login, logout, register } from "../controllers/userControllers.js";
import isAuthenticated from "../middlewares/isAuthenticated.js" 

const router = express.Router();

router.route("/register").post( register);
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/comments").get(isAuthenticated,  getCommentedProducts);
router.route("/upvote").get(isAuthenticated, getUpvotedProducts)


export default router;