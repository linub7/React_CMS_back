import express from 'express';
import {
  forgotPassword,
  resetPassword,
  signin,
  signup,
} from '../controllers/auth';

const router = express.Router();

// controllers

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
