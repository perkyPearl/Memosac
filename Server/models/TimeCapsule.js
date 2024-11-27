const mongoose = require('mongoose');

const timeCapsuleSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  scheduled_date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['locked', 'unlocked'],
    default: 'locked',
  },
});

const TimeCapsule = mongoose.model('TimeCapsule', timeCapsuleSchema);

module.exports = TimeCapsule;