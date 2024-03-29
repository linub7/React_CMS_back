require('dotenv').config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from './routes/auth';
import categoryRoutes from './routes/category';
import postRoutes from './routes/post';
import userRoutes from './routes/user';
import commentRoutes from './routes/comment';
import websiteRoutes from './routes/website';
import statisticsRoutes from './routes/statistics';

const morgan = require('morgan');

const app = express();

// db connection
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log('DB connected'))
  .catch((err) => console.log('DB CONNECTION ERROR: ', err));

// middlewares
app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(morgan('dev'));

// route middlewares
app.use('/api/v1', authRoutes);
app.use('/api/v1', categoryRoutes);
app.use('/api/v1', postRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', commentRoutes);
app.use('/api/v1', websiteRoutes);
app.use('/api/v1', statisticsRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log('Server running on port 8000'));
