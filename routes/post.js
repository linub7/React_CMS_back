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
  getSinglePost,
  updatePost,
  getAuthorPosts,
  getAuthorMedia,
  postCount,
  getPostsForAdmin,
} from '../controllers/post';
import {
  requireAdmin,
  requireSignin,
  canCreateAndRead,
  canDeleteMedia,
  canUpdateAndDeletePost,
  requireAuthor,
  canCreateAndReadWithSubscriber,
} from '../middlewares';

const router = express.Router();

// controllers
router.delete(
  '/posts/:postId',
  requireSignin,
  canUpdateAndDeletePost,
  deletePost
);
router.put('/posts/:postId', requireSignin, canUpdateAndDeletePost, updatePost);
router.get('/posts/:slug', getSinglePost);

// we receive base64 image
router.post('/upload-image', requireSignin, canCreateAndRead, uploadImage);

// we receive formData, we need to use middleware: =>  (req.files: provided by formidable)`
router.post(
  '/upload-image-file',
  formidable(),
  requireSignin,
  canCreateAndReadWithSubscriber,
  uploadImageFile
);
router.post('/create-post', requireSignin, canCreateAndRead, createPost);
router.get('/all-posts', getPosts);
router.get('/posts-for-admin', requireSignin, requireAdmin, getPostsForAdmin);
router.get('/posts-count', postCount);
router.get('/author-posts', requireSignin, requireAuthor, getAuthorPosts);

// media
router.get('/media', requireSignin, canCreateAndRead, getMedia);
router.get('/author-media', requireSignin, canCreateAndRead, getAuthorMedia);
router.delete('/media/:mediaId', requireSignin, canDeleteMedia, removeMedia);

export default router;
