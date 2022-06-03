import express from 'express';
import {
  forgotPassword,
  resetPassword,
  signin,
  signup,
  currentUser,
} from '../controllers/auth';
import { requireAdmin, requireSignin } from '../middlewares';

const router = express.Router();

// controllers

router.get('/current-admin', requireSignin, requireAdmin, currentUser);
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
