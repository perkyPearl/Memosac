const express = require('express');
const TimeCapsule = require('../models/TimeCapsule');
const router = express.Router();
const multer = require('multer');
const AWS = require('aws-sdk');
const cors = require('cors');
require('dotenv').config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.array('files'), async (req, res) => {
  const { title, releaseDateTime } = req.body;
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded.' });
  }

  try {
    const uploadPromises = files.map(file => {
      const params = {
        Bucket: "memosac.bucket",
        Key: `Time Capsule/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      return s3.upload(params).promise();
    });

    const results = await Promise.all(uploadPromises);

    const newTimeCapsule = new TimeCapsule({
      title,
      releaseDateTime,
      files: results.map(result => result.Location),
      scheduled_date: new Date(releaseDateTime),
      status: 'locked',
    });

    await newTimeCapsule.save();

    res.status(201).json({
      message: 'Time capsule created successfully',
      data: newTimeCapsule,
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Error uploading files' });
  }
});

router.get("/", async (req, res) => {
  try {
    const capsules = await TimeCapsule.find({});
    res.status(200).json(capsules);
  } catch (error) {
    console.error('Error fetching time capsules:', error);
    res.status(500).json({ error: 'Failed to fetch time capsules' });
  }
});

router.get('/:id', async (req, res) => {
  const timeCapsuleId = req.params.id;
  const now = new Date();

  try {
    const timeCapsule = await TimeCapsule.findById(timeCapsuleId);

    if (!timeCapsule) {
      return res.status(404).json({ error: 'Time Capsule not found' });
    }

    if (now >= timeCapsule.scheduled_date) {
      timeCapsule.status = 'unlocked';
      await timeCapsule.save();

      return res.json({
        status: 'unlocked',
        content: timeCapsule.content || 'No content available',
        files: timeCapsule.files,
      });
    } else {
      return res.json({
        status: 'locked',
        message: `The time capsule is locked. It will be unlocked at ${new Date(timeCapsule.scheduled_date).toLocaleString()}.`,
      });
    }
  } catch (error) {
    console.error('Error fetching time capsule:', error);
    res.status(500).json({ error: 'Failed to fetch time capsule' });
  }
});

module.exports = router;