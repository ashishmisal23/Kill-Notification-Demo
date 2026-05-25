const DeviceToken = require('../models/DeviceToken');
const { sendToToken, sendToTokens, sendToTopic } = require('../services/notificationService');

// Save a device token
async function registerToken(req, res) {
  const { token, platform } = req.body;
  if (!token) return res.status(400).json({ error: 'token is required' });

  const doc = await DeviceToken.findOneAndUpdate(
    { token },
    { token, platform: platform || 'unknown' },
    { upsert: true, new: true }
  );

  res.json({ ok: true, token: doc });
}

// Send notification to a single token
async function sendNotification(req, res) {
  const { token, title, body, image, data } = req.body;
  if (!token || !title) return res.status(400).json({ error: 'token and title are required' });

  const payload = {
    notification: { title, body, image },
    data: data || {}
  };

  const result = await sendToToken(token, payload);
  res.json({ ok: true, result });
}

// Send notification to all registered tokens in DB
async function sendToAll(req, res) {
  const { title, body, image, data } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });

  const tokens = await DeviceToken.find().select('token -_id').lean();
  const tokenList = tokens.map((t) => t.token).filter(Boolean);

  if (tokenList.length === 0) return res.status(400).json({ error: 'no registered tokens' });

  const payload = {
    notification: { title, body, image },
    data: data || {}
  };

  const result = await sendToTokens(tokenList, payload);
  res.json({ ok: true, result });
}

// Send to topic (bonus)
async function sendToTopicController(req, res) {
  const { topic, title, body, image, data } = req.body;
  if (!topic || !title) return res.status(400).json({ error: 'topic and title are required' });

  const payload = { notification: { title, body, image }, data: data || {} };
  const result = await sendToTopic(topic, payload);
  res.json({ ok: true, result });
}

// Get all saved device tokens (simple list)
async function getTokens(req, res) {
  const tokens = await DeviceToken.find().select('token platform createdAt -_id').lean();
  res.json({ ok: true, tokens });
}

// Clear single token
async function clearToken(req, res) {
  try {
    const { token } = req.params;

    const deleted = await DeviceToken.findOneAndDelete({ token });

    if (!deleted) {
      return res.status(404).json({
        ok: false,
        error: 'Token not found',
      });
    }

    res.json({
      ok: true,
      message: 'Token removed successfully',
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
}

// Clear all tokens
async function clearAllTokens(req, res) {
  try {
    await DeviceToken.deleteMany({});

    res.json({
      ok: true,
      message: 'All tokens cleared successfully',
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
}

// Unregister token via POST body { token }
async function unregisterToken(req, res) {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ ok: false, error: 'token is required' });

    const deleted = await DeviceToken.findOneAndDelete({ token });

    if (!deleted) {
      return res.status(404).json({ ok: false, error: 'Token not found' });
    }

    res.json({ ok: true, message: 'Token unregistered successfully' });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
}

module.exports = { registerToken, sendNotification, sendToAll, sendToTopicController, getTokens, clearToken, clearAllTokens, unregisterToken };
