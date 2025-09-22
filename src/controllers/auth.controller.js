import logger from '#config/logger.js';
import { authenticateUser, createUser } from '#services/auth.service.js';
import { cookies } from '#utils/cookies.js';
import { formatValidationError } from '#utils/format.js';
import { jwttoken } from '#utils/jwt.js';
import { loginSchema, registerSchema } from '#validations/auth.validation.js';

export const register = async (req, res, next) => {
  try {
    const validationResult = registerSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: 'Validation Error',
        details: formatValidationError(validationResult.error),
      });
    }

    const { name, email, password, role } = validationResult.data;

    const newUser = await createUser({ name, email, password, role });

    const token = jwttoken.sign({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    cookies.set(res, 'token', token);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        id: newUser.id,
      },
    });
  } catch (error) {
    logger.error('Registration error:', error);

    if (error.message === 'User with this email already exists') {
      return res.status(400).json({ message: error.message });
    }

    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: 'Validation Error',
        details: formatValidationError(validationResult.error),
      });
    }

    const { email, password } = validationResult.data;

    const user = await authenticateUser({ email, password });

    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    cookies.set(res, 'token', token);

    logger.info('User logged in successfully:', {
      id: user.id,
      email: user.email,
    });

    res.status(200).json({
      message: 'User logged in successfully',
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        id: user.id,
      },
    });
  } catch (error) {
    logger.error('Login error:', error);

    if (error.message === 'Invalid email or password') {
      return res.status(401).json({ message: error.message });
    }

    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    // Get the token from cookies to log which user is logging out
    const token = cookies.get(req, 'token');

    if (token) {
      try {
        const decoded = jwttoken.verify(token);
        logger.info('User logged out successfully:', {
          id: decoded.id,
          email: decoded.email,
        });
      } catch (e) {
        // Token might be invalid or expired, but we still want to clear it
        logger.info('Logout attempt with invalid/expired token', {
          error: e.message,
        });
      }
    }

    // Clear the authentication cookie
    cookies.clear(res, 'token');

    res.status(200).json({
      message: 'User logged out successfully',
    });
  } catch (error) {
    logger.error('Logout error:', error);
    next(error);
  }
};
