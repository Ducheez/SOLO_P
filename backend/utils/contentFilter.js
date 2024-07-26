const profanityList = ['shit', 'fuck', 'ass', 'damn', 'bitch']; // Expand this list as needed

function containsProfanity(text) {
  const lowerText = text.toLowerCase();
  return profanityList.some(word => new RegExp(`\\b${word}\\b`).test(lowerText));
}

exports.filterContent = (content) => {
  return {
    hasProfanity: containsProfanity(content),
    filteredContent: content.replace(new RegExp(`\\b(${profanityList.join('|')})\\b`, 'gi'), '****')
  };
};
