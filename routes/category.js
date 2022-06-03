import express from 'express';
import {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../controllers/category';

const router = express.Router();

// controllers

router.put('/categories/:categoryId', updateCategory);
router.delete('/categories/:categoryId', deleteCategory);
router.get('/categories', getCategories);
router.post('/add-category', addCategory);

export default router;
