require('dotenv').config();
const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const express = require('express');
const TimeCapsule = require('../models/TimeCapsule');
const router = express.Router();
const multer = require('multer');
const multerS3 = require('multer-s3');

// Create the S3 client with the correct configuration
const client = new S3Client({
  region: process.env.AWS_Region, 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Setup multer with S3 storage
const upload = multer({
  storage: multerS3({
    s3: client,  // Use the correct S3 client instance
    bucket: 'memosac.bucket',  // Replace with your actual S3 bucket name
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, `Time Capsule/${fileName}`);  // Specify the folder structure here
    },
  }),
});

router.post('/', upload.array('files', 10), async (req, res) => {
  console.log("Receiving Data: ", req.body);
  
  let { releaseDateTime } = req.body;
  
  // Ensure the release date is in ISO 8601 format
  releaseDateTime = releaseDateTime.replace(' ', 'T') + ':00';
  
  const scheduledDate = new Date(releaseDateTime);

  // Check if the date is valid
  if (isNaN(scheduledDate)) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  try {
    // Map file locations from S3 to an array
    const fileUrls = req.files.map((file) => file.location);
    
    // Create new Time Capsule document
    const newCapsule = new TimeCapsule({
      scheduled_date: scheduledDate,
      files: fileUrls,  // Save the S3 file URLs
    });

    await newCapsule.save();
    res.status(201).json({ message: 'Time capsule created successfully' });
  } catch (error) {
    console.error("Error saving Time Capsule:", error);
    res.status(500).json({ error: 'Failed to create time capsule' });
  }
});

router.get('/:id', async (req, res) => {
  const timeCapsuleId = req.params.id;

  try {
    // Find the time capsule by ID and ensure it belongs to the logged-in user
    const timeCapsule = await TimeCapsule.findOne({
      _id: timeCapsuleId,
      // Assuming user_id is available on req.user (set via authentication middleware)
      user_id: req.user.id,
    });

    if (!timeCapsule) {
      return res.status(404).json({ error: 'Time Capsule not found' });
    }

    const now = new Date();
    if (now >= timeCapsule.scheduled_date) {
      timeCapsule.status = 'unlocked';
      await timeCapsule.save();

      return res.json({
        status: 'unlocked',
        content: timeCapsule.content,  // Assuming content exists
        files: timeCapsule.files,
      });
    } else {
      return res.json({
        status: 'locked',
        message: 'The time capsule is locked',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch time capsule' });
  }
});

module.exports = router;