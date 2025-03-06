import express from 'express';
import authCtrl from '../controllers/authController.js' 

// Declare the router
const authRouter = express.Router();

// Define routes
authRouter.route('/auth/signin').post(authCtrl.signIn)
authRouter.route('/auth/signout').get(authCtrl.signOut)

// Export the router
export default authRouter;
