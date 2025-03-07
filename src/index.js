// Import necessary modules
import express from 'express';
import cors from 'cors';
import { swaggerSpec, swaggerUi } from './config/swaggerConfig.js';
import connectDB from './config/db.js';  
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js'; 
import userRoutes from './routes/userRoutes.js'; 
import userSettingsRoutes from './routes/userSettingsRoutes.js'; 
import subjectRoutes from './routes/subjectRoutes.js'; 
import gradeRoutes from './routes/gradeRoutes.js'; 
import assignmentRoutes from './routes/assignmentRoutes.js'; 
import teacherRoutes from './routes/teacherRoutes.js'; 
import semesterRoutes from './routes/semesterRoutes.js'; 
import timeTableRoutes from './routes/timetableRoutes.js'; 
import notificationRoutes from './routes/notificationRoutes.js'; 
import eventRoutes from './routes/eventRoutes.js'; 
import feedbackRoutes from './routes/feedbackRoutes.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Set up Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' })); // Replace with frontend's URL

//API routes
app.use('/', authRoutes);
app.use('/', subjectRoutes);
app.use('/', gradeRoutes);
app.use('/', assignmentRoutes);
app.use('/', userRoutes);
app.use('/', userSettingsRoutes);
app.use('/', teacherRoutes);
app.use('/', semesterRoutes);
app.use('/', timeTableRoutes);
app.use('/', notificationRoutes);
app.use('/', eventRoutes);
app.use('/', feedbackRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ "error": err.name + ": " + err.message });
  } else if (err) {
    res.status(400).json({ "error": err.name + ": " + err.message });
    console.log(err);
  }
});

app.get('/', (req, res) => {
  res.send('Academic Management Platform Backend is running');
});

// Catch-all route for handling 404 errors
app.use((req, res) => {
  res.status(404).send('Resource not found');
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});

// Export app for testing purposes
export default app;
