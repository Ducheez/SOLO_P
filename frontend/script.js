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
      const generatedContent = document.getElementById('generatedContent');
  
      showLoading('generatedContent');
  
      try {
          console.log("Sending generate request with:", { prompt, interests });
          const response = await fetch('https://solo-p.onrender.com/api/generate', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ prompt, interests }),
          });
  
          if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Failed to generate content: ${errorText}`);
          }
  
          const data = await response.json();
          console.log("Received generated content:", data);
          generatedContent.innerHTML = `
              <h3>Generated Content:</h3>
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
      const moderationResult = document.getElementById('moderationResult');
  
      showLoading('moderationResult');
  
      try {
          console.log("Sending moderation request with:", { content });
          const response = await fetch('https://solo-p.onrender.com/api/moderate', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ content }),
          });
  
          if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Failed to moderate content: ${errorText}`);
          }
  
          const data = await response.json();
          console.log("Received moderation result:", data);
          moderationResult.innerHTML = `
              <p>Flagged: ${data.isFlagged ? 'Yes' : 'No'}</p>
              <p>Explanation: ${data.explanation}</p>
              <p>Reasoning: ${data.reasoning}</p>
              <p>Contains Profanity: ${data.hasProfanity ? 'Yes' : 'No'}</p>
          `;
      } catch (error) {
          console.error('Error:', error);
          moderationResult.innerHTML = `Failed to moderate content. Error: ${error.message}`;
      } finally {
          hideLoading('moderationResult');
      }
  }