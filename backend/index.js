// index.js
import express from 'express';
import cors from 'cors';
import userRoutes from './user.js'; // Import the user routes
import messageRoutes from './message.js'; // Import the message routes

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Use the user routes
app.use('/users', userRoutes);
// Use the message routes
app.use('/messages', messageRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
