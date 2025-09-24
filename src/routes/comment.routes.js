import {
  addComment,
  editComment,
  fetchCommentsByPostId,
  removeComment,
} from '#controllers/comments.controller.js';
import { authenticateToken } from '#middleware/auth.middleware.js';
import express from 'express';

const router = express.Router();

router.get('/:id/comments', fetchCommentsByPostId);

router.post('/:id/comments', authenticateToken, addComment);

router.put('/:id/comments/:id', authenticateToken, editComment);

router.delete('/:id/comments/:id', authenticateToken, removeComment);

export default router;
