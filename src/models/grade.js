import mongoose from 'mongoose';
const Schema = mongoose.Schema;

/**
 * Grade schema for MongoDB.
 * Represents a grade entry for a subject or assignment in the application.
 * 
 * @typedef {Object} Grade
 * @property {number} grade - The grade received, required.
 * @property {number} outOf - The total possible points, required.
 * @property {Schema.Types.ObjectId} s_id - Reference ID to the Subject (optional).
 * @property {Schema.Types.ObjectId} a_id - Reference ID to the Assignment (optional).
 * @property {Schema.Types.ObjectId} uid - Reference to the User (Student) (optional).
 * @property {string} notes - Extra notes providing information about the grade (optional).
 * @property {Date} date - The date when the grade was recorded (default is current date).
 * @property {Date} created_at - Timestamp for when the grade was added.
 * @property {Date} updated_at - Timestamp for the last update of the grade.
 */
const gradeSchema = new Schema({
  grade: { type: Number, required: true }, 
  outOf: { type: Number, required: true }, 
  s_id: { type: Schema.Types.ObjectId, ref: 'Subject' }, 
  a_id: { type: Schema.Types.ObjectId, ref: 'Assignment' }, 
  uid: { type: Schema.Types.ObjectId, ref: 'User' }, 
  notes: { type: String }, 
  date: { type: Date, default: Date.now }, 
  created_at: { type: Date, default: Date.now }, 
  updated_at: { type: Date, default: Date.now }, 
});

const Grade = mongoose.model('Grade', gradeSchema);

export default Grade;