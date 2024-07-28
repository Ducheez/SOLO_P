const langdetect = require('langdetect');
const translate = require('google-translate-api');

exports.detectLanguage = (text) => {
  try {
    const detection = langdetect.detect(text);
    return detection[0].lang;
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'en'; // Default to English if detection fails
  }
};

exports.translateToEnglish = async (text) => {
  try {
    const result = await translate(text, { to: 'en' });
    return result.text;
  } catch (error) {
    console.error('Error translating to English:', error);
    return text; // Return original text if translation fails
  }
};

exports.translateFromEnglish = async (text, targetLanguage) => {
  try {
    const result = await translate(text, { to: targetLanguage });
    return result.text;
  } catch (error) {
    console.error('Error translating from English:', error);
    return text; // Return original text if translation fails
  }
};