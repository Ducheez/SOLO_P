// backend/utils/contentFilter.js

const profanityList = ['shit', 'fuck', 'ass', 'damn', 'bitch', 'crap', 'piss', 'dick', 'cock', 'pussy', 'asshole', 'fag', 'bastard', 'slut', 'douche'];

function containsProfanity(text) {
  const lowerText = text.toLowerCase();
  return profanityList.some(word => new RegExp(`\\b${word}\\b`).test(lowerText));
}

exports.filterContent = (content) => {
  const hasProfanity = containsProfanity(content);
  const filteredContent = content.replace(new RegExp(`\\b(${profanityList.join('|')})\\b`, 'gi'), match => '*'.repeat(match.length));
  return { hasProfanity, filteredContent };
};