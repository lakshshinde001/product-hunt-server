import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; 
import userRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
dotenv.config()

connectDB();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())


app.use('/api/v1/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})