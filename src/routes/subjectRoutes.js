import express from 'express';
import auth from '../controllers/authController.js';
import subjectCtrl from '../controllers/subjectController.js';

const subjectRouter = express.Router();

// Route to create a new subject
/**
 * @swagger
 * /api/subject:
 *   post:
 *     summary: Create a new subject
 *     tags: [Subjects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subject'
 *     responses:
 *       201:
 *         description: Subject created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       500:
 *         description: Server error
 */
subjectRouter.post('/api/subject', auth.requireSignin, subjectCtrl.createSubject);

// Route to get, update, or delete a specific subject by ID
/**
 * @swagger
 * /api/subjects/{id}:
 *   get:
 *     summary: Get a subject by ID
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The subject ID
 *     responses:
 *       200:
 *         description: The subject details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       404:
 *         description: Subject not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update a subject by ID
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The subject ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subject'
 *     responses:
 *       200:
 *         description: Subject updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       404:
 *         description: Subject not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a subject by ID
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The subject ID
 *     responses:
 *       200:
 *         description: Subject deleted successfully
 *       404:
 *         description: Subject not found
 *       500:
 *         description: Server error
 */
subjectRouter.route('/api/subjects/:id')
  .get(auth.requireSignin, subjectCtrl.getSubjectById)
  .put(auth.requireSignin, subjectCtrl.updateSubject)
  .delete(auth.requireSignin, subjectCtrl.deleteSubject);

// Route to get subjects by user ID
/**
 * @swagger
 * /api/subjects/user/{userId}:
 *   get:
 *     summary: Get subjects by user ID
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A list of subjects for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subject'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
subjectRouter.route('/api/subjects/user/:userId')
  .get(auth.requireSignin, subjectCtrl.getSubjectsByUser);

// Route to list all the subjects
/**
 * @swagger
 * /api/subjects:
 *   get:
 *     summary: Get all subjects
 *     tags: [Subjects]
 *     responses:
 *       200:
 *         description: A list of all subjects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subject'
 *       500:
 *         description: Server error
 */
subjectRouter.route('/api/subjects')
  .get(auth.requireSignin, subjectCtrl.getAllSubjects);

export default subjectRouter;
