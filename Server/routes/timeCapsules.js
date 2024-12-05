const express = require('express');
const TimeCapsule = require('../models/TimeCapsule'); // Assuming you have this model
const router = express.Router();

// Get all time capsules
router.get("/", async (req, res) => {
  try {
    const capsules = await TimeCapsule.find({});
    res.status(200).json(capsules);
  } catch (error) {
    console.error('Error fetching time capsules:', error);
    res.status(500).json({ error: 'Failed to fetch time capsules' });
  }
});

// Get a specific time capsule by ID
router.get('/:id', async (req, res) => {
  const timeCapsuleId = req.params.id;
  const now = new Date(); // Get current time

  try {
    const timeCapsule = await TimeCapsule.findById(timeCapsuleId);

    if (!timeCapsule) {
      return res.status(404).json({ error: 'Time Capsule not found' });
    }

    // Check if the time capsule's scheduled release date has passed
    if (now >= timeCapsule.scheduled_date) {
      // Unlock the capsule if the scheduled date has passed
      timeCapsule.status = 'unlocked';
      await timeCapsule.save(); // Save the unlocked status

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