const express = require('express');
const router = express.Router();
const {
  registerToken,
  sendNotification,
  sendToAll,
  sendToTopicController
  ,getTokens
} = require('../controllers/notificationController');

// Register a device token
router.post('/register-token', registerToken);

// Send to a single device
router.post('/send-notification', sendNotification);

// Send to all registered devices (from DB)
router.post('/send-to-all', sendToAll);

// Send to a topic (bonus)
router.post('/send-to-topic', sendToTopicController);

// Get saved tokens
router.get('/tokens', getTokens);

module.exports = router;
