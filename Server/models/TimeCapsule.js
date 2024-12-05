const mongoose = require('mongoose');

const timeCapsuleSchema = new mongoose.Schema({
  scheduled_date: {
    type: Date,
    required: true,
  },
  files: [String],
  content: {
    type: String,
    default: '',
  },
});

const TimeCapsule = mongoose.model('TimeCapsule', timeCapsuleSchema);
module.exports = TimeCapsule;