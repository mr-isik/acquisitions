import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(3).max(255).trim(),
  email: z.email().max(255).trim(),
  password: z.string().min(6).max(100),
  role: z.enum(['user', 'admin']).default('user'),
});

export const loginSchema = z.object({
  email: z.string().email().max(255).trim(),
  password: z.string().min(6).max(100),
});
