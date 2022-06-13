import express from 'express';
import { contact } from '../controllers/website';

const router = express.Router();

// controllers
router.post('/contact', contact);

export default router;
