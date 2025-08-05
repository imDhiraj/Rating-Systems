import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';


//custom routes
import userRouter from './routes/auth.route.js';
import userAdminRouter from './routes/user.route.js';
import ratingsRouter from './routes/rating.route.js';
import storeRouter from './routes/store.route.js';

dotenv.config();
const PORT = process.env.PORT || 8000;

const app= express();



app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow cookies to be sent with requests
    allowedHeaders: ['Content-Type', 'Authorization']
    
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req ,res)=>{
    res.send('Hello  Roxiler Systems! Welcome to the backend.');
})

app.use('/api/v1/auth', userRouter);
app.use('/api/v1/user', userAdminRouter);
app.use('/api/v1/store', storeRouter);  
app.use('/api/v1/rating', ratingsRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})