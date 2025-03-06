import mongoose from 'mongoose';
const Schema = mongoose.Schema;

/**
 * UserSettings schema for MongoDB.
 * Represents user-specific settings in the application.
 * 
 * @typedef {Object} UserSettings
 * @property {Schema.Types.ObjectId} userId - Reference to the User for whom these settings apply, required.
 * @property {string} theme - Theme preference for the user (e.g., 'light', 'dark'). Defaults to 'light'.
 * @property {Object} notifications - Notification preferences for the user.
 * @property {boolean} notifications.email - Whether the user wants email notifications. Defaults to true.
 * @property {boolean} notifications.sms - Whether the user wants SMS notifications. Defaults to false.
 * @property {boolean} notifications.push - Whether the user wants push notifications. Defaults to true.
 * @property {string} language - Language preference for the user. Defaults to 'en'.
 * @property {Object} privacy - Privacy settings for the user.
 * @property {string} privacy.profileVisibility - Profile visibility, must be one of 'public', 'private', or 'friends'. Defaults to 'public'.
 * @property {Date} created_at - Timestamp for when the settings were created.
 * @property {Date} updated_at - Timestamp for the last update of the settings.
 */
const userSettingsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  theme: { type: String, default: 'light' }, 
  notifications: {
    email: { type: Boolean, default: true }, 
    sms: { type: Boolean, default: false }, 
    push: { type: Boolean, default: true }, 
  },
  language: { type: String, default: 'en' }, 
  privacy: {
    profileVisibility: { type: String, enum: ['public', 'private', 'friends'], default: 'public' }, 
  },
  created_at: { type: Date, default: Date.now }, 
  updated_at: { type: Date, default: Date.now }, 
});

const UserSettings = mongoose.model('UserSettings', userSettingsSchema);
export default UserSettings;
