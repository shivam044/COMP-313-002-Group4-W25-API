import express from 'express';
import auth from '../controllers/authController.js';
import assignmentCtrl from '../controllers/assignmentController.js';

const assignmentRouter = express.Router();

// Route to create a new assignment
/**
 * @swagger
 * /api/assignment:
 *   post:
 *     summary: Create a new assignment
 *     tags: [Assignments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Assignment'
 *     responses:
 *       201:
 *         description: Assignment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
 *       500:
 *         description: Server error
 */
assignmentRouter.post('/api/assignment', auth.requireSignin, assignmentCtrl.createAssignment);

// Route to get a specific assignment by ID
/**
 * @swagger
 * /api/assignments/{id}:
 *   get:
 *     summary: Get an assignment by ID
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The assignment ID
 *     responses:
 *       200:
 *         description: The assignment description by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
 *       404:
 *         description: Assignment not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update an assignment by ID
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The assignment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Assignment'
 *     responses:
 *       200:
 *         description: Assignment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
 *       404:
 *         description: Assignment not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete an assignment by ID
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The assignment ID
 *     responses:
 *       200:
 *         description: Assignment deleted successfully
 *       404:
 *         description: Assignment not found
 *       500:
 *         description: Server error
 */
assignmentRouter.route('/api/assignments/:id')
  .get(auth.requireSignin, assignmentCtrl.getAssignmentById)
  .put(auth.requireSignin, assignmentCtrl.updateAssignment)
  .delete(auth.requireSignin, assignmentCtrl.deleteAssignment);

// Route to get assignments by user
/**
 * @swagger
 * /api/assignments/user/{userId}:
 *   get:
 *     summary: Get assignments by user ID
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A list of assignments for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Assignment'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
assignmentRouter.route('/api/assignments/user/:userId')
  .get(auth.requireSignin, assignmentCtrl.getAssignmentsByUser);

// Route to list all assignments
/**
 * @swagger
 * /api/assignments:
 *   get:
 *     summary: Get all assignments
 *     tags: [Assignments]
 *     responses:
 *       200:
 *         description: A list of all assignments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Assignment'
 *       500:
 *         description: Server error
 */
assignmentRouter.route('/api/assignments')
  .get(auth.requireSignin, assignmentCtrl.getAllAssignments);

export default assignmentRouter;
