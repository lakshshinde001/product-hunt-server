import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; 
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config()

connectDB();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())

const corsOptions = {
    origin:'*',
    credentials:true
}
app.use(cors(corsOptions))



app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})