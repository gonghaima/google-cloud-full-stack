import express from 'express';
import { firestore, upload, uploadImageToStorage } from './util/index.js';

const router = express.Router();

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
async function updateMessageById(messageId, updateData, file) {
  let messageRef;
  let snapshot;

  // First, attempt to retrieve the document by its ID
  messageRef = firestore.collection('Messages').doc(messageId);
  snapshot = await messageRef.get();

  // If the document doesn't exist, fall back to querying by 'id' field
  if (!snapshot.exists) {
    const messageQueryRef = firestore
      .collection('Messages')
      .where('id', '==', messageId);
    const querySnapshot = await messageQueryRef.get();

    if (querySnapshot.empty) {
      throw new Error('Message not found');
    }

    // Use the first matching document from the query
    const doc = querySnapshot.docs[0];
    messageRef = doc.ref; // Get the document reference
  }

  // If a new image file is provided, upload it and update the image_url
  if (file) {
    const newImageUrl = await uploadImageToStorage(file);
    updateData.image_url = newImageUrl;
  }

  // Perform the update operation with the new data
  await messageRef.update(updateData);

  return { id: messageId, updateData };
}

// update a new message
router.patch('/', upload.single('image'), async (req, res) => {
  const updateData = req.body;
  const file = req.file;
  console.log('updateData: ', updateData);

  try {
    // Update the message in Firestore
    const updatedMessage = await updateMessageById(
      updateData.id,
      { ...updateData, posted_date: new Date() },
      file
    );
    res.send(updatedMessage);
  } catch (error) {
    console.error(`Error updating message with ID ${updateData?.id}:`, error);
    res.status(404).send({ message: 'Message not found' });
  }
});

export default router;
