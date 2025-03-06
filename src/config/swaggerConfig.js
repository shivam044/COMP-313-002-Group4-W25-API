import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Academic Management API',
    version: '1.0.5',
    description: 'API Documentation for Academic Management Platform',
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Backend Server',
    },
  ],
  components: {
    schemas: {
      User: {
        type: 'object',
        required: ['userName', 'firstName', 'lastName', 'email', 'password'],
        properties: {
          userName: { type: 'string', description: "The user's username" },
          firstName: { type: 'string', description: "The user's first name" },
          lastName: { type: 'string', description: "The user's last name" },
          email: { type: 'string', format: 'email', description: "The user's email address" },
          password: { type: 'string', description: "The user's password" },
          role: { type: 'string', description: 'The role of the user (e.g., student, teacher)' },
          created_at: { type: 'string', format: 'date-time', description: 'Creation date' },
          updated_at: { type: 'string', format: 'date-time', description: 'Last update date' },
        },
        example: {
          userName: 'johndoe',
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@example.com',
          password: 'password123',
          role: 'student',
        },
      },
      Subject: {
        type: 'object',
        required: ['subjectTitle', 'uid'],
        properties: {
          subjectTitle: { type: 'string', description: 'The title of the subject' },
          targetGrade: { type: 'number', description: 'The target grade for the subject' },
          uid: { type: 'string', description: 'Reference to the student user ID' },
          t_uid: { type: 'string', description: 'Reference to the teacher user ID (optional)' },
          semester_id: { type: 'string', description: 'Reference to the semester or term ID (optional)' },
          room: { type: 'string', description: 'Room name or number (optional)' },
          created_at: { type: 'string', format: 'date-time', description: 'Creation date' },
          updated_at: { type: 'string', format: 'date-time', description: 'Last update date' },
        },
        example: {
          subjectTitle: 'Mathematics',
          targetGrade: 90,
          uid: '60d0fe4f5311236168a109ca',
          t_uid: '60d0fe4f5311236168a109cb',
          semester_id: '60d0fe4f5311236168a109cc',
          room: 'Room 101',
        },
      },
      Grade: {
        type: 'object',
        required: ['grade', 's_id', 'uid'],
        properties: {
          grade: { type: 'number', description: 'The grade value' },
          outOf: { type: 'number', description: 'The max value of the grade' },
          s_id: { type: 'string', description: 'Reference ID to the Subject' },
          a_id: { type: 'string', description: 'Reference ID to the Assignment' },
          uid: { type: 'string', description: 'Reference to the student user ID' },
          notes: { type: 'string', description: 'Extra notes for information' },
          date: { type: 'string', format: 'date-time', description: 'The date the grade was recorded' },
          created_at: { type: 'string', format: 'date-time', description: 'Creation date' },
          updated_at: { type: 'string', format: 'date-time', description: 'Last update date' },
        },
        example: {
          grade: 85,
          outOf: 100,
          s_id: '60d0fe4f5311236168a109cc',
          a_id: '60d0fe4f5311236168a109cd',
          uid: '60d0fe4f5311236168a109ca',
          notes: 'Well done on the assignment',
          date: '2023-08-01T00:00:00.000Z',
        },
      },
      Assignment: {
        type: 'object',
        required: ['name', 's_id', 'uid'],
        properties: {
          name: { type: 'string', description: 'The name of the assignment' },
          s_id: { type: 'string', description: 'Reference to the Subject' },
          uid: { type: 'string', description: 'Reference to the student user ID' },
          g_id: { type: 'string', description: 'Reference to the Grade' },
          due_date: { type: 'string', format: 'date-time', description: 'The due date' },
          created_at: { type: 'string', format: 'date-time', description: 'Creation date' },
          updated_at: { type: 'string', format: 'date-time', description: 'Last update date' },
        },
        example: {
          name: 'Math Homework 1',
          s_id: '60d0fe4f5311236168a109cc',
          uid: '60d0fe4f5311236168a109ca',
          g_id: '60d0fe4f5311236168a109ce',
          due_date: '2023-09-01T00:00:00.000Z',
        },
      },
      Semester: {
        type: 'object',
        required: ['startDate', 'endDate', 'uid'],
        properties: {
          title: { type: 'string', description: 'The title of the semester' },
          startDate: { type: 'string', format: 'date-time', description: 'The start date' },
          endDate: { type: 'string', format: 'date-time', description: 'The end date' },
          uid: { type: 'string', description: 'Reference to the user ID who created the semester' },
          created_at: { type: 'string', format: 'date-time', description: 'Creation date' },
          updated_at: { type: 'string', format: 'date-time', description: 'Last update date' },
        },
        example: {
          title: 'Semester 1',
          startDate: '2023-01-01T00:00:00.000Z',
          endDate: '2023-06-01T00:00:00.000Z',
          uid: '60d0fe4f5311236168a109ca',
        },
      },
      Teacher: {
        type: 'object',
        required: ['first_name', 'last_name', 'phone', 'school_email', 'uid'],
        properties: {
          first_name: { type: 'string', description: "The teacher's first name" },
          last_name: { type: 'string', description: "The teacher's last name" },
          phone: { type: 'string', description: "The teacher's phone number" },
          school_email: { type: 'string', description: "The teacher's school email" },
          uid: { type: 'string', description: 'Reference to the user ID who created the teacher entry' },
          created_at: { type: 'string', format: 'date-time', description: 'Creation date' },
          updated_at: { type: 'string', format: 'date-time', description: 'Last update date' },
        },
        example: {
          first_name: 'Jane',
          last_name: 'Smith',
          phone: '123-456-7890',
          school_email: 'jane.smith@school.edu',
          uid: '60d0fe4f5311236168a109ca',
        },
      },
      TimeTable: {
        type: 'object',
        required: ['subject_id', 'day_of_week', 'start_time', 'end_time', 'uid'],
        properties: {
          subject_id: { type: 'string', description: 'Reference to the Subject ID' },
          day_of_week: { type: 'string', description: 'Day of the week (e.g., Monday)' },
          start_time: { type: 'string', description: 'Start time of the class' },
          end_time: { type: 'string', description: 'End time of the class' },
          room: { type: 'string', description: 'Room name/number (optional)' },
          t_uid: { type: 'string', description: 'Reference to the Teacher ID (optional)' },
          note: { type: 'string', description: 'Additional notes (optional)' },
          uid: { type: 'string', description: 'Reference to the user ID who created the timetable entry' },
          created_at: { type: 'string', format: 'date-time', description: 'Creation date' },
          updated_at: { type: 'string', format: 'date-time', description: 'Last update date' },
        },
        example: {
          subject_id: '60d0fe4f5311236168a109cc',
          day_of_week: 'Monday',
          start_time: '09:00 AM',
          end_time: '10:30 AM',
          room: 'Room 101',
          t_uid: '60d0fe4f5311236168a109cb',
          note: 'Bring lab materials',
          uid: '60d0fe4f5311236168a109ca',
        },
      },
      Notification: {
        type: 'object',
        required: ['title', 'message', 'uid', 'type'],
        properties: {
          title: { type: 'string', description: 'The title of the notification' },
          message: { type: 'string', description: 'The message body of the notification' },
          uid: { type: 'string', description: 'Reference to the user ID who is receiving the notification' },
          type: { type: 'string', description: 'Type of notification (e.g., informational, alert, etc.)' },
          read: { type: 'boolean', description: 'Indicates if the notification has been read', default: false },
          created_at: { type: 'string', format: 'date-time', description: 'Creation date' },
          updated_at: { type: 'string', format: 'date-time', description: 'Last update date' },
        },
        example: {
          title: 'New Grade Added',
          message: 'A new grade has been added to your profile.',
          uid: '60d0fe4f5311236168a109ca',
          type: 'info',
          read: false,
        },

      },
      UserSettings: {
        type: 'object',
        required: ['uid'],
        properties: {
          uid: {
            type: 'string',
            description: 'The user ID associated with these settings',
          },
          preferences: {
            type: 'object',
            description: 'User preferences including language, theme, etc.',
            properties: {
              theme: {
                type: 'string',
                description: 'Theme preference (e.g., dark, light)',
              },
              notificationsEnabled: {
                type: 'boolean',
                description: 'Indicates if the user wants to receive notifications',
              },
              language: {
                type: 'string',
                description: 'Language preference of the user',
              },
            },
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Creation date of the user settings',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            description: 'Last update date of the user settings',
          },
        },
        example: {
          uid: '60d0fe4f5311236168a109ca',
          preferences: {
            theme: 'dark',
            notificationsEnabled: true,
            language: 'en',
          },
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-02T00:00:00.000Z',
        },
      },
      Event: {
        type: 'object',
        required: ['name', 'type', 'date', 'user_id'],
        properties: {
          name: { type: 'string', description: 'Event name (e.g., Assignment, Exam, Reminder)' },
          type: { type: 'string', enum: ['Assignment', 'Exam', 'Reminder'], description: 'Type of event' },
          description: { type: 'string', description: 'Optional description for the event' },
          date: { type: 'string', format: 'date-time', description: 'Date of the event' },
          user_id: { type: 'string', description: 'Reference to the User ID' },
          related_id: { type: 'string', description: 'Reference to another related model (optional)' },
          relatedModel: { type: 'string', enum: ['Subject', 'Grade', 'Assignment', 'User'], description: 'Name of the related model (optional)' },
          created_at: { type: 'string', format: 'date-time', description: 'Creation date' },
          updated_at: { type: 'string', format: 'date-time', description: 'Last update date' },
        },
        example: {
          name: 'Math Exam',
          type: 'Exam',
          description: 'Final Math Exam for Semester 1',
          date: '2023-06-01T09:00:00.000Z',
          user_id: '60d0fe4f5311236168a109ca',
          related_id: '60d0fe4f5311236168a109cc',
          relatedModel: 'Subject',
        },
      },
    },
  },
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'], // Path to your API files (update as per your project structure)
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec, swaggerUi };
