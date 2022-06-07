import express from 'express';
import formidable from 'express-formidable';
import {
  uploadImage,
  createPost,
  getPosts,
  deletePost,
  uploadImageFile,
  getMedia,
  removeMedia,
} from '../controllers/post';
import { requireAdmin, requireSignin } from '../middlewares';

const router = express.Router();

// controllers
router.delete('/posts/:postId', requireSignin, requireAdmin, deletePost);
router.post('/upload-image', requireSignin, requireAdmin, uploadImage); // we receive base64 image

router.post(
  '/upload-image-file',
  formidable(),
  requireSignin,
  requireAdmin,
  uploadImageFile
); // we receive formData, we need to use middleware: =>  (req.files: provided by formidable)`
router.post('/create-post', requireSignin, requireAdmin, createPost);
router.get('/posts', getPosts);
router.get('/media', requireSignin, requireAdmin, getMedia);
router.delete('/media/:mediaId', requireSignin, requireAdmin, removeMedia);

export default router;
