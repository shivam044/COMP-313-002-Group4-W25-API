import mongoose from 'mongoose';
const Schema = mongoose.Schema;

/**
 * Event schema for MongoDB.
 * Represents an event in the application.
 * 
 * @typedef {Object} Event
 * @property {string} name - The name of the event, required (e.g., Assignment, Exam, Reminder).
 * @property {string} type - The type of the event, must be one of 'Assignment', 'Exam', or 'Reminder', required.
 * @property {string} description - Optional description for the event.
 * @property {Date} date - The date of the event, required.
 * @property {Schema.Types.ObjectId} user_id - Reference to the User associated with this event, required.
 * @property {Schema.Types.ObjectId} related_id - Reference to another related model (optional).
 * @property {string} relatedModel - Name of the related model, must be one of 'Subject', 'Grade', 'Assignment', or 'User' (optional).
 * @property {Date} created_at - Timestamp for when the event was added.
 * @property {Date} updated_at - Timestamp for the last update of the event.
 */
const eventSchema = new Schema({
  name: { type: String, required: true }, 
  type: { type: String, enum: ['Assignment', 'Exam', 'Reminder'], required: true }, 
  description: { type: String }, 
  date: { type: Date, required: true }, 
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  related_id: { type: Schema.Types.ObjectId, refPath: 'relatedModel' }, 
  relatedModel: { type: String, enum: ['Subject', 'Grade', 'Assignment', 'User'] }, 
  created_at: { type: Date, default: Date.now }, 
  updated_at: { type: Date, default: Date.now }, 
});

const Event = mongoose.model('Event', eventSchema);
export default Event;