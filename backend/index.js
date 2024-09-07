import { Firestore } from '@google-cloud/firestore';

import express from 'express';

import cors from 'cors';
import { users } from './data.js'; // Ensure the file extension .js is included for local imports in ES modules

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());

// Define a route
app.get('/', (req, res) => {
  if (!users) {
    res.status(404).send({ message: 'No users found' });
  } else {
    res.send(users);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
