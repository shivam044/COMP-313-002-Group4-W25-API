import express from 'express';
import auth from '../controllers/authController.js';
import timeTableCtrl from '../controllers/timetableController.js';

const timeTableRouter = express.Router();

// Route to create a new timetable entry
/**
 * @swagger
 * /api/timetable:
 *   post:
 *     summary: Create a new timetable entry
 *     tags: [TimeTable]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TimeTable'
 *     responses:
 *       201:
 *         description: Timetable entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TimeTable'
 *       500:
 *         description: Server error
 */
timeTableRouter.post('/api/timetable', auth.requireSignin, timeTableCtrl.createTimeTableEntry);

// Route to get, update, or delete a specific timetable entry by ID
/**
 * @swagger
 * /api/timetable/{id}:
 *   get:
 *     summary: Get a timetable entry by ID
 *     tags: [TimeTable]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The timetable entry ID
 *     responses:
 *       200:
 *         description: Timetable entry retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TimeTable'
 *       404:
 *         description: Timetable entry not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update a timetable entry by ID
 *     tags: [TimeTable]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The timetable entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TimeTable'
 *     responses:
 *       200:
 *         description: Timetable entry updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TimeTable'
 *       404:
 *         description: Timetable entry not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a timetable entry by ID
 *     tags: [TimeTable]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The timetable entry ID
 *     responses:
 *       200:
 *         description: Timetable entry deleted successfully
 *       404:
 *         description: Timetable entry not found
 *       500:
 *         description: Server error
 */
timeTableRouter.route('/api/timetable/:id')
  .get(auth.requireSignin, timeTableCtrl.getTimeTableById)
  .put(auth.requireSignin, timeTableCtrl.updateTimeTableEntry)
  .delete(auth.requireSignin, timeTableCtrl.deleteTimeTableEntry);

// Route to get all timetable entries
/**
 * @swagger
 * /api/timetable:
 *   get:
 *     summary: Get all timetable entries
 *     tags: [TimeTable]
 *     responses:
 *       200:
 *         description: A list of all timetable entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TimeTable'
 *       500:
 *         description: Server error
 */
timeTableRouter.route('/api/timetable')
  .get(auth.requireSignin, timeTableCtrl.getAllTimeTableEntries);

// Route to get all timetable entries for a specific user
/**
 * @swagger
 * /api/timetable/user/{userId}:
 *   get:
 *     summary: Get all timetable entries for a specific user
 *     tags: [TimeTable]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A list of timetable entries for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TimeTable'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
timeTableRouter.get('/api/timetable/user/:userId', auth.requireSignin, timeTableCtrl.getTimeTableByUser);

export default timeTableRouter;
