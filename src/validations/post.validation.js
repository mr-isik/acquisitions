import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(3).max(200).trim(),
  content: z.string().min(10).trim(),
  slug: z.string().min(3).max(200).trim().optional(),
});

export const updatePostSchema = z.object({
  title: z.string().min(3).max(200).trim().optional(),
  content: z.string().min(10).trim().optional(),
  slug: z.string().min(3).max(200).trim().optional(),
});

export const postParamsSchema = z.object({
  slug: z.string().min(3).max(200).trim().optional(),
});
