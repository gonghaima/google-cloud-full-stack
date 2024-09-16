import express from 'express';
import { Firestore } from '@google-cloud/firestore';
import { Storage } from '@google-cloud/storage';
import multer from 'multer'; // Middleware to handle file uploads

const router = express.Router();

const projectConfig = {
  projectId: 'forumproject-backend',
  keyFilename: 'credentials/forumproject-backend-8d3a9c76ffe0.json', // Path to the service account file
};

// Initialize Firestore with explicit credentials
const firestore = new Firestore(projectConfig);

const storage = new Storage(projectConfig);

// Define your Google Cloud Storage bucket name
const bucketName = 'forumapp_bucket';
// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory before uploading to Google Cloud
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Function to upload an image to Google Cloud Storage
async function uploadImageToStorage(file) {
  const bucket = storage.bucket(bucketName);
  const blob = bucket.file(file.originalname);
  const blobStream = blob.createWriteStream({
    resumable: false,
    contentType: file.mimetype,
  });

  return new Promise((resolve, reject) => {
    blobStream
      .on('finish', async () => {
        // Make the file public
        await blob.makePublic();

        // Return the public URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve(publicUrl);
      })
      .on('error', (err) => {
        reject(err);
      })
      .end(file.buffer); // Upload file buffer to Google Cloud Storage
  });
}

async function getMessageById(messageId) {
  const messageRef = firestore
    .collection('Messages')
    .where('id', '==', messageId);
  const snapshot = await messageRef.get();

  // Check if the snapshot is empty
  if (snapshot.empty) {
    throw new Error('Message not found');
  }

  // Return the first matching document (you can extend this logic if you need to handle multiple users)
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}
// Route to get messages by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const messages = await getMessageById(id);
    res.send(messages);
  } catch (error) {
    console.error(`Error fetching messages with ID: ${id}`, error);
    res.status(404).send({ message: 'Messages not found' });
  }
});

// Function to get messages by user_id
async function getMessagesByUserId(userId) {
  const messagesRef = firestore
    .collection('Messages')
    .where('user_id', '==', userId);
  const snapshot = await messagesRef.get();

  if (snapshot.empty) {
    throw new Error('No messages found for this user');
  }

  // Return an array of message documents
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
// Route to get messages by user_id
router.get('/user/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const messages = await getMessagesByUserId(user_id);
    res.send(messages);
  } catch (error) {
    console.error(
      `Error fetching messages for user with ID ${user_id}:`,
      error
    );
    res.status(404).send({ message: 'Messages not found' });
  }
});

// Function to create a new message
async function createMessage(messageData) {
  const messageRef = await firestore.collection('Messages').add(messageData);
  const newMessage = await messageRef.get();
  return { id: messageRef.id, ...newMessage.data() };
}
// create a new message
router.post('/', upload.single('image'), async (req, res) => {
  const messageData = req.body;

  try {
    // Add timestamp for posted_date if it's not provided
    if (!messageData.posted_date) {
      messageData.posted_date = new Date();
    }
    // Upload image to Google Cloud Storage
    const imageUrl = await uploadImageToStorage(req.file);

    // Add image URL and current timestamp to the message data
    messageData.image_url = imageUrl;

    const newMessage = await createMessage(messageData);
    res.status(201).send(newMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Function to update a message by ID
async function updateMessageById(messageId, updateData) {
  const messageRef = firestore
    .collection('Messages')
    .where('id', '==', messageId);
  const snapshot = await messageRef.get();

  // Check if the snapshot is empty
  if (snapshot.empty) {
    throw new Error('Message not found');
  }

  const doc = snapshot.docs[0];
  const docRef = doc.ref; // Get the document reference

  await docRef.update(updateData);
  return { id: doc.id, ...updateData };
}
// update a new message
router.patch('/', async (req, res) => {
  const updateData = req.body;
  console.log('updateData: ', updateData);

  try {
    // Update the message in Firestore
    const updatedMessage = await updateMessageById(updateData.id, updateData);
    res.send(updatedMessage);
  } catch (error) {
    console.error(`Error updating message with ID ${updateData?.id}:`, error);
    res.status(404).send({ message: 'Message not found' });
  }
});

export default router;
