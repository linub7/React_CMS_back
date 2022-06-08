import express from 'express';
import { createUser } from '../controllers/user';
import { requireAdmin, requireSignin } from '../middlewares';

const router = express.Router();

// controllers

router.post('/users', requireSignin, requireAdmin, createUser);

export default router;
