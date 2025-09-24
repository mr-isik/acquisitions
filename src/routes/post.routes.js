import {
  createNewPost,
  editPost,
  fetchPostBySlug,
  fetchPosts,
  removePost,
} from '#controllers/posts.controller.js';
import { authenticateToken, requireRole } from '#middleware/auth.middleware.js';
import express from 'express';

const router = express.Router();

router.get('/', fetchPosts);

router.get('/:slug', fetchPostBySlug);

router.post('/', authenticateToken, requireRole(['admin']), createNewPost);

router.put('/:id', authenticateToken, requireRole(['admin']), editPost);

router.delete('/:id', authenticateToken, requireRole(['admin']), removePost);

export default router;
