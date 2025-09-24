import { db } from '#config/db.js';
import logger from '#config/logger.js';
import { comments } from '#models/comment.model.js';
import { users } from '#models/user.model.js';
import { and, desc, eq } from 'drizzle-orm';

export const getCommentsByPostId = async postId => {
  try {
    const result = await db
      .select({
        id: comments.id,
        postId: comments.postId,
        content: comments.content,
        author: users.name,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
      })
      .from(comments)
      .where(eq(comments.postId, postId))
      .leftJoin(users, eq(comments.authorId, users.id))
      .orderBy(desc(comments.createdAt));

    return result;
  } catch (e) {
    logger.error(`Error fetching comments for postId ${postId}:`, e);
    throw new Error('Could not fetch comments');
  }
};

export const addCommentToPost = async (postId, authorId, content) => {
  try {
    const comment = await db
      .insert(comments)
      .values({
        postId,
        authorId,
        content,
      })
      .returning({
        id: comments.id,
        postId: comments.postId,
        content: comments.content,
        authorId: comments.authorId,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
      });
    return comment;
  } catch (e) {
    logger.error('Error adding comment:', e);
    throw new Error('Could not add comment');
  }
};

export const updateComment = async (commentId, authorId, content) => {
  try {
    const comment = await db
      .update(comments)
      .set({
        content,
        updatedAt: new Date(),
      })
      .where(and(eq(comments.id, commentId), eq(comments.authorId, authorId)))
      .returning({
        id: comments.id,
        postId: comments.postId,
        content: comments.content,
        authorId: comments.authorId,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
      });

    if (!comment) {
      throw new Error(
        'Comment not found or you are not authorized to update it'
      );
    }

    return comment;
  } catch (e) {
    logger.error('Error updating comment:', e);
    throw new Error(e.message || 'Could not update comment');
  }
};

export const deleteComment = async (commentId, authorId) => {
  try {
    const [comment] = await db
      .delete(comments)
      .where(and(eq(comments.id, commentId), eq(comments.authorId, authorId)))
      .returning({
        id: comments.id,
      });

    if (!comment) {
      throw new Error(
        'Comment not found or you are not authorized to delete it'
      );
    }

    return comment;
  } catch (e) {
    logger.error('Error deleting comment:', e);
    throw new Error(e.message || 'Could not delete comment');
  }
};
