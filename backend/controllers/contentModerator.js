// backend/controllers/contentModerator.js
const geminiApi = require('../utils/geminiApi');
const contentFilter = require('../utils/contentFilter');

exports.moderateContent = async (req, res) => {
  try {
    const { content } = req.body;
    
    // First, use the local content filter
    const localFilterResult = contentFilter.filterContent(content);
    
    let moderationResult = {
      isFlagged: localFilterResult.hasProfanity,
      explanation: localFilterResult.hasProfanity 
        ? "Content contains profanity and has been flagged as inappropriate."
        : "Content appears to be appropriate.",
      hasProfanity: localFilterResult.hasProfanity,
      filteredContent: localFilterResult.filteredContent
    };

    // Only use Gemini API if local filter doesn't flag the content
    if (!localFilterResult.hasProfanity) {
      try {
        const geminiModeration = await geminiApi.moderate(content);
        if (geminiModeration.isFlagged) {
          moderationResult.isFlagged = true;
          moderationResult.explanation = geminiModeration.explanation;
        }
      } catch (error) {
        console.error('Error with Gemini API moderation:', error);
        // If Gemini API fails, we'll stick with the local filter results
      }
    }

    res.json(moderationResult);
  } catch (error) {
    console.error('Error moderating content:', error);
    res.status(500).json({ error: 'Failed to moderate content' });
  }
};