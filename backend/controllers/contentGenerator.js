const geminiApi = require('../utils/geminiApi');

exports.generateContent = async (req, res) => {
  try {
    const { prompt, interests } = req.body;
    const generatedContent = await geminiApi.generate(prompt, interests);
    const summary = await geminiApi.summarize(generatedContent);
    
    const formattedContent = formatContent(generatedContent);

    res.json({ content: formattedContent, summary });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
};

function formatContent(content) {
  const paragraphs = content.split('\n\n');
  return paragraphs.map(p => `<p>${p}</p>`).join('');
}