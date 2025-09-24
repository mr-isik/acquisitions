import { db } from '#config/db.js';
import logger from '#config/logger.js';
import { posts } from '#models/post.model.js';
import { eq } from 'drizzle-orm';

export const getPosts = async (page = 1, limit = 10) => {
  try {
    return await db
      .select({
        id: posts.id,
        userId: posts.userId,
        title: posts.title,
        slug: posts.slug,
        content: posts.content,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
      })
      .from(posts)
      .limit(limit)
      .offset((page - 1) * limit);
  } catch (error) {
    logger.error('Error fetching posts:', error);
    throw new Error('Could not fetch posts');
  }
};

export const getPostBySlug = async slug => {
  try {
    const [post] = await db
      .select({
        id: posts.id,
        userId: posts.userId,
        title: posts.title,
        slug: posts.slug,
        content: posts.content,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
      })
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1);
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  } catch (error) {
    logger.error(`Error fetching post with slug ${slug}:`, error);
    throw new Error(error.message || 'Could not fetch post');
  }
};

export const createPost = async postData => {
  try {
    const [post] = await db
      .insert(posts)
      .values({
        userId: postData.userId,
        title: postData.title,
        slug: postData.slug,
        content: postData.content,
      })
      .returning({
        id: posts.id,
        userId: posts.userId,
        title: posts.title,
        slug: posts.slug,
        content: posts.content,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
      });
    return post;
  } catch (error) {
    logger.error('Error creating post:', error);
    throw new Error('Could not create post');
  }
};

export const updatePost = async (id, postData) => {
  try {
    const [post] = await db
      .update(posts)
      .set({
        title: postData.title,
        slug: postData.slug,
        content: postData.content,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id))
      .returning({
        id: posts.id,
        userId: posts.userId,
        title: posts.title,
        slug: posts.slug,
        content: posts.content,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
      });
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  } catch (error) {
    logger.error(`Error updating post with id ${id}:`, error);
    throw new Error(error.message || 'Could not update post');
  }
};

export const deletePost = async id => {
  try {
    const [post] = await db.delete(posts).where(eq(posts.id, id)).returning({
      id: posts.id,
      userId: posts.userId,
      title: posts.title,
      slug: posts.slug,
      content: posts.content,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
    });
    if (!post) {
      throw new Error('Post not found');
    }

    return post;
  } catch (error) {
    logger.error(`Error deleting post with id ${id}:`, error);
    throw new Error(error.message || 'Could not delete post');
  }
};
