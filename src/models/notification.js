import mongoose from 'mongoose';
const Schema = mongoose.Schema;

/**
 * Notification schema for MongoDB.
 * Represents a notification to be sent to a user in the application.
 * 
 * @typedef {Object} Notification
 * @property {string} title - The title of the notification, required.
 * @property {string} message - The body of the notification, required.
 * @property {Schema.Types.ObjectId} uid - Reference to the User who will receive the notification, required.
 * @property {string} type - The type of notification, must be one of 'info', 'reminder', 'alert', or 'success'. Defaults to 'info'.
 * @property {boolean} read - Status of the notification indicating whether it has been read. Defaults to false.
 * @property {Date} created_at - Timestamp for when the notification was added.
 * @property {Date} updated_at - Timestamp for the last update of the notification.
 */
const notificationSchema = new Schema({
  title: { type: String, required: true }, // Notification title
  message: { type: String, required: true }, // Notification message body
  uid: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User who will receive the notification
  type: { type: String, enum: ['info', 'reminder', 'alert', 'success'], default: 'info' }, // Type of notification
  read: { type: Boolean, default: false }, // Status of the notification (read/unread)
  created_at: { type: Date, default: Date.now }, // Timestamp for when the notification was created
  updated_at: { type: Date, default: Date.now }, // Timestamp for the last update of the notification
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
