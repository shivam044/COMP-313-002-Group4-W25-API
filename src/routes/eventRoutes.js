import express from 'express';
import auth from '../controllers/authController.js';
import eventCtrl from '../controllers/eventController.js';

const eventRouter = express.Router();

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       500:
 *         description: Server error
 */
eventRouter.post('/api/events', auth.requireSignin, eventCtrl.createEvent);

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: A list of all events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Server error
 */
eventRouter.get('/api/events', auth.requireSignin, eventCtrl.getAllEvents);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get an event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *     responses:
 *       200:
 *         description: Event description by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update an event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete an event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
eventRouter.route('/api/events/:id')
  .get(auth.requireSignin, eventCtrl.getEventById)
  .put(auth.requireSignin, eventCtrl.updateEvent)
  .delete(auth.requireSignin, eventCtrl.deleteEvent);

/**
 * @swagger
 * /api/events/user/{userId}:
 *   get:
 *     summary: Get events for a specific user
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [Assignment, Exam, Reminder, Meeting]
 *         description: Filter by event type
 *       - in: query
 *         name: past
 *         schema:
 *           type: boolean
 *         description: Get past events instead of upcoming events
 *     responses:
 *       200:
 *         description: List of user's events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
eventRouter.get('/api/events/user/:userId', auth.requireSignin, eventCtrl.getUserEvents);

/**
 * @swagger
 * /api/events/meetings:
 *   post:
 *     summary: Schedule a meeting between an advisor and a student
 *     tags: [Events, Meetings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - date
 *               - time
 *               - advisorId
 *               - studentId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Title of the meeting
 *               description:
 *                 type: string
 *                 description: Description of the meeting
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the meeting
 *               time:
 *                 type: string
 *                 description: Time of the meeting (e.g., "14:30")
 *               duration:
 *                 type: number
 *                 description: Duration of the meeting in minutes
 *                 default: 30
 *               advisorId:
 *                 type: string
 *                 description: MongoDB ObjectId of the advisor
 *               studentId:
 *                 type: string
 *                 description: MongoDB ObjectId of the student
 *     responses:
 *       201:
 *         description: Meeting scheduled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 studentEvent:
 *                   $ref: '#/components/schemas/Event'
 *                 advisorEvent:
 *                   $ref: '#/components/schemas/Event'
 *       404:
 *         description: Advisor or student not found
 *       500:
 *         description: Server error
 */
eventRouter.post('/api/events/meetings', auth.requireSignin, eventCtrl.scheduleMeeting);

/**
 * @swagger
 * /api/events/meetings/{id}:
 *   delete:
 *     summary: Cancel a meeting (deletes both advisor and student events)
 *     tags: [Events, Meetings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of one of the meeting events
 *     responses:
 *       200:
 *         description: Meeting canceled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Meeting canceled successfully
 *                 canceledEvents:
 *                   type: number
 *                   example: 2
 *       404:
 *         description: Meeting not found
 *       500:
 *         description: Server error
 */
eventRouter.delete('/api/events/meetings/:id', auth.requireSignin, eventCtrl.cancelMeeting);

export default eventRouter;