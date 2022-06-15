import express from 'express';
import { contact, createPage, getPage } from '../controllers/website';
import { requireAdmin, requireSignin } from '../middlewares';

const router = express.Router();

// controllers
router.post('/contact', contact);
router.post('/page', requireSignin, requireAdmin, createPage);
router.get('/page', getPage);

export default router;
