import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateRecipes = async (ingredients) => {
  try {
    const prompt = `Generate 3 creative recipes using some or all of these ingredients: ${ingredients.join(', ')}. 
    For each recipe, provide:
    1. Recipe name
    2. List of ingredients needed (including quantities)
    3. Step-by-step cooking instructions

    Format each recipe with clear sections for the name, ingredients list, and numbered instructions.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Parse the text response into our recipe format
    const recipes = text.split('\n\n').filter(r => r.trim()).map(recipe => {
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