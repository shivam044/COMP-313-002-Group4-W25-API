import express from 'express';
import auth from '../controllers/authController.js';
import feedbackCtrl from '../controllers/feedbackController.js';

const feedbackRouter = express.Router();

// Route to create new feedback
/**
 * @swagger
 * /api/feedback:
 *   post:
 *     summary: Create new feedback
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Feedback'
 *     responses:
 *       201:
 *         description: Feedback created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *       500:
 *         description: Server error
 */
feedbackRouter.post('/api/feedback', auth.requireSignin, feedbackCtrl.createFeedback);

// Route to get feedback by ID
/**
 * @swagger
 * /api/feedback/{id}:
 *   get:
 *     summary: Get feedback by ID
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The feedback ID
 *     responses:
 *       200:
 *         description: The feedback entry
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *       404:
 *         description: Feedback not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update feedback by ID
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The feedback ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Feedback'
 *     responses:
 *       200:
 *         description: Feedback updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *       404:
 *         description: Feedback not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete feedback by ID
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The feedback ID
 *     responses:
 *       200:
 *         description: Feedback deleted successfully
 *       404:
 *         description: Feedback not found
 *       500:
 *         description: Server error
 */
feedbackRouter.route('/api/feedback/:id')
  .get(auth.requireSignin, feedbackCtrl.getFeedbackByStudent)
  .put(auth.requireSignin, feedbackCtrl.updateFeedback)
  .delete(auth.requireSignin, feedbackCtrl.deleteFeedback);

// Route to get all feedback
/**
 * @swagger
 * /api/feedback:
 *   get:
 *     summary: Get all feedback
 *     tags: [Feedback]
 *     responses:
 *       200:
 *         description: A list of all feedback
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feedback'
 *       500:
 *         description: Server error
 */
feedbackRouter.route('/api/feedback')
  .get(auth.requireSignin, feedbackCtrl.getAllFeedback);

// Route to get feedback by assignment ID
/**
 * @swagger
 * /api/feedback/assignment/{assignmentId}:
 *   get:
 *     summary: Get feedback for a specific assignment
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The assignment ID
 *     responses:
 *       200:
 *         description: Feedback retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feedback'
 *       404:
 *         description: No feedback found for this assignment
 *       500:
 *         description: Server error
 */
feedbackRouter.get('/api/feedback/assignment/:assignmentId', auth.requireSignin, feedbackCtrl.getFeedbackByAssignment);

// Route to get feedback by subject ID
/**
 * @swagger
 * /api/feedback/subject/{subjectId}:
 *   get:
 *     summary: Get feedback for a specific subject
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *         description: The subject ID
 *     responses:
 *       200:
 *         description: Feedback retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feedback'
 *       404:
 *         description: No feedback found for this subject
 *       500:
 *         description: Server error
 */
feedbackRouter.get('/api/feedback/subject/:subjectId', auth.requireSignin, feedbackCtrl.getFeedbackBySubject);

export default feedbackRouter;
