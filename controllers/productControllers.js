import {Product} from "../modules/productModule.js"
import cloudinary from "../utils/cloudinary.js"
import getDataUri from "../utils/datauri.js"

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
