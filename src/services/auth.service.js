import { db } from '#config/db.js';
import logger from '#config/logger.js';
import { users } from '#models/user.model.js';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

export const hashPassword = async password => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (e) {
    logger.error('Error hashing password:', e);
    throw new Error('Password hashing failed');
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (e) {
    logger.error('Error comparing password:', e);
    throw new Error('Password comparison failed');
  }
};

export const createUser = async ({ name, email, password, role }) => {
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await hashPassword(password);

    const [newUser] = await db
      .insert(users)
      .values({ name, email, password: hashedPassword, role })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      });

    logger.info('User created successfully:', {
      id: newUser.id,
      email: newUser.email,
    });
    return newUser;
  } catch (e) {
    logger.error('Error creating user:', e);
    throw new Error('User creation failed');
  }
};

export const authenticateUser = async ({ email, password }) => {
  try {
    // Find user by email
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Compare passwords
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    logger.info('User authenticated successfully:', {
      id: user.id,
      email: user.email,
    });

    return userWithoutPassword;
  } catch (e) {
    if (e.message === 'Invalid email or password') {
      logger.warn('Authentication failed for email:', email);
      throw e;
    }
    logger.error('Error authenticating user:', e);
    throw new Error('Authentication failed');
  }
};
