import { db } from '#config/db.js';
import logger from '#config/logger.js';
import { users } from '#models/user.model.js';

export const getAllUsers = async () => {
  try {
    return await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users);
  } catch (e) {
    logger.error('Error fetching users:', e);
    throw new Error('Could not fetch users');
  }
};

export const getUserById = async id => {
  try {
    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(users.id, '=', id)
      .first();

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (e) {
    logger.error(`Error fetching user with id ${id}:`, e);
    throw new Error(e.message || 'Could not fetch user');
  }
};

export const createUser = async userData => {
  try {
    const [user] = await db
      .insert(users)
      .values({
        name: userData.name,
        email: userData.email,
        role: userData.role || 'user',
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    return user;
  } catch (e) {
    logger.error('Error creating user:', e);
    if (e.code === '23505') {
      // PostgreSQL unique violation error code
      throw new Error('Email already exists');
    }
    throw new Error('Could not create user');
  }
};

export const updateUser = async (id, userData) => {
  try {
    const [updatedUser] = await db
      .update(users)
      .set({
        name: userData.name,
        email: userData.email,
        role: userData.role,
        updatedAt: new Date(),
      })
      .where(users.id, '=', id)
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  } catch (e) {
    logger.error(`Error updating user with id ${id}:`, e);
    if (e.code === '23505') {
      throw new Error('Email already exists');
    }
    throw new Error(e.message || 'Could not update user');
  }
};

export const deleteUser = async id => {
  try {
    const [deletedUser] = await db
      .delete(users)
      .where(users.id, '=', id)
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
      });

    if (!deletedUser) {
      throw new Error('User not found');
    }

    return deletedUser;
  } catch (e) {
    logger.error(`Error deleting user with id ${id}:`, e);
    throw new Error(e.message || 'Could not delete user');
  }
};
