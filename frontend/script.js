const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' }
];

function populateLanguageDropdowns() {
  const dropdowns = document.querySelectorAll('.language-select');
  dropdowns.forEach(dropdown => {
      languages.forEach(lang => {
          const option = document.createElement('option');
          option.value = lang.code;
          option.textContent = lang.name;
          dropdown.appendChild(option);
      });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  populateLanguageDropdowns();
  
  document.getElementById('prompt').addEventListener('input', detectInputLanguage);
  document.getElementById('contentToModerate').addEventListener('input', detectModerationLanguage);
});

function detectInputLanguage() {
  const text = document.getElementById('prompt').value;
  const detectedLanguage = detectLanguage(text);
  document.getElementById('inputLanguage').textContent = getLanguageName(detectedLanguage);
}

function detectModerationLanguage() {
  const text = document.getElementById('contentToModerate').value;
  const detectedLanguage = detectLanguage(text);
  document.getElementById('moderationLanguage').textContent = getLanguageName(detectedLanguage);
}

function detectLanguage(text) {
  const firstChar = text.trim()[0] || '';
  if (/[a-zA-Z]/.test(firstChar)) return 'en';
  if (/[áéíóúüñ]/.test(firstChar)) return 'es';
  if (/[àâçéèêëîïôûùüÿ]/.test(firstChar)) return 'fr';
  return 'unknown';
}

function getLanguageName(languageCode) {
  const language = languages.find(lang => lang.code === languageCode);
  return language ? language.name : 'Unknown';
}

function showLoading(elementId) {
  document.getElementById(elementId).innerHTML = '<div class="loading">Loading...</div>';
}

function hideLoading(elementId) {
  const loadingDiv = document.getElementById(elementId).querySelector('.loading');
  if (loadingDiv) loadingDiv.remove();
}

async function generateContent() {
  const prompt = document.getElementById('prompt').value;
  const interests = document.getElementById('interests').value.split(',').map(i => i.trim());
  const targetLanguage = document.getElementById('targetLanguage').value;
  const generatedContent = document.getElementById('generatedContent');

  showLoading('generatedContent');

  try {
      console.log("Sending generate request with:", { prompt, interests, targetLanguage });
      const response = await fetch('https://solo-p.onrender.com/api/generate', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt, interests, targetLanguage }),
      });

      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to generate content: ${errorText}`);
      }

      const data = await response.json();
      console.log("Received generated content:", data);
      generatedContent.innerHTML = `
          <h3>Generated Content (${getLanguageName(targetLanguage || 'en')}):</h3>
          ${data.content}
          <h3>Summary:</h3>
          <p>${data.summary}</p>
      `;
  } catch (error) {
      console.error('Error:', error);
      generatedContent.innerHTML = `Failed to generate content. Error: ${error.message}`;
  } finally {
      hideLoading('generatedContent');
  }
}

async function moderateContent() {
  const content = document.getElementById('contentToModerate').value;
  const targetLanguage = document.getElementById('moderationTargetLanguage').value;
  const moderationResult = document.getElementById('moderationResult');

  showLoading('moderationResult');

  try {
      console.log("Sending moderation request with:", { content, targetLanguage });
      const response = await fetch('https://solo-p.onrender.com/api/moderate', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content, targetLanguage }),
      });

      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to moderate content: ${errorText}`);
      }

      const data = await response.json();
      console.log("Received moderation result:", data);
      moderationResult.innerHTML = `
          <p>Flagged: ${data.isFlagged ? 'Yes' : 'No'}</p>
          <p>Explanation (${getLanguageName(targetLanguage || 'en')}): ${data.explanation}</p>
          <p>Contains Profanity: ${data.hasProfanity ? 'Yes' : 'No'}</p>
          <p>Filtered Content: ${data.filteredContent}</p>
      `;
  } catch (error) {
      console.error('Error:', error);
      moderationResult.innerHTML = `Failed to moderate content. Error: ${error.message}`;
  } finally {
      hideLoading('moderationResult');
  }
}