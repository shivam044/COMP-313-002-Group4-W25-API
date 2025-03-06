import TimeTable from '../models/timetable.js';
import Subject from '../models/subject.js';
import Teacher from '../models/teacher.js';
import User from '../models/user.js';

/**
 * Create a new timetable entry.
 * 
 * @async
 * @function createTimeTableEntry
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing timetable information.
 * @param {Schema.Types.ObjectId} req.body.subject_id - ID of the subject.
 * @param {string} req.body.day_of_week - Day of the week for the timetable entry.
 * @param {string} req.body.start_time - Start time of the class (e.g., "09:00 AM").
 * @param {string} req.body.end_time - End time of the class (e.g., "10:30 AM").
 * @param {string} [req.body.room] - Room name or number (optional).
 * @param {Schema.Types.ObjectId} [req.body.t_uid] - ID of the teacher (optional).
 * @param {string} [req.body.note] - Additional notes for the timetable entry (optional).
 * @param {Schema.Types.ObjectId} req.body.uid - ID of the user who created the entry.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the created timetable entry or an error message.
 */
const createTimeTableEntry = async (req, res) => {
  try {
    const { subject_id, day_of_week, start_time, end_time, room, t_uid, note, uid } = req.body;

    // Check if the user exists
    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the subject exists
    const subject = await Subject.findById(subject_id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const newTimeTableEntry = new TimeTable({
      subject_id,
      day_of_week,
      start_time,
      end_time,
      room,
      t_uid,
      note,
      uid,
    });

    const savedTimeTableEntry = await newTimeTableEntry.save();
    res.status(201).json(savedTimeTableEntry);
  } catch (error) {
    res.status(500).json({ message: 'Error creating timetable entry', error: error.message });
  }
};

/**
 * Get all timetable entries for a specific user.
 * 
 * @async
 * @function getTimeTableByUser
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.userId - ID of the user.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the timetable entries for the user or an error message.
 */
const getTimeTableByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const timeTableEntries = await TimeTable.find({ uid: userId })
      .populate('subject_id', 'subjectTitle')
      .populate('t_uid', 'first_name last_name school_email'); // Populate subject and teacher info

    res.status(200).json(timeTableEntries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching timetable entries', error: error.message });
  }
};

/**
 * Get a specific timetable entry by ID.
 * 
 * @async
 * @function getTimeTableById
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - ID of the timetable entry.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the timetable entry or an error message.
 */
const getTimeTableById = async (req, res) => {
  try {
    const { id } = req.params;
    const timeTableEntry = await TimeTable.findById(id)
      .populate('subject_id', 'subjectTitle')
      .populate('t_uid', 'first_name last_name school_email'); // Populate subject and teacher info

    if (!timeTableEntry) {
      return res.status(404).json({ message: 'Timetable entry not found' });
    }

    res.status(200).json(timeTableEntry);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching timetable entry', error: error.message });
  }
};

/**
 * Get all timetable entries.
 * 
 * @async
 * @function getAllTimeTableEntries
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with all timetable entries or an error message.
 */
const getAllTimeTableEntries = async (req, res) => {
  try {
    const timeTableEntries = await TimeTable.find()
      .populate('subject_id', 'subjectTitle')
      .populate('t_uid', 'first_name last_name school_email'); // Populate subject and teacher info

    res.status(200).json(timeTableEntries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching timetable entries', error: error.message });
  }
};

/**
 * Update a specific timetable entry.
 * 
 * @async
 * @function updateTimeTableEntry
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - ID of the timetable entry.
 * @param {Object} req.body - The request body containing updated information for the timetable entry.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the updated timetable entry or an error message.
 */
const updateTimeTableEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject_id, day_of_week, start_time, end_time, room, t_uid, note } = req.body;

    const updatedTimeTableEntry = await TimeTable.findByIdAndUpdate(
      id,
      { subject_id, day_of_week, start_time, end_time, room, t_uid, note, updated_at: Date.now() },
      { new: true }
    );

    if (!updatedTimeTableEntry) {
      return res.status(404).json({ message: 'Timetable entry not found' });
    }

    res.status(200).json(updatedTimeTableEntry);
  } catch (error) {
    res.status(500).json({ message: 'Error updating timetable entry', error: error.message });
  }
};

/**
 * Delete a specific timetable entry.
 * 
 * @async
 * @function deleteTimeTableEntry
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - ID of the timetable entry to delete.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with deletion success message or an error message.
 */
const deleteTimeTableEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTimeTableEntry = await TimeTable.findByIdAndDelete(id);

    if (!deletedTimeTableEntry) {
      return res.status(404).json({ message: 'Timetable entry not found' });
    }

    res.status(200).json({ message: 'Timetable entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting timetable entry', error: error.message });
  }
};

export default {
  createTimeTableEntry,
  getTimeTableByUser,
  getTimeTableById,
  getAllTimeTableEntries,
  updateTimeTableEntry,
  deleteTimeTableEntry,
};
