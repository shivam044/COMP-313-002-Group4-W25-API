import mongoose from 'mongoose';
const Schema = mongoose.Schema;

/**
 * TimeTable schema for MongoDB.
 * Represents a timetable entry for a subject in the application.
 * 
 * @typedef {Object} TimeTable
 * @property {Schema.Types.ObjectId} subject_id - Reference to the Subject for this timetable entry, required.
 * @property {string} day_of_week - Day of the week when the class is held (e.g., "Monday", "Tuesday"), required.
 * @property {string} start_time - Start time of the class (e.g., "09:00 AM"), required.
 * @property {string} end_time - End time of the class (e.g., "10:30 AM"), required.
 * @property {string} room - Room name or number for the class (optional).
 * @property {Schema.Types.ObjectId} t_uid - Reference to the Teacher for this class (optional).
 * @property {string} note - Additional notes regarding the class (optional).
 * @property {Schema.Types.ObjectId} uid - Reference to the User who created this timetable entry, required.
 * @property {Date} created_at - Timestamp for when the timetable entry was added.
 * @property {Date} updated_at - Timestamp for the last update of the timetable entry.
 */
const timeTableSchema = new Schema({
  subject_id: { type: Schema.Types.ObjectId, ref: 'Subject', required: true }, // Reference to the Subject
  day_of_week: { type: String, required: true }, // Day of the week (e.g., "Monday", "Tuesday")
  start_time: { type: String, required: true }, // Start time of the class (e.g., "09:00 AM")
  end_time: { type: String, required: true }, // End time of the class (e.g., "10:30 AM")
  room: { type: String, default: "" }, // Room name/number (optional)
  t_uid: { type: Schema.Types.ObjectId, ref: 'Teacher', required: false }, // Reference to Teacher (optional)
  note: { type: String, default: "" }, // Additional notes (optional)
  uid: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User who created this entry
  created_at: { type: Date, default: Date.now }, // Timestamp when the timetable entry was added
  updated_at: { type: Date, default: Date.now }, // Timestamp for the last update
});

const TimeTable = mongoose.model('TimeTable', timeTableSchema);
export default TimeTable;
