import express from 'express';
import auth from '../controllers/authController.js';
import teacherCtrl from '../controllers/teacherController.js';

const teacherRouter = express.Router();

// Route to create a new teacher
/**
 * @swagger
 * /api/teacher:
 *   post:
 *     summary: Create a new teacher
 *     tags: [Teachers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       201:
 *         description: Teacher created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       500:
 *         description: Server error
 */
teacherRouter.post('/api/teacher', auth.requireSignin, teacherCtrl.createTeacher);

// Route to get a specific teacher by ID
/**
 * @swagger
 * /api/teachers/{id}:
 *   get:
 *     summary: Get a teacher by ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The teacher ID
 *     responses:
 *       200:
 *         description: The teacher description by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update a teacher by ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The teacher ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       200:
 *         description: Teacher updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a teacher by ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The teacher ID
 *     responses:
 *       200:
 *         description: Teacher deleted successfully
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Server error
 */
teacherRouter.route('/api/teachers/:id')
  .get(auth.requireSignin, teacherCtrl.getTeacherById)
  .put(auth.requireSignin, teacherCtrl.updateTeacher)
  .delete(auth.requireSignin, teacherCtrl.deleteTeacher);

// Route to get all teachers
/**
 * @swagger
 * /api/teachers:
 *   get:
 *     summary: Get all teachers
 *     tags: [Teachers]
 *     responses:
 *       200:
 *         description: A list of all teachers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Teacher'
 *       500:
 *         description: Server error
 */
teacherRouter.route('/api/teachers')
  .get(auth.requireSignin, teacherCtrl.getAllTeachers);

export default teacherRouter;
