import { User } from "../modules/userModule.js";
import { Product } from "../modules/productModule.js";
import { Comment } from "../modules/commentModule.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();


export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password } = req.body;
         
        if (!fullname || !email || !phoneNumber || !password ) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };


        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password ) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            token,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getUpvotedProducts = async (req, res) => {
  const userId = req.id

  try {
    const products = await Product.find({ upvotes: userId })
      .populate('user', 'fullname email') 
      .exec()

    res.status(200).json({
      success: true,
      products,
    })
  } catch (error) {
    console.error('Error fetching upvoted products:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching upvoted products',
    })
  }
}


export const getCommentedProducts = async (req, res) => {
  const userId = req.id

  try {
    
    const commentedProductIds = await Comment.distinct('product', { user: userId })

    
    const products = await Product.find({ _id: { $in: commentedProductIds } })
      .populate('user', 'fullname email') 
      .lean() 

  
    for (const product of products) {
      const userComments = await Comment.find({
        product: product._id,
        user: userId
      }).lean()

      product.userComments = userComments
    }

    res.status(200).json({
      success: true,
      products,
    })
  } catch (error) {
    console.error('Error fetching commented products:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching commented products',
    })
  }
}