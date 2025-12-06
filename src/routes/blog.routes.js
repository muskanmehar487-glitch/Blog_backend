import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getBlogById, listBlogs } from '../controllers/blog.controller.js';

const router = Router();

router.get('/', listBlogs);
router.get('/:id', requireAuth, getBlogById);

export default router;


