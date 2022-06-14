import express from 'express';
import { statistics } from '../controllers/statistics';

const router = express.Router();

// controllers
router.get('/statistics', statistics);

export default router;
