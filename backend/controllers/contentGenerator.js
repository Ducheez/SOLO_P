// backend/controllers/contentGenerator.js

const geminiApi = require('../utils/geminiApi');

exports.generateContent = async (req, res) => {
  try {
    const { prompt, interests } = req.body;
    console.log("Received request to generate content:", { prompt, interests });

    const generatedContent = await geminiApi.generate(prompt, interests);
    console.log("Content generated, now summarizing...");
    
    const summary = await geminiApi.summarize(generatedContent);
    console.log("Summary created, now formatting content...");

    const formattedContent = formatContent(generatedContent);

    console.log("Content generation process completed successfully");
    res.json({ content: formattedContent, summary });
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