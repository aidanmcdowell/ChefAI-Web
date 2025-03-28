const OPENAI_API_KEY = process.env.api_key;

export const generateRecipes = async (ingredients) => {
  try {
    const prompt = `Generate 3 creative recipes using some or all of these ingredients: ${ingredients.join(', ')}. 
    For each recipe, provide:
    1. Recipe name
    2. List of ingredients needed (including quantities)
    3. Step-by-step cooking instructions`;

    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        prompt: prompt,
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate recipes');
    }

    const data = await response.json();
    const recipes = data.choices[0].text.split('\n\n').filter(r => r.trim()).map(recipe => {
      const lines = recipe.split('\n').filter(l => l.trim());
      return {
        name: lines[0].replace(/^\d+\.\s*/, ''),
        ingredients: lines.slice(1, lines.indexOf('Instructions:')).filter(l => l.trim()).map(l => l.replace(/^-\s*/, '')),
        instructions: lines.slice(lines.indexOf('Instructions:') + 1).filter(l => l.trim()).map(l => l.replace(/^\d+\.\s*/, ''))
      };
    });

    return recipes;
  } catch (error) {
    console.error('Error generating recipes:', error);
    throw error;
  }
}; 