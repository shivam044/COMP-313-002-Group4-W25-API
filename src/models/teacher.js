import mongoose from 'mongoose';
const Schema = mongoose.Schema;

/**
 * Teacher schema for MongoDB.
 * Represents a teacher in the application.
 * 
 * @typedef {Object} Teacher
 * @property {string} first_name - The teacher's first name, required.
 * @property {string} last_name - The teacher's last name, required.
 * @property {string} phone - The teacher's phone number, required.
 * @property {string} school_email - The teacher's school email address, must be unique, required.
 * @property {Schema.Types.ObjectId} uid - Reference to the User who created this entry, required.
 * @property {Date} created_at - Timestamp for when the teacher was added.
 * @property {Date} updated_at - Timestamp for the last update.
 */
const teacherSchema = new Schema({
  first_name: { type: String, required: true }, // Teacher's first name
  last_name: { type: String, required: true }, // Teacher's last name
  phone: { type: String, required: true }, // Teacher's phone number
  school_email: { type: String, required: true, unique: true }, // School email for contact
  uid: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User who created this entry
  created_at: { type: Date, default: Date.now }, // Timestamp when the teacher was added
  updated_at: { type: Date, default: Date.now }, // Timestamp for the last update
});

const Teacher = mongoose.model('Teacher', teacherSchema);
export default Teacher;