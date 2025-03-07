// Event Controller
import Event from '../models/event.js';
import User from '../models/user.js';
import Subject from '../models/subject.js';
import Grade from '../models/grade.js';
import Assignment from '../models/assignment.js';

/**
 * Create a new event.
 * 
 * @async
 * @function createEvent
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing event information.
 * @param {string} req.body.name - Name of the event.
 * @param {string} req.body.type - Type of the event ('Assignment', 'Exam', 'Reminder', 'Meeting').
 * @param {string} [req.body.description] - Description of the event (optional).
 * @param {Date} req.body.date - Date of the event.
 * @param {Schema.Types.ObjectId} req.body.user_id - ID of the user associated with the event.
 * @param {Schema.Types.ObjectId} [req.body.related_id] - ID of the related model (optional).
 * @param {string} [req.body.relatedModel] - The related model type ('Subject', 'Grade', 'Assignment', 'User') (optional).
 * @param {string} [req.body.time] - Time of the event (for meetings) (optional).
 * @param {number} [req.body.duration] - Duration in minutes (for meetings) (optional).
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the created event or an error message.
 */
const createEvent = async (req, res) => {
  try {
    const { 
      name, 
      type, 
      description, 
      date, 
      user_id, 
      related_id, 
      relatedModel,
      time,
      duration
    } = req.body;

    // Check if the user exists
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate related model if provided
    if (related_id && relatedModel) {
      let relatedEntity;
      switch (relatedModel) {
        case 'Subject':
          relatedEntity = await Subject.findById(related_id);
          break;
        case 'Grade':
          relatedEntity = await Grade.findById(related_id);
          break;
        case 'Assignment':
          relatedEntity = await Assignment.findById(related_id);
          break;
        case 'User':
          relatedEntity = await User.findById(related_id);
          break;
        default:
          return res.status(400).json({ message: 'Invalid related model' });
      }
      if (!relatedEntity) {
        return res.status(404).json({ message: `${relatedModel} not found` });
      }
    }

    const newEvent = new Event({ 
      name, 
      type, 
      description, 
      date, 
      user_id, 
      related_id, 
      relatedModel,
      time,
      duration
    });
    
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

/**
 * Schedule a meeting between an advisor and a student
 * Creates two event records - one for each participant
 * 
 * @async
 * @function scheduleMeeting
 * @param {Object} req - Express request object
 * @param {Object} req.body - The request body
 * @param {string} req.body.name - Title of the meeting
 * @param {string} [req.body.description] - Description of the meeting (optional)
 * @param {Date} req.body.date - Date of the meeting
 * @param {string} req.body.time - Time of the meeting (e.g., "14:30")
 * @param {number} [req.body.duration] - Duration in minutes (optional, default: 30)
 * @param {Schema.Types.ObjectId} req.body.advisorId - ID of the advisor
 * @param {Schema.Types.ObjectId} req.body.studentId - ID of the student
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Response with the created meeting events or an error message
 */
const scheduleMeeting = async (req, res) => {
  try {
    const {
      name,
      description,
      date,
      time,
      duration = 30,
      advisorId,
      studentId
    } = req.body;

    // Check if both users exist
    const [advisor, student] = await Promise.all([
      User.findById(advisorId),
      User.findById(studentId)
    ]);

    if (!advisor) {
      return res.status(404).json({ message: 'Advisor not found' });
    }
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Create meeting event for student
    const studentEvent = new Event({
      name,
      type: 'Meeting',
      description,
      date,
      time,
      duration,
      user_id: studentId,
      related_id: advisorId,
      relatedModel: 'User'
    });

    // Create meeting event for advisor
    const advisorEvent = new Event({
      name,
      type: 'Meeting',
      description,
      date,
      time,
      duration,
      user_id: advisorId,
      related_id: studentId,
      relatedModel: 'User'
    });

    // Save both events (using Promise.all for parallel operation)
    const [savedStudentEvent, savedAdvisorEvent] = await Promise.all([
      studentEvent.save(),
      advisorEvent.save()
    ]);

    res.status(201).json({
      studentEvent: savedStudentEvent,
      advisorEvent: savedAdvisorEvent
    });
  } catch (error) {
    res.status(500).json({ message: 'Error scheduling meeting', error: error.message });
  }
};

/**
 * Get all events.
 * 
 * @async
 * @function getAllEvents
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with all events or an error message.
 */
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('user_id', 'firstName lastName email');
    
    // If related model is User, populate that data as well
    for (let i = 0; i < events.length; i++) {
      if (events[i].relatedModel === 'User' && events[i].related_id) {
        await events[i].populate('related_id', 'firstName lastName email');
      }
    }
    
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};

/**
 * Get a specific event by ID.
 * 
 * @async
 * @function getEventById
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - ID of the event to fetch.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the event data or an error message.
 */
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).populate('user_id', 'firstName lastName email');
    
    // If related model is User, populate that data as well
    if (event && event.relatedModel === 'User' && event.related_id) {
      await event.populate('related_id', 'firstName lastName email');
    }
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event', error: error.message });
  }
};

