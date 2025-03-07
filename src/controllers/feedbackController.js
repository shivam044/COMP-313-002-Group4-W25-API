// Import necessary models
import Feedback from '../models/feedback.js';
import User from '../models/user.js';
import Assignment from '../models/assignment.js';
import Subject from '../models/subject.js';

/**
 * Create a new feedback entry.
 *
 * @async
 * @function createFeedback
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing feedback information.
 * @param {Schema.Types.ObjectId} req.body.advisor_id - ID of the advisor providing the feedback.
 * @param {Schema.Types.ObjectId} req.body.student_id - ID of the student receiving feedback.
 * @param {Schema.Types.ObjectId} [req.body.assignment_id] - ID of the assignment (optional).
 * @param {Schema.Types.ObjectId} [req.body.subject_id] - ID of the subject (optional).
 * @param {string} req.body.feedback_text - The feedback message.
 * @param {number} [req.body.rating] - Optional rating (1-5).
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the created feedback or an error message.
 */
const createFeedback = async (req, res) => {
  try {
    const { advisor_id, student_id, assignment_id, subject_id, feedback_text, rating } = req.body;

    // Ensure feedback is linked to either an assignment or subject
    if (!assignment_id && !subject_id) {
      return res.status(400).json({ message: 'Feedback must be associated with either an Assignment or a Subject.' });
    }

    // Validate advisor and student
    const advisor = await User.findById(advisor_id);
    if (!advisor) {
      return res.status(404).json({ message: 'Advisor not found' });
    }
    
    // Check if user has advisor role
    if (advisor.role !== 'advisor') {
      return res.status(403).json({ message: 'Only users with advisor role can submit feedback' });
    }
    
    const student = await User.findById(student_id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Validate assignment if provided
    if (assignment_id) {
      const assignment = await Assignment.findById(assignment_id);
      if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found' });
      }
    }

    // Validate subject if provided
    if (subject_id) {
      const subject = await Subject.findById(subject_id);
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
    }

    // Create new feedback object with all provided fields
    const feedbackData = { 
      advisor_id, 
      student_id, 
      feedback_text
    };
    
    // Only add these fields if they are provided
    if (assignment_id) feedbackData.assignment_id = assignment_id;
    if (subject_id) feedbackData.subject_id = subject_id;
    if (rating !== undefined) feedbackData.rating = rating;

    const newFeedback = new Feedback(feedbackData);
    const savedFeedback = await newFeedback.save();
    
    res.status(201).json(savedFeedback);
  } catch (error) {
    console.error('Feedback creation error:', error);
    res.status(500).json({ 
      message: 'Error creating feedback', 
      error: error.message,
      // Include more details if it's a validation error
      details: error.name === 'ValidationError' ? error.errors : undefined
    });
  }
};

/**
 * Get all feedback for a specific student.
 *
 * @async
 * @function getFeedbackByStudent
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.studentId - ID of the student.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the feedback list or an error message.
 */
const getFeedbackByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const feedback = await Feedback.find({ student_id: studentId })
      .populate('advisor_id', 'firstName lastName email')
      .populate('assignment_id', 'name')
      .populate('subject_id', 'subjectTitle');
    
    res.status(200).json(feedback);
  } catch (error) {
    console.error('Error fetching student feedback:', error);
    res.status(500).json({ message: 'Error fetching feedback', error: error.message });
  }
};

/**
 * Get all feedback entries.
 *
 * @async
 * @function getAllFeedback
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with all feedback entries or an error message.
 */
const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate('advisor_id', 'firstName lastName email')
      .populate('student_id', 'firstName lastName email')
      .populate('assignment_id', 'name')
      .populate('subject_id', 'subjectTitle');
    res.status(200).json(feedback);
  } catch (error) {
    console.error('Error fetching all feedback:', error);
    res.status(500).json({ message: 'Error fetching feedback', error: error.message });
  }
};

/**
 * Update a specific feedback entry.
 *
 * @async
 * @function updateFeedback
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - ID of the feedback entry to update.
 * @param {Object} req.body - The request body containing updated feedback information.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the updated feedback or an error message.
 */
const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback_text, rating } = req.body;
    
    // Only update fields that were provided
    const updateData = { updated_at: Date.now() };
    if (feedback_text !== undefined) updateData.feedback_text = feedback_text;
    if (rating !== undefined) updateData.rating = rating;
    
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedFeedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    res.status(200).json(updatedFeedback);
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ 
      message: 'Error updating feedback', 
      error: error.message,
      details: error.name === 'ValidationError' ? error.errors : undefined
    });
  }
};

/**
 * Delete a specific feedback entry.
 *
 * @async
 * @function deleteFeedback
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - ID of the feedback entry to delete.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with deletion success message or an error message.
 */
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFeedback = await Feedback.findByIdAndDelete(id);
    if (!deletedFeedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ message: 'Error deleting feedback', error: error.message });
  }
};

/**
 * Get feedback by assignment ID.
 *
 * @async
 * @function getFeedbackByAssignment
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.assignmentId - ID of the assignment.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the feedback list or an error message.
 */
export const getFeedbackByAssignment = async (req, res) => {
    try {
      const feedback = await Feedback.find({ assignment_id: req.params.assignmentId })
        .populate('advisor_id', 'firstName lastName email')
        .sort({ created_at: -1 });
  
      if (!feedback.length) {
        return res.status(404).json({ message: 'No feedback found for this assignment' });
      }
  
      res.status(200).json(feedback);
    } catch (error) {
      console.error('Error fetching feedback by assignment:', error);
      res.status(500).json({ message: 'Error fetching feedback', error: error.message });
    }
  };
  
  /**
   * Get feedback by subject ID.
   *
   * @async
   * @function getFeedbackBySubject
   * @param {Object} req - Express request object.
   * @param {Object} req.params - The request parameters.
   * @param {string} req.params.subjectId - ID of the subject.
   * @param {Object} res - Express response object.
   * @returns {Promise<void>} Response with the feedback list or an error message.
   */
  export const getFeedbackBySubject = async (req, res) => {
    try {
      const feedback = await Feedback.find({ subject_id: req.params.subjectId })
        .populate('advisor_id', 'firstName lastName email')
        .sort({ created_at: -1 });
  
      if (!feedback.length) {
        return res.status(404).json({ message: 'No feedback found for this subject' });
      }
  
      res.status(200).json(feedback);
    } catch (error) {
      console.error('Error fetching feedback by subject:', error);
      res.status(500).json({ message: 'Error fetching feedback', error: error.message });
    }
  };





export default { createFeedback, getFeedbackByStudent, getAllFeedback, updateFeedback, deleteFeedback, getFeedbackByAssignment, getFeedbackBySubject };