// backend/utils/geminiApi.js

const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;
console.log("API Key:", API_KEY ? "Set" : "Not set");

if (!API_KEY) {
  console.error("GEMINI_API_KEY is not set in the environment variables!");
}

const genAI = new GoogleGenerativeAI(API_KEY);

exports.generate = async (prompt, interests) => {
  try {
    console.log("Generating content for prompt:", prompt);
    console.log("Interests:", interests);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(`
      Generate a blog post based on the following prompt and interests:
      Prompt: ${prompt}
      Interests: ${interests.join(', ')}
      
      Please format the content with appropriate headings (using # for main headings and ## for subheadings) and paragraphs.
    `);
    
    console.log("Generation successful");
    return result.response.text();
  } catch (error) {
    console.error('Error generating content:', error);
    if (error.response) {
      console.error('API response:', error.response);
    }
    throw new Error(`Failed to generate content: ${error.message}`);
  }
};

exports.summarize = async (content) => {
  try {
    console.log("Summarizing content...");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(`
      Summarize the following content in 2-3 sentences:
      ${content}
    `);
    console.log("Summary generation successful");
    return result.response.text();
  } catch (error) {
    console.error('Error summarizing content:', error);
    if (error.response) {
      console.error('API response:', error.response);
    }
    throw new Error(`Failed to summarize content: ${error.message}`);
  }
};

exports.moderate = async (content) => {
  try {
    console.log("Moderating content...");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent(`
      You are a content moderator. Your task is to determine if the following content is appropriate or inappropriate.
      
      Respond with a JSON object containing 'isFlagged' (boolean) and 'explanation' (string).
      If the content contains any profanity, explicit content, hate speech, or offensive language, flag it as inappropriate.
      Be strict in your moderation. When in doubt, flag the content.
      
      Content to moderate: "${content}"
      
      Respond only with a JSON object in this format:
      {
        "isFlagged": boolean,
        "explanation": "Your explanation here"
      }
    `);
    
    const responseText = result.response.text();
    console.log("Moderation response:", responseText);
    
    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Invalid response format from Gemini API");
      }
    }
  } catch (error) {
    console.error('Error moderating content with Gemini:', error);
    throw new Error(`Failed to moderate content: ${error.message}`);
  }
};