import logger from '#config/logger.js';
import {
  addCommentToPost,
  deleteComment,
  getCommentsByPostId,
  updateComment,
} from '#services/comment.service.js';

export const fetchCommentsByPostId = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const comments = await getCommentsByPostId(id, page, limit);

    res.status(200).json({
      message: 'Comments retrieved successfully',
      comments,
      count: comments.length,
    });
  } catch (e) {
    logger.error('Error in fetchCommentsByPostId:', e);
    res.status(500).json({
      message: e.message || 'Could not fetch comments',
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { id } = req.user;

    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        message: 'Content is required',
      });
    }

    const newComment = await addCommentToPost(postId, id, content);

    res.status(201).json({
      message: 'Comment added successfully',
      comment: newComment,
    });
  } catch (e) {
    logger.error('Error in addComment:', e);
    res.status(500).json({
      message: e.message || 'Could not add comment',
    });
  }
};

export const editComment = async (req, res) => {
  try {
    const { id: commentId } = req.params;
    const { id } = req.user;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        message: 'Content is required',
      });
    }

    const updatedComment = await updateComment(commentId, id, content);

    res.status(200).json({
      message: 'Comment updated successfully',
      comment: updatedComment,
    });
  } catch (e) {
    logger.error('Error in updateComment:', e);
    res.status(500).json({
      message: 'Could not update comment',
    });
  }
};

export const removeComment = async (req, res) => {
  try {
    const { id: commentId } = req.params;
    const { id } = req.user;

    await deleteComment(commentId, id);

    res.status(200).json({
      message: 'Comment deleted successfully',
    });
  } catch (e) {
    logger.error('Error in deleteComment:', e);
    res.status(500).json({
      message: 'Could not delete comment',
    });
  }
};
