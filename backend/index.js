// index.js
import express from 'express';
import cors from 'cors';
import userRoutes from './user.js'; // Import the user routes

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Use the user routes
app.use('/users', userRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
