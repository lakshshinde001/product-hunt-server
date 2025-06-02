import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    tagline: {
         type: String,
          required: true
    },
    description: {
         type: String,
          required: true
    },
    website: { 
        type: String, 
        required: true 
    },
    logo: { 
        type: String 
    }, 
    category: {
      type: String,
      enum: ["AI", "SaaS", "Devtools", "Other"],
      required: true,
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ]
  },
  { timestamps: true }
);

export const  Product =  mongoose.model("Product", productSchema);
