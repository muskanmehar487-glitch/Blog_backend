import { Router } from 'express';
import { body } from 'express-validator';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { createBlog, deleteBlog, listAll, updateBlog } from '../controllers/admin.blog.controller.js';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/', listAll);
router.post(
  '/',
  [
    body('title').isString().isLength({ min: 1 }),
    body('description').isString().isLength({ min: 1 }),
    body('content').isString().isLength({ min: 1 }),
    body('author').isString().isLength({ min: 1 })
  ],
  createBlog
);
router.put(
  '/:id',
  [
    body('title').optional().isString().isLength({ min: 1 }),
    body('description').optional().isString().isLength({ min: 1 }),
    body('content').optional().isString().isLength({ min: 1 }),
    body('author').optional().isString().isLength({ min: 1 })
  ],
  updateBlog
);
router.delete('/:id', deleteBlog);

export default router;


