// backend/controllers/contentModerator.js

const geminiApi = require('../utils/geminiApi');

exports.moderateContent = async (req, res) => {
  try {
    const { content } = req.body;
    const moderationResult = await geminiApi.moderate(content);
    
    res.json(moderationResult);
  } catch (error) {
    console.error('Error moderating content:', error);
    res.status(500).json({ error: 'Failed to moderate content' });
  }
};