import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { expressjwt } from "express-jwt";
import User from '../models/user.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Sign in a user.
 * 
 * @async
 * @function signIn
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing sign-in information.
 * @param {string} req.body.email - The user's email address.
 * @param {string} req.body.password - The user's password.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the generated token or an error message.
 */
const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Sign out a user.
 * 
 * @function signOut
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} Response with the sign-out success message.
 */
const signOut = (req, res) => {
  res.clearCookie("t");
  return res.status(200).json({
    message: "Signed out"
  });
};

/**
 * Middleware to require user sign-in.
 * 
 * @function requireSignin
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Function} Middleware function to check for authorization.
 */
const requireSignin = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    // Bypass authorization in development mode
    return next();
  }

  return expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: 'auth',
  })(req, res, next);
};

/**
 * Middleware to check user authorization.
 * 
 * @function hasAuthorization
 * @param {Object} req - Express request object.
 * @param {Object} req.profile - User profile.
 * @param {Object} req.auth - Authentication object from JWT.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void} Calls next middleware if authorized, otherwise returns an error response.
 */
const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!authorized) {
    return res.status('403').json({
      error: "User is not authorized"
    });
  }
  next();
};

export default { signIn, signOut, requireSignin, hasAuthorization };
