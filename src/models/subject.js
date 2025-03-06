import mongoose from 'mongoose';
const Schema = mongoose.Schema;

/**
 * Subject schema for MongoDB.
 * Represents a subject in the application.
 * 
 * @typedef {Object} Subject
 * @property {string} subjectTitle - The title of the subject, required.
 * @property {number} targetGrade - The target grade for the subject (optional).
 * @property {Schema.Types.ObjectId} uid - Reference to the User (Student) who takes this subject (optional).
 * @property {Schema.Types.ObjectId} t_uid - Reference to the Teacher for this subject (optional).
 * @property {Schema.Types.ObjectId} semester_id - Reference to the Semester/Term for this subject (optional).
 * @property {string} room - The room name or number for the subject (optional).
 * @property {Date} created_at - Timestamp for when the subject was added.
 * @property {Date} updated_at - Timestamp for the last update.
 */
const subjectSchema = new Schema({
  subjectTitle: { type: String, required: true }, 
  targetGrade: { type: Number }, 
  uid: { type: Schema.Types.ObjectId, ref: 'User' }, 
  t_uid: { type: Schema.Types.ObjectId, ref: 'Teacher', required: false }, 
  semester_id: { type: Schema.Types.ObjectId, ref: 'Semester', required: false }, 
  room: { type: String }, 
  created_at: { type: Date, default: Date.now }, 
  updated_at: { type: Date, default: Date.now }, 
});

const Subject = mongoose.model('Subject', subjectSchema);
export default Subject;