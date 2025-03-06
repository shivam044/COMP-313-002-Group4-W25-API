import Notification from '../models/notification.js';
import User from '../models/user.js';

// Create a new notification
const createNotification = async (req, res) => {
  try {
    const { title, message, uid, type } = req.body;
    // Check if the user exists
    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const newNotification = new Notification({ title, message, uid, type });
    const savedNotification = await newNotification.save();
    res.status(201).json(savedNotification);
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error: error.message });
  }
};

// Get all notifications for a user
const getAllNotifications = async (req, res) => {
  try {
    const { userId } = req.auth; // Assumes user ID is in the auth object after authentication
    const notifications = await Notification.find({ uid: userId }).populate('uid', 'firstName lastName email');
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

// Get all notifications for a specific user
const getNotificationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const notifications = await Notification.find({ uid: userId })
      .populate('uid', 'firstName lastName email'); // Populate user info
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

// Get a specific notification by ID
const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id).populate('uid', 'firstName lastName email');
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notification', error: error.message });
  }
};

// Update a specific notification
const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, type, read } = req.body;
    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      { title, message, type, read, updated_at: Date.now() },
      { new: true }
    );
    if (!updatedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(updatedNotification);
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification', error: error.message });
  }
};

// Delete a specific notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNotification = await Notification.findByIdAndDelete(id);
    if (!deletedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification', error: error.message });
  }
};

// Mark a notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      { read: true, updated_at: Date.now() },
      { new: true }
    );
    if (!updatedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(updatedNotification);
  } catch (error) {
    res.status(500).json({ message: 'Error marking notification as read', error: error.message });
  }
};

export default { createNotification, getAllNotifications, getNotificationById, updateNotification, deleteNotification, markNotificationAsRead, getNotificationsByUser };
