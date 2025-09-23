import {
  createNewUser,
  deleteExistingUser,
  fetchAllUsers,
  fetchUserById,
  updateExistingUser,
} from '#controllers/users.controller.js';
import express from 'express';

const router = express.Router();

router.get('/', fetchAllUsers);

router.get('/:id', fetchUserById);

router.post('/', createNewUser);

router.put('/:id', updateExistingUser);

router.delete('/:id', deleteExistingUser);

export default router;
