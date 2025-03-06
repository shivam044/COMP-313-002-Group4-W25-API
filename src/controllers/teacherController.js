import Teacher from '../models/teacher.js';
import User from '../models/user.js';

/**
 * Create a new teacher.
 * 
 * @async
 * @function createTeacher
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing teacher information.
 * @param {string} req.body.first_name - The teacher's first name.
 * @param {string} req.body.last_name - The teacher's last name.
 * @param {string} req.body.phone - The teacher's phone number.
 * @param {string} req.body.school_email - The teacher's school email address.
 * @param {Schema.Types.ObjectId} req.body.uid - ID of the user who created the teacher entry.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the created teacher or an error message.
 */
const createTeacher = async (req, res) => {
  try {
    const { first_name, last_name, phone, school_email, uid } = req.body;

    // Check if the user exists
    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newTeacher = new Teacher({ first_name, last_name, phone, school_email, uid });
    const savedTeacher = await newTeacher.save();
    res.status(201).json(savedTeacher);
  } catch (error) {
    res.status(500).json({ message: 'Error creating teacher', error: error.message });
  }
};

/**
 * Get all teachers.
 * 
 * @async
 * @function getAllTeachers
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the list of all teachers or an error message.
 */
const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('uid', 'firstName lastName email'); // Populate user info
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teachers', error: error.message });
  }
};

/**
 * Get a specific teacher by ID.
 * 
 * @async
 * @function getTeacherById
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - ID of the teacher to fetch.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the teacher data or an error message.
 */
const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id).populate('uid', 'firstName lastName email'); // Populate user info

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teacher', error: error.message });
  }
};

/**
 * Update a specific teacher.
 * 
 * @async
 * @function updateTeacher
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - ID of the teacher to update.
 * @param {Object} req.body - The request body containing updated teacher information.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the updated teacher or an error message.
 */
const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, phone, school_email } = req.body;

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      id,
      { first_name, last_name, phone, school_email, updated_at: Date.now() },
      { new: true }
    );

    if (!updatedTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.status(200).json(updatedTeacher);
  } catch (error) {
    res.status(500).json({ message: 'Error updating teacher', error: error.message });
  }
};

/**
 * Delete a specific teacher.
 * 
 * @async
 * @function deleteTeacher
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - ID of the teacher to delete.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with deletion success message or an error message.
 */
const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTeacher = await Teacher.findByIdAndDelete(id);

    if (!deletedTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.status(200).json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting teacher', error: error.message });
  }
};

export default { createTeacher, getAllTeachers, getTeacherById, updateTeacher, deleteTeacher };
