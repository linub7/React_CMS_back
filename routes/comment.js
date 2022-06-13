import express from 'express';
import {
  createComment,
  deleteComment,
  updateComment,
  getCommentsByAdmin,
  getTotalCommentsByAdmin,
  deleteCommentByAdmin,
  updateCommentByAdmin,
  getCommentsByUser,
  getCommentsCountByUser,
  deleteCommentByUser,
} from '../controllers/comment';

import { requireAdmin, requireSignin } from '../middlewares';

const router = express.Router();

// controllers

router.post('/comments/:postId', requireSignin, createComment);
router.delete('/comments/:postId/:commentId', requireSignin, deleteComment);
router.put('/comments/:postId/:commentId', requireSignin, updateComment);
router.delete(
  '/admin/comments/:commentId',
  requireSignin,
  requireAdmin,
  deleteCommentByAdmin
);
router.put(
  '/admin/comments/:commentId',
  requireSignin,
  requireAdmin,
  updateCommentByAdmin
);
router.get('/admin/comments', requireSignin, requireAdmin, getCommentsByAdmin);
router.get(
  '/admin/comments-count',
  requireSignin,
  requireAdmin,
  getTotalCommentsByAdmin
);

router.get('/user-comments', requireSignin, getCommentsByUser);
router.delete('/user-comments/:commentId', requireSignin, deleteCommentByUser);
router.get('/user-comments-count', requireSignin, getCommentsCountByUser);

export default router;
