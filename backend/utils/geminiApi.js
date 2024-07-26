const { GoogleGenerativeAI } = require("@google/generative-ai");
const contentFilter = require('./contentFilter');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generate = async (prompt, interests) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(
      `Generate content based on the following prompt: "${prompt}". Consider these interests: ${interests.join(', ')}.`
    );
    return result.response.text();
  } catch (error) {
    console.error('Error generating content with Gemini:', error);
    throw error;
  }
};

exports.moderate = async (content) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const filterResult = contentFilter.filterContent(content);

    console.log('Filtered Content:', filterResult.filteredContent);

    const result = await model.generateContent(
      `Moderate the following content and determine if it's appropriate. 
       Provide a detailed explanation of your decision.
       Respond with a JSON object containing 'isFlagged' (boolean), 'explanation' (string), and 'reasoning' (string).
       Content: "${filterResult.filteredContent}"`
    );

    let aiModerationText = await result.response.text();
    console.log('AI Moderation Response:', aiModerationText);

    // Clean the AI response
    aiModerationText = aiModerationText.replace(/```[\s\S]*?```/g, '').replace(/```/g, '').trim();
    console.log('Cleaned AI Moderation Response:', aiModerationText);

    let aiModeration;
    try {
      aiModeration = JSON.parse(aiModerationText);
    } catch (parseError) {
      console.error('Error parsing AI moderation response:', parseError);
      throw new Error('Failed to parse AI moderation response');
    }

    return {
      isFlagged: aiModeration.isFlagged || filterResult.hasProfanity,
      explanation: aiModeration.explanation || (filterResult.hasProfanity ? "Contains profanity" : ""),
      reasoning: aiModeration.reasoning,
      hasProfanity: filterResult.hasProfanity
    };
  } catch (error) {
    console.error('Error moderating content:', error);
    return {
      isFlagged: false,
      explanation: "Error occurred during moderation. Please review manually.",
      reasoning: "An error occurred in the moderation process.",
      hasProfanity: false
    };
  }
};

exports.summarize = async (content) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(
      `Summarize the following content in a concise manner:
       "${content}"`
    );
    return result.response.text();
  } catch (error) {
    console.error('Error summarizing content:', error);
    throw error;
  }
};
