import express from 'express';
import auth from '../controllers/authController.js';
import userSettingsCtrl from '../controllers/userSettingsController.js';

const userSettingsRouter = express.Router();

// Route to create or update user settings
/**
 * @swagger
 * /api/user-settings:
 *   post:
 *     summary: Create or update user settings
 *     tags: [UserSettings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSettings'
 *     responses:
 *       200:
 *         description: User settings created or updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSettings'
 *       500:
 *         description: Server error
 */
userSettingsRouter.post('/api/user-settings', auth.requireSignin, userSettingsCtrl.createOrUpdateUserSettings);

// Route to get user settings by user ID
/**
 * @swagger
 * /api/user-settings/{userId}:
 *   get:
 *     summary: Get user settings by user ID
 *     tags: [UserSettings]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user settings by user ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSettings'
 *       404:
 *         description: User settings not found
 *       500:
 *         description: Server error
 */
userSettingsRouter.get('/api/user-settings/:userId', auth.requireSignin, userSettingsCtrl.getUserSettings);

// Route to delete user settings by user ID
/**
 * @swagger
 * /api/user-settings/{userId}:
 *   delete:
 *     summary: Delete user settings by user ID
 *     tags: [UserSettings]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User settings deleted successfully
 *       404:
 *         description: User settings not found
 *       500:
 *         description: Server error
 */
userSettingsRouter.delete('/api/user-settings/:userId', auth.requireSignin, userSettingsCtrl.deleteUserSettings);

export default userSettingsRouter;
