import logger from '#config/logger.js';
import {
  createPost,
  deletePost,
  getPostBySlug,
  getPosts,
  updatePost,
} from '#services/posts.service.js';
import { formatValidationError } from '#utils/format.js';
import {
  createPostSchema,
  updatePostSchema,
} from '#validations/post.validation.js';

export const fetchPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const posts = await getPosts(Number(page), Number(limit));
    res.json(posts);
  } catch (error) {
    logger.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Could not fetch posts' });
  }
};

export const fetchPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await getPostBySlug(slug);
    res.json(post);
  } catch (error) {
    logger.error('Error fetching post by slug:', error);
    res.status(500).json({ error: 'Could not fetch post' });
  }
};

export const createNewPost = async (req, res) => {
  try {
    const validationResult = createPostSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: 'Validation Error',
        details: formatValidationError(validationResult.error),
      });
    }

    const { title, slug, content } = validationResult.data;

    const userId = req.user.id;

    const newPost = await createPost({ userId, title, slug, content });
    res.status(201).json({
      message: 'Post created successfully',
      post: newPost,
    });
  } catch (error) {
    logger.error('Error creating post:', error);
    res.status(500).json({ error: 'Could not create post' });
  }
};

export const editPost = async (req, res) => {
  try {
    const { id } = req.params;

    const validationResult = updatePostSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        message: 'Validation Error',
        details: formatValidationError(validationResult.error),
      });
    }

    const { title, slug, content } = validationResult.data;

    const updatedPost = await updatePost(id, { title, slug, content });
    res.status(200).json({
      message: 'Post updated successfully',
      post: updatedPost,
    });
  } catch (error) {
    logger.error('Error updating post:', error);
    res.status(500).json({ error: 'Could not update post' });
  }
};

export const removePost = async (req, res) => {
  try {
    const { id } = req.params;

    await deletePost(id);

    res.status(200).json({ message: `Post with id: ${id} deleted` });
  } catch (error) {
    logger.error('Error deleting post:', error);
    res.status(500).json({ error: 'Could not delete post' });
  }
};
