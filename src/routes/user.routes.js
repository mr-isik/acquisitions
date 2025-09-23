import {
  createNewUser,
  deleteExistingUser,
  fetchAllUsers,
  fetchUserById,
  updateExistingUser,
} from '#controllers/users.controller.js';
import { authenticateToken, requireRole } from '#middleware/auth.middleware.js';
import express from 'express';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /users - Fetch all users (authenticated users only)
router.get('/', fetchAllUsers);

// GET /users/:id - Fetch a single user by ID (admin only)
router.get('/:id', requireRole(['admin']), fetchUserById);

// POST /users - Create a new user (authenticated users only)
router.post('/', createNewUser);

// PUT /users/:id - Update an existing user (authenticated users only)
router.put('/:id', updateExistingUser);

// DELETE /users/:id - Delete an existing user (admin only)
router.delete('/:id', requireRole(['admin']), deleteExistingUser);

export default router;
