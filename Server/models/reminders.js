const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  title: String,
  description: String,
  scheduled_time: Date,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  is_notified: { type: Boolean, default: false },
});

const Reminder = mongoose.model('Reminder', reminderSchema);