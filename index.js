require('dotenv').config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { readdirSync } from 'fs';

import authRoutes from './routes/auth';
import categoryRoutes from './routes/category';
import postRoutes from './routes/post';

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
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(morgan('dev'));

// route middlewares
app.use('/api/v1', authRoutes);
app.use('/api/v1', categoryRoutes);
app.use('/api/v1', postRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log('Server running on port 8000'));
