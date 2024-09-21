// user.js
import express from 'express';
import { firestore, upload, uploadImageToStorage } from './util/index.js';

const router = express.Router();

// Function to get all users from the Firestore 'Users' collection
async function getUsers() {
  const snapshot = await firestore.collection('Users').get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Function to get a user by ID
export async function getUserById(userId) {
  console.log('userId: ', userId);
  const userRef = firestore
    .collection('Users')
    // .where('user_name', '==', 'David0');
    .where('user_id', '==', userId);
  const snapshot = await userRef.get();

  // Check if the snapshot is empty
  if (snapshot.empty) {
    throw new Error('User not found');
  }

  // Return the first matching document (you can extend this logic if you need to handle multiple users)
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

// Function to update a user by ID
async function updateUserById(userId, updateData) {
  // Query the document by ID
  const userRef = firestore.collection('Users').where('id', '==', userId);
  const snapshot = await userRef.get();

  if (snapshot.empty) {
    throw new Error(`User with ID ${userId} not found`);
  }

  const doc = snapshot.docs[0];
  const docRef = doc.ref; // Get the document reference

  await docRef.update(updateData);

  return { id: doc.id, ...updateData };
}

// Function to update a user password by ID
async function updateUserPassword(userId, oldPassword, newPassword) {
  // Query the document by user ID
  const userRef = firestore.collection('Users').where('id', '==', userId);
  const snapshot = await userRef.get();

  // Check if any documents were found
  if (snapshot.empty) {
    throw new Error(`User with ID ${userId} not found`);
  }

  // Assuming IDs are unique, get the first matching document
  const doc = snapshot.docs[0];
  const docRef = doc.ref; // Get the document reference
  const userData = doc.data(); // Retrieve the current user data

  // Validate the old password
  if (userData.password !== oldPassword) {
    throw new Error('The old password is incorrect');
  }

  // Update the password with the new password
  await docRef.update({ password: newPassword });

  // Return a success message or the updated user data
  return { id: doc.id, message: 'Password updated successfully' };
}

// Function to create a new user
async function createUser(userData) {
  const userRef = await firestore.collection('Users').add(userData);
  const newUser = await userRef.get();
  return { id: userRef.id, ...newUser.data() };
}

// Function to handle user login
async function loginUser(userId, password) {
  // Query the document by user ID
  const userRef = firestore.collection('Users').where('user_id', '==', userId);
  const snapshot = await userRef.get();

  // Check if any documents were found
  if (snapshot.empty) {
    throw new Error('User not found');
  }

  // Get the first matching document
  const doc = snapshot.docs[0];
  const userData = doc.data();

  // Validate the password
  if (userData.password !== password) {
    throw new Error('Invalid password');
  }

  // Return the user data (excluding sensitive information like password)
  return {
    id: doc.id,
    ...userData,
  };
}

// Route to get all users
router.get('/', async (req, res) => {
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

// Route to get a user by ID
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const user = await getUserById(user_id);
    res.send(user);
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    res.status(404).send({ message: 'User not found' });
  }
});

// Route to update a user by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const updatedUser = await updateUserById(id, updateData);
    res.send(updatedUser);
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Route to update a user password by ID
router.put('/:id/password', async (req, res) => {
  const { id } = req.params;
  console.log('req.body: ', req.body);
  //   const { oldPassword, newPassword } = req.body;
  //   console.log("oldPassword, newPassword : ", oldPassword, newPassword );
  try {
    const updatedUser = await updateUserPassword(
      id,
      req.body.oldPassword,
      req.body.newPassword
    );
    res.send(updatedUser);
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Route to create a new user
router.post('/', upload.single('image'), async (req, res) => {
  const userData = req.body;
  try {
    if (req.file) {
      const imageUrl = await uploadImageToStorage(req.file);
      userData.image_url = imageUrl;
    }

    console.log('userData: ', userData);
    const newUser = await createUser(userData);
    res.status(201).send(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Route to handle user login
router.post('/login', async (req, res) => {
  const { user_id, password } = req.body;
  console.log('user_id: ', user_id);
  try {
    const user = await loginUser(user_id, password);
    res.status(200).send({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(401).send({ message: 'Invalid credentials' });
  }
});

export default router;
