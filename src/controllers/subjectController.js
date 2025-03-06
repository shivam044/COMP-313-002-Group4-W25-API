import Subject from '../models/subject.js';
import User from '../models/user.js';
import Teacher from '../models/teacher.js';
import Semester from '../models/semester.js';

/**
 * Create a new subject.
 * 
 * @async
 * @function createSubject
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing subject information.
 * @param {string} req.body.subjectTitle - Title of the subject.
 * @param {number} req.body.targetGrade - Target grade for the subject (optional).
 * @param {Schema.Types.ObjectId} req.body.uid - ID of the user (student) who created the subject.
 * @param {Schema.Types.ObjectId} req.body.t_uid - ID of the teacher.
 * @param {Schema.Types.ObjectId} req.body.semester_id - ID of the semester.
 * @param {string} [req.body.room] - Room name or number (optional).
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the created subject or an error message.
 */
const createSubject = async (req, res) => {
  try {
    const { subjectTitle, targetGrade, uid, t_uid, semester_id, room } = req.body;

    // Check if the user exists
    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the teacher exists
    const teacher = await Teacher.findById(t_uid);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Check if the semester exists
    const semester = await Semester.findById(semester_id);
    if (!semester) {
      return res.status(404).json({ message: 'Semester not found' });
    }

    const newSubject = new Subject({ subjectTitle, targetGrade, uid, t_uid, semester_id, room });
    const savedSubject = await newSubject.save();
    res.status(201).json(savedSubject);
  } catch (error) {
    res.status(500).json({ message: 'Error creating subject', error: error.message });
  }
};

/**
 * Get all subjects for a specific user (student).
 * 
 * @async
 * @function getSubjectsByUser
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.userId - ID of the user to fetch subjects for.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the subjects for the user or an error message.
 */
const getSubjectsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const subjects = await Subject.find({ uid: userId })
      .populate('t_uid', 'first_name last_name school_email')
      .populate('semester_id', 'title startDate endDate'); // Populate teacher and semester info
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subjects', error: error.message });
  }
};

/**
 * Get a specific subject by ID.
 * 
 * @async
 * @function getSubjectById
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - ID of the subject to fetch.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the subject data or an error message.
 */
const getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findById(id)
      .populate('t_uid', 'first_name last_name school_email')
      .populate('semester_id', 'title startDate endDate'); // Populate teacher and semester info
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subject', error: error.message });
  }
};

/**
 * Get all subjects.
 * 
 * @async
 * @function getAllSubjects
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with all subjects or an error message.
 */
const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate('t_uid', 'first_name last_name school_email')
      .populate('semester_id', 'title startDate endDate'); // Populate teacher and semester info
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subjects', error: error.message });
  }
};

/**
 * Update a specific subject.
 * 
 * @async
 * @function updateSubject
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - ID of the subject to update.
 * @param {Object} req.body - The request body containing updated subject information.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the updated subject or an error message.
 */
const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { subjectTitle, targetGrade, t_uid, semester_id, room } = req.body;

    // Check if the teacher exists
    const teacher = await Teacher.findById(t_uid);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Check if the semester exists
    const semester = await Semester.findById(semester_id);
    if (!semester) {
      return res.status(404).json({ message: 'Semester not found' });
    }

    const updatedSubject = await Subject.findByIdAndUpdate(
      id,
      { subjectTitle, targetGrade, t_uid, semester_id, room, updated_at: Date.now() },
      { new: true }
    )
      .populate('t_uid', 'first_name last_name school_email')
      .populate('semester_id', 'title startDate endDate'); // Populate teacher and semester info
    if (!updatedSubject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.status(200).json(updatedSubject);
  } catch (error) {
    res.status(500).json({ message: 'Error updating subject', error: error.message });
  }
};

/**
 * Delete a specific subject.
 * 
 * @async
 * @function deleteSubject
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - ID of the subject to delete.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with deletion success message or an error message.
 */
const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSubject = await Subject.findByIdAndDelete(id);
    if (!deletedSubject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.status(200).json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting subject', error: error.message });
  }
};

export default {
  createSubject,
  getSubjectsByUser,
  getSubjectById,
  getAllSubjects,
  updateSubject,
  deleteSubject,
};
