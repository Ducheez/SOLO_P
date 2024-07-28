const geminiApi = require('../utils/geminiApi');
const contentFilter = require('../utils/contentFilter');
const languageUtils = require('../utils/languageUtils');

exports.moderateContent = async (req, res) => {
  try {
    const { content, targetLanguage } = req.body;

    const detectedLanguage = languageUtils.detectLanguage(content);

    const translatedContent = detectedLanguage !== 'en' 
      ? await languageUtils.translateToEnglish(content)
      : content;

    const localFilterResult = contentFilter.filterContent(translatedContent);

    let moderationResult = {
      isFlagged: localFilterResult.hasProfanity,
      explanation: localFilterResult.hasProfanity
        ? "Content contains profanity and has been flagged as inappropriate."
        : "Content appears to be appropriate.",
      hasProfanity: localFilterResult.hasProfanity,
      filteredContent: localFilterResult.filteredContent
    };

    if (!localFilterResult.hasProfanity) {
      try {
        const geminiModeration = await geminiApi.moderate(translatedContent);
        if (geminiModeration.isFlagged) {
          moderationResult.isFlagged = true;
          moderationResult.explanation = geminiModeration.explanation;
        }
      } catch (error) {
        console.error('Error with Gemini API moderation:', error);
      }
    }

    if (targetLanguage && targetLanguage !== 'en') {
      moderationResult.explanation = await languageUtils.translateFromEnglish(moderationResult.explanation, targetLanguage);
    }

    res.json(moderationResult);
  } catch (error) {
    console.error('Error moderating content:', error);
    res.status(500).json({ error: 'Failed to moderate content' });
  }
};