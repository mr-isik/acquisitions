import logger from '#config/logger.js';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from '#services/users.service.js';

export const fetchAllUsers = async (req, res) => {
  try {
    const allUsers = await getAllUsers();

    res.status(200).json({
      message: 'Users retrieved successfully',
      users: allUsers,
      count: allUsers.length,
    });
  } catch (e) {
    logger.error('Error in fetchAllUsers:', e);
    res.status(500).json({
      message: e.message || 'Could not fetch users',
    });
  }
};

export const fetchUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    res.status(200).json({
      message: 'User retrieved successfully',
      user,
    });
  } catch (e) {
    logger.error('Error in fetchUserById:', e);
    if (e.message === 'User not found') {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(500).json({
        message: e.message || 'Could not fetch user',
      });
    }
  }
};

export const createNewUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // Basic validation
    if (!name || !email) {
      return res.status(400).json({
        message: 'Name and email are required',
      });
    }

    const newUser = await createUser({ name, email, role });

    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
    });
  } catch (e) {
    logger.error('Error in createNewUser:', e);
    if (e.message === 'Email already exists') {
      res.status(409).json({ message: 'Email already exists' });
    } else {
      res.status(500).json({
        message: e.message || 'Could not create user',
      });
    }
  }
};

export const updateExistingUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    // Basic validation
    if (!name && !email && !role) {
      return res.status(400).json({
        message:
          'At least one field (name, email, role) is required for update',
      });
    }

    const updatedUser = await updateUser(id, { name, email, role });

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (e) {
    logger.error('Error in updateExistingUser:', e);
    if (e.message === 'User not found') {
      res.status(404).json({ message: 'User not found' });
    } else if (e.message === 'Email already exists') {
      res.status(409).json({ message: 'Email already exists' });
    } else {
      res.status(500).json({
        message: e.message || 'Could not update user',
      });
    }
  }
};

export const deleteExistingUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUser(id);

    res.status(200).json({
      message: 'User deleted successfully',
      user: deletedUser,
    });
  } catch (e) {
    logger.error('Error in deleteExistingUser:', e);
    if (e.message === 'User not found') {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(500).json({
        message: e.message || 'Could not delete user',
      });
    }
  }
};
