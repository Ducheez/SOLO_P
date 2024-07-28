const geminiApi = require('../utils/geminiApi');
const languageUtils = require('../utils/languageUtils');

exports.generateContent = async (req, res) => {
  try {
    const { prompt, interests, targetLanguage } = req.body;
    console.log("Received request to generate content:", { prompt, interests, targetLanguage });

    const detectedLanguage = languageUtils.detectLanguage(prompt);

    const translatedPrompt = detectedLanguage !== 'en' 
      ? await languageUtils.translateToEnglish(prompt)
      : prompt;

    const generatedContent = await geminiApi.generate(translatedPrompt, interests);
    console.log("Content generated, now summarizing...");

    const summary = await geminiApi.summarize(generatedContent);
    console.log("Summary created, now formatting content...");

    const formattedContent = formatContent(generatedContent);

    const translatedContent = targetLanguage && targetLanguage !== 'en'
      ? await languageUtils.translateFromEnglish(formattedContent, targetLanguage)
      : formattedContent;

    const translatedSummary = targetLanguage && targetLanguage !== 'en'
      ? await languageUtils.translateFromEnglish(summary, targetLanguage)
      : summary;

    console.log("Content generation process completed successfully");
    res.json({ content: translatedContent, summary: translatedSummary });
  } catch (error) {
    console.error('Error in generateContent:', error);
    res.status(500).json({ error: `Failed to generate content: ${error.message}` });
  }
}

function formatContent(content) {
  const paragraphs = content.split('\n\n');
  return paragraphs.map(p => {
    if (p.startsWith('#')) {
      const level = p.match(/^#+/)[0].length;
      const text = p.replace(/^#+\s*/, '');
      return `<h${level}>${text}</h${level}>`;
    }
    return `<p>${p}</p>`;
  }).join('');
}