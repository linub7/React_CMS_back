import express from 'express';
import {
  createUser,
  getUsers,
  deleteUser,
  getSingleUser,
  updateUserByAdmin,
} from '../controllers/user';
import { requireAdmin, requireSignin } from '../middlewares';

const router = express.Router();

// controllers

router.delete('/users/:userId', requireSignin, requireAdmin, deleteUser);
router.get('/users/:userId', requireSignin, requireAdmin, getSingleUser);
router.put('/users/:userId', requireSignin, requireAdmin, updateUserByAdmin);
router.post('/users', requireSignin, requireAdmin, createUser);
router.get('/users', requireSignin, getUsers);

export default router;
