// Import necessary modules
import Assignment from '../models/assignment.js';
import User from '../models/user.js';
import Subject from '../models/subject.js';

/**
 * Create a new assignment.
 * 
 * @async
 * @function createAssignment
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing assignment information.
 * @param {string} req.body.name - Name of the assignment.
 * @param {Schema.Types.ObjectId} req.body.s_id - ID of the subject.
 * @param {Schema.Types.ObjectId} req.body.uid - ID of the user (student) associated with the assignment.
 * @param {Schema.Types.ObjectId} [req.body.g_id] - ID of the grade (optional).
 * @param {Date} req.body.due_date - Due date for the assignment.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the created assignment or an error message.
 */
const createAssignment = async (req, res) => {
  try {
    const { name, s_id, uid, g_id, due_date } = req.body;

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

    const newAssignment = new Assignment({ name, s_id, uid, g_id, due_date });
    const savedAssignment = await newAssignment.save();
    res.status(201).json(savedAssignment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating assignment', error: error.message });
  }
};

/**
 * Get all assignments for a specific user (student).
 * 
 * @async
 * @function getAssignmentsByUser
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.userId - ID of the user to fetch assignments for.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the assignments for the user or an error message.
 */
const getAssignmentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const assignments = await Assignment.find({ uid: userId }).populate('s_id', 'subjectTitle'); // Populate subject info
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignments', error: error.message });
  }
};

/**
 * Get a specific assignment by ID.
 * 
 * @async
 * @function getAssignmentById
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - ID of the assignment to fetch.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the assignment data or an error message.
 */
const getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id).populate('s_id', 'subjectTitle').populate('uid', 'firstName lastName email'); // Populate subject and user info
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignment', error: error.message });
  }
};

/**
 * Get all assignments.
 * 
 * @async
 * @function getAllAssignments
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with all assignments or an error message.
 */
const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().populate('s_id', 'subjectTitle').populate('uid', 'firstName lastName email'); // Populate subject and user info
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignments', error: error.message });
  }
};

/**
 * Update a specific assignment.
 * 
 * @async
 * @function updateAssignment
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - ID of the assignment to update.
 * @param {Object} req.body - The request body containing updated assignment information.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the updated assignment or an error message.
 */
const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, s_id, g_id, due_date } = req.body;

    if (s_id) {
      const subject = await Subject.findById(s_id);
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
    }

    const updatedAssignment = await Assignment.findByIdAndUpdate(
      id,
      { name, s_id, g_id, due_date, updated_at: Date.now() },
      { new: true }
    );

    if (!updatedAssignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json(updatedAssignment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating assignment', error: error.message });
  }
};

/**
 * Delete a specific assignment.
 * 
 * @async
 * @function deleteAssignment
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - ID of the assignment to delete.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with deletion success message or an error message.
 */
const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAssignment = await Assignment.findByIdAndDelete(id);
    if (!deletedAssignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting assignment', error: error.message });
  }
};

export default { createAssignment, getAssignmentsByUser, getAssignmentById, getAllAssignments, updateAssignment, deleteAssignment };
