const mongoose = require('mongoose');

const timeCapsuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  scheduled_date: {
    type: Date,
    required: true,
  },
  files: [String],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    default: 'locked'
  }
});

const TimeCapsule = mongoose.model('TimeCapsule', timeCapsuleSchema);
module.exports = TimeCapsule;