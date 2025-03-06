// Import necessary modules
import User from '../models/user.js';
import bcrypt from 'bcryptjs';

/**
 * Create a new user.
 * 
 * @async
 * @function createUser
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing user information.
 * @param {string} req.body.userName - The user's username.
 * @param {string} req.body.firstName - The user's first name.
 * @param {string} req.body.lastName - The user's last name.
 * @param {string} req.body.email - The user's email address.
 * @param {string} req.body.password - The user's password.
 * @param {string} req.body.role - The user's role (e.g., 'student', 'admin').
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the created user or an error message.
 */
const createUser = async (req, res) => {
  try {
    const { userName, firstName, lastName, email, password, role } = req.body;

    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ userName, firstName, lastName, email, password: hashedPassword, role });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

/**
 * Get a specific user by ID.
 * 
 * @async
 * @function getUserById
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - ID of the user to fetch.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the user data or an error message.
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

/**
 * Get all users.
 * 
 * @async
 * @function getAllUsers
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with all users or an error message.
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

/**
 * Update a specific user.
 * 
 * @async
 * @function updateUser
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - ID of the user to update.
 * @param {Object} req.body - The request body containing updated user information.
 * @param {string} [req.body.userName] - The user's updated username.
 * @param {string} [req.body.firstName] - The user's updated first name.
 * @param {string} [req.body.lastName] - The user's updated last name.
 * @param {string} [req.body.email] - The user's updated email address.
 * @param {string} [req.body.role] - The user's updated role.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the updated user or an error message.
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, firstName, lastName, email, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { userName, firstName, lastName, email, role, updated_at: Date.now() },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

/**
 * Delete a specific user.
 * 
 * @async
 * @function deleteUser
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - ID of the user to delete.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with deletion success message or an error message.
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

export default { createUser, getUserById, getAllUsers, updateUser, deleteUser };
