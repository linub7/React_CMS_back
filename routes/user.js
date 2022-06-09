import express from 'express';
import { createUser, getUsers, deleteUser } from '../controllers/user';
import { requireAdmin, requireSignin } from '../middlewares';

const router = express.Router();

// controllers

router.delete('/users/:userId', requireSignin, requireAdmin, deleteUser);
router.post('/users', requireSignin, requireAdmin, createUser);
router.get('/users', requireSignin, requireAdmin, getUsers);

export default router;
