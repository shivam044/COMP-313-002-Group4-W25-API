// Import necessary modules
import Grade from '../models/grade.js';
import User from '../models/user.js';
import Subject from '../models/subject.js';
import Assignment from '../models/assignment.js';

/**
 * Create a new grade.
 * 
 * @async
 * @function createGrade
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing grade information.
 * @param {number} req.body.grade - Grade value.
 * @param {Schema.Types.ObjectId} req.body.s_id - ID of the subject.
 * @param {Schema.Types.ObjectId} [req.body.a_id] - ID of the assignment (optional).
 * @param {Schema.Types.ObjectId} req.body.uid - ID of the user (student) who received the grade.
 * @param {string} [req.body.notes] - Additional notes for the grade (optional).
 * @param {number} req.body.outOf - The maximum possible grade value.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the created grade or an error message.
 */
const createGrade = async (req, res) => {
  try {
    const { grade, s_id, a_id, uid, notes, outOf } = req.body;

    // Check if the user (student) exists
    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the subject exists
    const subject = await Subject.findById(s_id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Check if the assignment exists
    if (a_id) {
      const assignment = await Assignment.findById(a_id);
      if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found' });
      }
    }

    const newGrade = new Grade({ grade, s_id, a_id, uid, notes, outOf });
    const savedGrade = await newGrade.save();
    res.status(201).json(savedGrade);
  } catch (error) {
    res.status(500).json({ message: 'Error creating grade', error: error.message });
  }
};

/**
 * Get all grades for a specific user (student).
 * 
 * @async
 * @function getGradesByUser
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.userId - ID of the user to fetch grades for.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the grades for the user or an error message.
 */
const getGradesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const grades = await Grade.find({ uid: userId })
      .populate('s_id', 'subjectTitle')
      .populate('a_id', 'assignmentTitle'); // Populate subject and assignment info

    res.status(200).json(grades);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grades', error: error.message });
  }
};

/**
 * Get a specific grade by ID.
 * 
 * @async
 * @function getGradeById
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - ID of the grade to fetch.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the grade data or an error message.
 */
const getGradeById = async (req, res) => {
  try {
    const { id } = req.params;
    const grade = await Grade.findById(id)
      .populate('s_id', 'subjectTitle')
      .populate('a_id', 'assignmentTitle')
      .populate('uid', 'firstName lastName email'); // Populate subject, assignment, and user info

    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }

    res.status(200).json(grade);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grade', error: error.message });
  }
};

/**
 * Get all grades.
 * 
 * @async
 * @function getAllGrades
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with all grades or an error message.
 */
const getAllGrades = async (req, res) => {
  try {
    const grades = await Grade.find()
      .populate('s_id', 'subjectTitle')
      .populate('a_id', 'assignmentTitle')
      .populate('uid', 'firstName lastName email'); // Populate subject, assignment, and user info

    res.status(200).json(grades);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grades', error: error.message });
  }
};

/**
 * Update a specific grade.
 * 
 * @async
 * @function updateGrade
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - ID of the grade to update.
 * @param {Object} req.body - The request body containing updated grade information.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the updated grade or an error message.
 */
const updateGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const { grade, s_id, a_id, notes, outOf } = req.body;

    if (s_id) {
      const subject = await Subject.findById(s_id);
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
    }

    if (a_id) {
      const assignment = await Assignment.findById(a_id);
      if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found' });
      }
    }

    const updatedGrade = await Grade.findByIdAndUpdate(
      id,
      { grade, s_id, a_id, notes, outOf, updated_at: Date.now() },
      { new: true }
    );

    if (!updatedGrade) {
      return res.status(404).json({ message: 'Grade not found' });
    }

    res.status(200).json(updatedGrade);
  } catch (error) {
    res.status(500).json({ message: 'Error updating grade', error: error.message });
  }
};

/**
 * Delete a specific grade.
 * 
 * @async
 * @function deleteGrade
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - ID of the grade to delete.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with deletion success message or an error message.
 */
const deleteGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGrade = await Grade.findByIdAndDelete(id);

    if (!deletedGrade) {
      return res.status(404).json({ message: 'Grade not found' });
    }

    res.status(200).json({ message: 'Grade deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting grade', error: error.message });
  }
};

export default { createGrade, getGradesByUser, getGradeById, getAllGrades, updateGrade, deleteGrade };
