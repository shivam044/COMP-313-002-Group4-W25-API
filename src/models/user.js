import mongoose from 'mongoose';
const Schema = mongoose.Schema;

/**
 * User schema for MongoDB.
 * Represents a user in the application.
 * 
 * @typedef {Object} User
 * @property {string} userName - The user's username, required.
 * @property {string} firstName - The user's first name, required.
 * @property {string} lastName - The user's last name, required.
 * @property {string} email - The user's email address, must be unique and valid, required.
 * @property {string} password - The user's password, required.
 * @property {string} role - The user's role (default: 'student'), required.
 * @property {Date} created_at - Timestamp for when the user was created.
 * @property {Date} updated_at - Timestamp for when the user was last updated.
 */
const UserSchema = new Schema({
  userName: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true }, 
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: true,
  },
  role: { type: String, default: 'student', required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);
export default User;