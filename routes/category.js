import express from 'express';
import {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../controllers/category';
import { requireAdmin, requireSignin } from '../middlewares';

const router = express.Router();

// controllers

router.put('/categories/:categoryId', updateCategory);
router.delete('/categories/:categoryId', deleteCategory);
router.get('/categories', getCategories);
router.post('/add-category', requireSignin, requireAdmin, addCategory);

export default router;
