import express from 'express';
import auth from '../controllers/authController.js';
import semesterCtrl from '../controllers/semesterController.js';

const semesterRouter = express.Router();

// Route to create a new semester
/**
 * @swagger
 * /api/semester:
 *   post:
 *     summary: Create a new semester
 *     tags: [Semesters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Semester'
 *     responses:
 *       201:
 *         description: Semester created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Semester'
 *       500:
 *         description: Server error
 */
semesterRouter.post('/api/semester', auth.requireSignin, semesterCtrl.createSemester);

// Route to get all semesters
/**
 * @swagger
 * /api/semesters:
 *   get:
 *     summary: Get all semesters
 *     tags: [Semesters]
 *     responses:
 *       200:
 *         description: A list of all semesters
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Semester'
 *       500:
 *         description: Server error
 */
semesterRouter.route('/api/semesters')
  .get(auth.requireSignin, semesterCtrl.getAllSemesters);

// Route to get a specific semester by ID
/**
 * @swagger
 * /api/semesters/{id}:
 *   get:
 *     summary: Get a semester by ID
 *     tags: [Semesters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The semester ID
 *     responses:
 *       200:
 *         description: The semester description by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Semester'
 *       404:
 *         description: Semester not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update a semester by ID
 *     tags: [Semesters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The semester ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Semester'
 *     responses:
 *       200:
 *         description: Semester updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Semester'
 *       404:
 *         description: Semester not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a semester by ID
 *     tags: [Semesters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The semester ID
 *     responses:
 *       200:
 *         description: Semester deleted successfully
 *       404:
 *         description: Semester not found
 *       500:
 *         description: Server error
 */
semesterRouter.route('/api/semesters/:id')
  .get(auth.requireSignin, semesterCtrl.getSemesterById)
  .put(auth.requireSignin, semesterCtrl.updateSemester)
  .delete(auth.requireSignin, semesterCtrl.deleteSemester);

export default semesterRouter;
