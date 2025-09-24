import z from 'zod';

export const commentSchema = z.object({
  id: z.uuid(),
  postId: z.uuid(),
  content: z.string().min(2).max(500),
  author: z.string().min(2).max(100),
});

export const createCommentSchema = commentSchema.omit({ id: true });
export const updateCommentSchema = commentSchema.partial().omit({ id: true });

export const commentIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const postIdParamSchema = z.object({
  postId: z.string().uuid(),
});

export const paginationSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});
