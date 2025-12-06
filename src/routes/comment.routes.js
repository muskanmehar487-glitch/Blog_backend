import { Router } from 'express';
import { body } from 'express-validator';
import { addComment, deleteComment, getCommentsForBlog, updateComment } from '../controllers/comment.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/blog/:blogId', getCommentsForBlog);

router.post(
  '/',
  requireAuth,
  [body('blogId').isString(), body('content').isString().isLength({ min: 1 })],
  addComment
);

router.put('/:id', requireAuth, [body('content').isString().isLength({ min: 1 })], updateComment);
router.delete('/:id', requireAuth, deleteComment);

export default router;


