import express from 'express';
import auth from '../controllers/authController.js';
import gradeCtrl from '../controllers/gradeController.js';

const gradeRouter = express.Router();

// Route to create a new grade
/**
 * @swagger
 * /api/grade:
 *   post:
 *     summary: Create a new grade
 *     tags: [Grades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Grade'
 *     responses:
 *       201:
 *         description: Grade created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grade'
 *       500:
 *         description: Server error
 */
gradeRouter.post('/api/grade', auth.requireSignin, gradeCtrl.createGrade);

// Route to get a specific grade by ID
/**
 * @swagger
 * /api/grades/{id}:
 *   get:
 *     summary: Get a grade by ID
 *     tags: [Grades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The grade ID
 *     responses:
 *       200:
 *         description: The grade description by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grade'
 *       404:
 *         description: Grade not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update a grade by ID
 *     tags: [Grades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The grade ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Grade'
 *     responses:
 *       200:
 *         description: Grade updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grade'
 *       404:
 *         description: Grade not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a grade by ID
 *     tags: [Grades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The grade ID
 *     responses:
 *       200:
 *         description: Grade deleted successfully
 *       404:
 *         description: Grade not found
 *       500:
 *         description: Server error
 */
gradeRouter.route('/api/grades/:id')
  .get(auth.requireSignin, gradeCtrl.getGradeById)
  .put(auth.requireSignin, gradeCtrl.updateGrade)
  .delete(auth.requireSignin, gradeCtrl.deleteGrade);

// Route to get grades by user
/**
 * @swagger
 * /api/grades/user/{userId}:
 *   get:
 *     summary: Get grades by user ID
 *     tags: [Grades]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A list of grades for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Grade'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
gradeRouter.route('/api/grades/user/:userId')
  .get(auth.requireSignin, gradeCtrl.getGradesByUser);

// Route to list all the grades
/**
 * @swagger
 * /api/grades:
 *   get:
 *     summary: Get all grades
 *     tags: [Grades]
 *     responses:
 *       200:
 *         description: A list of all grades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Grade'
 *       500:
 *         description: Server error
 */
gradeRouter.route('/api/grades')
  .get(auth.requireSignin, gradeCtrl.getAllGrades);

export default gradeRouter;