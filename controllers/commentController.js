import { Comment } from "../modules/commentModule.js";
import { Product } from "../modules/productModule.js";

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, parentCommentId } = req.body;
    const userId = req.id; 

   
    const product = await Product.findById(id);
    console.log(product)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    
    const comment = await Comment.create({
      product: id,
      user: userId,
      text,
      nestedComments: parentCommentId || null,
    });

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const { id } = req.params;

   
    const comments = await Comment.find({
      product: id,
      nestedComments: null, 
    })
      .populate("user", "fullname") 
      .sort({ createdAt: -1 }) 
      .lean();

    
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({
          nestedComments: comment._id,
        })
          .populate("user", "fullname")
          .sort({ createdAt: 1 }) 
          .lean();

        return {
          ...comment,
          replies,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      comments: commentsWithReplies,
    });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};