/**
 * Get upcoming events for a specific user.
 * 
 * @async
 * @function getUserEvents
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.userId - ID of the user.
 * @param {Object} req.query - The query parameters.
 * @param {string} [req.query.type] - Filter by event type.
 * @param {boolean} [req.query.past] - Whether to get past events instead of upcoming.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the user's events or an error message.
 */
const getUserEvents = async (req, res) => {
  try {
    const { userId } = req.params;
    const { type, past } = req.query;
    
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const currentDate = new Date();
    
    // Build query
    const query = { user_id: userId };
    
    // Add date filter
    if (past === 'true') {
      query.date = { $lt: currentDate };
    } else {
      query.date = { $gte: currentDate };
    }
    
    // Add type filter if specified
    if (type) {
      query.type = type;
    }
    
    // Get events
    const events = await Event.find(query)
      .sort({ date: past === 'true' ? -1 : 1 }) // Sort by date: descending for past, ascending for upcoming
      .populate('user_id', 'firstName lastName email');
    
    // If events are meetings, populate the related user
    for (let i = 0; i < events.length; i++) {
      if (events[i].relatedModel === 'User' && events[i].related_id) {
        await events[i].populate('related_id', 'firstName lastName email');
      }
    }
    
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user events', error: error.message });
  }
};

/**
 * Update a specific event.
 * 
 * @async
 * @function updateEvent
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - ID of the event to update.
 * @param {Object} req.body - The request body containing updated event information.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with the updated event or an error message.
 */
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      type, 
      description, 
      date, 
      related_id, 
      relatedModel,
      time,
      duration
    } = req.body;

    // Validate related model if provided
    if (related_id && relatedModel) {
      let relatedEntity;
      switch (relatedModel) {
        case 'Subject':
          relatedEntity = await Subject.findById(related_id);
          break;
        case 'Grade':
          relatedEntity = await Grade.findById(related_id);
          break;
        case 'Assignment':
          relatedEntity = await Assignment.findById(related_id);
          break;
        case 'User':
          relatedEntity = await User.findById(related_id);
          break;
        default:
          return res.status(400).json({ message: 'Invalid related model' });
      }
      if (!relatedEntity) {
        return res.status(404).json({ message: `${relatedModel} not found` });
      }
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { 
        name, 
        type, 
        description, 
        date, 
        related_id, 
        relatedModel, 
        time,
        duration,
        updated_at: Date.now() 
      },
      { new: true }
    );
    
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
};

/**
 * Delete a specific event.
 * 
 * @async
 * @function deleteEvent
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - ID of the event to delete.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Response with deletion success message or an error message.
 */
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};

/**
 * Cancel a meeting (deletes both the advisor and student event records)
 * 
 * @async
 * @function cancelMeeting
 * @param {Object} req - Express request object
 * @param {Object} req.params - The request parameters
 * @param {string} req.params.id - ID of one meeting event to cancel
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Response with success message or an error message
 */
const cancelMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the meeting event to be canceled
    const meetingEvent = await Event.findById(id);
    if (!meetingEvent || meetingEvent.type !== 'Meeting') {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    
    // Find the counterpart meeting event (the other user's event)
    const counterpartMeeting = await Event.findOne({
      type: 'Meeting',
      date: meetingEvent.date,
      time: meetingEvent.time,
      related_id: meetingEvent.user_id,
      user_id: meetingEvent.related_id
    });
    
    // Delete both meeting events
    const deleteOperations = [Event.findByIdAndDelete(id)];
    
    if (counterpartMeeting) {
      deleteOperations.push(Event.findByIdAndDelete(counterpartMeeting._id));
    }
    
    await Promise.all(deleteOperations);
    
    res.status(200).json({ 
      message: 'Meeting canceled successfully',
      canceledEvents: counterpartMeeting ? 2 : 1
    });
  } catch (error) {
    res.status(500).json({ message: 'Error canceling meeting', error: error.message });
  }
};

export default { 
  createEvent, 
  getAllEvents, 
  getEventById, 
  updateEvent, 
  deleteEvent,
  scheduleMeeting,
  getUserEvents,
  cancelMeeting
};