import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
      role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    password:{
        type:String,
        required:true,
    },
    profilePicture : {
        type : String,
        default: "https://res.cloudinary.com/dz1q5xj3h/image/upload/v1706266460/placeholder.png"
    }
   
   
},{timestamps:true});
export const User = mongoose.model('User', userSchema);