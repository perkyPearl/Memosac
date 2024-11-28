const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const express = require('express');
const TimeCapsule = require('../models/TimeCapsule');
const router = express.Router();
const multer = require('multer');
const multerS3 = require('multer-s3');

const client = new S3Client({
  region: process.env.AWS_Region, 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: client,
    bucket: 'memosac.bucket',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, `Time Capsule/${fileName}`);
    },
  }),
});

router.post('/', upload.array('files', 10), async (req, res) => {
  console.log("Receiving Data: ", req.body);
  let { releaseDateTime } = req.body;

  releaseDateTime = releaseDateTime.replace(' ', 'T') + ':00';

  const scheduledDate = new Date(releaseDateTime);

  if (isNaN(scheduledDate)) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  try {
    const fileUrls = req.files.map((file) => file.location);

    const newCapsule = new TimeCapsule({
      // Add user_id and content as necessary
      scheduled_date: scheduledDate,
      files: fileUrls,
    });

    await newCapsule.save();
    res.status(201).json({ message: 'Time capsule created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create time capsule' });
  }
});

router.get("/", async (req,res) => {
  
})

router.get('/:id', async (req, res) => {
  const timeCapsuleId = req.params.id;

  try {
    const timeCapsule = await TimeCapsule.findOne({
      _id: timeCapsuleId,
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
        content: timeCapsule.content,
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