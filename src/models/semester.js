import mongoose from 'mongoose';
const Schema = mongoose.Schema;

/**
 * Semester schema for MongoDB.
 * Represents a semester/term in the application.
 * 
 * @typedef {Object} Semester
 * @property {string} title - The title of the semester. If not provided, it is set automatically.
 * @property {Date} startDate - The start date of the semester, required.
 * @property {Date} endDate - The end date of the semester, required.
 * @property {Schema.Types.ObjectId} uid - Reference to the User who created this entry, required.
 * @property {Date} created_at - Timestamp for when the semester was added.
 * @property {Date} updated_at - Timestamp for the last update.
 */
const semesterSchema = new Schema({
  title: { type: String, default: "" }, 
  startDate: { type: Date, required: true }, 
  endDate: { type: Date, required: true }, 
  uid: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  created_at: { type: Date, default: Date.now }, 
  updated_at: { type: Date, default: Date.now }, 
});

/**
 * Middleware to set the default title before saving.
 * If the title is not provided, it assigns a sequential number to the semester.
 */
semesterSchema.pre('save', async function (next) {
  if (!this.title) {
    // Get the model
    const Semester = mongoose.model('Semester', semesterSchema);

    // Count existing semesters to determine the next title number
    const count = await Semester.countDocuments();
    this.title = `Semester ${count + 1}`;
  }
  next();
});

const Semester = mongoose.model('Semester', semesterSchema);
export default Semester;
