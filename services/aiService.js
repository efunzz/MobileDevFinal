import { OPENAI_API_KEY } from '@env';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Generate flashcards using OpenAI API
export const generateFlashcards = async (topic, cardCount = 10) => {
  try {
    const prompt = `Create exactly ${cardCount} flashcards about "${topic}". 
    
    Return ONLY a valid JSON array in this exact format:
    [
      {"front": "Question 1", "back": "Answer 1"},
      {"front": "Question 2", "back": "Answer 2"}
    ]
    
    Make the questions educational and the answers clear and concise.`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const aiContent = data.choices[0].message.content;

    const flashcards = JSON.parse(aiContent);
    
    if (!Array.isArray(flashcards) || flashcards.length === 0) {
      throw new Error('Invalid flashcards format from AI');
    }

    return {
      success: true,
      flashcards: flashcards
    };

  } catch (error) {
    console.error('Error generating flashcards:', error);
    
    if (error.message.includes('401')) {
      return {
        success: false,
        error: 'Invalid API key. Please check your OpenAI API key.'
      };
    } else if (error.message.includes('429')) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again in a moment.'
      };
    } else {
      return {
        success: false,
        error: 'Failed to generate flashcards. Please try again.'
      };
    }
  }
};

// Test OpenAI API connection
export const testOpenAIConnection = async () => {
  try {
    const result = await generateFlashcards('basic math', 2);
    return result.success;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
};