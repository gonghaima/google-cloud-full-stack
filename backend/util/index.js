import multer from 'multer';
import { Firestore } from '@google-cloud/firestore';
import { Storage } from '@google-cloud/storage';

const projectConfig = {
  projectId: 'forumproject-backend',
  keyFilename: 'credentials/forumproject-backend-8d3a9c76ffe0.json', // Path to the service account file
};

const firestore = new Firestore(projectConfig);

// Define your Google Cloud Storage bucket name
const bucketName = 'forumapp_bucket';

const storage = new Storage(projectConfig);

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory before uploading to Google Cloud
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

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

export { firestore, upload, uploadImageToStorage };
