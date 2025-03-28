const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

export const generateRecipes = async (ingredients) => {
  try {
    const prompt = `Generate 3 creative recipes using these ingredients: ${ingredients.join(', ')}. 
    For each recipe, provide:
    1. Recipe name
    2. List of ingredients needed (including quantities)
    3. Step-by-step cooking instructions
    4. Estimated cooking time
    5. Difficulty level
    
    Format the response as JSON with the following structure:
    {
      "recipes": [
        {
          "name": "Recipe Name",
          "ingredients": ["ingredient 1", "ingredient 2", ...],
          "instructions": ["step 1", "step 2", ...],
          "cookingTime": "XX minutes",
          "difficulty": "Easy/Medium/Hard"
        }
      ]
    }`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate recipes');
    }

    const data = await response.json();
    const recipeText = data.choices[0].message.content;
    try {
      return JSON.parse(recipeText).recipes;
    } catch (error) {
      console.error('Error parsing recipe JSON:', error);
      throw new Error('Failed to parse recipe data');
    }
  } catch (error) {
    console.error('Error generating recipes:', error);
    throw error;
  }
}; 