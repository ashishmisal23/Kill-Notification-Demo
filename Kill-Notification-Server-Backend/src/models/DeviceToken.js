const mongoose = require('mongoose');

const DeviceTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  platform: { type: String, enum: ['android', 'ios', 'unknown'], default: 'unknown' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DeviceToken', DeviceTokenSchema);
