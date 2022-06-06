import express from 'express';
import {
  uploadImage,
  createPost,
  getPosts,
  deletePost,
} from '../controllers/post';
import { requireAdmin, requireSignin } from '../middlewares';

const router = express.Router();

// controllers
router.delete('/posts/:postId', requireSignin, requireAdmin, deletePost);
router.post('/upload-image', requireSignin, requireAdmin, uploadImage);
router.post('/create-post', requireSignin, requireAdmin, createPost);
router.get('/posts', getPosts);

export default router;
