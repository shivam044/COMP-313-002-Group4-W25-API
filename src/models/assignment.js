import mongoose from 'mongoose';
const Schema = mongoose.Schema;

/**
 * Assignment schema for MongoDB.
 * Represents an assignment in the application.
 * 
 * @typedef {Object} Assignment
 * @property {string} name - The name of the assignment, required.
 * @property {Schema.Types.ObjectId} s_id - Reference to the Subject this assignment belongs to (optional).
 * @property {Schema.Types.ObjectId} uid - Reference to the User (Student) assigned this task (optional).
 * @property {Schema.Types.ObjectId} g_id - Reference to the Grade for this assignment (optional).
 * @property {Date} due_date - The due date for the assignment (optional).
 * @property {Date} created_at - Timestamp for when the assignment was added.
 * @property {Date} updated_at - Timestamp for the last update of the assignment.
 */
const assignmentSchema = new Schema({
  name: { type: String, required: true }, 
  s_id: { type: Schema.Types.ObjectId, ref: 'Subject' }, 
  uid: { type: Schema.Types.ObjectId, ref: 'User' }, 
  g_id: { type: Schema.Types.ObjectId, ref: 'Grade' }, 
  due_date: { type: Date }, 
  created_at: { type: Date, default: Date.now }, 
  updated_at: { type: Date, default: Date.now }, 
});

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;