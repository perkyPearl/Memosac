const express = require('express');
const TimeCapsule = require('../models/TimeCapsule');
const router = express.Router();
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "Time Capsule",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
});

router.post('/', upload.array('files', 10), async (req, res) => {
  console.log("Recieving Data" + req.body);
  const { content, scheduled_date } = req.body;

  try {
    const fileUrls = req.files.map((file) => file.location);

    const newCapsule = new TimeCapsule({
      // user_id: userId,
      // content,
      scheduled_date: new Date(scheduled_date),
      files: fileUrls,
    });

    await newCapsule.save();
    res.status(201);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create time capsule' });
  }
});

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