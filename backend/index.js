import { Firestore } from '@google-cloud/firestore';
import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

// Initialize Firestore with explicit credentials
const firestore = new Firestore({
  projectId: 'forumproject-backend',
  keyFilename: 'credentials/forumproject-backend-8d3a9c76ffe0.json', // Path to the service account file
});

// Function to get all users from the Firestore 'Users' collection
async function getUsers() {
  const snapshot = await firestore.collection('Users').get();

  // Map through the snapshot to extract document data into an array
  const allUsers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return allUsers;
}

app.use(cors());

// Define a route
app.get('/users', async (req, res) => {
  try {
    const allUsers = await getUsers();

    if (allUsers.length === 0) {
      res.status(404).send({ message: 'No users found' });
    } else {
      res.send(allUsers);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
