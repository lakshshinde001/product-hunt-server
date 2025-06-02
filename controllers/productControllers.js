import {Product} from "../modules/productModule.js"
import cloudinary from "../utils/cloudinary.js"
import getDataUri from "../utils/datauri.js"
import { Comment } from "../modules/commentModule.js";

export const createProduct = async (req, res) => {
  try {
    const { name, tagline, description, website, category } = req.body
   

     if (!name || !tagline || !description || !website || !category) {
            return res.status(400).json({
                message: "Somethin is missing.",
                success: false
            })
        };
        
     const file = req.file;
     const fileUri = getDataUri(file);
     const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    const product = new Product({
      name,
      tagline,
      description,
      website,
      category,
      logo : cloudResponse.secure_url, 
      user: req.id, 
    })

    await product.save()
    res.status(201).json({ message: 'Product created', product })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}


export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('user', 'fullname') 
      .sort({ createdAt: -1 }) 
      .lean()

    const productsWithComments = await Promise.all(
      products.map(async (product) => {
        const comments = await Comment.find({ product: product._id })
          .populate('user', 'fullname')
          .sort({ createdAt: -1 })
          .lean();

        return {
          ...product,
          comments,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: 'All products fetched successfully',
      products: productsWithComments,
    });
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products',
    })
  }
}

export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;


    if (!id) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

   
    const product = await Product.findById(id)
      .populate('user', 'fullname')
      .lean();

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    
    const comments = await Comment.find({ product: id })
      .populate('user', 'fullname')
      .sort({ createdAt: -1 })
      .lean();

   
    const productWithComments = {
      ...product,
      comments,
      upvotesCount: product.upvotes?.length || 0,
    };

    res.status(200).json({
      success: true,
      message: 'Product fetched successfully',
      product: productWithComments,
    }); 
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product',
    });
  }
};

export const upvoteProduct = async (req, res) => {
  const productId = req.params.id;
  const userId = req.id; 

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const hasUpvoted = product.upvotes.includes(userId);

    if (hasUpvoted) {
      return res.status(400).json({ success: false, message: "You have already upvoted this product" });
    }

    product.upvotes.push(userId);
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product upvoted successfully",
      upvotesCount: product.upvotes.length,
    });
  } catch (error) {
    console.error("Error upvoting product:", error);
    res.status(500).json({
      success: false,
      message: "Server error while upvoting product",
    });
  }
};

export const unvoteProduct = async (req, res) => {
  const productId = req.params.id;
  const userId = req.id;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const hasUpvoted = product.upvotes.includes(userId);

    if (!hasUpvoted) {
      return res.status(400).json({ success: false, message: "You have not upvoted this product" });
    }

    
    product.upvotes = product.upvotes.filter(
      (upvoteUserId) => upvoteUserId.toString() !== userId
    );

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product unvoted successfully",
      upvotesCount: product.upvotes.length,
    });
  } catch (error) {
    console.error("Error unvoting product:", error);
    res.status(500).json({
      success: false,
      message: "Server error while unvoting product",
    });
  }
};
