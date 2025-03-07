import mongoose from 'mongoose';
const Schema = mongoose.Schema;

/**
 * Feedback schema for MongoDB.
 * Represents feedback given by an academic advisor to a student.
 * 
 * @typedef {Object} Feedback
 * @property {Schema.Types.ObjectId} advisor_id - Reference to the User (Academic Advisor) who provided the feedback.
 * @property {Schema.Types.ObjectId} student_id - Reference to the User (Student) receiving the feedback.
 * @property {Schema.Types.ObjectId} assignment_id - Reference to the Assignment (if feedback is about an assignment, optional).
 * @property {Schema.Types.ObjectId} subject_id - Reference to the Subject (if feedback is about a subject, optional).
 * @property {string} feedback_text - The written feedback provided by the advisor.
 * @property {number} rating - Optional numeric rating (e.g., 1-5) for performance feedback.
 * @property {Date} created_at - Timestamp for when the feedback was added.
 * @property {Date} updated_at - Timestamp for when the feedback was last updated.
 */
const feedbackSchema = new Schema({
  advisor_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Advisor who gives feedback
  student_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Student receiving feedback
  assignment_id: { type: Schema.Types.ObjectId, ref: 'Assignment', required: false }, // Optional, if feedback is for an assignment
  subject_id: { type: Schema.Types.ObjectId, ref: 'Subject', required: false }, // Optional, if feedback is for a subject
  feedback_text: { type: String, required: true }, // The feedback comment
  rating: { type: Number, min: 1, max: 5, required: false }, // Optional rating (1-5)
  created_at: { type: Date, default: Date.now }, 
  updated_at: { type: Date, default: Date.now }
});

// Ensure at least one of `assignment_id` or `subject_id` is provided
feedbackSchema.pre('save', function (next) {
  if (!this.assignment_id && !this.subject_id) {
    return next(new Error('Feedback must be associated with either an Assignment or a Subject.'));
  }
  next();
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
